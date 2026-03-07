import { MessageCircle } from "lucide-react";
import { useLocation } from "wouter";
import { Link } from "wouter";

export function FloatingForumButton() {
  const [location] = useLocation();

  if (location === "/forum") {
    return null;
  }

  return (
    <Link
      href="/forum"
      data-testid="button-forum-float"
      title="Ask a Question"
      className="fixed right-4 bottom-4 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-transform duration-200 hover:scale-105"
      style={{ backgroundColor: "#0D2137" }}
    >
      <MessageCircle className="w-6 h-6" style={{ color: "#D4A43E" }} />
    </Link>
  );
}
