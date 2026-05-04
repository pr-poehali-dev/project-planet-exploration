import { useRef } from "react";
import Icon from "@/components/ui/icon";
import { Message } from "./types";
import func2url from "../../../backend/func2url.json";
import { useState } from "react";

const urls = func2url as Record<string, string>;

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

interface ChatMessagesProps {
  messages: Message[];
  loading: boolean;
  mode: string;
  configName: string;
  suggestions: string[];
  videoProgress: number;
  videoElapsed: number;
  copiedIndex: number | null;
  onSuggestionClick: (s: string) => void;
  onCopyMessage: (content: string, index: number) => void;
  bottomRef: React.RefObject<HTMLDivElement>;
}

export default function ChatMessages({
  messages,
  loading,
  mode,
  configName,
  suggestions,
  videoProgress,
  videoElapsed,
  copiedIndex,
  onSuggestionClick,
  onCopyMessage,
  bottomRef,
}: ChatMessagesProps) {
  return (
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
              <h1 className="text-2xl font-bold mb-2">{configName}</h1>
              <p className="text-muted-foreground text-sm max-w-sm">
                {mode === "vision" && "Генерация изображений на базе Playground v2.5. Опишите что хотите увидеть."}
                {mode === "video" && "Генерация видео на базе Wan2.1. Опишите сцену для видеоролика."}
                {mode === "audio" && "Распознавание речи на базе Whisper large-v3. Загрузите аудио файл."}
                {(mode === "chat") && "Российский ИИ-ассистент. Задайте любой вопрос или выберите подсказку ниже."}
              </p>
            </div>
            {suggestions.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => onSuggestionClick(s)}
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
                      onClick={() => onCopyMessage(msg.content, i)}
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
  );
}
