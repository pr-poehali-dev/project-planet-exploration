import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import func2url from "../../backend/func2url.json";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_PROMPT = `Ты — DevayAI, умный русскоязычный ИИ-ассистент платформы devay.ru. Отвечай чётко, по делу и дружелюбно. Всегда отвечай на русском языке, если пользователь не попросил иначе.`;

const SUGGESTIONS = [
  "Напиши текст для лендинга ИИ-стартапа",
  "Объясни, что такое нейронные сети",
  "Придумай 5 идей для бизнеса с ИИ",
  "Переведи на английский: «Привет, как дела?»",
];

export default function DevayAI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const autoResize = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { role: "user", content: trimmed };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setLoading(true);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 90000);
      const res = await fetch(func2url["devay-chat"], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          model: "qwen2.5:7b",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...updatedMessages,
          ],
        }),
      });
      clearTimeout(timeout);
      const data = await res.json();
      const reply = typeof data === "string" ? JSON.parse(data).reply : data.reply;
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Ошибка соединения. Попробуйте ещё раз." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-accent/20 bg-background/80 backdrop-blur-xl z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="font-display font-black text-xl tracking-tighter bg-gradient-to-r from-white via-accent to-accent/80 bg-clip-text text-transparent">
            devay.ru
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm text-accent font-medium">DevayAI · qwen2.5</span>
          </div>
          <Link to="/" className="text-sm text-muted-foreground hover:text-white transition-colors flex items-center gap-1">
            <Icon name="ArrowLeft" size={16} />
            Назад
          </Link>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center">
                <Icon name="Sparkles" size={32} className="text-accent" />
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-2">DevayAI</h1>
                <p className="text-muted-foreground text-sm max-w-sm">
                  Российский ИИ-ассистент на базе Qwen 2.5. Задайте любой вопрос или выберите подсказку ниже.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="text-left px-4 py-3 rounded-xl border border-accent/20 hover:border-accent/50 hover:bg-accent/5 transition-all text-sm text-white/80"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/30 flex-shrink-0 flex items-center justify-center mt-1">
                  <Icon name="Sparkles" size={14} className="text-accent" />
                </div>
              )}
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-accent text-black font-medium rounded-br-sm"
                    : "bg-card border border-accent/10 text-white/90 rounded-bl-sm"
                }`}
              >
                {msg.content}
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-lg bg-white/10 flex-shrink-0 flex items-center justify-center mt-1">
                  <Icon name="User" size={14} className="text-white/80" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/30 flex-shrink-0 flex items-center justify-center mt-1">
                <Icon name="Sparkles" size={14} className="text-accent" />
              </div>
              <div className="bg-card border border-accent/10 px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="flex-shrink-0 border-t border-accent/20 bg-background/80 backdrop-blur-xl p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-end bg-card border border-accent/20 rounded-2xl p-3 focus-within:border-accent/50 transition-colors">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => { setInput(e.target.value); autoResize(); }}
              onKeyDown={handleKeyDown}
              placeholder="Задайте вопрос... (Enter — отправить, Shift+Enter — перенос)"
              rows={1}
              className="flex-1 bg-transparent resize-none outline-none text-sm text-white placeholder:text-muted-foreground leading-relaxed py-1"
              disabled={loading}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-xl bg-accent flex-shrink-0 flex items-center justify-center disabled:opacity-30 hover:bg-accent/80 transition-colors"
            >
              <Icon name="ArrowUp" size={18} className="text-black" />
            </button>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-2">
            DevayAI работает на российских серверах · Данные не передаются третьим лицам
          </p>
        </div>
      </div>
    </div>
  );
}