import type { DocumentTemplate, DocumentType, PlanId } from "@/types";

export const documentTypes: DocumentType[] = [
  "PRAD",
  "PTRF",
  "RAP",
  "RCA",
  "PCA",
  "PGRS",
  "PMGRCC",
  "Parecer Tecnico",
  "Laudo Ambiental"
];

export const documentCategories: Record<DocumentType, string[]> = {
  PRAD: ["PRAD"],
  PTRF: ["PTRF"],
  RAP: ["RAP"],
  RCA: ["RCA"],
  PCA: ["PCA"],
  PGRS: ["PGRS"],
  PMGRCC: ["PMGRCC"],
  "Parecer Tecnico": ["Parecer Tecnico"],
  "Laudo Ambiental": ["Laudo Ambiental"]
};

export const documentSubcategories: Record<DocumentType, string[]> = {
  PRAD: ["APP", "Reserva Legal", "Mineracao", "Area Urbana"],
  PTRF: ["Florestal", "Compensacao", "Reposicao"],
  RAP: ["Empreendimento", "Infraestrutura", "Regularizacao"],
  RCA: ["Industrial", "Minerario", "Saneamento"],
  PCA: ["Controle ambiental", "Mitigacao", "Monitoramento"],
  PGRS: ["Comercial", "Industrial", "Servicos de saude"],
  PMGRCC: ["Obra civil", "Demolicao", "Reforma"],
  "Parecer Tecnico": ["Arborizacao", "Supressao Vegetal", "Recursos Hidricos"],
  "Laudo Ambiental": ["Nascente", "APP", "Erosao"]
};

export const environmentalAgencies = ["Municipal", "Estadual", "Federal", "IBAMA", "CETESB", "SEMAD"];

export const plans: Array<{
  id: PlanId;
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}> = [
  {
    id: "basico",
    name: "Basico",
    price: "R$ 49/mes",
    description: "Para profissionais iniciando a organizacao de documentos ambientais.",
    features: [
      "3 PRADs por mes",
      "Modelos padrao",
      "Exportacao em PDF",
      "Historico simples"
    ]
  },
  {
    id: "intermediario",
    name: "Intermediario",
    price: "R$ 129/mes",
    description: "Para consultorias que precisam padronizar entregas tecnicas.",
    features: [
      "15 PRADs por mes",
      "DOCX e PDF",
      "Modelos customizaveis",
      "Campos tecnicos avancados"
    ],
    highlighted: true
  },
  {
    id: "premium",
    name: "Premium",
    price: "R$ 299/mes",
    description: "Para equipes com alto volume e controle administrativo.",
    features: [
      "PRADs ilimitados",
      "Biblioteca de modelos",
      "Usuarios administrativos",
      "Preparado para IA assistida"
    ]
  }
];

export const templates: DocumentTemplate[] = [
  {
    id: "tpl-prad-default",
    tipo_documento: "PRAD",
    nome: "PRAD - Estrutura padrao",
    descricao: "Plano de recuperacao para areas degradadas com diagnostico, acoes e monitoramento.",
    categoria: "PRAD",
    subcategoria: "APP",
    orgao_ambiental: "Municipal",
    versao: "1.0",
    plano_minimo: "basico",
    status: "Ativo",
    secoes: [
      "Identificacao",
      "Diagnostico ambiental",
      "Plano de recuperacao",
      "Monitoramento",
      "Responsabilidade tecnica"
    ],
    campos_obrigatorios: [
      { id: "titulo", label: "Titulo do projeto", type: "text", required: true, placeholder: "PRAD Fazenda Santa Clara" },
      { id: "nome_imovel", label: "Nome do imovel", type: "text", required: true, placeholder: "Fazenda Santa Clara" },
      { id: "municipio", label: "Municipio", type: "text", required: true, placeholder: "Registro" },
      { id: "uf", label: "UF", type: "text", required: true, placeholder: "SP" },
      { id: "area_degradada", label: "Area degradada (ha)", type: "number", required: true, placeholder: "12.5" },
      { id: "causa_degradacao", label: "Causa da degradacao", type: "textarea", required: true },
      { id: "acoes_propostas", label: "Acoes propostas", type: "textarea", required: true },
      { id: "responsavel_tecnico", label: "Responsavel tecnico", type: "text", required: true }
    ],
    texto_base:
      "O {tipo_documento} intitulado {titulo} trata da recuperacao da area localizada no imovel {nome_imovel}, em {municipio}/{uf}. A area degradada possui {area_degradada} ha. A degradacao decorre de {causa_degradacao}. As acoes propostas incluem {acoes_propostas}. O responsavel tecnico e {responsavel_tecnico}.",
    updatedAt: "2026-06-01"
  },
  {
    id: "tpl-pmgrcc-default",
    tipo_documento: "PMGRCC",
    nome: "PMGRCC - Obra civil",
    descricao: "Plano de gerenciamento de residuos da construcao civil para obras de pequeno e medio porte.",
    categoria: "PMGRCC",
    subcategoria: "Obra civil",
    orgao_ambiental: "Municipal",
    versao: "1.0",
    plano_minimo: "intermediario",
    status: "Ativo",
    secoes: [
      "Identificacao da obra",
      "Caracterizacao dos residuos",
      "Segregacao e acondicionamento",
      "Transporte e destinacao",
      "Responsabilidade tecnica"
    ],
    campos_obrigatorios: [
      { id: "titulo", label: "Titulo do plano", type: "text", required: true, placeholder: "PMGRCC Residencial Aurora" },
      { id: "empreendimento", label: "Empreendimento", type: "text", required: true },
      { id: "endereco_obra", label: "Endereco da obra", type: "text", required: true },
      { id: "area_construida", label: "Area construida (m2)", type: "number", required: true },
      { id: "residuos_previstos", label: "Residuos previstos", type: "textarea", required: true },
      { id: "destinacao", label: "Destinacao final", type: "textarea", required: true },
      { id: "responsavel_tecnico", label: "Responsavel tecnico", type: "text", required: true }
    ],
    texto_base:
      "O {tipo_documento} {titulo} apresenta as diretrizes para o empreendimento {empreendimento}, localizado em {endereco_obra}, com area construida de {area_construida} m2. Os residuos previstos sao {residuos_previstos}. A destinacao final seguira: {destinacao}. Responsavel tecnico: {responsavel_tecnico}.",
    updatedAt: "2026-06-05"
  },
  {
    id: "tpl-parecer-default",
    tipo_documento: "Parecer Tecnico",
    nome: "Parecer Tecnico - Analise ambiental",
    descricao: "Parecer com contextualizacao, analise tecnica, conclusao e recomendacoes.",
    categoria: "Parecer Tecnico",
    subcategoria: "Supressao Vegetal",
    orgao_ambiental: "Estadual",
    versao: "1.0",
    plano_minimo: "basico",
    status: "Ativo",
    secoes: ["Objeto", "Analise tecnica", "Conclusao", "Recomendacoes"],
    campos_obrigatorios: [
      { id: "titulo", label: "Titulo do parecer", type: "text", required: true },
      { id: "solicitante", label: "Solicitante", type: "text", required: true },
      { id: "objeto", label: "Objeto da analise", type: "textarea", required: true },
      { id: "analise_tecnica", label: "Analise tecnica", type: "textarea", required: true },
      { id: "conclusao", label: "Conclusao", type: "textarea", required: true },
      { id: "responsavel_tecnico", label: "Responsavel tecnico", type: "text", required: true }
    ],
    texto_base:
      "Este parecer tecnico, solicitado por {solicitante}, tem como objeto {objeto}. A analise tecnica identificou: {analise_tecnica}. Conclui-se que {conclusao}. Responsavel tecnico: {responsavel_tecnico}.",
    updatedAt: "2026-06-08"
  },
  {
    id: "tpl-laudo-ambiental-default",
    tipo_documento: "Laudo Ambiental",
    nome: "Laudo Ambiental - Vistoria",
    descricao: "Laudo para registro de vistoria ambiental, evidencias, avaliacao e conclusao.",
    categoria: "Laudo Ambiental",
    subcategoria: "Nascente",
    orgao_ambiental: "Estadual",
    versao: "1.0",
    plano_minimo: "premium",
    status: "Rascunho",
    secoes: ["Identificacao", "Metodologia", "Evidencias", "Avaliacao ambiental", "Conclusao"],
    campos_obrigatorios: [
      { id: "titulo", label: "Titulo do laudo", type: "text", required: true },
      { id: "area_vistoriada", label: "Area vistoriada", type: "text", required: true },
      { id: "data_vistoria", label: "Data da vistoria", type: "date", required: true },
      { id: "metodologia", label: "Metodologia", type: "textarea", required: true },
      { id: "evidencias", label: "Evidencias observadas", type: "textarea", required: true },
      { id: "conclusao", label: "Conclusao", type: "textarea", required: true },
      { id: "responsavel_tecnico", label: "Responsavel tecnico", type: "text", required: true }
    ],
    texto_base:
      "O laudo ambiental {titulo} registra vistoria realizada em {data_vistoria} na area {area_vistoriada}. A metodologia aplicada foi {metodologia}. As evidencias observadas foram {evidencias}. Conclusao: {conclusao}. Responsavel tecnico: {responsavel_tecnico}.",
    updatedAt: "2026-06-08"
  }
];

export const recentDocuments = [
  {
    title: "PRAD Fazenda Santa Clara",
    status: "Rascunho",
    updatedAt: "Hoje",
    progress: 72
  },
  {
    title: "PRAD Area Ciliar Rio Verde",
    status: "Gerado",
    updatedAt: "Ontem",
    progress: 100
  },
  {
    title: "PRAD Talhao Norte",
    status: "Em revisao",
    updatedAt: "10 jun.",
    progress: 86
  }
];
