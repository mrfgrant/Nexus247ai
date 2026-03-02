import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Send, MessageCircle, Bot, User, Loader2, Lightbulb } from "lucide-react";
import type { ChatMessage } from "@shared/schema";

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
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: messages = [], isLoading } = useQuery<ChatMessage[]>({
    queryKey: ["/api/chat/messages"],
  });

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
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
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

      <Card className="flex-1 flex flex-col min-h-0">
        <CardContent className="flex-1 flex flex-col min-h-0 p-0">
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
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
                      className={`max-w-[80%] rounded-lg p-3 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/50 text-foreground border border-border"
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.content}</div>
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
                {sendMutation.isPending && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                    <div className="bg-muted/50 border border-border rounded-lg p-3">
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}
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
