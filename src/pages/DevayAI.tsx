import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import Icon from "@/components/ui/icon";
import func2url from "../../backend/func2url.json";

const urls = func2url as Record<string, string>;

interface Message {
  role: "user" | "assistant";
  content: string;
  image_base64?: string;
  video_base64?: string;
}

interface ChatSession {
  id: string;
  product: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

interface CodeBlockProps {
  code: string;
  lang: string;
}

function CodeBlock({ code, lang }: CodeBlockProps) {
  const [output, setOutput] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const isPython = lang === "python" || lang === "py" || lang === "";

  const runCode = async () => {
    setRunning(true);
    setOutput(null);
    try {
      const res = await fetch(urls["execute-code"], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      const result = data.stdout || data.stderr || "Нет вывода";
      setOutput(result);
    } catch {
      setOutput("Ошибка при выполнении кода");
    } finally {
      setRunning(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-accent/20 bg-black/40">
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-accent/10">
        <span className="text-xs text-muted-foreground font-mono">{lang || "python"}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={copyCode}
            className="text-xs text-muted-foreground hover:text-white transition-colors flex items-center gap-1"
          >
            <Icon name={copied ? "Check" : "Copy"} size={12} />
            {copied ? "Скопировано" : "Копировать"}
          </button>
          {isPython && (
            <button
              onClick={runCode}
              disabled={running}
              className="text-xs bg-accent text-black font-semibold px-3 py-1 rounded-lg flex items-center gap-1 hover:bg-accent/80 transition-colors disabled:opacity-50"
            >
              <Icon name={running ? "Loader" : "Play"} size={12} />
              {running ? "Выполняется..." : "Запустить"}
            </button>
          )}
        </div>
      </div>
      <pre className="px-4 py-3 text-sm font-mono text-white/90 overflow-x-auto leading-relaxed">
        <code>{code}</code>
      </pre>
      {output !== null && (
        <div className="border-t border-accent/10 px-4 py-3 bg-black/20">
          <p className="text-xs text-muted-foreground mb-1 font-semibold uppercase tracking-wide">Результат</p>
          <pre className="text-sm font-mono text-green-400 whitespace-pre-wrap">{output}</pre>
        </div>
      )}
    </div>
  );
}

function MessageContent({ content }: { content: string }) {
  const parts: { type: "text" | "code"; value: string; lang: string }[] = [];
  const codeBlockRegex = /```(\w*)\n?([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", value: content.slice(lastIndex, match.index), lang: "" });
    }
    parts.push({ type: "code", value: match[2].trim(), lang: match[1].toLowerCase() });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < content.length) {
    parts.push({ type: "text", value: content.slice(lastIndex), lang: "" });
  }

  return (
    <div>
      {parts.map((part, i) =>
        part.type === "code" ? (
          <CodeBlock key={i} code={part.value} lang={part.lang} />
        ) : (
          <span key={i} className="whitespace-pre-wrap">{part.value}</span>
        )
      )}
    </div>
  );
}

const PRODUCT_CONFIGS: Record<string, { name: string; prompt: string; suggestions: string[]; mode: string }> = {
  devaychat: {
    name: "DevayChat",
    mode: "chat",
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
    mode: "vision",
    prompt: "",
    suggestions: [
      "Логотип IT-компании в стиле минимализм",
      "Реалистичное фото кофе на столе у окна",
      "Баннер для соцсетей: технологии и будущее",
      "Иллюстрация: робот читает книгу в библиотеке",
    ],
  },
  devayaudio: {
    name: "DevayAudio",
    mode: "audio",
    prompt: "",
    suggestions: [],
  },
  devayvideo: {
    name: "DevayVideo",
    mode: "video",
    prompt: "",
    suggestions: [
      "Закат над океаном, волны бьются о берег",
      "Городской таймлапс: огни ночного города",
      "Полёт над снежными горами на рассвете",
      "Цветок распускается в ускоренной съёмке",
    ],
  },
  devaycode: {
    name: "DevayCode",
    mode: "chat",
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
    mode: "chat",
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
  mode: "chat",
  prompt: `Ты — DevayAI, умный русскоязычный ИИ-ассистент платформы devay.ru. Отвечай чётко, по делу и дружелюбно. Всегда отвечай на русском языке, если пользователь не попросил иначе.`,
  suggestions: [
    "Напиши текст для лендинга ИИ-стартапа",
    "Объясни, что такое нейронные сети",
    "Придумай 5 идей для бизнеса с ИИ",
    "Переведи на английский: «Привет, как дела?»",
  ],
};

const STORAGE_KEY = "devay_chat_history";

function loadHistory(): ChatSession[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveHistory(sessions: ChatSession[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions.slice(0, 50)));
}

export default function DevayAI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoElapsed, setVideoElapsed] = useState(0);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [history, setHistory] = useState<ChatSession[]>(loadHistory);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { product } = useParams<{ product?: string }>();
  const config = (product && PRODUCT_CONFIGS[product]) ? PRODUCT_CONFIGS[product] : DEFAULT_CONFIG;
  const mode = config.mode;
  const productKey = product || "default";

  useEffect(() => {
    const token = localStorage.getItem("devay_token");
    if (!token) navigate("/login", { state: { from: location.pathname } });
  }, [navigate, location.pathname]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const startNewChat = () => {
    setMessages([]);
    setCurrentSessionId(null);
    setInput("");
    setSidebarOpen(false);
  };

  const loadSession = (session: ChatSession) => {
    setMessages(session.messages);
    setCurrentSessionId(session.id);
    setSidebarOpen(false);
  };

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = history.filter(s => s.id !== id);
    setHistory(updated);
    saveHistory(updated);
    if (currentSessionId === id) startNewChat();
  };

  const persistMessages = (msgs: Message[], sessionId: string | null, firstUserMsg: string) => {
    const id = sessionId || `${productKey}-${Date.now()}`;
    const title = firstUserMsg.slice(0, 40) + (firstUserMsg.length > 40 ? "..." : "");
    const session: ChatSession = { id, product: productKey, title, messages: msgs, createdAt: Date.now() };
    const updated = [session, ...history.filter(s => s.id !== id)];
    setHistory(updated);
    saveHistory(updated);
    return id;
  };

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

  const sendChat = async (text: string, chatMessages: Message[]) => {
    const res = await fetch(urls["devay-chat"], {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: product === "devaycode" ? "qwen2.5-coder:32b" : "qwen2.5:7b",
        messages: [
          { role: "system", content: config.prompt },
          ...chatMessages.map(m => ({ role: m.role, content: m.content })),
        ],
      }),
    });
    const raw = await res.text();
    if (!raw) throw new Error("Достигнут лимит вызовов. Обновите подписку на poehali.dev/p/pay");
    let parsed = JSON.parse(raw);
    if (typeof parsed === "string") parsed = JSON.parse(parsed);
    return parsed.reply ?? parsed?.message?.content ?? "Нет ответа";
  };

  const sendVision = async (prompt: string) => {
    const res = await fetch(urls["devay-vision"], {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, width: 1024, height: 1024, steps: 25 }),
    });
    const data = await res.json();
    if (!data.image_base64) throw new Error("Не удалось сгенерировать изображение");
    return data.image_base64 as string;
  };

  const sendVideo = async (prompt: string, onStatus?: (status: string, elapsed: number) => void) => {
    const res = await fetch(urls["devay-video"], {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, num_frames: 49, fps: 8 }),
    });
    const data = await res.json();
    if (!data.job_id) throw new Error("Не удалось запустить генерацию видео");

    const jobId = data.job_id;
    const startTime = Date.now();

    while (true) {
      await new Promise(r => setTimeout(r, 5000));
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      onStatus?.(jobId, elapsed);

      const statusRes = await fetch(`${urls["devay-video-status"]}?job_id=${jobId}`);
      const statusData = await statusRes.json();

      if (statusData.status === "done" && statusData.video_url) {
        const videoRes = await fetch(statusData.video_url);
        const blob = await videoRes.blob();
        return await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64 = (reader.result as string).split(",")[1];
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }
      if (statusData.status === "error") {
        throw new Error(statusData.error || "Ошибка генерации видео");
      }
    }
  };

  const sendAudio = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);
    let binary = "";
    uint8.forEach(b => binary += String.fromCharCode(b));
    const b64 = btoa(binary);
    const res = await fetch(urls["devay-audio"], {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ audio_base64: b64 }),
    });
    const data = await res.json();
    if (!data.text) throw new Error("Не удалось распознать аудио");
    return data.text as string;
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (mode === "audio" && !audioFile) return;
    if (mode !== "audio" && !trimmed) return;
    if (loading) return;

    const userMsg: Message = {
      role: "user",
      content: mode === "audio" ? `🎙 ${audioFile?.name ?? "аудио файл"}` : trimmed,
    };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setAudioFile(null);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setLoading(true);

    try {
      const controller = new AbortController();
      const timeoutMs = mode === "video" ? 300000 : 120000;
      const timeout = setTimeout(() => controller.abort(), timeoutMs);

      let reply = "";
      let image_base64: string | undefined;
      let video_base64: string | undefined;

      if (mode === "vision") {
        image_base64 = await sendVision(trimmed);
        reply = `Изображение по запросу: «${trimmed}»`;
      } else if (mode === "video") {
        setVideoProgress(0);
        setVideoElapsed(0);
        video_base64 = await sendVideo(trimmed, (_jobId, elapsed) => {
          setVideoElapsed(elapsed);
          setVideoProgress(Math.min(95, Math.floor((elapsed / 1800) * 95)));
        });
        setVideoProgress(100);
        reply = `Видео по запросу: «${trimmed}»`;
      } else if (mode === "audio") {
        reply = await sendAudio(audioFile!);
      } else {
        reply = await sendChat(trimmed, updatedMessages);
      }

      clearTimeout(timeout);
      const assistantMsg: Message = { role: "assistant", content: reply, image_base64, video_base64 };
      const finalMessages = [...updatedMessages, assistantMsg];
      setMessages(finalMessages);
      const newId = persistMessages(finalMessages, currentSessionId, userMsg.content);
      if (!currentSessionId) setCurrentSessionId(newId);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setMessages(prev => [...prev, { role: "assistant", content: `Ошибка: ${msg}` }]);
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

  const modelLabel =
    product === "devaycode" ? "qwen2.5-coder:32b" :
    product === "devayvision" ? "playground-v2.5" :
    product === "devayvideo" ? "cogvideox-2b" :
    product === "devayaudio" ? "whisper-large-v3" :
    "qwen2.5:7b";

  const sessionsByProduct = history.filter(s => s.product === productKey);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-72 bg-card border-r border-accent/20 flex flex-col h-full z-50">
            <div className="flex items-center justify-between px-4 py-4 border-b border-accent/20">
              <span className="font-semibold text-sm">История чатов</span>
              <button onClick={() => setSidebarOpen(false)} className="text-muted-foreground hover:text-white">
                <Icon name="X" size={18} />
              </button>
            </div>
            <button
              onClick={startNewChat}
              className="mx-3 mt-3 flex items-center gap-2 px-3 py-2.5 rounded-xl border border-accent/30 hover:border-accent/60 hover:bg-accent/5 transition-all text-sm text-accent"
            >
              <Icon name="Plus" size={15} />
              Новый чат
            </button>
            <div className="flex-1 overflow-y-auto mt-2 px-3 pb-4 space-y-1">
              {sessionsByProduct.length === 0 && (
                <p className="text-xs text-muted-foreground px-2 py-4 text-center">История пуста</p>
              )}
              {sessionsByProduct.map(session => (
                <button
                  key={session.id}
                  onClick={() => loadSession(session)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all group flex items-center justify-between gap-2 ${
                    currentSessionId === session.id
                      ? "bg-accent/10 border border-accent/30 text-white"
                      : "hover:bg-white/5 text-white/70 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon name="MessageSquare" size={13} className="flex-shrink-0 text-muted-foreground" />
                    <span className="truncate">{session.title}</span>
                  </div>
                  <button
                    onClick={(e) => deleteSession(session.id, e)}
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-400 transition-all flex-shrink-0"
                  >
                    <Icon name="Trash2" size={13} />
                  </button>
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      <div className="flex flex-col flex-1 min-w-0">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-accent/20 bg-background/80 backdrop-blur-xl z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-muted-foreground hover:text-white transition-colors"
              title="История чатов"
            >
              <Icon name="PanelLeft" size={20} />
            </button>
            <Link to="/" className="font-display font-black text-xl tracking-tighter bg-gradient-to-r from-white via-accent to-accent/80 bg-clip-text text-transparent">
              devay.ru
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm text-accent font-medium">{config.name} · {modelLabel}</span>
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
                <Icon name={
                  mode === "vision" ? "Image" :
                  mode === "video" ? "Video" :
                  mode === "audio" ? "Mic" :
                  "Sparkles"
                } size={32} className="text-accent" />
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-2">{config.name}</h1>
                <p className="text-muted-foreground text-sm max-w-sm">
                  {mode === "vision" && "Генерация изображений на базе Playground v2.5. Опишите что хотите увидеть."}
                  {mode === "video" && "Генерация видео на базе Wan2.1. Опишите сцену для видеоролика."}
                  {mode === "audio" && "Распознавание речи на базе Whisper large-v3. Загрузите аудио файл."}
                  {(mode === "chat") && "Российский ИИ-ассистент. Задайте любой вопрос или выберите подсказку ниже."}
                </p>
              </div>
              {config.suggestions.length > 0 && (
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
              )}
              {mode === "audio" && (
                <div className="text-muted-foreground text-sm">
                  Поддерживаемые форматы: MP3, WAV, M4A, OGG, FLAC
                </div>
              )}
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
                className={`max-w-[80%] rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-accent text-black font-medium rounded-br-sm whitespace-pre-wrap px-4 py-3"
                    : "bg-card border border-accent/10 text-white/90 rounded-bl-sm px-4 py-3"
                }`}
              >
                {msg.role === "assistant" ? (
                  <div>
                    {msg.image_base64 && (
                      <div className="mb-3">
                        <img
                          src={`data:image/png;base64,${msg.image_base64}`}
                          alt="Сгенерированное изображение"
                          className="rounded-xl max-w-full border border-accent/20"
                        />
                        <a
                          href={`data:image/png;base64,${msg.image_base64}`}
                          download={`devay-vision-${Date.now()}.png`}
                          className="mt-2 inline-flex items-center gap-1.5 text-xs text-accent hover:text-accent/80 transition-colors"
                        >
                          <Icon name="Download" size={12} />
                          Скачать изображение
                        </a>
                      </div>
                    )}
                    {msg.video_base64 && (
                      <div className="mb-3">
                        <video
                          controls
                          className="rounded-xl max-w-full border border-accent/20"
                          src={`data:video/mp4;base64,${msg.video_base64}`}
                        />
                        <a
                          href={`data:video/mp4;base64,${msg.video_base64}`}
                          download={`devay-video-${Date.now()}.mp4`}
                          className="mt-2 inline-flex items-center gap-1.5 text-xs text-accent hover:text-accent/80 transition-colors"
                        >
                          <Icon name="Download" size={12} />
                          Скачать видео
                        </a>
                      </div>
                    )}
                    <MessageContent content={msg.content} />
                    {mode === "audio" && !msg.image_base64 && !msg.video_base64 && (
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(msg.content);
                          setCopiedIndex(i);
                          setTimeout(() => setCopiedIndex(null), 2000);
                        }}
                        className="mt-2 inline-flex items-center gap-1.5 text-xs text-accent hover:text-accent/80 transition-colors"
                      >
                        <Icon name={copiedIndex === i ? "Check" : "Copy"} size={12} />
                        {copiedIndex === i ? "Скопировано" : "Копировать текст"}
                      </button>
                    )}
                  </div>
                ) : msg.content}
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
              {mode === "video" ? (
                <div className="bg-card border border-accent/10 px-4 py-3 rounded-2xl rounded-bl-sm flex flex-col gap-2 min-w-[260px]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/80 font-medium">Генерация видео на CPU...</span>
                    <span className="text-muted-foreground">
                      {Math.floor(videoElapsed / 60)}:{String(videoElapsed % 60).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full transition-all duration-1000"
                      style={{ width: `${videoProgress}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">Это может занять 10–30 минут, не закрывай вкладку</span>
                </div>
              ) : (
                <div className="bg-card border border-accent/10 px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                  {mode === "vision" && <span className="text-xs text-muted-foreground ml-2">Генерация изображения...</span>}
                  {mode === "audio" && <span className="text-xs text-muted-foreground ml-2">Распознаю речь...</span>}
                </div>
              )}
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="flex-shrink-0 border-t border-accent/20 bg-background/80 backdrop-blur-xl p-4">
        <div className="max-w-4xl mx-auto">
          {mode === "audio" ? (
            <div className="flex gap-3 items-center bg-card border border-accent/20 rounded-2xl p-3 focus-within:border-accent/50 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept=".mp3,.wav,.m4a,.ogg,.flac,audio/*"
                className="hidden"
                onChange={e => setAudioFile(e.target.files?.[0] ?? null)}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors flex-1"
              >
                <Icon name="Paperclip" size={16} />
                {audioFile ? audioFile.name : "Выберите аудио файл (MP3, WAV, M4A...)"}
              </button>
              <button
                onClick={() => sendMessage("")}
                disabled={!audioFile || loading}
                className="w-9 h-9 rounded-xl bg-accent flex-shrink-0 flex items-center justify-center disabled:opacity-30 hover:bg-accent/80 transition-colors"
              >
                <Icon name="ArrowUp" size={18} className="text-black" />
              </button>
            </div>
          ) : (
            <div className="flex gap-3 items-end bg-card border border-accent/20 rounded-2xl p-3 focus-within:border-accent/50 transition-colors">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => { setInput(e.target.value); autoResize(); }}
                onKeyDown={handleKeyDown}
                placeholder={
                  mode === "vision" ? "Опишите изображение... (Enter — сгенерировать)" :
                  mode === "video" ? "Опишите сцену для видео... (Enter — сгенерировать)" :
                  "Задайте вопрос... (Enter — отправить, Shift+Enter — перенос)"
                }
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
          )}
          <p className="text-center text-xs text-muted-foreground mt-2">
            DevayAI работает на российских серверах · Данные не передаются третьим лицам
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}