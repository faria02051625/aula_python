"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Download, Eye, FileDown, FileText } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { getMockUser } from "@/lib/auth";
import { documentTypes } from "@/lib/mock-data";
import {
  buildDynamicDocumentPreview,
  canUseTemplate,
  getDocumentTemplates
} from "@/lib/document-templates";
import { generateDynamicDocumentDocx, generateDynamicDocumentPdf } from "@/lib/document-generation";
import type { DocumentTemplate, DocumentType, DynamicDocumentValues } from "@/types";

export default function NewDocumentPage() {
  const user = getMockUser();
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [selectedType, setSelectedType] = useState<DocumentType>("PRAD");
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [selectedSubcategory, setSelectedSubcategory] = useState("todos");
  const [selectedAgency, setSelectedAgency] = useState("todos");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [values, setValues] = useState<DynamicDocumentValues>({});
  const [isGeneratingDocx, setIsGeneratingDocx] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setTemplates(getDocumentTemplates());
  }, []);

  const templatePool = useMemo(
    () =>
      templates.filter(
        (template) =>
          template.tipo_documento === selectedType &&
          template.status === "Ativo" &&
          canUseTemplate(user.plan, template.plano_minimo)
      ),
    [selectedType, templates, user.plan]
  );

  const categoryOptions = useMemo(
    () => Array.from(new Set(templatePool.map((template) => template.categoria))).sort(),
    [templatePool]
  );

  const subcategoryOptions = useMemo(
    () =>
      Array.from(
        new Set(
          templatePool
            .filter((template) => selectedCategory === "todos" || template.categoria === selectedCategory)
            .map((template) => template.subcategoria)
        )
      ).sort(),
    [selectedCategory, templatePool]
  );

  const agencyOptions = useMemo(
    () =>
      Array.from(
        new Set(
          templatePool
            .filter((template) => selectedCategory === "todos" || template.categoria === selectedCategory)
            .filter((template) => selectedSubcategory === "todos" || template.subcategoria === selectedSubcategory)
            .map((template) => template.orgao_ambiental)
        )
      ).sort(),
    [selectedCategory, selectedSubcategory, templatePool]
  );

  const availableTemplates = useMemo(
    () =>
      templatePool.filter((template) => {
        const matchesCategory = selectedCategory === "todos" || template.categoria === selectedCategory;
        const matchesSubcategory = selectedSubcategory === "todos" || template.subcategoria === selectedSubcategory;
        const matchesAgency = selectedAgency === "todos" || template.orgao_ambiental === selectedAgency;

        return matchesCategory && matchesSubcategory && matchesAgency;
      }),
    [selectedAgency, selectedCategory, selectedSubcategory, templatePool]
  );

  const selectedTemplate = useMemo(
    () => availableTemplates.find((template) => template.id === selectedTemplateId) ?? availableTemplates[0] ?? null,
    [availableTemplates, selectedTemplateId]
  );

  const preview = selectedTemplate ? buildDynamicDocumentPreview(selectedTemplate, values) : "";

  useEffect(() => {
    setSelectedTemplateId(availableTemplates[0]?.id ?? "");
    setValues({});
  }, [availableTemplates]);

  useEffect(() => {
    setSelectedCategory("todos");
    setSelectedSubcategory("todos");
    setSelectedAgency("todos");
  }, [selectedType]);

  function updateValue(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function handleGenerateDocx() {
    if (!selectedTemplate) {
      return;
    }

    setIsGeneratingDocx(true);
    setMessage(null);

    try {
      await generateDynamicDocumentDocx(selectedTemplate, values);
      setMessage("DOCX gerado com sucesso.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erro inesperado ao gerar DOCX.");
    } finally {
      setIsGeneratingDocx(false);
    }
  }

  async function handleGeneratePdf() {
    if (!selectedTemplate) {
      return;
    }

    setIsGeneratingPdf(true);
    setMessage(null);

    try {
      await generateDynamicDocumentPdf(selectedTemplate, values);
      setMessage("PDF gerado com sucesso.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erro inesperado ao gerar PDF.");
    } finally {
      setIsGeneratingPdf(false);
    }
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="Novo documento"
        title="Gerador dinamico"
        description="Escolha o tipo, selecione um modelo disponivel para seu plano e preencha os campos gerados automaticamente."
      />

      <section className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <div className="glass-panel rounded-lg p-5">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">1. Tipo de documento</span>
                <select
                  value={selectedType}
                  onChange={(event) => setSelectedType(event.target.value as DocumentType)}
                  className="modern-field"
                >
                  {documentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Categoria</span>
                <select
                  value={selectedCategory}
                  onChange={(event) => {
                    setSelectedCategory(event.target.value);
                    setSelectedSubcategory("todos");
                    setSelectedAgency("todos");
                  }}
                  className="modern-field"
                >
                  <option value="todos">Todas</option>
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Subcategoria</span>
                <select
                  value={selectedSubcategory}
                  onChange={(event) => {
                    setSelectedSubcategory(event.target.value);
                    setSelectedAgency("todos");
                  }}
                  className="modern-field"
                >
                  <option value="todos">Todas</option>
                  {subcategoryOptions.map((subcategory) => (
                    <option key={subcategory} value={subcategory}>
                      {subcategory}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Orgao ambiental</span>
                <select
                  value={selectedAgency}
                  onChange={(event) => setSelectedAgency(event.target.value)}
                  className="modern-field"
                >
                  <option value="todos">Todos</option>
                  {agencyOptions.map((agency) => (
                    <option key={agency} value={agency}>
                      {agency}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">2. Modelo disponivel</span>
                <select
                  value={selectedTemplate?.id ?? ""}
                  onChange={(event) => {
                    setSelectedTemplateId(event.target.value);
                    setValues({});
                  }}
                  className="modern-field"
                >
                  {availableTemplates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.nome}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {selectedTemplate ? (
              <div className="mt-4 rounded-lg bg-forest-50 p-4 text-sm leading-6 text-slate-700">
                <p className="font-semibold text-forest-900">{selectedTemplate.nome}</p>
                <p>{selectedTemplate.descricao}</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-forest-700">
                  Plano minimo: {selectedTemplate.plano_minimo}
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  {selectedTemplate.categoria} · {selectedTemplate.subcategoria} · {selectedTemplate.orgao_ambiental} · v{selectedTemplate.versao}
                </p>
              </div>
            ) : (
              <div className="mt-4 rounded-lg border border-clay-100 bg-clay-100/40 p-4 text-sm text-clay-700">
                Nenhum modelo ativo desse tipo esta disponivel para o plano {user.plan}.
              </div>
            )}
          </div>

          {selectedTemplate ? (
            <form className="glass-panel rounded-lg p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-forest-50 text-forest-700">
                  <FileText size={20} />
                </span>
                <div>
                  <h2 className="font-bold text-forest-900">3. Campos do modelo</h2>
                  <p className="text-sm text-slate-500">O formulario muda automaticamente conforme o modelo escolhido.</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {selectedTemplate.campos_obrigatorios.map((field) => {
                  const commonClass =
                    "modern-field";

                  return (
                    <label key={field.id} className={field.type === "textarea" ? "block md:col-span-2" : "block"}>
                      <span className="text-sm font-semibold text-slate-700">
                        {field.label}
                        {field.required ? " *" : ""}
                      </span>
                      {field.type === "textarea" ? (
                        <textarea
                          name={field.id}
                          value={values[field.id] ?? ""}
                          onChange={updateValue}
                          rows={4}
                          required={field.required}
                          placeholder={field.placeholder}
                          className={commonClass}
                        />
                      ) : field.type === "select" ? (
                        <select
                          name={field.id}
                          value={values[field.id] ?? ""}
                          onChange={updateValue}
                          required={field.required}
                          className={commonClass}
                        >
                          <option value="">Selecione</option>
                          {field.options?.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          name={field.id}
                          value={values[field.id] ?? ""}
                          onChange={updateValue}
                          type={field.type}
                          required={field.required}
                          placeholder={field.placeholder}
                          className={commonClass}
                        />
                      )}
                    </label>
                  );
                })}
              </div>
            </form>
          ) : null}
        </div>

        <aside className="glass-panel rounded-lg p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-forest-50 text-forest-700">
                <Eye size={20} />
              </span>
              <div>
                <h2 className="font-bold text-forest-900">4. Previa</h2>
                <p className="text-sm text-slate-500">Atualizada conforme os campos sao preenchidos.</p>
              </div>
            </div>
            <span className="rounded-full bg-forest-50 px-3 py-1 text-xs font-semibold text-forest-700">
              5. Exportar
            </span>
          </div>

          <pre className="mt-5 max-h-[650px] overflow-auto whitespace-pre-wrap rounded-lg bg-slate-950 p-4 text-sm leading-6 text-slate-100">
            {preview || "Selecione um modelo para visualizar a previa."}
          </pre>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleGenerateDocx}
              disabled={!selectedTemplate || isGeneratingDocx}
              className="primary-button"
            >
              <Download size={17} />
              {isGeneratingDocx ? "Gerando DOCX..." : "Exportar DOCX"}
            </button>
            <button
              type="button"
              onClick={handleGeneratePdf}
              disabled={!selectedTemplate || isGeneratingPdf}
              className="primary-button bg-clay-500 hover:bg-clay-700"
            >
              <FileDown size={17} />
              {isGeneratingPdf ? "Gerando PDF..." : "Exportar PDF"}
            </button>
          </div>

          {message ? (
            <p className="mt-4 rounded-lg border border-forest-100 bg-forest-50 px-4 py-3 text-sm font-medium text-forest-700">
              {message}
            </p>
          ) : null}
        </aside>
      </section>
    </AppShell>
  );
}
