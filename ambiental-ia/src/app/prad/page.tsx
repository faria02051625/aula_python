"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { Download, FileDown, Save } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { buildPradPreview, downloadTextAsFile, generatePradDocx } from "@/lib/document-generation";
import { savePradProject } from "@/lib/prad-projects";
import type { PradFormData } from "@/types";

const initialForm: PradFormData = {
  title: "",
  propertyName: "",
  ownerName: "",
  municipality: "",
  state: "",
  areaHectares: "",
  biome: "",
  degradationCause: "",
  soilCondition: "",
  waterResources: "",
  proposedActions: "",
  nativeSpecies: "",
  monitoringPlan: "",
  schedule: "",
  technicalResponsible: ""
};

const fields: Array<{
  name: keyof PradFormData;
  label: string;
  type?: "input" | "textarea";
  placeholder: string;
}> = [
  { name: "title", label: "Titulo do PRAD", placeholder: "PRAD Fazenda Santa Clara" },
  { name: "propertyName", label: "Nome do imovel", placeholder: "Fazenda Santa Clara" },
  { name: "ownerName", label: "Proprietario ou responsavel", placeholder: "Joao da Silva" },
  { name: "municipality", label: "Municipio", placeholder: "Registro" },
  { name: "state", label: "UF", placeholder: "SP" },
  { name: "areaHectares", label: "Area degradada (ha)", placeholder: "12,5" },
  { name: "biome", label: "Bioma", placeholder: "Mata Atlantica" },
  {
    name: "degradationCause",
    label: "Causa da degradacao",
    type: "textarea",
    placeholder: "Descreva supressao vegetal, erosao, uso anterior ou outros fatores."
  },
  {
    name: "soilCondition",
    label: "Condicao do solo",
    type: "textarea",
    placeholder: "Informe compactacao, erosao, materia organica, contaminacao ou exposicao."
  },
  {
    name: "waterResources",
    label: "Recursos hidricos",
    type: "textarea",
    placeholder: "Informe APPs, nascentes, cursos d'agua, drenagem e riscos associados."
  },
  {
    name: "proposedActions",
    label: "Acoes propostas",
    type: "textarea",
    placeholder: "Liste isolamento, preparo do solo, plantio, controle de invasoras e manutencao."
  },
  {
    name: "nativeSpecies",
    label: "Especies nativas indicadas",
    type: "textarea",
    placeholder: "Ex.: ingazeiro, aroeira, embauba, guapuruvu."
  },
  {
    name: "monitoringPlan",
    label: "Plano de monitoramento",
    type: "textarea",
    placeholder: "Defina indicadores, frequencia de vistorias e criterios de sucesso."
  },
  {
    name: "schedule",
    label: "Cronograma",
    type: "textarea",
    placeholder: "Ex.: preparo no mes 1, plantio no mes 2, manutencoes trimestrais."
  },
  {
    name: "technicalResponsible",
    label: "Responsavel tecnico",
    placeholder: "Nome, registro profissional e contato"
  }
];

export default function PradPage() {
  const [form, setForm] = useState(initialForm);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingDocx, setIsGeneratingDocx] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const preview = useMemo(() => buildPradPreview(form), [form]);

  function updateField(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function exportDraft(format: "pdf") {
    // Nesta primeira versao, o arquivo textual facilita validar o conteudo.
    // A evolucao natural e mover a geracao real para uma rota server-side.
    downloadTextAsFile(`prad-${form.title || "rascunho"}.${format}.txt`, preview);
  }

  async function handleGenerateDocx() {
    setIsGeneratingDocx(true);
    setSaveError(null);

    try {
      await generatePradDocx(form);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Erro inesperado ao gerar o arquivo DOCX.");
    } finally {
      setIsGeneratingDocx(false);
    }
  }

  async function handleSaveDraft() {
    setIsSaving(true);
    setSaveMessage(null);
    setSaveError(null);

    try {
      const project = await savePradProject(form);
      setSaveMessage(`Projeto "${project.titulo}" salvo com sucesso. ID: ${project.id}`);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Erro inesperado ao salvar o projeto PRAD.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="Documento tecnico"
        title="Formulario PRAD"
        description="Preencha os dados tecnicos essenciais para montar a base do Plano de Recuperacao de Area Degradada."
      />

      <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <form className="glass-panel rounded-lg p-5">
          <div className="grid gap-4 md:grid-cols-2">
            {fields.map((field) => {
              const commonProps = {
                id: field.name,
                name: field.name,
                value: form[field.name],
                onChange: updateField,
                placeholder: field.placeholder,
                className:
                  "modern-field"
              };

              return (
                <label
                  key={field.name}
                  className={field.type === "textarea" ? "block md:col-span-2" : "block"}
                >
                  <span className="text-sm font-semibold text-slate-700">{field.label}</span>
                  {field.type === "textarea" ? (
                    <textarea {...commonProps} rows={4} />
                  ) : (
                    <input {...commonProps} />
                  )}
                </label>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="secondary-button"
            >
              <Save size={17} />
              {isSaving ? "Salvando..." : "Salvar rascunho"}
            </button>
            <button
              type="button"
              onClick={handleGenerateDocx}
              disabled={isGeneratingDocx}
              className="primary-button"
            >
              <Download size={17} />
              {isGeneratingDocx ? "Gerando DOCX..." : "Gerar DOCX"}
            </button>
            <button
              type="button"
              onClick={() => exportDraft("pdf")}
              className="primary-button bg-clay-500 hover:bg-clay-700"
            >
              <FileDown size={17} />
              Gerar PDF
            </button>
          </div>

          {saveMessage ? (
            <p className="mt-4 rounded-lg border border-forest-100 bg-forest-50 px-4 py-3 text-sm font-medium text-forest-700">
              {saveMessage}
            </p>
          ) : null}

          {saveError ? (
            <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {saveError}
            </p>
          ) : null}
        </form>

        <aside className="glass-panel rounded-lg p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-forest-900">Previa do documento</h2>
            <span className="rounded-full bg-forest-50 px-3 py-1 text-xs font-semibold text-forest-700">
              Rascunho
            </span>
          </div>
          <pre className="mt-5 max-h-[720px] overflow-auto whitespace-pre-wrap rounded-lg bg-slate-950 p-4 text-sm leading-6 text-slate-100">
            {preview}
          </pre>
        </aside>
      </section>
    </AppShell>
  );
}
