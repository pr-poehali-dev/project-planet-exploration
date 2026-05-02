import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Icon from "@/components/ui/icon";
import func2url from "../../backend/func2url.json";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const PRODUCT_CONFIGS: Record<string, { name: string; prompt: string; suggestions: string[] }> = {
  devaychat: {
    name: "DevayChat",
    prompt: `Ты — DevayChat, языковой ИИ-ассистент платформы devay.ru уровня GPT-4. Специализируешься на генерации текстов, написании кода, переводе, аналитике и ответах на вопросы. Отвечай чётко, профессионально и дружелюбно. Всегда отвечай на русском языке, если пользователь не попросил иначе.`,
    suggestions: [
      "Напиши текст для лендинга ИИ-стартапа",
      "Объясни, что такое нейронные сети простыми словами",
      "Придумай 5 идей для бизнеса с использованием ИИ",
      "Переведи на английский: «Привет, как дела?»",
    ],
  },
  devayvision: {
    name: "DevayVision",
    prompt: `Ты — DevayVision, ИИ-ассистент по генерации изображений платформы devay.ru. Помогаешь пользователям составлять точные и детальные текстовые описания (промпты) для создания изображений: маркетинговых материалов, иллюстраций, логотипов, фото продуктов. Объясняй как лучше описать стиль, цвета, композицию. Отвечай на русском языке.`,
    suggestions: [
      "Помоги составить промпт для логотипа IT-компании",
      "Как описать реалистичное фото продукта для рекламы?",
      "Придумай описание баннера для соцсетей в стиле минимализм",
      "Какие параметры влияют на качество генерации изображения?",
    ],
  },
  devayaudio: {
    name: "DevayAudio",
    prompt: `Ты — DevayAudio, ИИ-ассистент по работе с аудио и речью платформы devay.ru. Специализируешься на транскрибации, распознавании речи, создании субтитров, диаризации и обработке звонков. Помогаешь пользователям понять как настроить и использовать аудио-модели. Отвечай на русском языке.`,
    suggestions: [
      "Как транскрибировать звонки колл-центра?",
      "Какие форматы аудио вы поддерживаете?",
      "Как создать субтитры для видео автоматически?",
      "Что такое диаризация и зачем она нужна?",
    ],
  },
  devayvideo: {
    name: "DevayVideo",
    prompt: `Ты — DevayVideo, ИИ-ассистент по генерации видео платформы devay.ru. Помогаешь пользователям создавать текстовые описания для генерации видеороликов, анимаций и визуализаций. Объясняешь как правильно описать движение камеры, сцену, персонажей, стиль. Отвечай на русском языке.`,
    suggestions: [
      "Помоги составить описание рекламного видеоролика",
      "Как описать движение камеры в промпте для видео?",
      "Придумай сцену для обучающей анимации по физике",
      "Какой максимальный хронометраж видео можно сгенерировать?",
    ],
  },
  devaycode: {
    name: "DevayCode",
    prompt: `Ты — DevayCode, ИИ-ассистент для разработчиков платформы devay.ru. Специализируешься на генерации кода, объяснении алгоритмов, поиске багов, рефакторинге и написании тестов. Поддерживаешь Python, JavaScript, TypeScript, Go, Rust, Java, SQL и другие языки. Давай примеры кода с объяснениями. Отвечай на русском языке, код пиши без перевода.`,
    suggestions: [
      "Напиши REST API на Python с FastAPI",
      "Найди баг в этом коде и объясни причину",
      "Как написать unit-тесты для React компонента?",
      "Оптимизируй этот SQL-запрос для больших таблиц",
    ],
  },
  devayapi: {
    name: "Devay API",
    prompt: `Ты — Devay API ассистент платформы devay.ru. Помогаешь разработчикам интегрировать AI-модели devay.ru через REST API. Знаешь все эндпоинты, форматы запросов и ответов, методы аутентификации, лимиты и тарификацию. Совместим с OpenAI SDK. Давай примеры кода для интеграции. Отвечай на русском языке.`,
    suggestions: [
      "Как подключить Devay API совместимо с OpenAI SDK?",
      "Покажи пример запроса к chat completion API",
      "Какие модели доступны через API и их лимиты?",
      "Как настроить аутентификацию через API ключ?",
    ],
  },
};

const DEFAULT_CONFIG = {
  name: "DevayAI",
  prompt: `Ты — DevayAI, умный русскоязычный ИИ-ассистент платформы devay.ru. Отвечай чётко, по делу и дружелюбно. Всегда отвечай на русском языке, если пользователь не попросил иначе.`,
  suggestions: [
    "Напиши текст для лендинга ИИ-стартапа",
    "Объясни, что такое нейронные сети",
    "Придумай 5 идей для бизнеса с ИИ",
    "Переведи на английский: «Привет, как дела?»",
  ],
};

export default function DevayAI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();
  const { product } = useParams<{ product?: string }>();
  const config = (product && PRODUCT_CONFIGS[product]) ? PRODUCT_CONFIGS[product] : DEFAULT_CONFIG;

  useEffect(() => {
    const token = localStorage.getItem("devay_token");
    if (!token) navigate("/login");
  }, [navigate]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleLogout = () => {
    localStorage.removeItem("devay_token");
    localStorage.removeItem("devay_email");
    navigate("/login");
  };

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
            { role: "system", content: config.prompt },
            ...updatedMessages,
          ],
        }),
      });
      clearTimeout(timeout);
      const text = await res.text();
      if (!text) throw new Error("Достигнут лимит вызовов. Обновите подписку на poehali.dev/p/pay");
      let parsed = JSON.parse(text);
      if (typeof parsed === "string") parsed = JSON.parse(parsed);
      const reply = parsed.reply ?? parsed?.message?.content ?? "Нет ответа";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error("Fetch error:", err);
      const msg = err instanceof Error ? err.message : String(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Ошибка: ${msg}` },
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
            <span className="text-sm text-accent font-medium">{config.name} · qwen2.5</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-muted-foreground hover:text-white transition-colors flex items-center gap-1"
          >
            <Icon name="LogOut" size={16} />
            Выйти
          </button>
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
                <h1 className="text-2xl font-bold mb-2">{config.name}</h1>
                <p className="text-muted-foreground text-sm max-w-sm">
                  Российский ИИ-ассистент на базе Qwen 2.5. Задайте любой вопрос или выберите подсказку ниже.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                {config.suggestions.map((s) => (
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