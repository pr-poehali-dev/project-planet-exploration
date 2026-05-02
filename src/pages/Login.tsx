import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import func2url from "../../backend/func2url.json";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(func2url["auth"], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      const data = await res.json();
      const parsed = typeof data === "string" ? JSON.parse(data) : data;

      if (!res.ok) {
        setError(parsed.error || "Неверный email или пароль");
        return;
      }

      localStorage.setItem("devay_token", parsed.token);
      localStorage.setItem("devay_email", parsed.email);
      navigate("/chat");
    } catch {
      setError("Ошибка соединения. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/" className="font-display font-black text-2xl tracking-tighter bg-gradient-to-r from-white via-accent to-accent/80 bg-clip-text text-transparent">
            devay.ru
          </Link>
          <h1 className="text-2xl font-bold mt-6 mb-2">Войти в аккаунт</h1>
          <p className="text-muted-foreground text-sm">Введите ваши данные для входа</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-accent/20 rounded-2xl p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2 text-white/80">Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@test"
              required
              className="w-full px-4 py-3 rounded-xl bg-background border border-accent/20 focus:border-accent/60 outline-none text-sm text-white placeholder:text-muted-foreground transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-white/80">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 rounded-xl bg-background border border-accent/20 focus:border-accent/60 outline-none text-sm text-white placeholder:text-muted-foreground transition-colors"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
              <Icon name="AlertCircle" size={16} />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-accent to-accent/80 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-accent/30 transition-all disabled:opacity-50"
          >
            {loading ? "Входим..." : "Войти"}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          <Link to="/" className="hover:text-white transition-colors">← На главную</Link>
        </p>
      </div>
    </div>
  );
}
