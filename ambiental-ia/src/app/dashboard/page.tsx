import Link from "next/link";
import { CheckCircle2, ClipboardList, FileText, FolderKanban } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { recentDocuments } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Visao geral"
        title="Dashboard"
        description="Acompanhe documentos em andamento, modelos disponiveis e proximas acoes tecnicas."
        action={
          <Link
            href="/prad"
            className="primary-button"
          >
            <ClipboardList size={17} />
            Novo PRAD
          </Link>
        }
      />

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <StatCard label="PRADs este mes" value="7" detail="Limite atual do plano: 15 documentos." icon={FileText} />
        <StatCard label="Modelos ativos" value="2" detail="Templates prontos para PRAD e relatorios." icon={FolderKanban} />
        <StatCard label="Documentos gerados" value="4" detail="Exportacoes simuladas em DOCX/PDF." icon={CheckCircle2} />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="glass-panel rounded-lg p-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-forest-900">Documentos recentes</h2>
            <Link href="/prad" className="text-sm font-semibold text-forest-700">
              Criar novo
            </Link>
          </div>
          <div className="mt-5 space-y-4">
            {recentDocuments.map((document) => (
              <article key={document.title} className="rounded-lg border border-white/70 bg-white/70 p-4 shadow-sm">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-forest-900">{document.title}</h3>
                    <p className="text-sm text-slate-500">
                      {document.status} · atualizado {document.updatedAt}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-forest-700">{document.progress}%</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-forest-600" style={{ width: `${document.progress}%` }} />
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-lg p-5">
          <h2 className="text-lg font-bold text-forest-900">Proximas integracoes</h2>
          <div className="mt-5 space-y-4 text-sm leading-6 text-slate-600">
            <p>Supabase Auth substituira o login simulado e controlara perfis, papeis e sessoes.</p>
            <p>Rotas server-side gerarao DOCX/PDF a partir dos modelos cadastrados no painel admin.</p>
            <p>OpenAI API podera sugerir textos tecnicos, sempre passando por revisao do responsavel.</p>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
