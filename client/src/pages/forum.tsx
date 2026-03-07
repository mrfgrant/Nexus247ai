import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ArrowRight, ThumbsUp, Send, Menu, X, Loader2, MessageSquareText, Clock, ChevronDown, Share2, Twitter, Facebook, Link2 } from "lucide-react";
import { SiTiktok } from "react-icons/si";
import { getRankDisplayName } from "@shared/utils";
import { useToast } from "@/hooks/use-toast";
import { trackForumRegistration, trackForumQuestion, trackForumUpvote } from "@/lib/analytics";

interface ForumUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  rank: string | null;
  branch: string | null;
}

interface ForumQuestion {
  id: string;
  forumUserId: string;
  question: string;
  aiAnswer: string | null;
  category: string | null;
  featureCta: string | null;
  upvotes: number;
  createdAt: string;
  answeredAt: string | null;
  firstName?: string | null;
  lastName?: string | null;
  rank?: string | null;
  branch?: string | null;
}

const STORAGE_KEY = "nexus247_forum_user";
const BRANCHES = ["Army", "Navy", "Air Force", "Marines", "Coast Guard", "Space Force"];

const CTA_LABELS: Record<string, string> = {
  "/generate": "Generate a Letter",
  "/rating": "Try the Rating Estimator",
  "/analyze": "Analyze Your Decision Letter",
  "/cnp-prep": "Prep for Your C&P Exam",
  "/chat": "Chat with AI Advisor",
  "/conditions": "Track Your Conditions",
  "/": "Start Your Free Trial",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export default function Forum() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [forumUser, setForumUser] = useState<ForumUser | null>(null);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [rank, setRank] = useState("");
  const [branch, setBranch] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [pendingQuestionId, setPendingQuestionId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [allQuestions, setAllQuestions] = useState<ForumQuestion[]>([]);
  const [upvotedIds, setUpvotedIds] = useState<Set<string>>(new Set());
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [regError, setRegError] = useState("");
  const [questionError, setQuestionError] = useState("");
  const [pendingStartTime, setPendingStartTime] = useState<number | null>(null);
  const [pendingTimedOut, setPendingTimedOut] = useState(false);

  useEffect(() => {
    const defaultTitle = "VA Claims Q&A Forum | Nexus247.ai";
    const defaultDesc = "Ask any VA claims question — get expert AI answers grounded in 38 CFR. Community knowledge base for veterans.";

    // Helper to update or create meta tags
    const updateMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    if (pendingQuestionId && pendingQuestion) {
      const qText = pendingQuestion.question.substring(0, 60) + (pendingQuestion.question.length > 60 ? "..." : "");
      document.title = `${qText} | VA Claims Q&A`;
      const desc = pendingQuestion.aiAnswer?.substring(0, 160).replace(/\n/g, " ") || defaultDesc;
      updateMeta("description", desc);
      updateMeta("og:title", qText, true);
      updateMeta("og:description", desc, true);
      updateMeta("og:url", window.location.href, true);
    } else {
      document.title = defaultTitle;
      updateMeta("description", defaultDesc);
      updateMeta("og:title", defaultTitle, true);
      updateMeta("og:description", defaultDesc, true);
      updateMeta("og:url", window.location.href, true);
    }

    return () => {
      document.title = "Nexus247.ai - AI-Powered VA Claims Assistant";
    };
  }, [pendingQuestion, pendingQuestionId]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const questionId = urlParams.get('q');
    if (questionId) {
      setExpandedIds(new Set([questionId]));
      // Scroll to question
      setTimeout(() => {
        const element = document.querySelector(`[data-testid="card-question-${questionId}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 500);
    }
  }, [allQuestions]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setForumUser(JSON.parse(stored));
    } catch {}
    try {
      const stored = localStorage.getItem("nexus247_forum_upvoted");
      if (stored) setUpvotedIds(new Set(JSON.parse(stored)));
    } catch {}
  }, []);

  const { data: questions, isLoading: questionsLoading } = useQuery<ForumQuestion[]>({
    queryKey: ["/api/forum/questions", selectedCategory, offset],
    queryFn: async () => {
      const params = new URLSearchParams({ limit: "20", offset: String(offset) });
      if (selectedCategory) params.set("category", selectedCategory);
      const res = await fetch(`/api/forum/questions?${params}`);
      return res.json();
    },
  });

  const { data: categories } = useQuery<{ category: string; count: number }[]>({
    queryKey: ["/api/forum/categories"],
    queryFn: async () => {
      const res = await fetch("/api/forum/categories");
      return res.json();
    },
  });

  useEffect(() => {
    if (questions && offset === 0) {
      setAllQuestions(questions);
    } else if (questions && offset > 0) {
      setAllQuestions(prev => {
        const existingIds = new Set(prev.map(q => q.id));
        const newOnes = questions.filter(q => !existingIds.has(q.id));
        return [...prev, ...newOnes];
      });
    }
  }, [questions, offset]);

  useEffect(() => {
    if (selectedCategory !== null || selectedCategory === null) {
      setOffset(0);
      setAllQuestions([]);
    }
  }, [selectedCategory]);

  const shouldPoll = !!pendingQuestionId && !pendingTimedOut;

  const { data: pendingQuestion } = useQuery<ForumQuestion>({
    queryKey: ["/api/forum/questions", pendingQuestionId],
    queryFn: async () => {
      const res = await fetch(`/api/forum/questions/${pendingQuestionId}`);
      return res.json();
    },
    enabled: shouldPoll,
    refetchInterval: shouldPoll ? 3000 : false,
  });

  useEffect(() => {
    if (pendingQuestion?.aiAnswer) {
      setPendingQuestionId(null);
      setPendingStartTime(null);
      setPendingTimedOut(false);
      queryClient.invalidateQueries({ queryKey: ["/api/forum/questions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/forum/categories"] });
      if (pendingQuestion?.category) {
        trackForumQuestion(pendingQuestion.category);
      }
    }
  }, [pendingQuestion]);

  useEffect(() => {
    if (!pendingStartTime || !pendingQuestionId) return;
    const timer = setTimeout(() => {
      if (pendingQuestionId && !pendingQuestion?.aiAnswer) {
        setPendingTimedOut(true);
      }
    }, 90000);
    return () => clearTimeout(timer);
  }, [pendingStartTime, pendingQuestionId, pendingQuestion]);

  const registerMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/forum/register", {
        email, firstName, lastName, rank, branch,
      });
      return res.json();
    },
    onSuccess: (user: ForumUser) => {
      setForumUser(user);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      setRegError("");
      trackForumRegistration();
    },
    onError: (err: any) => {
      setRegError(err.message || "Registration failed");
    },
  });

  const askMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/forum/questions", {
        forumUserId: forumUser!.id,
        question: questionText.trim(),
      });
      return res.json();
    },
    onSuccess: (q: ForumQuestion) => {
      setPendingQuestionId(q.id);
      setPendingStartTime(Date.now());
      setPendingTimedOut(false);
      setQuestionText("");
      setQuestionError("");
    },
    onError: (err: any) => {
      let message = err.message || "Failed to submit question";
      if (message.includes('{"error":')) {
        try {
          const parsed = JSON.parse(message.split(': ').slice(1).join(': '));
          message = parsed.error;
        } catch (e) {
          message = message.replace(/429: \{"error":"(.*)"\}/, "$1");
        }
      }
      setQuestionError(message);
    },
  });

  const upvoteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("POST", `/api/forum/questions/${id}/upvote`, {});
      return { id, data: await res.json() };
    },
    onSuccess: ({ id, data }) => {
      setAllQuestions(prev => prev.map(q => q.id === id ? { ...q, upvotes: data.upvotes } : q));
      const newSet = new Set(upvotedIds);
      newSet.add(id);
      setUpvotedIds(newSet);
      localStorage.setItem("nexus247_forum_upvoted", JSON.stringify([...newSet]));
      trackForumUpvote();
    },
  });

  const handleShare = (e: React.MouseEvent, type: 'twitter' | 'facebook' | 'copy', question: ForumQuestion) => {
    e.stopPropagation();
    const url = `${window.location.origin}/forum?q=${question.id}`;
    const text = `Check out this VA claims Q&A on Nexus247.ai: "${question.question.substring(0, 100)}${question.question.length > 100 ? '...' : ''}"`;

    if (type === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (type === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else if (type === 'copy') {
      navigator.clipboard.writeText(url);
      toast({
        title: "Link Copied",
        description: "The link to this question has been copied to your clipboard.",
      });
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setRegError("Email is required"); return; }
    registerMutation.mutate();
  };

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (questionText.trim().length < 10) {
      setQuestionError("Question must be at least 10 characters");
      return;
    }
    askMutation.mutate();
  };

  const displayName = forumUser
    ? getRankDisplayName(forumUser.rank, forumUser.branch, forumUser.lastName, forumUser.firstName)
    : "";

  const navLinkStyle: React.CSSProperties = {
    color: "rgba(255,255,255,0.72)", textDecoration: "none", fontSize: "0.88rem",
    fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase",
  };

  const goldBtnStyle: React.CSSProperties = {
    background: "var(--gold)", color: "var(--navy)", border: "none",
    padding: "10px 22px", borderRadius: 3, fontSize: "0.83rem", fontWeight: 600,
    letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "var(--smoke)", color: "var(--body-txt)", minHeight: "100vh" }}>
      <nav className="landing-nav" data-testid="nav-forum" style={{ position: "sticky", top: 0, zIndex: 100 }}>
        <a href="/" style={{ textDecoration: "none" }} data-testid="link-forum-logo">
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.35rem", color: "#fff", letterSpacing: "0.02em" }}>
            Nexus<span style={{ color: "var(--gold)" }}>247</span>.ai
          </span>
        </a>
        <ul className="hidden md:flex" style={{ gap: "2.2rem", listStyle: "none", margin: 0, padding: 0 }}>
          <li><a href="/" style={navLinkStyle} data-testid="link-home">Home</a></li>
          <li><a href="/forum" style={{ ...navLinkStyle, color: "var(--gold)" }} data-testid="link-forum-active">Forum</a></li>
          <li><a href="/faq" style={navLinkStyle} data-testid="link-faq">FAQ</a></li>
        </ul>
        <div className="hidden md:flex" style={{ alignItems: "center", gap: "12px" }}>
          <a href="/api/login" style={navLinkStyle} data-testid="button-login">Log In</a>
          <a href="/api/login" data-testid="button-get-started">
            <button type="button" style={goldBtnStyle}>START MY FREE TRIAL</button>
          </a>
        </div>
        <button
          type="button"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", padding: 4 }}
          data-testid="button-forum-mobile-menu"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X style={{ width: 24, height: 24 }} /> : <Menu style={{ width: 24, height: 24 }} />}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div style={{
          position: "fixed", top: 56, left: 0, right: 0, zIndex: 99,
          background: "var(--navy)", borderBottom: "1px solid rgba(200,153,58,0.18)",
          padding: "16px 5vw", display: "flex", flexDirection: "column", gap: 12,
        }}>
          <a href="/" onClick={() => setMobileMenuOpen(false)} style={{ ...navLinkStyle, padding: "8px 0" }} data-testid="link-home-mobile">Home</a>
          <a href="/forum" onClick={() => setMobileMenuOpen(false)} style={{ ...navLinkStyle, color: "var(--gold)", padding: "8px 0" }} data-testid="link-forum-mobile">Forum</a>
          <a href="/faq" onClick={() => setMobileMenuOpen(false)} style={{ ...navLinkStyle, padding: "8px 0" }} data-testid="link-faq-mobile">FAQ</a>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 12, display: "flex", flexDirection: "column", gap: 12 }}>
            <a href="/api/login" style={{ ...navLinkStyle, padding: "8px 0" }} data-testid="button-login-mobile">Log In</a>
            <a href="/api/login" data-testid="button-get-started-mobile">
              <button type="button" style={{ ...goldBtnStyle, width: "100%", padding: "12px 22px" }}>START MY FREE TRIAL</button>
            </a>
          </div>
        </div>
      )}

      <section className="landing-grid-bg" style={{
        background: "var(--navy)", padding: "5rem 5vw 3rem", textAlign: "center",
        borderBottom: "2px solid rgba(200,153,58,0.18)",
      }}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.18em",
          textTransform: "uppercase", color: "var(--gold)", opacity: 0.85, marginBottom: 12,
        }} data-testid="text-forum-eyebrow">
          COMMUNITY KNOWLEDGE BASE
        </div>
        <h1 style={{
          fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2rem, 4vw, 3.2rem)",
          color: "#fff", margin: "0 0 12px", lineHeight: 1.15,
        }} data-testid="text-forum-heading">
          VA Claims Q&A Forum
        </h1>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: "1.05rem",
          color: "rgba(255,255,255,0.65)", maxWidth: 600, margin: "0 auto",
          lineHeight: 1.6,
        }} data-testid="text-forum-subheading">
          Ask any VA claims question — get expert AI answers grounded in 38 CFR
        </p>
      </section>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 5vw 4rem" }}>
        {!forumUser ? (
          <div style={{
            background: "#FAFAF7", border: "2px solid #EFF0F3", borderRadius: 10,
            padding: "2rem", marginBottom: "2rem",
          }}>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif", fontSize: "1.4rem",
              color: "var(--navy)", margin: "0 0 6px",
            }} data-testid="text-register-heading">
              Join the Discussion
            </h2>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem",
              color: "var(--landing-muted)", margin: "0 0 20px",
            }}>
              Register to ask questions and participate in the forum
            </p>
            <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--navy)", marginBottom: 4, display: "block" }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    data-testid="input-forum-email"
                    style={{
                      width: "100%", padding: "10px 12px", border: "1.5px solid #EFF0F3",
                      borderRadius: 5, fontSize: "0.9rem", fontFamily: "'DM Sans', sans-serif",
                      outline: "none", boxSizing: "border-box",
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = "var(--navy)"}
                    onBlur={e => e.currentTarget.style.borderColor = "#EFF0F3"}
                  />
                </div>
                <div>
                  <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--navy)", marginBottom: 4, display: "block" }}>
                    Branch
                  </label>
                  <select
                    value={branch}
                    onChange={e => setBranch(e.target.value)}
                    data-testid="select-forum-branch"
                    style={{
                      width: "100%", padding: "10px 12px", border: "1.5px solid #EFF0F3",
                      borderRadius: 5, fontSize: "0.9rem", fontFamily: "'DM Sans', sans-serif",
                      background: "#fff", outline: "none", boxSizing: "border-box",
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = "var(--navy)"}
                    onBlur={e => e.currentTarget.style.borderColor = "#EFF0F3"}
                  >
                    <option value="">Select branch...</option>
                    {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--navy)", marginBottom: 4, display: "block" }}>
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    placeholder="First name"
                    data-testid="input-forum-first-name"
                    style={{
                      width: "100%", padding: "10px 12px", border: "1.5px solid #EFF0F3",
                      borderRadius: 5, fontSize: "0.9rem", fontFamily: "'DM Sans', sans-serif",
                      outline: "none", boxSizing: "border-box",
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = "var(--navy)"}
                    onBlur={e => e.currentTarget.style.borderColor = "#EFF0F3"}
                  />
                </div>
                <div>
                  <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--navy)", marginBottom: 4, display: "block" }}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    placeholder="Last name"
                    data-testid="input-forum-last-name"
                    style={{
                      width: "100%", padding: "10px 12px", border: "1.5px solid #EFF0F3",
                      borderRadius: 5, fontSize: "0.9rem", fontFamily: "'DM Sans', sans-serif",
                      outline: "none", boxSizing: "border-box",
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = "var(--navy)"}
                    onBlur={e => e.currentTarget.style.borderColor = "#EFF0F3"}
                  />
                </div>
              </div>
              <div>
                <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--navy)", marginBottom: 4, display: "block" }}>
                  Rank
                </label>
                <input
                  type="text"
                  value={rank}
                  onChange={e => setRank(e.target.value)}
                  placeholder="e.g., E-5 / SGT"
                  data-testid="input-forum-rank"
                  style={{
                    width: "100%", padding: "10px 12px", border: "1.5px solid #EFF0F3",
                    borderRadius: 5, fontSize: "0.9rem", fontFamily: "'DM Sans', sans-serif",
                    outline: "none", boxSizing: "border-box",
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = "var(--navy)"}
                  onBlur={e => e.currentTarget.style.borderColor = "#EFF0F3"}
                />
              </div>
              {regError && (
                <p style={{ color: "#dc2626", fontSize: "0.85rem", margin: 0 }} data-testid="text-register-error">{regError}</p>
              )}
              <button
                type="submit"
                disabled={registerMutation.isPending}
                data-testid="button-forum-register"
                style={{
                  ...goldBtnStyle,
                  padding: "12px 28px",
                  opacity: registerMutation.isPending ? 0.7 : 1,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
              >
                {registerMutation.isPending ? <Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} /> : null}
                JOIN THE FORUM
              </button>
            </form>
          </div>
        ) : (
          <>
            <div style={{
              background: "var(--navy)", borderRadius: 8, padding: "14px 20px",
              marginBottom: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <MessageSquareText style={{ width: 18, height: 18, color: "var(--gold)" }} />
                <span style={{ color: "#fff", fontSize: "0.92rem", fontFamily: "'DM Sans', sans-serif" }} data-testid="text-welcome-user">
                  Welcome, {displayName}
                </span>
              </div>
              <button
                onClick={() => { setForumUser(null); localStorage.removeItem(STORAGE_KEY); }}
                style={{
                  background: "none", border: "1px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.6)",
                  padding: "4px 12px", borderRadius: 3, fontSize: "0.75rem", cursor: "pointer",
                  fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em",
                }}
                data-testid="button-forum-logout"
              >
                SIGN OUT
              </button>
            </div>

            <div style={{
              background: "#FAFAF7", border: "2px solid #EFF0F3", borderRadius: 10,
              padding: "1.5rem", marginBottom: "2rem",
            }}>
              <h3 style={{
                fontFamily: "'DM Serif Display', serif", fontSize: "1.15rem",
                color: "var(--navy)", margin: "0 0 12px",
              }}>
                Ask a Question
              </h3>
              <form onSubmit={handleAsk}>
                <textarea
                  value={questionText}
                  onChange={e => setQuestionText(e.target.value)}
                  placeholder="Describe your VA claims question in detail..."
                  rows={4}
                  maxLength={2000}
                  data-testid="input-forum-question"
                  style={{
                    width: "100%", padding: "12px", border: "1.5px solid #EFF0F3",
                    borderRadius: 5, fontSize: "0.92rem", fontFamily: "'DM Sans', sans-serif",
                    resize: "vertical", outline: "none", boxSizing: "border-box",
                    minHeight: 100,
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = "var(--navy)"}
                  onBlur={e => e.currentTarget.style.borderColor = "#EFF0F3"}
                />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem",
                    color: "var(--landing-muted)",
                  }}>
                    {questionText.length}/2000
                  </span>
                  {questionError && (
                    <span style={{ color: "#dc2626", fontSize: "0.82rem" }} data-testid="text-question-error">{questionError}</span>
                  )}
                  <button
                    type="submit"
                    disabled={askMutation.isPending || questionText.trim().length < 10}
                    data-testid="button-submit-question"
                    style={{
                      ...goldBtnStyle,
                      padding: "10px 24px",
                      opacity: (askMutation.isPending || questionText.trim().length < 10) ? 0.6 : 1,
                      display: "flex", alignItems: "center", gap: 8,
                    }}
                  >
                    {askMutation.isPending ? <Loader2 style={{ width: 14, height: 14, animation: "spin 1s linear infinite" }} /> : <Send style={{ width: 14, height: 14 }} />}
                    ASK YOUR QUESTION
                  </button>
                </div>
              </form>
            </div>
          </>
        )}

        {pendingQuestionId && pendingQuestion && !pendingQuestion.aiAnswer && (
          <div style={{
            background: "#FAFAF7", border: "2px solid var(--gold)", borderRadius: 10,
            padding: "1.5rem", marginBottom: "1.5rem",
          }}>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: "var(--navy)",
              margin: "0 0 8px", fontSize: "0.95rem",
            }}>
              {pendingQuestion.question}
            </p>
            {pendingTimedOut ? (
              <div>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem",
                  color: "var(--landing-muted)", margin: "0 0 8px",
                }} data-testid="text-ai-timeout">
                  The AI is taking longer than expected. Your answer will appear in the feed once it's ready.
                </p>
                <button
                  onClick={() => { setPendingQuestionId(null); setPendingStartTime(null); setPendingTimedOut(false); }}
                  data-testid="button-dismiss-pending"
                  style={{
                    background: "none", border: "1px solid #EFF0F3", color: "var(--navy)",
                    padding: "6px 16px", borderRadius: 3, fontSize: "0.78rem", cursor: "pointer",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  DISMISS
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--gold)" }}>
                <Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} />
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem",
                  letterSpacing: "0.06em",
                }} data-testid="text-ai-pending">
                  AI is preparing your answer...
                </span>
              </div>
            )}
          </div>
        )}

        {pendingQuestion?.aiAnswer && (
          <div style={{
            background: "#FAFAF7", border: "2px solid var(--gold)", borderRadius: 10,
            padding: "1.5rem", marginBottom: "1.5rem",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              {pendingQuestion.category && (
                <span style={{
                  background: "var(--gold)", color: "var(--navy)", padding: "2px 10px",
                  borderRadius: 3, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem",
                  fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase",
                }} data-testid="badge-pending-category">
                  {pendingQuestion.category}
                </span>
              )}
            </div>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: "var(--navy)",
              margin: "0 0 12px", fontSize: "0.95rem",
            }}>
              {pendingQuestion.question}
            </p>
            <div style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "var(--body-txt)",
              lineHeight: 1.7, whiteSpace: "pre-wrap",
            }} data-testid="text-pending-answer">
              {pendingQuestion.aiAnswer}
            </div>
            {pendingQuestion.featureCta && pendingQuestion.featureCta !== "/" && (
              <a
                href={pendingQuestion.featureCta}
                data-testid="link-pending-cta"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: "var(--gold)", color: "var(--navy)", padding: "8px 18px",
                  borderRadius: 3, fontSize: "0.8rem", fontWeight: 600, textDecoration: "none",
                  fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.04em",
                  textTransform: "uppercase", marginTop: 16,
                }}
              >
                {CTA_LABELS[pendingQuestion.featureCta] || "Try It Now"}
                <ArrowRight style={{ width: 14, height: 14 }} />
              </a>
            )}
          </div>
        )}

        {categories && categories.length > 0 && (
          <div style={{
            display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4,
            marginBottom: "1.5rem", WebkitOverflowScrolling: "touch",
          }}>
            <button
              onClick={() => setSelectedCategory(null)}
              data-testid="button-category-all"
              style={{
                padding: "6px 16px", borderRadius: 3, border: "none", cursor: "pointer",
                fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", fontWeight: 600,
                letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap",
                background: !selectedCategory ? "var(--navy)" : "transparent",
                color: !selectedCategory ? "#fff" : "var(--navy)",
                outline: selectedCategory ? "1.5px solid var(--navy)" : "none",
              }}
            >
              ALL
            </button>
            {categories.map(cat => (
              <button
                key={cat.category}
                onClick={() => setSelectedCategory(cat.category)}
                data-testid={`button-category-${cat.category.toLowerCase().replace(/\s+/g, "-")}`}
                style={{
                  padding: "6px 16px", borderRadius: 3, border: "none", cursor: "pointer",
                  fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", fontWeight: 600,
                  letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap",
                  background: selectedCategory === cat.category ? "var(--navy)" : "transparent",
                  color: selectedCategory === cat.category ? "#fff" : "var(--navy)",
                  outline: selectedCategory !== cat.category ? "1.5px solid var(--navy)" : "none",
                  display: "flex", alignItems: "center", gap: 6,
                }}
              >
                {cat.category}
                <span style={{
                  background: selectedCategory === cat.category ? "var(--gold)" : "rgba(13,33,55,0.1)",
                  color: selectedCategory === cat.category ? "var(--navy)" : "var(--navy)",
                  padding: "1px 6px", borderRadius: 2, fontSize: "0.65rem",
                }}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        )}

        {questionsLoading && offset === 0 && (
          <div style={{ textAlign: "center", padding: "3rem 0" }}>
            <Loader2 style={{ width: 28, height: 28, animation: "spin 1s linear infinite", color: "var(--navy)", margin: "0 auto" }} />
            <p style={{ color: "var(--landing-muted)", fontSize: "0.88rem", marginTop: 12 }}>Loading questions...</p>
          </div>
        )}

        {allQuestions.length === 0 && !questionsLoading && (
          <div style={{
            textAlign: "center", padding: "3rem 0",
          }}>
            <MessageSquareText style={{ width: 40, height: 40, color: "rgba(13,33,55,0.15)", margin: "0 auto 12px" }} />
            <p style={{ color: "var(--landing-muted)", fontSize: "0.92rem" }}>
              No questions yet. Be the first to ask!
            </p>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {allQuestions.map(q => {
            const isExpanded = expandedIds.has(q.id);
            return (
              <div
                key={q.id}
                data-testid={`card-question-${q.id}`}
                style={{
                  background: "#FAFAF7", border: "1.5px solid #EFF0F3", borderRadius: 10,
                  padding: "1.25rem 1.5rem", transition: "all 0.2s ease-in-out",
                  cursor: "pointer",
                }}
                onClick={() => toggleExpand(q.id)}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, flexWrap: "wrap", gap: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <ChevronDown style={{ 
                      width: 16, height: 16, color: "var(--navy)", 
                      transition: "transform 0.2s",
                      transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)"
                    }} />
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem",
                      color: "var(--landing-muted)", letterSpacing: "0.04em",
                    }} data-testid={`text-asker-${q.id}`}>
                      {getRankDisplayName(q.rank, q.branch, q.lastName, q.firstName)}
                      {q.branch ? ` · ${q.branch}` : ""}
                      {" · "}{timeAgo(q.createdAt)}
                    </span>
                  </div>
                  {q.category && (
                    <span style={{
                      background: "var(--gold)", color: "var(--navy)", padding: "2px 10px",
                      borderRadius: 3, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem",
                      fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase",
                    }} data-testid={`badge-category-${q.id}`}>
                      {q.category}
                    </span>
                  )}
                </div>

                <p style={{
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: "var(--navy)",
                  margin: "0 0 12px", fontSize: "0.95rem", lineHeight: 1.5,
                }} data-testid={`text-question-${q.id}`}>
                  {q.question}
                </p>

                <div style={{
                  maxHeight: isExpanded ? "2000px" : "0px",
                  overflow: "hidden",
                  transition: "max-height 0.3s ease-in-out",
                }}>
                  {q.aiAnswer && (
                    <div style={{
                      fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", color: "var(--body-txt)",
                      lineHeight: 1.7, whiteSpace: "pre-wrap", borderTop: "1px solid #EFF0F3",
                      paddingTop: 12,
                    }} data-testid={`text-answer-${q.id}`}>
                      {q.aiAnswer}
                    </div>
                  )}

                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    marginTop: 14, flexWrap: "wrap", gap: 8,
                  }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); if (!upvotedIds.has(q.id)) upvoteMutation.mutate(q.id); }}
                      disabled={upvotedIds.has(q.id)}
                      data-testid={`button-upvote-${q.id}`}
                      style={{
                        display: "flex", alignItems: "center", gap: 6,
                        background: "none", border: "1.5px solid #EFF0F3", borderRadius: 5,
                        padding: "5px 12px", cursor: upvotedIds.has(q.id) ? "default" : "pointer",
                        color: upvotedIds.has(q.id) ? "var(--gold)" : "var(--landing-muted)",
                        fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem",
                        fontWeight: 600, transition: "all 0.2s",
                      }}
                    >
                      <ThumbsUp style={{ width: 14, height: 14 }} />
                      {q.upvotes}
                    </button>

                    {q.featureCta && q.featureCta !== "/" && (
                      <a
                        href={q.featureCta}
                        onClick={(e) => e.stopPropagation()}
                        data-testid={`link-cta-${q.id}`}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 5,
                          color: "var(--gold)", fontFamily: "'DM Sans', sans-serif",
                          fontSize: "0.82rem", fontWeight: 600, textDecoration: "none",
                          letterSpacing: "0.03em",
                        }}
                        onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                        onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
                      >
                        {CTA_LABELS[q.featureCta] || "Try It Now"}
                        <ArrowRight style={{ width: 13, height: 13 }} />
                      </a>
                    )}
                  </div>

                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 12, 
                    marginTop: 16, 
                    paddingTop: 12, 
                    borderTop: "1px solid #EFF0F3" 
                  }}>
                    <span style={{ 
                      fontFamily: "'JetBrains Mono', monospace", 
                      fontSize: "0.65rem", 
                      color: "var(--landing-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em"
                    }}>Share:</span>
                    <button 
                      onClick={(e) => handleShare(e, 'twitter', q)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "var(--landing-muted)", display: "flex", alignItems: "center" }}
                      title="Share on Twitter"
                      data-testid={`share-twitter-${q.id}`}
                    >
                      <Twitter style={{ width: 14, height: 14 }} />
                    </button>
                    <button 
                      onClick={(e) => handleShare(e, 'facebook', q)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "var(--landing-muted)", display: "flex", alignItems: "center" }}
                      title="Share on Facebook"
                      data-testid={`share-facebook-${q.id}`}
                    >
                      <Facebook style={{ width: 14, height: 14 }} />
                    </button>
                    <button 
                      onClick={(e) => handleShare(e, 'copy', q)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "var(--landing-muted)", display: "flex", alignItems: "center" }}
                      title="Copy Link"
                      data-testid={`share-copy-${q.id}`}
                    >
                      <Link2 style={{ width: 14, height: 14 }} />
                    </button>
                  </div>
                </div>

                {!isExpanded && (
                  <div style={{ 
                    marginTop: 8, 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 6,
                    color: "var(--gold)",
                    fontSize: "0.75rem",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 600
                  }}>
                    <ThumbsUp style={{ width: 12, height: 12 }} />
                    {q.upvotes}
                    <span style={{ color: "#EFF0F3", margin: "0 4px" }}>|</span>
                    READ ANSWER
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {questions && questions.length === 20 && (
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <button
              onClick={() => setOffset(prev => prev + 20)}
              data-testid="button-load-more"
              style={{
                background: "none", border: "1.5px solid var(--navy)", color: "var(--navy)",
                padding: "10px 28px", borderRadius: 3, fontSize: "0.82rem", fontWeight: 600,
                fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em",
                textTransform: "uppercase", cursor: "pointer",
              }}
            >
              LOAD MORE
            </button>
          </div>
        )}
      </div>

      <footer style={{
        background: "var(--navy)", borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "32px 5vw", display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 16,
      }}>
        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.1rem", color: "#fff" }}>
          Nexus<span style={{ color: "var(--gold)" }}>247</span>.ai
        </div>
        <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.3)", margin: 0 }}>
          2025 Nexus247.ai · Not a law firm · Not affiliated with the VA
        </p>
        <a href="mailto:support@nexus247.ai" style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>
          support@nexus247.ai
        </a>
        <nav style={{ display: "flex", alignItems: "center", gap: 0 }}>
          <a href="/faq" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none", fontSize: "0.78rem", marginLeft: "1.4rem" }} data-testid="link-forum-footer-faq">FAQ</a>
          <a href="/terms" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none", fontSize: "0.78rem", marginLeft: "1.4rem" }} data-testid="link-forum-footer-terms">Terms</a>
          <a href="/terms" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none", fontSize: "0.78rem", marginLeft: "1.4rem" }} data-testid="link-forum-footer-privacy">Privacy</a>
          <a href="https://www.tiktok.com/@nexus247.ai" target="_blank" rel="noopener noreferrer"
            style={{ color: "rgba(255,255,255,0.5)", marginLeft: "1.4rem", display: "inline-flex", transition: "color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.color = "#D4A43E"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
            data-testid="link-forum-footer-tiktok"
          >
            <SiTiktok size={16} />
          </a>
        </nav>
      </footer>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 640px) {
          footer { flex-direction: column; align-items: flex-start !important; }
        }
      `}</style>
    </div>
  );
}
