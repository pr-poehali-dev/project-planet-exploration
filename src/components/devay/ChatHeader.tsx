import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

interface ChatHeaderProps {
  configName: string;
  modelLabel: string;
  onOpenSidebar: () => void;
  onLogout: () => void;
}

export default function ChatHeader({
  configName,
  modelLabel,
  onOpenSidebar,
  onLogout,
}: ChatHeaderProps) {
  return (
    <header className="flex-shrink-0 border-b border-accent/20 bg-background/80 backdrop-blur-xl z-10">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSidebar}
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
          <span className="text-sm text-accent font-medium">{configName} · {modelLabel}</span>
        </div>
        <button
          onClick={onLogout}
          className="text-sm text-muted-foreground hover:text-white transition-colors flex items-center gap-1"
        >
          <Icon name="LogOut" size={16} />
          Выйти
        </button>
      </div>
    </header>
  );
}
