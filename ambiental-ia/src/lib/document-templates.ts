"use client";

import { templates } from "@/lib/mock-data";
import type { DocumentTemplate, DocumentType, DynamicDocumentValues, PlanId } from "@/types";

const STORAGE_KEY = "ambiental-ia:document-templates";
const planWeight: Record<PlanId, number> = {
  basico: 1,
  intermediario: 2,
  premium: 3
};

function normalizeTemplate(template: DocumentTemplate): DocumentTemplate {
  return {
    ...template,
    categoria: template.categoria ?? template.tipo_documento,
    subcategoria: template.subcategoria ?? "Geral",
    orgao_ambiental: template.orgao_ambiental ?? "Municipal",
    versao: template.versao ?? "1.0"
  };
}

export function getDocumentTemplates(): DocumentTemplate[] {
  if (typeof window === "undefined") {
    return templates.map(normalizeTemplate);
  }

  const storedTemplates = window.localStorage.getItem(STORAGE_KEY);
  if (!storedTemplates) {
    return templates.map(normalizeTemplate);
  }

  try {
    return (JSON.parse(storedTemplates) as DocumentTemplate[]).map(normalizeTemplate);
  } catch {
    return templates.map(normalizeTemplate);
  }
}

export function saveDocumentTemplates(nextTemplates: DocumentTemplate[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextTemplates));
}

export function canUseTemplate(userPlan: PlanId, templatePlan: PlanId) {
  return planWeight[userPlan] >= planWeight[templatePlan];
}

export function getAvailableTemplates(type: DocumentType, userPlan: PlanId) {
  return getDocumentTemplates().filter(
    (template) =>
      template.tipo_documento === type &&
      template.status === "Ativo" &&
      canUseTemplate(userPlan, template.plano_minimo)
  );
}

export function renderTemplateText(template: DocumentTemplate, values: DynamicDocumentValues) {
  return template.texto_base.replace(/\{([^}]+)\}/g, (_, key: string) => {
    if (key === "tipo_documento") {
      return template.tipo_documento;
    }

    return values[key]?.trim() || `[${key}]`;
  });
}

export function buildDynamicDocumentPreview(template: DocumentTemplate, values: DynamicDocumentValues) {
  const lines = [
    `${template.tipo_documento} - ${values.titulo || template.nome}`,
    "",
    "Modelo",
    template.nome,
    `Categoria: ${template.categoria}`,
    `Subcategoria: ${template.subcategoria}`,
    `Orgao ambiental: ${template.orgao_ambiental}`,
    `Versao: ${template.versao}`,
    "",
    "Secoes",
    ...template.secoes.map((section, index) => `${index + 1}. ${section}`),
    "",
    "Texto base preenchido",
    renderTemplateText(template, values),
    "",
    "Campos informados",
    ...template.campos_obrigatorios.map((field) => `${field.label}: ${values[field.id] || "Nao informado"}`)
  ];

  return lines.join("\n");
}
