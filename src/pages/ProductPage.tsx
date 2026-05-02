import { useState } from "react";
import { ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Icon from "@/components/ui/icon";
import LeadForm from "@/components/LeadForm";

export interface ProductConfig {
  slug: string;
  tag: string;
  icon: string;
  name: string;
  tagline: string;
  description: string;
  heroFeatures: string[];
  useCases: { title: string; desc: string }[];
  capabilities: { icon: string; title: string; desc: string }[];
  demoPlaceholder: string;
  color: string;
}

export const PRODUCTS: ProductConfig[] = [
  {
    slug: "devaychat",
    tag: "GPT-серия",
    icon: "MessageSquare",
    name: "DevayChat",
    tagline: "Языковой ИИ уровня GPT-4",
    description:
      "Мощная языковая модель для генерации текстов, ответов на вопросы, написания кода, перевода и обобщения информации. Работает на 100% на российских серверах.",
    heroFeatures: [
      "Генерация текстов любых жанров",
      "Написание и объяснение кода",
      "Перевод и перефразирование",
      "Ответы на вопросы и аналитика",
      "Создание чат-ботов через API",
    ],
    useCases: [
      { title: "Контент-маркетинг", desc: "Статьи, посты, рекламные тексты и описания продуктов за секунды" },
      { title: "Клиентская поддержка", desc: "Умный чат-бот, который отвечает как живой оператор" },
      { title: "Разработка ПО", desc: "Генерация кода, код-ревью, документация и тесты" },
      { title: "Образование", desc: "Персональный репетитор по любому предмету" },
    ],
    capabilities: [
      { icon: "Brain", title: "Контекст 128K токенов", desc: "Помнит длинные диалоги и большие документы целиком" },
      { icon: "Languages", title: "100+ языков", desc: "Полноценная работа с русским, включая юридические тексты" },
      { icon: "Zap", title: "Стриминг ответов", desc: "Текст появляется в реальном времени, без ожидания" },
      { icon: "Settings", title: "Fine-tuning", desc: "Обучите модель на ваших данных для лучших результатов" },
    ],
    demoPlaceholder: "Напишите деловое письмо партнёру о переносе встречи...",
    color: "from-cyan-500/20 to-blue-500/20",
  },
  {
    slug: "devayvision",
    tag: "DALL-E аналог",
    icon: "Image",
    name: "DevayVision",
    tagline: "Генерация изображений по тексту",
    description:
      "Создавайте уникальные изображения, иллюстрации и маркетинговые материалы по текстовому описанию. От фотореализма до цифрового арта — любой стиль.",
    heroFeatures: [
      "Генерация по текстовому описанию",
      "Редактирование существующих фото",
      "Разные стили: фото, арт, карикатура",
      "Коммерческие права на изображения",
      "Пакетная генерация через API",
    ],
    useCases: [
      { title: "Маркетинг и реклама", desc: "Баннеры, обложки, визуалы для соцсетей без дизайнера" },
      { title: "E-commerce", desc: "Фото продуктов на белом фоне, lifestyle-съёмка без студии" },
      { title: "Книги и СМИ", desc: "Иллюстрации к статьям, обложки книг, инфографика" },
      { title: "Игры и приложения", desc: "Концепт-арт, персонажи, текстуры и UI-элементы" },
    ],
    capabilities: [
      { icon: "Palette", title: "1024×1024 и выше", desc: "Высокое разрешение для печати и профессионального использования" },
      { icon: "Wand2", title: "Inpainting", desc: "Добавляйте или убирайте элементы на готовых изображениях" },
      { icon: "Copy", title: "Вариации", desc: "Несколько вариантов одного запроса для выбора лучшего" },
      { icon: "Shield", title: "Чистые права", desc: "Все сгенерированные изображения — ваша интеллектуальная собственность" },
    ],
    demoPlaceholder: "Логотип компании в стиле минимализм, синие тона...",
    color: "from-purple-500/20 to-pink-500/20",
  },
  {
    slug: "devayaudio",
    tag: "Whisper аналог",
    icon: "Mic",
    name: "DevayAudio",
    tagline: "Распознавание речи на 90+ языках",
    description:
      "Точная транскрибация аудио и видео, создание субтитров, автоматизация обработки звонков. Работает с шумом, акцентами и низким качеством записи.",
    heroFeatures: [
      "Транскрибация аудио и видео",
      "Создание субтитров (SRT, VTT)",
      "Перевод речи в текст",
      "Определение языка автоматически",
      "Диаризация — кто что сказал",
    ],
    useCases: [
      { title: "Колл-центры", desc: "Автоматическая расшифровка звонков и анализ качества" },
      { title: "Медиа и подкасты", desc: "Субтитры для видео, расшифровки интервью" },
      { title: "Медицина", desc: "Диктовка диагнозов и протоколов без ввода с клавиатуры" },
      { title: "Образование", desc: "Транскрибация лекций и создание обучающих материалов" },
    ],
    capabilities: [
      { icon: "Volume2", title: "680 000 ч обучения", desc: "Обучена на огромном корпусе аудиозаписей" },
      { icon: "Zap", title: "Реальное время", desc: "Стриминговое распознавание с задержкой менее секунды" },
      { icon: "FileText", title: "Форматы: MP3, WAV, M4A", desc: "Поддерживает все популярные аудио и видеоформаты" },
      { icon: "Globe", title: "90+ языков", desc: "Русский, английский, и ещё 88 языков из коробки" },
    ],
    demoPlaceholder: "Загрузите аудиофайл или укажите URL для транскрибации...",
    color: "from-green-500/20 to-teal-500/20",
  },
  {
    slug: "devayvideo",
    tag: "Sora аналог",
    icon: "Video",
    name: "DevayVideo",
    tagline: "Генерация видео по тексту",
    description:
      "Создавайте видеоролики, визуализации и анимации по текстовому описанию. Больше не нужна съёмочная группа — достаточно идеи.",
    heroFeatures: [
      "Генерация видео до 60 секунд",
      "Разрешение до 1080p",
      "Анимация изображений",
      "Текст-в-видео (Text-to-Video)",
      "Стили: реализм, анимация, кино"],
    useCases: [
      { title: "Реклама", desc: "Видеоролики для соцсетей и таргетированной рекламы без бюджета на съёмку" },
      { title: "Обучение", desc: "Объясняющие анимации и визуализации сложных концепций" },
      { title: "Презентации", desc: "Динамичные видео-слайды вместо скучных статичных презентаций" },
      { title: "Прототипирование", desc: "Видеоконцепты продуктов до начала разработки" },
    ],
    capabilities: [
      { icon: "Film", title: "До 60 сек / ролик", desc: "Полноценные короткие ролики по текстовому запросу" },
      { icon: "Sparkles", title: "Физически точная анимация", desc: "Реалистичное движение объектов и людей" },
      { icon: "Layers", title: "Img2Video", desc: "Оживите любое фото — добавьте движение и атмосферу" },
      { icon: "Clock", title: "Генерация ~2 мин", desc: "Быстрый рендер без ожидания часами" },
    ],
    demoPlaceholder: "Закат над Москвой, камера медленно летит над Москва-рекой...",
    color: "from-orange-500/20 to-red-500/20",
  },
  {
    slug: "devaycode",
    tag: "Codex аналог",
    icon: "Code",
    name: "DevayCode",
    tagline: "ИИ-ассистент для разработчиков",
    description:
      "Генерация, объяснение и исправление кода на любом языке программирования. Ускорьте разработку в 3-5 раз с AI-парным программированием.",
    heroFeatures: [
      "Генерация кода по описанию задачи",
      "Объяснение непонятного кода",
      "Поиск и исправление багов",
      "Написание тестов автоматически",
      "Рефакторинг и оптимизация"],
    useCases: [
      { title: "Backend-разработка", desc: "API, базы данных, микросервисы — описываете задачу, получаете код" },
      { title: "Frontend", desc: "React, Vue, Angular компоненты и верстка по макету или описанию" },
      { title: "DevOps", desc: "Docker, CI/CD конфиги, скрипты автоматизации инфраструктуры" },
      { title: "Аналитика данных", desc: "SQL-запросы, Python скрипты для обработки данных" },
    ],
    capabilities: [
      { icon: "Terminal", title: "50+ языков", desc: "Python, JS, Go, Rust, Java, C++, SQL и любые другие" },
      { icon: "GitBranch", title: "Git-интеграция", desc: "Код-ревью прямо в pull request, объяснение diff" },
      { icon: "Bug", title: "Автодебаггинг", desc: "Вставьте ошибку — получите причину и исправление" },
      { icon: "BookOpen", title: "Документация", desc: "Автогенерация JSDoc, docstrings и README по коду" },
    ],
    demoPlaceholder: "Напиши функцию на Python для парсинга RSS-ленты...",
    color: "from-yellow-500/20 to-amber-500/20",
  },
  {
    slug: "devayapi",
    tag: "OpenAI API аналог",
    icon: "Zap",
    name: "Devay API",
    tagline: "REST API для интеграции ИИ в приложения",
    description:
      "Подключите все AI-модели devay.ru к вашим сервисам через единый REST API. Полная совместимость с OpenAI SDK — миграция без переписывания кода.",
    heroFeatures: [
      "Совместим с OpenAI SDK",
      "Доступ ко всем 6 продуктам",
      "Гибкая тарификация по токенам",
      "Fine-tuning своих моделей",
      "SLA и мониторинг запросов"],
    useCases: [
      { title: "SaaS-продукты", desc: "Добавьте AI-функциональность в ваш сервис за один день" },
      { title: "Корпоративные системы", desc: "Интеграция ИИ в CRM, ERP, документооборот" },
      { title: "Мобильные приложения", desc: "Умные фичи для iOS и Android через лёгкий REST API" },
      { title: "Автоматизация", desc: "Роботизация рутинных задач: обработка заявок, отчёты, анализ" },
    ],
    capabilities: [
      { icon: "Plug", title: "OpenAI-совместимость", desc: "Замените endpoint — и ваш код работает с devay.ru" },
      { icon: "BarChart3", title: "Дашборд аналитики", desc: "Мониторинг запросов, токенов и расходов в реальном времени" },
      { icon: "Key", title: "API-ключи и роли", desc: "Тонкое разграничение прав доступа для команды" },
      { icon: "Webhook", title: "Webhooks", desc: "Уведомления о событиях для асинхронных задач" },
    ],
    demoPlaceholder: "curl https://api.devay.ru/v1/chat/completions ...",
    color: "from-indigo-500/20 to-violet-500/20",
  },
];

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = PRODUCTS.find((p) => p.slug === slug);
  const [showForm, setShowForm] = useState(false);

  if (!product) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 w-full bg-background/80 backdrop-blur-2xl border-b border-accent/20 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <Link to="/" className="font-display font-black text-2xl tracking-tighter bg-gradient-to-r from-white via-accent to-accent/80 bg-clip-text text-transparent">
            devay.ru
          </Link>
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            {PRODUCTS.map((p) => (
              <Link
                key={p.slug}
                to={`/products/${p.slug}`}
                className={`transition-colors ${p.slug === slug ? "text-accent" : "text-muted-foreground hover:text-white"}`}
              >
                {p.name}
              </Link>
            ))}
          </nav>
          <button
            onClick={() => setShowForm(true)}
            className="px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-accent to-accent/80 text-black rounded-full hover:shadow-lg hover:shadow-accent/40 transition-all"
          >
            Попробовать бесплатно
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-40 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors mb-10">
            <ArrowLeft className="w-4 h-4" /> Все продукты
          </Link>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/10 mb-6">
                <Icon name={product.icon} size={16} className="text-accent" />
                <span className="text-xs font-medium tracking-widest text-accent/90 uppercase">{product.tag}</span>
              </div>
              <h1 className="text-6xl lg:text-7xl font-display font-black leading-tight mb-6 tracking-tighter">
                <span className="bg-gradient-to-br from-white via-white to-accent/40 bg-clip-text text-transparent">
                  {product.name}
                </span>
              </h1>
              <p className="text-xl text-accent font-semibold mb-4">{product.tagline}</p>
              <p className="text-lg text-white/70 leading-relaxed mb-10">{product.description}</p>
              <ul className="space-y-3 mb-10">
                {product.heroFeatures.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/80">
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="flex gap-4">
                <Link
                  to={`/chat/${product.slug}`}
                  className="group px-8 py-4 bg-gradient-to-r from-accent to-accent/90 text-black rounded-full hover:shadow-2xl hover:shadow-accent/50 transition-all font-semibold text-lg flex items-center gap-3"
                >
                  Попробовать
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                </Link>
                <Link
                  to="/#pricing"
                  className="px-8 py-4 border border-accent/40 rounded-full hover:border-accent/70 hover:bg-accent/10 transition-all font-medium text-lg text-white flex items-center"
                >
                  Тарифы
                </Link>
              </div>
            </div>

            <div className={`relative rounded-3xl p-1 bg-gradient-to-br ${product.color}`}>
              <div className="bg-card/90 backdrop-blur-sm rounded-[22px] p-8 border border-accent/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                    <Icon name={product.icon} size={20} className="text-accent" />
                  </div>
                  <span className="font-semibold text-white">{product.name}</span>
                  <span className="ml-auto text-xs text-accent/60 bg-accent/10 px-2.5 py-1 rounded-full">Demo</span>
                </div>
                <div className="bg-background/60 rounded-xl p-4 min-h-24 text-sm text-muted-foreground border border-accent/10 italic">
                  {product.demoPlaceholder}
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => setShowForm(true)}
                    className="flex-1 py-3 bg-accent/10 hover:bg-accent/20 border border-accent/20 rounded-xl text-sm font-medium text-accent transition-all"
                  >
                    Попробовать →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-24 px-6 bg-accent/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-display font-black tracking-tighter mb-12 text-center">
            <span className="bg-gradient-to-r from-white to-accent/60 bg-clip-text text-transparent">
              Технические возможности
            </span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {product.capabilities.map((cap, i) => (
              <div key={i} className="group p-6 border border-accent/10 hover:border-accent/40 rounded-2xl bg-card/50 hover:bg-card/80 transition-all">
                <div className="w-10 h-10 bg-accent/10 group-hover:bg-accent/20 rounded-xl flex items-center justify-center mb-4 transition-all">
                  <Icon name={cap.icon} size={20} className="text-accent" fallback="Zap" />
                </div>
                <h3 className="font-bold text-sm mb-2">{cap.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-display font-black tracking-tighter mb-12 text-center">
            <span className="bg-gradient-to-r from-white to-accent/60 bg-clip-text text-transparent">
              Кому подойдёт
            </span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {product.useCases.map((uc, i) => (
              <div key={i} className="flex gap-5 p-6 border border-accent/10 hover:border-accent/30 rounded-2xl bg-card/50 hover:bg-card/80 transition-all group cursor-pointer">
                <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-all">
                  <span className="text-accent font-bold text-sm">0{i + 1}</span>
                </div>
                <div>
                  <h3 className="font-bold mb-1">{uc.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{uc.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-accent/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-display font-black tracking-tighter mb-6">
            <span className="bg-gradient-to-r from-white via-white to-accent/40 bg-clip-text text-transparent">
              Готовы попробовать {product.name}?
            </span>
          </h2>
          <p className="text-lg text-muted-foreground mb-10">
            Оставьте заявку — мы свяжемся и поможем с первыми шагами бесплатно.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="group px-10 py-5 bg-gradient-to-r from-accent to-accent/90 text-black rounded-full hover:shadow-2xl hover:shadow-accent/40 transition-all font-bold text-lg flex items-center gap-3 mx-auto"
          >
            Начать бесплатно
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-accent/10 py-8 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm text-muted-foreground">
          <p>© 2026 devay.ru</p>
          <a href="mailto:support@devay.ru" className="hover:text-accent transition-colors">support@devay.ru</a>
        </div>
      </footer>

      {showForm && <LeadForm onClose={() => setShowForm(false)} product={product.name} />}
    </div>
  );
};

export default ProductPage;