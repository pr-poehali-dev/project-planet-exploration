import { useState } from "react";
import { X, CheckCircle, Loader2 } from "lucide-react";

interface LeadFormProps {
  onClose: () => void;
  product?: string;
}

const LeadForm = ({ onClose, product }: LeadFormProps) => {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("https://functions.poehali.dev/6a121b73-b6f8-4997-bd9f-22155b2c5570", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, product: product || "devay.ru" }),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-card border border-accent/20 rounded-2xl p-8 shadow-2xl shadow-accent/10 z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {status === "success" ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-xl font-bold mb-2">Заявка отправлена!</h3>
            <p className="text-muted-foreground text-sm">
              Мы свяжемся с вами в течение рабочего дня на указанный email.
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-6 py-3 bg-accent/10 hover:bg-accent/20 border border-accent/20 rounded-xl text-sm font-medium text-accent transition-all"
            >
              Закрыть
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h3 className="text-xl font-display font-bold mb-1">
                {product ? `Попробовать ${product}` : "Оставить заявку"}
              </h3>
              <p className="text-sm text-muted-foreground">
                Заполните форму — мы свяжемся и поможем с первыми шагами бесплатно.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Ваше имя *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Иван Иванов"
                  className="w-full px-4 py-3 bg-background border border-accent/20 hover:border-accent/40 focus:border-accent rounded-xl text-sm outline-none transition-colors placeholder:text-muted-foreground/50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="ivan@company.ru"
                  className="w-full px-4 py-3 bg-background border border-accent/20 hover:border-accent/40 focus:border-accent rounded-xl text-sm outline-none transition-colors placeholder:text-muted-foreground/50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Компания</label>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="ООО Ромашка"
                  className="w-full px-4 py-3 bg-background border border-accent/20 hover:border-accent/40 focus:border-accent rounded-xl text-sm outline-none transition-colors placeholder:text-muted-foreground/50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Комментарий</label>
                <textarea
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Расскажите о вашей задаче..."
                  className="w-full px-4 py-3 bg-background border border-accent/20 hover:border-accent/40 focus:border-accent rounded-xl text-sm outline-none transition-colors placeholder:text-muted-foreground/50 resize-none"
                />
              </div>

              {status === "error" && (
                <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                  Ошибка отправки. Напишите нам напрямую: support@devay.ru
                </p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-4 bg-gradient-to-r from-accent to-accent/80 text-black rounded-xl font-semibold hover:shadow-xl hover:shadow-accent/30 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Отправляем...
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