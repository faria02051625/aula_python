import Link from "next/link";
import { ArrowRight, ClipboardList, FileText, Settings, Sprout } from "lucide-react";

const capabilities = [
  {
    title: "Formulario PRAD",
    description: "Campos tecnicos organizados para diagnostico, recuperacao e monitoramento.",
    icon: ClipboardList
  },
  {
    title: "Documentos",
    description: "Base preparada para gerar DOCX e PDF a partir de modelos administraveis.",
    icon: FileText
  },
  {
    title: "Gestao",
    description: "Dashboard, planos e painel admin para evoluir o SaaS com seguranca.",
    icon: Settings
  }
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <header className="border-b border-white/70 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-forest-600 text-white shadow-sm shadow-forest-900/20">
              <Sprout size={20} />
            </span>
            <span className="text-lg font-bold text-forest-900">Ambiental IA</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:text-forest-700"
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="primary-button px-4 py-2"
            >
              Comecar
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:px-8 lg:py-20">
        <div>
          <p className="inline-flex rounded-full bg-forest-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-forest-700">MVP SaaS ambiental</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-forest-900 sm:text-5xl">
            Ambiental IA
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-650">
            Plataforma inicial para consultores ambientais criarem, organizarem e exportarem PRADs com modelos tecnicos
            padronizados.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="primary-button px-5 py-3"
            >
              Abrir dashboard
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/planos"
              className="secondary-button px-5 py-3"
            >
              Ver planos
            </Link>
          </div>
        </div>

        <div className="glass-panel rounded-lg p-6">
          <p className="text-sm font-semibold text-forest-700">Fluxo principal</p>
          <div className="mt-6 space-y-4">
            {["Cadastro do usuario", "Preenchimento tecnico", "Selecao de modelo", "Geracao DOCX/PDF"].map(
              (step, index) => (
                <div key={step} className="flex items-center gap-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-forest-600 text-sm font-bold text-white shadow-sm">
                    {index + 1}
                  </span>
                  <span className="font-medium text-slate-700">{step}</span>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-14 sm:px-6 md:grid-cols-3 lg:px-8">
        {capabilities.map((item) => {
          const Icon = item.icon;

          return (
            <article key={item.title} className="glass-panel rounded-lg p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-forest-50 text-forest-700">
                <Icon size={20} />
              </span>
              <h2 className="mt-4 text-lg font-bold text-forest-900">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
            </article>
          );
        })}
      </section>
    </main>
  );
}
