"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  Sprout,
  WalletCards
} from "lucide-react";
import { clearMockUser, getMockUser } from "@/lib/auth";

const navigation = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/planos", label: "Planos", icon: WalletCards },
  { href: "/documentos/novo", label: "Documentos", icon: FileText },
  { href: "/prad", label: "PRAD", icon: ClipboardList },
  { href: "/admin", label: "Admin", icon: Settings }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = getMockUser();

  function handleLogout() {
    clearMockUser();
    router.push("/login");
  }

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-white/70 bg-white/75 px-5 py-6 shadow-soft backdrop-blur-xl lg:block">
        <Link href="/dashboard" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-forest-600 text-white shadow-sm shadow-forest-900/20">
            <Sprout size={22} />
          </span>
          <span>
            <span className="block text-lg font-bold text-forest-900">Ambiental IA</span>
            <span className="text-sm text-slate-500">Documentos ambientais</span>
          </span>
        </Link>

        <nav className="mt-10 space-y-1.5">
          {navigation.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-forest-600 text-white shadow-sm shadow-forest-900/10"
                    : "text-slate-600 hover:bg-white hover:text-forest-700 hover:shadow-sm"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-5 right-5 rounded-lg border border-forest-100 bg-forest-50/80 p-4 shadow-sm">
          <p className="text-sm font-semibold text-forest-900">{user.name}</p>
          <p className="mt-1 truncate text-xs text-slate-600">{user.email}</p>
          <p className="mt-3 inline-flex rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-forest-700">
            Plano {user.plan}
          </p>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-white/70 bg-white/75 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href="/dashboard" className="flex items-center gap-2 font-bold text-forest-900 lg:hidden">
              <Sprout size={22} />
              Ambiental IA
            </Link>
            <div className="hidden items-center gap-2 text-sm text-slate-500 lg:flex">
              <FileText size={18} />
              MVP tecnico ambiental
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="secondary-button px-3 py-2"
            >
              <LogOut size={16} />
              Sair
            </button>
          </div>
          <nav className="flex gap-2 overflow-x-auto px-4 pb-3 lg:hidden">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex min-w-fit items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
                    active ? "bg-forest-600 text-white" : "bg-white/70 text-slate-600"
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
