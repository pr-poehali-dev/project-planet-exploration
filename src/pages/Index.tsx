import { useEffect, useState } from "react";
import { ArrowRight, MessageSquare, Image, Mic, Code, Video, Zap, Lock, Globe, Shield, TrendingUp, Cpu } from "lucide-react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import LeadForm from "@/components/LeadForm";

const products = [
  {
    icon: "MessageSquare",
    tag: "GPT-серия",
    name: "DevayChat",
    slug: "devaychat",
    desc: "Мощный языковой ИИ уровня GPT-4. Генерирует тексты, отвечает на вопросы, пишет код, переводит и обобщает — в режиме реального времени.",
    badge: "Популярно",
  },
  {
    icon: "Image",
    tag: "DALL-E аналог",
    name: "DevayVision",
    slug: "devayvision",
    desc: "Генерация изображений по текстовому описанию. От реалистичных фото до иллюстраций и маркетинговых креативов — за секунды.",
  },
  {
    icon: "Mic",
    tag: "Whisper аналог",
    name: "DevayAudio",
    slug: "devayaudio",
    desc: "Распознавание речи на 90+ языках. Транскрибация, субтитры, обработка звонков. Работает даже с шумом и акцентами.",
  },
  {
    icon: "Video",
    tag: "Sora аналог",
    name: "DevayVideo",
    slug: "devayvideo",
    desc: "Генерация видео по тексту. Создавайте ролики, визуализации и анимации для бизнеса без съёмочной группы.",
    badge: "Новинка",
  },
  {
    icon: "Code",
    tag: "Codex аналог",
    name: "DevayCode",
    slug: "devaycode",
    desc: "ИИ-ассистент для разработчиков. Генерирует, объясняет и исправляет код на любом языке программирования.",
  },
  {
    icon: "Zap",
    tag: "OpenAI API аналог",
    name: "Devay API",
    slug: "devayapi",
    desc: "REST API для интеграции всех моделей в ваши приложения. Совместим с OpenAI SDK — переход без переписывания кода.",
  },
];

const features = [
  { icon: "Shield", title: "Данные в России", desc: "Все данные хранятся и обрабатываются только на российских серверах. GDPR и 152-ФЗ." },
  { icon: "Lock", title: "Без Big Tech", desc: "Полная независимость от OpenAI, Google, Microsoft. Никаких санкционных рисков." },
  { icon: "TrendingUp", title: "GPT-4 уровень", desc: "Качество ответов сопоставимо с лучшими западными моделями." },
  { icon: "Globe", title: "Русский в приоритете", desc: "Модели оптимизированы под русский язык — точнее, быстрее, дешевле." },
  { icon: "Cpu", title: "Тонкая настройка", desc: "Fine-tuning под ваши задачи и данные. Обучите модель под свой бизнес." },
  { icon: "Zap", title: "API совместимость", desc: "Миграция с OpenAI за минуты — полная совместимость форматов запросов." },
];

const Index = () => {
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({});
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const sectionIds = ["hero", "products", "features", "how", "pricing", "cta"];
    const observers: Record<string, IntersectionObserver> = {};

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (!element) return;
      observers[id] = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({ ...prev, [id]: true }));
            observers[id].unobserve(element);
          }
        },
        { threshold: 0.1 }
      );
      observers[id].observe(element);
    });

    return () => Object.values(observers).forEach((o) => o.disconnect());
  }, []);

  const fadeIn = (id: string) =>
    `transition-all duration-700 ${visibleSections[id] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 w-full bg-background/80 backdrop-blur-2xl border-b border-accent/20 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="font-display font-black text-2xl tracking-tighter bg-gradient-to-r from-white via-accent to-accent/80 bg-clip-text text-transparent">
            devay.ru
          </div>
          <nav className="hidden md:flex gap-10 text-sm font-medium">
            <a href="#products" className="text-muted-foreground hover:text-white transition-colors">Продукты</a>
            <a href="#features" className="text-muted-foreground hover:text-white transition-colors">Преимущества</a>
            <a href="#how" className="text-muted-foreground hover:text-white transition-colors">Как работает</a>
            <a href="#pricing" className="text-muted-foreground hover:text-white transition-colors">Тарифы</a>
          </nav>
          <div className="flex gap-3">
            <Link to="/login" className="px-5 py-2.5 text-sm font-medium border border-accent/40 rounded-full hover:border-accent/70 hover:bg-accent/10 transition-all">
              Войти
            </Link>
            <button
              onClick={() => setShowForm(true)}
              className="px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-accent to-accent/80 text-black rounded-full hover:shadow-lg hover:shadow-accent/40 transition-all font-semibold"
            >
              Попробовать бесплатно
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="hero" className="relative pt-32 pb-32 px-6 min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden">
          <img src="/images/black-hole-gif.gif" alt="" className="w-auto h-3/4 object-contain opacity-80" />
        </div>
        <div className="absolute inset-0 bg-black/65" />

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className={fadeIn("hero")}>
              <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/10">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-xs font-medium tracking-widest text-accent/90 uppercase">
                  Российский аналог OpenAI
                </span>
              </div>
              <h1 className="text-6xl lg:text-7xl font-display font-black leading-tight mb-8 tracking-tighter">
                <span className="bg-gradient-to-br from-white via-white to-accent/40 bg-clip-text text-transparent">
                  Весь ИИ.
                </span>
                <br />
                <span className="text-accent">Без зависимостей.</span>
              </h1>
              <p className="text-xl text-white/80 leading-relaxed mb-10 max-w-xl font-light">
                devay.ru — платформа полного цикла: языковые модели, генерация изображений и видео, распознавание речи, API для разработчиков. Всё как у OpenAI, но на российской инфраструктуре.
              </p>
              <div className="flex gap-4 mb-12 flex-col sm:flex-row">
                <button
                  onClick={() => setShowForm(true)}
                  className="group px-8 py-4 bg-gradient-to-r from-accent to-accent/90 text-black rounded-full hover:shadow-2xl hover:shadow-accent/50 transition-all font-semibold text-lg flex items-center gap-3 justify-center"
                >
                  Начать бесплатно
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                </button>
                <Link to="/chat" className="group px-8 py-4 border border-accent/40 rounded-full hover:border-accent/70 hover:bg-accent/10 transition-all font-medium text-lg text-white flex items-center gap-3 justify-center">
                  <MessageSquare className="w-5 h-5 text-accent" />
                  Попробовать DevayAI
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10">
                <div>
                  <div className="text-2xl font-bold text-accent mb-1">6</div>
                  <p className="text-sm text-white/60">AI-продуктов</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white mb-1">90+</div>
                  <p className="text-sm text-white/60">Языков</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent mb-1">99.9%</div>
                  <p className="text-sm text-white/60">Аптайм</p>
                </div>
              </div>
            </div>

            <div
              className={`relative h-96 lg:h-[550px] flex items-center justify-center transition-all duration-1000 ${visibleSections["hero"] ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/30 via-transparent to-transparent rounded-3xl blur-3xl animate-pulse" />
              <img
                src="/devay-logo.png"
                alt="devay.ru AI"
                className="w-full max-w-sm lg:max-w-md drop-shadow-2xl animate-float relative z-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="py-32 px-6 bg-accent/5">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-20 ${fadeIn("products")}`}>
            <span className="text-xs font-medium tracking-widest text-accent/60 uppercase">Продукты</span>
            <h2 className="text-5xl lg:text-6xl font-display font-black tracking-tighter mt-4 mb-4">
              <span className="bg-gradient-to-r from-white via-white to-accent/40 bg-clip-text text-transparent">
                Всё что есть у OpenAI —
              </span>
              <br />
              <span className="text-accent">теперь у вас</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              6 AI-продуктов на одной платформе. Полные аналоги ChatGPT, DALL-E, Whisper, Sora, Codex и OpenAI API.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, i) => (
              <Link
                to={`/products/${product.slug}`}
                key={i}
                className={`group relative p-8 border border-accent/10 hover:border-accent/50 rounded-2xl bg-card/50 hover:bg-card/80 transition-all duration-700 cursor-pointer block ${
                  visibleSections["products"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                {product.badge && (
                  <span className="absolute top-4 right-4 text-xs font-semibold px-2.5 py-1 rounded-full bg-accent/20 text-accent border border-accent/30">
                    {product.badge}
                  </span>
                )}
                <div className="w-12 h-12 bg-accent/10 group-hover:bg-accent/20 rounded-xl flex items-center justify-center mb-5 transition-all group-hover:scale-110">
                  <Icon name={product.icon} size={22} className="text-accent" />
                </div>
                <div className="text-xs text-accent/70 font-medium tracking-wide uppercase mb-2">{product.tag}</div>
                <h3 className="font-display font-bold text-xl mb-3">{product.name}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{product.desc}</p>
                <div className="mt-6 flex items-center gap-2 text-accent/70 text-sm font-medium group-hover:text-accent transition-colors">
                  Узнать больше <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-20 ${fadeIn("features")}`}>
            <span className="text-xs font-medium tracking-widest text-accent/60 uppercase">Преимущества</span>
            <h2 className="text-5xl lg:text-6xl font-display font-black tracking-tighter mt-4">
              <span className="bg-gradient-to-r from-white via-white to-accent/40 bg-clip-text text-transparent">
                Почему devay.ru?
              </span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className={`group p-8 border border-accent/10 hover:border-accent/40 rounded-2xl bg-card/50 hover:bg-card/80 transition-all duration-700 ${
                  visibleSections["features"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="w-12 h-12 bg-accent/10 group-hover:bg-accent/20 rounded-xl flex items-center justify-center mb-6 transition-all group-hover:scale-110">
                  <Icon name={f.icon} size={22} className="text-accent" />
                </div>
                <h3 className="font-display font-bold text-xl mb-3">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-32 px-6 bg-accent/5">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-20 ${fadeIn("how")}`}>
            <span className="text-xs font-medium tracking-widest text-accent/60 uppercase">Как это работает</span>
            <h2 className="text-5xl lg:text-6xl font-display font-black tracking-tighter mt-4">
              <span className="bg-gradient-to-r from-white via-white to-accent/40 bg-clip-text text-transparent">
                Запуск за 4 шага
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { num: "01", title: "Регистрация", desc: "Создайте аккаунт и получите бесплатные токены для тестирования" },
              { num: "02", title: "Выберите продукт", desc: "ChatGPT, изображения, речь, видео, код — всё в одном кабинете" },
              { num: "03", title: "Подключите API", desc: "Совместимо с OpenAI SDK — перенос существующих проектов за минуты" },
              { num: "04", title: "Масштабируйте", desc: "Автоматическое масштабирование и гибкая тарификация по токенам" },
            ].map((step, i) => (
              <div
                key={i}
                className={`relative transition-all duration-700 ${
                  visibleSections["how"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <div className="group bg-accent/10 hover:bg-accent/20 border border-accent/20 hover:border-accent/40 rounded-2xl p-8 h-full flex flex-col justify-between transition-all backdrop-blur-sm cursor-pointer">
                  <div>
                    <div className="text-5xl font-display font-black text-accent mb-4 group-hover:scale-110 transition-transform">
                      {step.num}
                    </div>
                    <h3 className="font-display font-bold text-xl mb-2">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{step.desc}</p>
                  </div>
                </div>
                {i < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-accent/40 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-20 ${fadeIn("pricing")}`}>
            <span className="text-xs font-medium tracking-widest text-accent/60 uppercase">Тарифы</span>
            <h2 className="text-5xl lg:text-6xl font-display font-black tracking-tighter mt-4">
              <span className="bg-gradient-to-r from-white via-white to-accent/40 bg-clip-text text-transparent">
                Честные цены в рублях
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Старт",
                price: "Бесплатно",
                sub: "навсегда",
                features: [
                  "100 000 токенов/месяц",
                  "DevayChat (GPT-аналог)",
                  "DevayAudio — 60 мин/мес",
                  "Доступ к API",
                  "Email поддержка",
                ],
                highlight: false,
                cta: "Начать бесплатно",
              },
              {
                name: "Про",
                price: "2 900 ₽",
                sub: "в месяц",
                features: [
                  "5 млн токенов/месяц",
                  "Все 6 AI-продуктов",
                  "DevayVideo — 30 видео/мес",
                  "Fine-tuning моделей",
                  "Приоритетная поддержка",
                ],
                highlight: true,
                cta: "Выбрать Про",
              },
              {
                name: "Бизнес",
                price: "По запросу",
                sub: "индивидуально",
                features: [
                  "Безлимитные токены",
                  "Развёртывание на вашем сервере",
                  "SLA 99.99% и выделенный менеджер",
                  "Обучение модели на ваших данных",
                  "Соглашение об NDA и ФЗ-152",
                ],
                highlight: false,
                cta: "Связаться с нами",
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`group relative transition-all duration-700 ${
                  visibleSections["pricing"] ? "opacity-100 scale-100" : "opacity-0 scale-95"
                } ${plan.highlight ? "md:scale-105" : ""}`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                {plan.highlight && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-accent via-accent to-accent/60 rounded-3xl opacity-20 blur-xl group-hover:opacity-30 transition" />
                )}
                <div
                  className={`relative p-10 border rounded-2xl h-full flex flex-col justify-between backdrop-blur-sm transition-all ${
                    plan.highlight ? "border-accent/40 bg-accent/10" : "border-accent/10 bg-card/50 hover:bg-card/80"
                  }`}
                >
                  <div>
                    {plan.highlight && (
                      <div className="text-xs font-semibold text-black bg-accent px-3 py-1 rounded-full inline-block mb-4">
                        Рекомендуем
                      </div>
                    )}
                    <h3 className="font-display font-bold text-2xl mb-1">{plan.name}</h3>
                    <div className="mb-8">
                      <span className="text-4xl font-black text-accent">{plan.price}</span>
                      <span className="text-muted-foreground text-sm ml-2">{plan.sub}</span>
                    </div>
                    <ul className="space-y-4 mb-10">
                      {plan.features.map((f, j) => (
                        <li key={j} className="flex gap-3 text-sm items-start">
                          <ArrowRight className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                          <span className="text-foreground/80">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button
                    onClick={() => setShowForm(true)}
                    className={`w-full px-6 py-4 rounded-xl font-semibold transition-all ${
                      plan.highlight
                        ? "bg-gradient-to-r from-accent to-accent/80 text-black hover:shadow-xl hover:shadow-accent/40"
                        : "border border-accent/20 hover:border-accent/40 hover:bg-accent/5"
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="py-32 px-6 bg-accent/5">
        <div
          className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${visibleSections["cta"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h2 className="text-5xl lg:text-6xl font-display font-black tracking-tighter mb-6">
            <span className="bg-gradient-to-r from-white via-white to-accent/40 bg-clip-text text-transparent">
              Начните использовать ИИ
            </span>
            <br />
            <span className="text-accent">без ограничений</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-12 font-light max-w-2xl mx-auto">
            Зарегистрируйтесь бесплатно и получите доступ ко всем продуктам devay.ru. Никаких зарубежных карт и VPN.
          </p>
          <div className="flex gap-4 justify-center flex-col sm:flex-row">
            <button
              onClick={() => setShowForm(true)}
              className="group px-10 py-5 bg-gradient-to-r from-accent to-accent/90 text-black rounded-full hover:shadow-2xl hover:shadow-accent/40 transition-all font-bold text-lg flex items-center gap-3 mx-auto sm:mx-0"
            >
              Начать бесплатно
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </button>
            <Link to="/#products" className="px-10 py-5 border border-accent/40 rounded-full hover:border-accent/70 hover:bg-accent/10 transition-all font-medium text-lg text-white mx-auto sm:mx-0 flex items-center justify-center">
              Смотреть продукты
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-accent/10 py-12 px-6 bg-background/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="font-display font-black text-xl bg-gradient-to-r from-white via-accent to-accent/80 bg-clip-text text-transparent mb-3">
                devay.ru
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Российская AI-платформа полного цикла. Аналог OpenAI без зарубежных зависимостей.
              </p>
            </div>
            <div>
              <div className="font-semibold text-sm mb-4">Продукты</div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {["DevayChat", "DevayVision", "DevayAudio", "DevayVideo", "DevayCode", "Devay API"].map((p) => (
                  <li key={p}><a href="#" className="hover:text-white transition-colors">{p}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-semibold text-sm mb-4">Компания</div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {["О нас", "Документация", "Блог", "Карьера", "Партнёрам"].map((p) => (
                  <li key={p}><a href="#" className="hover:text-white transition-colors">{p}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-semibold text-sm mb-4">Правовое</div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {["Политика конфиденциальности", "Условия использования", "Обработка данных (152-ФЗ)"].map((p) => (
                  <li key={p}><a href="#" className="hover:text-white transition-colors">{p}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-accent/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2026 devay.ru — Российский аналог OpenAI</p>
            <a href="mailto:support@devay.ru" className="hover:text-accent transition-colors">
              support@devay.ru
            </a>
          </div>
        </div>
      </footer>

      {showForm && <LeadForm onClose={() => setShowForm(false)} />}
    </div>
  );
};

export default Index;