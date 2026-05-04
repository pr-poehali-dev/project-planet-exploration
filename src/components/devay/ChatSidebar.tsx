import Icon from "@/components/ui/icon";
import { ChatSession } from "./types";

interface ChatSidebarProps {
  open: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  currentSessionId: string | null;
  onNewChat: () => void;
  onLoadSession: (session: ChatSession) => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
}

export default function ChatSidebar({
  open,
  onClose,
  sessions,
  currentSessionId,
  onNewChat,
  onLoadSession,
  onDeleteSession,
}: ChatSidebarProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex">
      <div className="w-72 bg-card border-r border-accent/20 flex flex-col h-full z-50">
        <div className="flex items-center justify-between px-4 py-4 border-b border-accent/20">
          <span className="font-semibold text-sm">История чатов</span>
          <button onClick={onClose} className="text-muted-foreground hover:text-white">
            <Icon name="X" size={18} />
          </button>
        </div>
        <button
          onClick={onNewChat}
          className="mx-3 mt-3 flex items-center gap-2 px-3 py-2.5 rounded-xl border border-accent/30 hover:border-accent/60 hover:bg-accent/5 transition-all text-sm text-accent"
        >
          <Icon name="Plus" size={15} />
          Новый чат
        </button>
        <div className="flex-1 overflow-y-auto mt-2 px-3 pb-4 space-y-1">
          {sessions.length === 0 && (
            <p className="text-xs text-muted-foreground px-2 py-4 text-center">История пуста</p>
          )}
          {sessions.map(session => (
            <button
              key={session.id}
              onClick={() => onLoadSession(session)}
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
                onClick={(e) => onDeleteSession(session.id, e)}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-400 transition-all flex-shrink-0"
              >
                <Icon name="Trash2" size={13} />
              </button>
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 bg-black/50" onClick={onClose} />
    </div>
  );
}
