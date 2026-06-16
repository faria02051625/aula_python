"use client";

import { Check, Crown } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { plans } from "@/lib/mock-data";
import { updateMockPlan } from "@/lib/auth";
import type { PlanId } from "@/types";

export default function PlansPage() {
  function selectPlan(plan: PlanId) {
    updateMockPlan(plan);
    window.alert(`Plano ${plan} selecionado no modo simulado.`);
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="Assinaturas"
        title="Planos"
        description="Escolha uma estrutura comercial inicial. Pagamentos ainda nao estao integrados neste MVP."
      />

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => (
          <article
            key={plan.id}
            className={`rounded-lg border bg-white/85 p-6 shadow-soft backdrop-blur transition hover:-translate-y-0.5 hover:shadow-lg ${
              plan.highlighted ? "border-forest-500 ring-2 ring-forest-100" : "border-white/70"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-forest-900">{plan.name}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{plan.description}</p>
              </div>
              {plan.highlighted ? (
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-clay-100 text-clay-700">
                  <Crown size={19} />
                </span>
              ) : null}
            </div>
            <p className="mt-6 text-3xl font-bold text-forest-900">{plan.price}</p>
            <ul className="mt-6 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex gap-3 text-sm text-slate-700">
                  <Check className="mt-0.5 text-forest-600" size={17} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => selectPlan(plan.id)}
              className={`focus-ring mt-7 w-full rounded-lg px-4 py-2.5 text-sm font-semibold ${
                plan.highlighted
                  ? "bg-forest-600 text-white shadow-sm shadow-forest-900/10 hover:bg-forest-700"
                  : "border border-forest-100 bg-white text-forest-700 hover:border-forest-500"
              }`}
            >
              Selecionar plano
            </button>
          </article>
        ))}
      </section>
    </AppShell>
  );
}
