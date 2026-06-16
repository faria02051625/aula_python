export type PlanId = "basico" | "intermediario" | "premium";

export type UserRole = "user" | "admin";

export type MockUser = {
  name: string;
  email: string;
  company?: string;
  plan: PlanId;
  role: UserRole;
};

export type PradFormData = {
  title: string;
  propertyName: string;
  ownerName: string;
  municipality: string;
  state: string;
  areaHectares: string;
  biome: string;
  degradationCause: string;
  soilCondition: string;
  waterResources: string;
  proposedActions: string;
  nativeSpecies: string;
  monitoringPlan: string;
  schedule: string;
  technicalResponsible: string;
};

export type DocumentType =
  | "PRAD"
  | "PTRF"
  | "RAP"
  | "RCA"
  | "PCA"
  | "PGRS"
  | "PMGRCC"
  | "Parecer Tecnico"
  | "Laudo Ambiental";

export type DocumentTemplateStatus = "Ativo" | "Rascunho" | "Inativo";

export type DocumentTemplateField = {
  id: string;
  label: string;
  type: "text" | "textarea" | "number" | "date" | "select";
  required: boolean;
  placeholder?: string;
  options?: string[];
};

export type DocumentTemplate = {
  id: string;
  tipo_documento: DocumentType;
  nome: string;
  descricao: string;
  categoria: string;
  subcategoria: string;
  orgao_ambiental: string;
  versao: string;
  plano_minimo: PlanId;
  status: DocumentTemplateStatus;
  secoes: string[];
  campos_obrigatorios: DocumentTemplateField[];
  texto_base: string;
  updatedAt: string;
};

export type DynamicDocumentValues = Record<string, string>;
