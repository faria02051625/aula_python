"use client";

import { renderTemplateText } from "@/lib/document-templates";
import type { DocumentTemplate, DynamicDocumentValues, PradFormData } from "@/types";

export function buildPradPreview(data: PradFormData) {
  return [
    `PRAD - ${data.title || "Projeto sem titulo"}`,
    "",
    `Imovel: ${data.propertyName || "Nao informado"}`,
    `Proprietario/Responsavel: ${data.ownerName || "Nao informado"}`,
    `Municipio/UF: ${data.municipality || "Nao informado"} - ${data.state || "UF"}`,
    `Area degradada: ${data.areaHectares || "0"} ha`,
    `Bioma: ${data.biome || "Nao informado"}`,
    "",
    "Diagnostico ambiental",
    data.degradationCause || "Causa de degradacao nao informada.",
    data.soilCondition || "Condicao do solo nao informada.",
    data.waterResources || "Recursos hidricos nao informados.",
    "",
    "Plano de recuperacao",
    data.proposedActions || "Acoes propostas nao informadas.",
    `Especies nativas: ${data.nativeSpecies || "Nao informadas"}`,
    `Monitoramento: ${data.monitoringPlan || "Nao informado"}`,
    `Cronograma: ${data.schedule || "Nao informado"}`,
    "",
    `Responsavel tecnico: ${data.technicalResponsible || "Nao informado"}`
  ].join("\n");
}

export function downloadTextAsFile(fileName: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

function sanitizeFileName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function generatePradDocx(data: PradFormData) {
  const {
    AlignmentType,
    Document,
    HeadingLevel,
    Packer,
    Paragraph,
    TextRun
  } = await import("docx");

  const title = data.title || "PRAD sem titulo";

  const heading = (text: string) =>
    new Paragraph({
      text,
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 320, after: 120 }
    });

  const field = (label: string, value?: string) =>
    new Paragraph({
      children: [
        new TextRun({ text: `${label}: `, bold: true }),
        new TextRun(value?.trim() || "Nao informado")
      ],
      spacing: { after: 120 }
    });

  const paragraph = (text?: string) =>
    new Paragraph({
      text: text?.trim() || "Nao informado",
      spacing: { after: 160 }
    });

  const doc = new Document({
    creator: "Ambiental IA",
    title,
    description: "Plano de Recuperacao de Area Degradada gerado pelo MVP Ambiental IA.",
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: title,
                bold: true,
                size: 34
              })
            ],
            spacing: { after: 280 }
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "Plano de Recuperacao de Area Degradada",
                italics: true,
                size: 24
              })
            ],
            spacing: { after: 480 }
          }),

          heading("1. Identificacao"),
          field("Imovel", data.propertyName),
          field("Proprietario ou responsavel", data.ownerName),
          field("Municipio", data.municipality),
          field("UF", data.state),
          field("Area degradada", data.areaHectares ? `${data.areaHectares} ha` : ""),
          field("Bioma", data.biome),

          heading("2. Diagnostico ambiental"),
          field("Causa da degradacao", data.degradationCause),
          field("Condicao do solo", data.soilCondition),
          field("Recursos hidricos", data.waterResources),

          heading("3. Plano de recuperacao"),
          paragraph(data.proposedActions),
          field("Especies nativas indicadas", data.nativeSpecies),

          heading("4. Monitoramento e cronograma"),
          field("Plano de monitoramento", data.monitoringPlan),
          field("Cronograma", data.schedule),

          heading("5. Responsabilidade tecnica"),
          paragraph(data.technicalResponsible),

          new Paragraph({
            spacing: { before: 520 },
            children: [
              new TextRun({
                text: "Documento gerado pelo MVP Ambiental IA. Revise todas as informacoes antes de protocolo ou envio oficial.",
                italics: true,
                size: 20
              })
            ]
          })
        ]
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${sanitizeFileName(title) || "prad"}.docx`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function generateDynamicDocumentDocx(template: DocumentTemplate, values: DynamicDocumentValues) {
  const {
    AlignmentType,
    Document,
    HeadingLevel,
    Packer,
    Paragraph,
    TextRun
  } = await import("docx");

  const title = values.titulo || template.nome;
  const field = (label: string, value?: string) =>
    new Paragraph({
      children: [
        new TextRun({ text: `${label}: `, bold: true }),
        new TextRun(value?.trim() || "Nao informado")
      ],
      spacing: { after: 120 }
    });

  const doc = new Document({
    creator: "Ambiental IA",
    title,
    description: `${template.tipo_documento} gerado pelo MVP Ambiental IA.`,
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: title, bold: true, size: 34 })],
            spacing: { after: 180 }
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: template.tipo_documento, italics: true, size: 24 })],
            spacing: { after: 420 }
          }),
          new Paragraph({
            text: "Secoes do documento",
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 120 }
          }),
          field("Categoria", template.categoria),
          field("Subcategoria", template.subcategoria),
          field("Orgao ambiental", template.orgao_ambiental),
          field("Versao", template.versao),
          ...template.secoes.map(
            (section, index) =>
              new Paragraph({
                text: `${index + 1}. ${section}`,
                spacing: { after: 80 }
              })
          ),
          new Paragraph({
            text: "Texto base",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 320, after: 120 }
          }),
          new Paragraph({
            text: renderTemplateText(template, values),
            spacing: { after: 240 }
          }),
          new Paragraph({
            text: "Campos preenchidos",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 320, after: 120 }
          }),
          ...template.campos_obrigatorios.map((templateField) =>
            field(templateField.label, values[templateField.id])
          ),
          new Paragraph({
            spacing: { before: 520 },
            children: [
              new TextRun({
                text: "Documento gerado pelo MVP Ambiental IA. Revise todas as informacoes antes de protocolo ou envio oficial.",
                italics: true,
                size: 20
              })
            ]
          })
        ]
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${sanitizeFileName(title) || "documento-ambiental"}.docx`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function generateDynamicDocumentPdf(template: DocumentTemplate, values: DynamicDocumentValues) {
  const { jsPDF } = await import("jspdf");
  const title = values.titulo || template.nome;
  const pdf = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 48;
  const maxWidth = 500;
  let cursorY = 56;

  function write(text: string, options?: { bold?: boolean; size?: number; gap?: number }) {
    pdf.setFont("helvetica", options?.bold ? "bold" : "normal");
    pdf.setFontSize(options?.size ?? 11);

    const lines = pdf.splitTextToSize(text, maxWidth) as string[];
    lines.forEach((line) => {
      if (cursorY > 780) {
        pdf.addPage();
        cursorY = 56;
      }

      pdf.text(line, margin, cursorY);
      cursorY += (options?.size ?? 11) + 5;
    });

    cursorY += options?.gap ?? 8;
  }

  write(title, { bold: true, size: 18, gap: 6 });
  write(template.tipo_documento, { size: 12, gap: 18 });
  write(`Categoria: ${template.categoria}`, { gap: 2 });
  write(`Subcategoria: ${template.subcategoria}`, { gap: 2 });
  write(`Orgao ambiental: ${template.orgao_ambiental}`, { gap: 2 });
  write(`Versao: ${template.versao}`, { gap: 14 });
  write("Secoes do documento", { bold: true, size: 13 });
  template.secoes.forEach((section, index) => write(`${index + 1}. ${section}`, { gap: 2 }));
  write("Texto base preenchido", { bold: true, size: 13, gap: 6 });
  write(renderTemplateText(template, values), { gap: 16 });
  write("Campos preenchidos", { bold: true, size: 13, gap: 6 });
  template.campos_obrigatorios.forEach((field) => {
    write(`${field.label}: ${values[field.id] || "Nao informado"}`, { gap: 2 });
  });

  pdf.save(`${sanitizeFileName(title) || "documento-ambiental"}.pdf`);
}
