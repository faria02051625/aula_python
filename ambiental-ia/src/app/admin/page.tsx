"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Eye, FilePlus2, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { documentCategories, documentSubcategories, documentTypes, environmentalAgencies } from "@/lib/mock-data";
import { getDocumentTemplates, saveDocumentTemplates } from "@/lib/document-templates";
import type {
  DocumentTemplate,
  DocumentTemplateField,
  DocumentTemplateStatus,
  DocumentType,
  PlanId
} from "@/types";

type TemplateFormState = {
  id?: string;
  tipo_documento: DocumentType;
  nome: string;
  descricao: string;
  categoria: string;
  subcategoria: string;
  orgao_ambiental: string;
  versao: string;
  plano_minimo: PlanId;
  status: DocumentTemplateStatus;
  secoesText: string;
  camposText: string;
  texto_base: string;
};

const fieldTypes: DocumentTemplateField["type"][] = ["text", "textarea", "number", "date", "select"];
const emptyForm: TemplateFormState = {
  tipo_documento: "PRAD",
  nome: "",
  descricao: "",
  categoria: "PRAD",
  subcategoria: "APP",
  orgao_ambiental: "Municipal",
  versao: "1.0",
  plano_minimo: "basico",
  status: "Rascunho",
  secoesText: "Identificacao\nDiagnostico\nConclusao",
  camposText: "titulo|Titulo do documento|text|sim|Informe o titulo",
  texto_base: "O documento {tipo_documento} intitulado {titulo} foi elaborado com base nas informacoes fornecidas."
};

function fieldsToText(fields: DocumentTemplateField[]) {
  return fields
    .map((field) =>
      [
        field.id,
        field.label,
        field.type,
        field.required ? "sim" : "nao",
        field.placeholder ?? "",
        field.options?.join(",") ?? ""
      ].join("|")
    )
    .join("\n");
}

function templateToForm(template: DocumentTemplate): TemplateFormState {
  return {
    id: template.id,
    tipo_documento: template.tipo_documento,
    nome: template.nome,
    descricao: template.descricao,
    categoria: template.categoria,
    subcategoria: template.subcategoria,
    orgao_ambiental: template.orgao_ambiental,
    versao: template.versao,
    plano_minimo: template.plano_minimo,
    status: template.status,
    secoesText: template.secoes.join("\n"),
    camposText: fieldsToText(template.campos_obrigatorios),
    texto_base: template.texto_base
  };
}

function parseFields(text: string): DocumentTemplateField[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [id, label, type, required, placeholder, options] = line.split("|").map((part) => part?.trim() ?? "");
      const safeType = fieldTypes.includes(type as DocumentTemplateField["type"])
        ? (type as DocumentTemplateField["type"])
        : "text";

      return {
        id: id || label.toLowerCase().replace(/[^a-z0-9]+/g, "_"),
        label: label || id || "Campo",
        type: safeType,
        required: required.toLowerCase() !== "nao",
        placeholder,
        options: safeType === "select" && options ? options.split(",").map((option) => option.trim()) : undefined
      };
    });
}

export default function AdminPage() {
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [form, setForm] = useState<TemplateFormState>(emptyForm);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<"todos" | DocumentType>("todos");
  const [filterCategory, setFilterCategory] = useState("todos");
  const [filterSubcategory, setFilterSubcategory] = useState("todos");
  const [filterAgency, setFilterAgency] = useState("todos");

  useEffect(() => {
    setTemplates(getDocumentTemplates());
  }, []);

  const selectedTemplate = useMemo(
    () => templates.find((template) => template.id === selectedTemplateId) ?? null,
    [selectedTemplateId, templates]
  );

  const filteredTemplates = useMemo(
    () =>
      templates.filter((template) => {
        const matchesType = filterType === "todos" || template.tipo_documento === filterType;
        const matchesCategory = filterCategory === "todos" || template.categoria === filterCategory;
        const matchesSubcategory = filterSubcategory === "todos" || template.subcategoria === filterSubcategory;
        const matchesAgency = filterAgency === "todos" || template.orgao_ambiental === filterAgency;

        return matchesType && matchesCategory && matchesSubcategory && matchesAgency;
      }),
    [filterAgency, filterCategory, filterSubcategory, filterType, templates]
  );

  const categoryOptions = useMemo(
    () => Array.from(new Set(templates.map((template) => template.categoria))).sort(),
    [templates]
  );

  const subcategoryOptions = useMemo(
    () => Array.from(new Set(templates.map((template) => template.subcategoria))).sort(),
    [templates]
  );

  const agencyOptions = useMemo(
    () => Array.from(new Set(templates.map((template) => template.orgao_ambiental))).sort(),
    [templates]
  );

  function persist(nextTemplates: DocumentTemplate[]) {
    setTemplates(nextTemplates);
    saveDocumentTemplates(nextTemplates);
  }

  function resetForm() {
    setForm(emptyForm);
    setSelectedTemplateId(null);
  }

  function submitTemplate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextTemplate: DocumentTemplate = {
      id: form.id ?? crypto.randomUUID(),
      tipo_documento: form.tipo_documento,
      nome: form.nome.trim(),
      descricao: form.descricao.trim(),
      categoria: form.categoria.trim(),
      subcategoria: form.subcategoria.trim(),
      orgao_ambiental: form.orgao_ambiental.trim(),
      versao: form.versao.trim(),
      plano_minimo: form.plano_minimo,
      status: form.status,
      secoes: form.secoesText.split("\n").map((section) => section.trim()).filter(Boolean),
      campos_obrigatorios: parseFields(form.camposText),
      texto_base: form.texto_base.trim(),
      updatedAt: new Date().toISOString().slice(0, 10)
    };

    if (
      !nextTemplate.nome ||
      !nextTemplate.descricao ||
      !nextTemplate.categoria ||
      !nextTemplate.subcategoria ||
      !nextTemplate.orgao_ambiental ||
      !nextTemplate.versao ||
      nextTemplate.campos_obrigatorios.length === 0
    ) {
      return;
    }

    const exists = templates.some((template) => template.id === nextTemplate.id);
    const nextTemplates = exists
      ? templates.map((template) => (template.id === nextTemplate.id ? nextTemplate : template))
      : [nextTemplate, ...templates];

    persist(nextTemplates);
    resetForm();
  }

  function editTemplate(template: DocumentTemplate) {
    setForm(templateToForm(template));
    setSelectedTemplateId(template.id);
  }

  function deleteTemplate(templateId: string) {
    persist(templates.filter((template) => template.id !== templateId));
    if (selectedTemplateId === templateId) {
      resetForm();
    }
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="Administracao"
        title="Modelos ambientais"
        description="Cadastre, edite, visualize e remova modelos usados para gerar formularios e documentos ambientais dinamicos."
      />

      <section className="mt-6 grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <form onSubmit={submitTemplate} className="glass-panel rounded-lg p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-forest-50 text-forest-700">
                <FilePlus2 size={20} />
              </span>
              <div>
                <h2 className="font-bold text-forest-900">{form.id ? "Editar modelo" : "Novo modelo"}</h2>
                <p className="text-sm text-slate-500">Use variaveis como {"{titulo}"} no texto base.</p>
              </div>
            </div>
            {form.id ? (
              <button
                type="button"
                onClick={resetForm}
                aria-label="Cancelar edicao"
                title="Cancelar edicao"
                className="focus-ring flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:border-forest-500 hover:text-forest-700"
              >
                <X size={16} />
              </button>
            ) : null}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Tipo</span>
              <select
                value={form.tipo_documento}
                onChange={(event) => {
                  const nextType = event.target.value as DocumentType;
                  setForm((current) => ({
                    ...current,
                    tipo_documento: nextType,
                    categoria: documentCategories[nextType][0] ?? nextType,
                    subcategoria: documentSubcategories[nextType][0] ?? ""
                  }));
                }}
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
                value={form.categoria}
                onChange={(event) => setForm((current) => ({ ...current, categoria: event.target.value }))}
                className="modern-field"
              >
                {documentCategories[form.tipo_documento].map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Subcategoria</span>
              <select
                value={form.subcategoria}
                onChange={(event) => setForm((current) => ({ ...current, subcategoria: event.target.value }))}
                className="modern-field"
              >
                {documentSubcategories[form.tipo_documento].map((subcategory) => (
                  <option key={subcategory} value={subcategory}>
                    {subcategory}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Orgao ambiental</span>
              <select
                value={form.orgao_ambiental}
                onChange={(event) => setForm((current) => ({ ...current, orgao_ambiental: event.target.value }))}
                className="modern-field"
              >
                {environmentalAgencies.map((agency) => (
                  <option key={agency} value={agency}>
                    {agency}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Versao</span>
              <input
                value={form.versao}
                onChange={(event) => setForm((current) => ({ ...current, versao: event.target.value }))}
                className="modern-field"
                placeholder="1.0"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Plano minimo</span>
              <select
                value={form.plano_minimo}
                onChange={(event) => setForm((current) => ({ ...current, plano_minimo: event.target.value as PlanId }))}
                className="modern-field"
              >
                <option value="basico">Basico</option>
                <option value="intermediario">Intermediario</option>
                <option value="premium">Premium</option>
              </select>
            </label>

            <label className="block md:col-span-2">
              <span className="text-sm font-semibold text-slate-700">Nome</span>
              <input
                value={form.nome}
                onChange={(event) => setForm((current) => ({ ...current, nome: event.target.value }))}
                className="modern-field"
                placeholder="PRAD - Estrutura padrao"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="text-sm font-semibold text-slate-700">Descricao</span>
              <textarea
                value={form.descricao}
                onChange={(event) => setForm((current) => ({ ...current, descricao: event.target.value }))}
                className="modern-field"
                rows={3}
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Status</span>
              <select
                value={form.status}
                onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as DocumentTemplateStatus }))}
                className="modern-field"
              >
                <option value="Ativo">Ativo</option>
                <option value="Rascunho">Rascunho</option>
                <option value="Inativo">Inativo</option>
              </select>
            </label>

            <label className="block md:col-span-2">
              <span className="text-sm font-semibold text-slate-700">Secoes do documento</span>
              <textarea
                value={form.secoesText}
                onChange={(event) => setForm((current) => ({ ...current, secoesText: event.target.value }))}
                className="modern-field"
                rows={4}
              />
            </label>

            <label className="block md:col-span-2">
              <span className="text-sm font-semibold text-slate-700">Campos obrigatorios</span>
              <textarea
                value={form.camposText}
                onChange={(event) => setForm((current) => ({ ...current, camposText: event.target.value }))}
                className="modern-field"
                rows={5}
              />
            </label>

            <label className="block md:col-span-2">
              <span className="text-sm font-semibold text-slate-700">Texto base com variaveis</span>
              <textarea
                value={form.texto_base}
                onChange={(event) => setForm((current) => ({ ...current, texto_base: event.target.value }))}
                className="modern-field"
                rows={5}
              />
            </label>
          </div>

          <button
            type="submit"
            className="primary-button mt-6 w-full"
          >
            {form.id ? <Save size={17} /> : <Plus size={17} />}
            {form.id ? "Salvar alteracoes" : "Cadastrar modelo"}
          </button>
        </form>

        <div className="space-y-6">
          <div className="glass-panel rounded-lg p-5">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-forest-900">Biblioteca de modelos</h2>
              <span className="rounded-full bg-forest-50 px-3 py-1 text-xs font-semibold text-forest-700">
                {filteredTemplates.length} de {templates.length} modelos
              </span>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <label className="block">
                <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Tipo</span>
                <select
                  value={filterType}
                  onChange={(event) => setFilterType(event.target.value as "todos" | DocumentType)}
                  className="modern-field py-2"
                >
                  <option value="todos">Todos</option>
                  {documentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Categoria</span>
                <select
                  value={filterCategory}
                  onChange={(event) => setFilterCategory(event.target.value)}
                  className="modern-field py-2"
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
                <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Subcategoria</span>
                <select
                  value={filterSubcategory}
                  onChange={(event) => setFilterSubcategory(event.target.value)}
                  className="modern-field py-2"
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
                <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Orgao</span>
                <select
                  value={filterAgency}
                  onChange={(event) => setFilterAgency(event.target.value)}
                  className="modern-field py-2"
                >
                  <option value="todos">Todos</option>
                  {agencyOptions.map((agency) => (
                    <option key={agency} value={agency}>
                      {agency}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-5 space-y-3">
              {filteredTemplates.map((template) => (
                <article key={template.id} className="rounded-lg border border-white/70 bg-white/70 p-4 shadow-sm">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="font-semibold text-forest-900">{template.nome}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {template.tipo_documento} · {template.subcategoria} · {template.orgao_ambiental} · v{template.versao}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Plano {template.plano_minimo} · {template.status}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{template.descricao}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedTemplateId(template.id)}
                        aria-label="Visualizar modelo"
                        title="Visualizar modelo"
                        className="focus-ring flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:border-forest-500 hover:text-forest-700"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => editTemplate(template)}
                        aria-label="Editar modelo"
                        title="Editar modelo"
                        className="focus-ring flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:border-forest-500 hover:text-forest-700"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteTemplate(template.id)}
                        aria-label="Excluir modelo"
                        title="Excluir modelo"
                        className="focus-ring flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:border-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
              {filteredTemplates.length === 0 ? (
                <p className="rounded-lg border border-slate-100 p-4 text-sm text-slate-500">
                  Nenhum modelo encontrado com os filtros selecionados.
                </p>
              ) : null}
            </div>
          </div>

          {selectedTemplate ? (
            <div className="glass-panel rounded-lg p-5">
              <h2 className="text-lg font-bold text-forest-900">Visualizacao do modelo</h2>
              <div className="mt-3 grid gap-3 text-sm text-slate-600 md:grid-cols-2">
                <p>
                  <span className="font-semibold text-slate-700">Categoria:</span> {selectedTemplate.categoria}
                </p>
                <p>
                  <span className="font-semibold text-slate-700">Subcategoria:</span> {selectedTemplate.subcategoria}
                </p>
                <p>
                  <span className="font-semibold text-slate-700">Orgao:</span> {selectedTemplate.orgao_ambiental}
                </p>
                <p>
                  <span className="font-semibold text-slate-700">Versao:</span> {selectedTemplate.versao}
                </p>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold text-slate-700">Secoes</p>
                  <ul className="mt-2 space-y-1 text-sm text-slate-600">
                    {selectedTemplate.secoes.map((section) => (
                      <li key={section}>{section}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">Campos obrigatorios</p>
                  <ul className="mt-2 space-y-1 text-sm text-slate-600">
                    {selectedTemplate.campos_obrigatorios.map((field) => (
                      <li key={field.id}>{field.label}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <pre className="mt-4 whitespace-pre-wrap rounded-lg bg-slate-950 p-4 text-sm leading-6 text-slate-100">
                {selectedTemplate.texto_base}
              </pre>
            </div>
          ) : null}
        </div>
      </section>
    </AppShell>
  );
}
