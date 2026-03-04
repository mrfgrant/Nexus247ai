import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Send, MessageCircle, Bot, User, Lightbulb, BookOpen, FileText, Shield, Upload } from "lucide-react";
import type { ChatMessage, SupportingDocument, LetterAnalysis } from "@shared/schema";
import { Link } from "wouter";

const THINKING_MESSAGES = [
  "Analyzing your question...",
  "Reviewing CFR references...",
  "Checking VA regulations...",
  "Researching claim strategies...",
  "Preparing your response...",
];

function ThinkingIndicator() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIndex((i) => (i + 1) % THINKING_MESSAGES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex gap-3 justify-start" data-testid="chat-thinking-indicator">
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        <BookOpen className="w-4 h-4 text-primary animate-pulse" />
      </div>
      <div className="bg-muted/50 border border-border rounded-lg p-3 max-w-[80%]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
          <span className="text-sm text-muted-foreground">{THINKING_MESSAGES[msgIndex]}</span>
        </div>
      </div>
    </div>
  );
}

function isBulletLine(line: string): boolean {
  return /^\s*[-*]\s+/.test(line);
}

function isOrderedLine(line: string): boolean {
  return /^\s*\d+[.)]\s+/.test(line);
}

function FormattedMessage({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: JSX.Element[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === "") {
      i++;
      continue;
    }

    if (/^```/.test(line.trim())) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i].trim())) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++;
      elements.push(
        <pre key={key++} className="bg-muted rounded p-3 text-xs font-mono overflow-x-auto my-2 whitespace-pre-wrap">
          {codeLines.join("\n")}
        </pre>
      );
      continue;
    }

    if (/^-{3,}$/.test(line.trim()) || /^\*{3,}$/.test(line.trim())) {
      elements.push(<hr key={key++} className="my-2 border-border" />);
      i++;
      continue;
    }

    if (/^#{1,4}\s+/.test(line)) {
      const text = line.replace(/^#{1,4}\s+/, "").replace(/\*{2,3}/g, "");
      elements.push(
        <p key={key++} className="font-semibold text-foreground text-[0.9rem] mt-3 first:mt-0 mb-1">
          {formatInline(text)}
        </p>
      );
      i++;
      continue;
    }

    const trimmed = line.trim();
    if (/^\*{2,3}.+\*{2,3}:?$/.test(trimmed)) {
      const text = trimmed.replace(/^\*{2,3}/, "").replace(/\*{2,3}:?$/, "").replace(/:$/, "") + (trimmed.endsWith(":**") || trimmed.endsWith(":***") ? ":" : "");
      elements.push(
        <p key={key++} className="font-semibold text-foreground mt-2.5 first:mt-0 mb-0.5">
          {formatInline(text)}
        </p>
      );
      i++;
      continue;
    }

    if (isBulletLine(line)) {
      const items: { text: string; indent: number }[] = [];
      while (i < lines.length && isBulletLine(lines[i])) {
        const match = lines[i].match(/^(\s*)[-*]\s+(.*)/);
        if (match) {
          items.push({ text: match[2], indent: match[1].length });
        }
        i++;
      }
      const baseIndent = items.length > 0 ? Math.min(...items.map(it => it.indent)) : 0;
      elements.push(
        <ul key={key++} className="ml-4 space-y-1 my-1.5">
          {items.map((item, idx) => (
            <li key={idx} className="flex gap-2 text-sm leading-relaxed" style={{ marginLeft: Math.max(0, (item.indent - baseIndent) * 6) }}>
              <span className="text-primary/60 mt-1.5 shrink-0">&#8226;</span>
              <span>{formatInline(item.text)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    if (isOrderedLine(line)) {
      const items: string[] = [];
      while (i < lines.length && isOrderedLine(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+[.)]\s+/, ""));
        i++;
      }
      elements.push(
        <ol key={key++} className="ml-4 space-y-1 my-1.5">
          {items.map((item, idx) => (
            <li key={idx} className="flex gap-2 text-sm leading-relaxed">
              <span className="text-primary/60 font-medium shrink-0 min-w-[1.2rem]">{idx + 1}.</span>
              <span>{formatInline(item)}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    elements.push(
      <p key={key++} className="text-sm leading-relaxed my-1">
        {formatInline(line)}
      </p>
    );
    i++;
  }

  return <div className="space-y-0">{elements}</div>;
}

function formatInline(text: string): (string | JSX.Element)[] {
  const parts: (string | JSX.Element)[] = [];
  let remaining = text;
  let k = 0;

  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*{2}(.+?)\*{2}/);
    const italicMatch = remaining.match(/(?<!\*)\*([^*]+?)\*(?!\*)/);

    let firstMatch: { index: number; full: string; inner: string; type: "bold" | "italic" } | null = null;

    if (boldMatch && boldMatch.index !== undefined) {
      firstMatch = { index: boldMatch.index, full: boldMatch[0], inner: boldMatch[1], type: "bold" };
    }
    if (italicMatch && italicMatch.index !== undefined) {
      if (!firstMatch || italicMatch.index < firstMatch.index) {
        firstMatch = { index: italicMatch.index, full: italicMatch[0], inner: italicMatch[1], type: "italic" };
      }
    }

    if (!firstMatch) {
      if (remaining) parts.push(remaining);
      break;
    }

    if (firstMatch.index > 0) {
      parts.push(remaining.slice(0, firstMatch.index));
    }

    if (firstMatch.type === "bold") {
      parts.push(<strong key={`b${k++}`} className="font-semibold text-foreground">{firstMatch.inner}</strong>);
    } else {
      parts.push(<em key={`i${k++}`} className="italic">{firstMatch.inner}</em>);
    }

    remaining = remaining.slice(firstMatch.index + firstMatch.full.length);
  }

  return parts;
}

const SUGGESTED_QUESTIONS = [
  "What are the strongest arguments for PTSD service connection?",
  "How should I prepare for a C&P exam?",
  "What is the difference between direct and secondary service connection?",
  "How does TDIU work and am I eligible?",
  "What are the PACT Act presumptive conditions?",
  "How do I appeal a VA denial?",
];

export default function Chat() {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: messages = [], isLoading } = useQuery<ChatMessage[]>({
    queryKey: ["/api/chat/messages"],
  });

  const { data: supportingDocs = [] } = useQuery<SupportingDocument[]>({
    queryKey: ["/api/supporting-documents"],
  });

  const { data: letterAnalyses = [] } = useQuery<LetterAnalysis[]>({
    queryKey: ["/api/letter-analyses"],
  });

  const medicalRecordCount = supportingDocs.filter((d) => d.category === "medical_records").length;
  const decisionLetterCount = supportingDocs.filter((d) => d.category === "decision_letter" || d.category === "denial_letter").length;
  const hasAnalysis = letterAnalyses.length > 0;
  const hasAnyContext = medicalRecordCount > 0 || decisionLetterCount > 0 || hasAnalysis;

  const sendMutation = useMutation({
    mutationFn: async (msg: string) => {
      const res = await apiRequest("POST", "/api/chat/send", { message: msg });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat/messages"] });
      setMessage("");
    },
    onError: (error: any) => {
      toast({
        title: "Message failed",
        description: error.message || "Try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, sendMutation.isPending]);

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed) return;
    sendMutation.mutate(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-3 sm:p-6 max-w-3xl mx-auto flex flex-col h-[calc(100vh-4rem)] sm:h-[calc(100vh-2rem)]">
      <div className="mb-2 sm:mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground" data-testid="text-chat-title">
          AI Claims Advisor
        </h1>
        <p className="text-muted-foreground text-xs sm:text-sm mt-0.5 sm:mt-1">
          Get expert guidance on VA claims, CFR regulations, and filing strategy.
        </p>
      </div>

      {hasAnyContext ? (
        <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/20 text-xs text-foreground/80 flex items-center gap-2 flex-wrap" data-testid="text-chat-context-banner">
          <Shield className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="font-medium">Your advisor has access to:</span>
          {medicalRecordCount > 0 && (
            <span className="inline-flex items-center gap-1 bg-primary/10 rounded px-1.5 py-0.5">
              <FileText className="w-3 h-3" />
              {medicalRecordCount} medical record{medicalRecordCount !== 1 ? "s" : ""}
            </span>
          )}
          {decisionLetterCount > 0 && (
            <span className="inline-flex items-center gap-1 bg-primary/10 rounded px-1.5 py-0.5">
              <FileText className="w-3 h-3" />
              {decisionLetterCount} decision letter{decisionLetterCount !== 1 ? "s" : ""}
            </span>
          )}
          {hasAnalysis && (
            <span className="inline-flex items-center gap-1 bg-primary/10 rounded px-1.5 py-0.5">
              <BookOpen className="w-3 h-3" />
              {letterAnalyses.length} analysis{letterAnalyses.length !== 1 ? " results" : " result"}
            </span>
          )}
        </div>
      ) : (
        <div className="p-2.5 rounded-lg bg-muted/50 border border-border text-xs text-muted-foreground flex items-center gap-2" data-testid="text-chat-no-context-banner">
          <Upload className="w-3.5 h-3.5 shrink-0" />
          <span>
            <Link href="/intake" className="text-primary underline underline-offset-2 hover:text-primary/80">Upload medical records</Link>
            {" "}in your profile to get personalized advice based on your actual records.
          </span>
        </div>
      )}

      <Card className="flex-1 flex flex-col min-h-0">
        <CardContent className="flex-1 flex flex-col min-h-0 p-0">
          <ScrollArea className="flex-1 p-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-3/4" />
                ))}
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-12 space-y-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <MessageCircle className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Welcome to Claims Advisor</h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                    Ask questions about VA claims, CFR regulations, C&P exams, appeals, and filing strategy.
                  </p>
                </div>
                <div className="space-y-2 max-w-md mx-auto">
                  <p className="text-xs text-muted-foreground flex items-center gap-1 justify-center">
                    <Lightbulb className="w-3 h-3" /> Try one of these:
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {SUGGESTED_QUESTIONS.slice(0, 4).map((q) => (
                      <Button
                        key={q}
                        variant="outline"
                        size="sm"
                        className="text-xs h-auto py-1.5 px-3"
                        onClick={() => {
                          setMessage(q);
                        }}
                        data-testid={`button-suggestion-${q.slice(0, 20)}`}
                      >
                        {q.length > 45 ? q.slice(0, 45) + "..." : q}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    data-testid={`chat-message-${msg.id}`}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                        <Bot className="w-4 h-4 text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground text-sm leading-relaxed"
                          : "bg-muted/50 text-foreground border border-border"
                      }`}
                    >
                      {msg.role === "assistant" ? (
                        <FormattedMessage content={msg.content} />
                      ) : (
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                      )}
                      <p className="text-xs opacity-60 mt-2">
                        {new Date(msg.createdAt!).toLocaleTimeString()}
                      </p>
                    </div>
                    {msg.role === "user" && (
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 mt-1">
                        <User className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                ))}
                {sendMutation.isPending && <ThinkingIndicator />}
                <div ref={bottomRef} />
              </div>
            )}
          </ScrollArea>

          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about VA claims, CFR regulations, appeals..."
                rows={2}
                className="resize-none"
                data-testid="input-chat-message"
              />
              <Button
                onClick={handleSend}
                disabled={sendMutation.isPending || !message.trim()}
                className="self-end"
                data-testid="button-send-message"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 italic">
              This is general guidance, not legal advice. Consult an accredited VA claims agent or attorney.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
