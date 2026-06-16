import { supabase } from "@/lib/supabase";
import type { PradFormData } from "@/types";

type SavePradProjectResult = {
  id: string;
  titulo: string;
};

function normalizeDecimal(value: string) {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) {
    return null;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function savePradProject(data: PradFormData): Promise<SavePradProjectResult> {
  if (!supabase) {
    throw new Error("Supabase nao configurado. Preencha NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user) {
    throw new Error("Entre com Supabase Auth antes de salvar o projeto PRAD no banco.");
  }

  const email = user.email ?? "";
  const nameFromMetadata = user.user_metadata?.name ?? user.user_metadata?.full_name;

  const { error: profileError } = await supabase.from("usuarios").upsert(
    {
      id: user.id,
      nome: nameFromMetadata || email || "Usuario Ambiental",
      email,
      plano_id: "basico"
    },
    { onConflict: "id" }
  );

  if (profileError) {
    throw new Error(`Nao foi possivel preparar o perfil do usuario: ${profileError.message}`);
  }

  const payload = {
    usuario_id: user.id,
    titulo: data.title || "PRAD sem titulo",
    status: "rascunho",
    nome_imovel: data.propertyName || "Imovel nao informado",
    proprietario_responsavel: data.ownerName || null,
    municipio: data.municipality || "Nao informado",
    uf: (data.state || "NA").trim().toUpperCase().slice(0, 2),
    area_degradada_ha: normalizeDecimal(data.areaHectares),
    bioma: data.biome || null,
    causa_degradacao: data.degradationCause || null,
    condicao_solo: data.soilCondition || null,
    recursos_hidricos: data.waterResources || null,
    acoes_propostas: data.proposedActions || null,
    especies_nativas: data.nativeSpecies || null,
    plano_monitoramento: data.monitoringPlan || null,
    cronograma: data.schedule || null,
    responsavel_tecnico: data.technicalResponsible || null,
    dados_tecnicos: {
      origem: "formulario_mvp",
      versao_formulario: 1
    }
  };

  const { data: project, error: projectError } = await supabase
    .from("projetos_prad")
    .insert(payload)
    .select("id,titulo")
    .single();

  if (projectError) {
    throw new Error(`Nao foi possivel salvar o projeto PRAD: ${projectError.message}`);
  }

  return project;
}
