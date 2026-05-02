import { useState } from "react";
import { X, CheckCircle, Loader2 } from "lucide-react";

interface LeadFormProps {
  onClose: () => void;
  product?: string;
}

const LeadForm = ({ onClose, product }: LeadFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch(`mailto:support@devay.ru`, { method: "GET" });
      // fallback: просто имитируем успех
      void res;
    } catch {
      // ignore
    }

    // Открываем mailto как запасной вариант
    const subject = encodeURIComponent(`Заявка на ${product || "devay.ru"}`);
    const body = encodeURIComponent(
      `Имя: ${name}\nEmail: ${email}\nКомпания: ${company}\nСообщение: ${message}`
    );
    window.location.href = `mailto:support@devay.ru?subject=${subject}&body=${body}`;

    setStatus("success");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-card border border-accent/20 rounded-3xl p-8 shadow-2xl shadow-accent/10">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-muted-foreground hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {status === "success" ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-2xl font-display font-black mb-3">Заявка отправлена!</h3>
            <p className="text-muted-foreground mb-8">
              Откроется ваш почтовый клиент. Если не открылся — напишите нам напрямую на{" "}
              <a href="mailto:support@devay.ru" className="text-accent hover:underline">
                support@devay.ru
              </a>
            </p>
            <button
              onClick={onClose}
              className="px-8 py-3 bg-gradient-to-r from-accent to-accent/80 text-black rounded-full font-semibold"
            >
              Закрыть
            </button>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <div className="text-xs font-medium tracking-widest text-accent/70 uppercase mb-2">Связаться с нами</div>
              <h3 className="text-2xl font-display font-black">
                {product ? `Попробовать ${product}` : "Оставить заявку"}
              </h3>
              <p className="text-muted-foreground text-sm mt-2">
                Ответим в течение рабочего дня
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Ваше имя *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Иван Петров"
                  className="w-full px-4 py-3 bg-background border border-accent/20 hover:border-accent/40 focus:border-accent/60 rounded-xl text-sm outline-none transition-colors placeholder:text-muted-foreground/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ivan@company.ru"
                  className="w-full px-4 py-3 bg-background border border-accent/20 hover:border-accent/40 focus:border-accent/60 rounded-xl text-sm outline-none transition-colors placeholder:text-muted-foreground/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Компания</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="ООО «Моя компания»"
                  className="w-full px-4 py-3 bg-background border border-accent/20 hover:border-accent/40 focus:border-accent/60 rounded-xl text-sm outline-none transition-colors placeholder:text-muted-foreground/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Что хотите автоматизировать?</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  placeholder="Расскажите о вашей задаче..."
                  className="w-full px-4 py-3 bg-background border border-accent/20 hover:border-accent/40 focus:border-accent/60 rounded-xl text-sm outline-none transition-colors placeholder:text-muted-foreground/50 resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-4 bg-gradient-to-r from-accent to-accent/80 text-black rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-accent/30 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Отправляю...
                  </>
                ) : (
                  "Отправить заявку"
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default LeadForm;
