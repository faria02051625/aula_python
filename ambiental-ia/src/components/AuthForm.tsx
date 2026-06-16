"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Leaf, LogIn, ShieldCheck, UserPlus } from "lucide-react";
import { saveMockUser } from "@/lib/auth";

type AuthFormProps = {
  mode: "login" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const isSignup = mode === "signup";
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("usuario@ambientalia.com");
  const [password, setPassword] = useState("ambiental123");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    saveMockUser({
      name: name || "Usuario Ambiental",
      email,
      company: company || "Ambiental IA Demo",
      role: "admin"
    });
    void password;
    router.push("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="glass-panel grid w-full max-w-5xl overflow-hidden rounded-lg lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative overflow-hidden bg-forest-700 p-8 text-white">
          <div className="absolute inset-x-0 top-0 h-1 bg-clay-500" />
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/15 shadow-sm">
              <Leaf size={22} />
            </span>
            <span className="text-xl font-bold">Ambiental IA</span>
          </div>
          <h1 className="mt-12 max-w-sm text-3xl font-bold leading-tight tracking-tight">
            Organize PRADs, modelos e documentos ambientais em um unico fluxo.
          </h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-forest-50">
            A autenticacao esta simulada neste MVP. A estrutura ja separa os pontos para integrar Supabase Auth.
          </p>
          <div className="mt-10 grid gap-3 text-sm text-forest-50">
            {["Modelos ambientais dinamicos", "Exportacao DOCX/PDF", "Base pronta para Supabase"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-clay-100" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/90 p-8">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-forest-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-forest-700">
              <ShieldCheck size={14} />
              {isSignup ? "Criar conta" : "Entrar"}
            </p>
            <h2 className="mt-2 text-2xl font-bold text-forest-900">
              {isSignup ? "Comece o MVP agora" : "Acesse seu painel"}
            </h2>
          </div>

          <div className="mt-8 space-y-4">
            {isSignup ? (
              <>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Nome</span>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="modern-field"
                    placeholder="Maria Silva"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Empresa</span>
                  <input
                    value={company}
                    onChange={(event) => setCompany(event.target.value)}
                    className="modern-field"
                    placeholder="Consultoria Ambiental"
                  />
                </label>
              </>
            ) : null}

            <label className="block">
              <span className="text-sm font-medium text-slate-700">E-mail</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="modern-field"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Senha</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="modern-field"
                required
              />
            </label>
          </div>

          <button
            type="submit"
            className="primary-button mt-6 w-full py-3"
          >
            {isSignup ? <UserPlus size={18} /> : <LogIn size={18} />}
            {isSignup ? "Criar cadastro" : "Entrar no dashboard"}
          </button>

          <p className="mt-5 text-center text-sm text-slate-600">
            {isSignup ? "Ja tem conta?" : "Ainda nao tem conta?"}{" "}
            <Link href={isSignup ? "/login" : "/cadastro"} className="font-semibold text-forest-700">
              {isSignup ? "Entrar" : "Criar cadastro"}
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
