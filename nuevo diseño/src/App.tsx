/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  LayoutDashboard,
  LineChart,
  Key,
  Link as LinkIcon,
  Search,
  Layers,
  HelpCircle,
  LogOut,
  Bell,
  Settings,
  Download,
  Gauge,
  ArrowRight,
  CheckCircle2,
  FileText,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal
} from 'lucide-react';

export default function App() {
  return (
    <div className="flex min-h-screen bg-surface font-manrope text-on-surface">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-50 flex h-full w-64 flex-col bg-surface-container-lowest px-4 py-6 shadow-[1px_0_10px_rgba(0,0,0,0.02)]">
        <div className="mb-10 px-4">
          <h1 className="font-jakarta text-xl font-extrabold tracking-tight text-primary">
            MediaFlow
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            SEO Intelligence
          </p>
        </div>

        <nav className="flex-1 space-y-1">
          <NavItem icon={<LayoutDashboard size={20} />} label="Overview" />
          <NavItem
            icon={<LineChart size={20} />}
            label="Rank Tracker"
            active
          />
          <NavItem icon={<Key size={20} />} label="Keyword Research" />
          <NavItem icon={<LinkIcon size={20} />} label="Backlink Audit" />
          <NavItem icon={<Search size={20} />} label="Site Explorer" />
          <NavItem icon={<Layers size={20} />} label="Content Gap" />
        </nav>

        <div className="mt-auto pt-6">
          <div className="mb-6 rounded-xl bg-gradient-to-br from-primary to-primary-container p-5 shadow-lg shadow-primary/20">
            <p className="mb-1 text-xs font-bold text-white">PRO PLAN</p>
            <p className="mb-4 text-[11px] text-white/80 leading-tight">
              Get unlimited keyword tracks and AI reports.
            </p>
            <button className="w-full rounded-full bg-white px-4 py-2 text-xs font-bold text-primary transition-colors hover:bg-surface-container-lowest">
              Upgrade Pro
            </button>
          </div>

          <div className="space-y-1">
            <NavItem icon={<HelpCircle size={20} />} label="Help Center" />
            <NavItem
              icon={<LogOut size={20} />}
              label="Logout"
              className="hover:text-red-500"
            />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex flex-1 flex-col">
        {/* Top Navigation */}
        <header className="sticky top-0 z-40 flex w-full items-center justify-between border-b border-outline-variant/15 bg-surface-container-lowest/80 px-8 py-4 backdrop-blur-md">
          <div className="flex flex-1 items-center gap-8">
            <div className="relative w-full max-w-md">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search tasks, campaigns or reports..."
                className="w-full rounded-full bg-surface-container-low py-2.5 pl-11 pr-4 text-sm outline-none transition-all focus:bg-white focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <nav className="hidden items-center gap-6 lg:flex">
              <a href="#" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">Dashboard</a>
              <a href="#" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">Reports</a>
              <a href="#" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">Campaigns</a>
            </nav>
          </div>

          <div className="flex items-center gap-5">
            <button className="relative text-on-surface-variant hover:text-primary transition-colors">
              <Bell size={20} />
              <span className="absolute right-0 top-0 h-2 w-2 rounded-full border-2 border-white bg-red-500"></span>
            </button>
            <button className="text-on-surface-variant hover:text-primary transition-colors">
              <Settings size={20} />
            </button>
            <div className="mx-1 h-8 w-px bg-outline-variant/30"></div>
            <button className="rounded-full bg-gradient-to-br from-primary to-primary-container px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
              New Project
            </button>
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhNamKbXnRfPzix4YKyHnGJDCb7oNFV4cH0wg8X9eeqg6_2wMgc0Xi1C3HH73UtKzrBrc1h8SwGGbfGIcoQl7lK6bEZEijZnzQ1VA8vsmdmkHG7CyuobALoI4TNAAxo-ay1KnsJ4Ojv6sM5duYFzDb0Wb1CMErNgj4X2deqSgRnlOuZojXpvReM4k7GOXXnAUijFBFJSJEDZ1ZlpZb5RqCdckJ7rB4o5ukrk4Uh6qVnpv03ZdOQNcXkMvU4FyahobTLE9kdGENCdgq"
              alt="User profile"
              className="h-10 w-10 rounded-full border-2 border-primary-fixed-dim object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </header>

        {/* Content Canvas */}
        <div className="mx-auto w-full max-w-7xl space-y-10 p-10">
          {/* Hero Header */}
          <section className="relative overflow-hidden rounded-[2rem] bg-slate-900 p-12 text-white">
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/50 to-transparent mix-blend-multiply"></div>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBq8MK7ACx0slRDc82uL0A-m4DGVufuy9JlRPxPwwP_rs1izkdsjg0IrOc31iS6RnGdK0M1JLWTlfQwngHmol8I8ASFW80EDoMMLT5f6wYdxfJT5CKgzcu98Rgz4xnqAwe5Fca_2ZHvT5jUgkJ_8zvCkNM54jARj4_BuA5VrRwTrVMWfmCt9oVxJA7rpIUwfo9LDMdc1yHzqCyBO2fj6HMctrZN-qI4WYCrxRR5dV19a-tIJD0FAQiMRfLtcoFxHgIHaDsHJD_zUIw0"
                alt="Abstract data background"
                className="h-full w-full object-cover opacity-20"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="relative z-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
              <div className="max-w-xl">
                <span className="mb-4 inline-block rounded-full border border-primary/30 bg-primary/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-fixed-dim backdrop-blur-sm">
                  Analytics History
                </span>
                <h2 className="font-jakarta mb-4 text-5xl font-extrabold tracking-tight">
                  Tareas Realizadas
                </h2>
                <p className="text-slate-300 leading-relaxed">
                  Registro detallado de optimizaciones técnicas y estratégicas aplicadas al ecosistema digital. Un historial transparente de crecimiento.
                </p>
              </div>
              <div className="flex gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-md">
                  <p className="mb-1 text-xs font-bold uppercase text-slate-400">Efficiency</p>
                  <p className="font-jakarta text-3xl font-bold">+24%</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-md">
                  <p className="mb-1 text-xs font-bold uppercase text-slate-400">Tasks Done</p>
                  <p className="font-jakarta text-3xl font-bold">1,284</p>
                </div>
              </div>
            </div>
          </section>

          {/* Filters Area */}
          <section className="flex flex-col items-center justify-between gap-6 rounded-3xl bg-surface-container-low p-6 md:flex-row">
            <div className="flex w-full gap-3 overflow-x-auto pb-2 md:w-auto md:pb-0">
              <button className="whitespace-nowrap rounded-full bg-primary px-6 py-2.5 text-xs font-bold text-white shadow-sm">
                Todas
              </button>
              <button className="whitespace-nowrap rounded-full bg-surface-container-highest px-6 py-2.5 text-xs font-bold text-on-surface-variant transition-colors hover:bg-white">
                Keyword Research
              </button>
              <button className="whitespace-nowrap rounded-full bg-surface-container-highest px-6 py-2.5 text-xs font-bold text-on-surface-variant transition-colors hover:bg-white">
                Technical Audit
              </button>
              <button className="whitespace-nowrap rounded-full bg-surface-container-highest px-6 py-2.5 text-xs font-bold text-on-surface-variant transition-colors hover:bg-white">
                Backlink Strategy
              </button>
            </div>
            <div className="flex w-full items-center gap-4 md:w-auto">
              <div className="relative flex-1 md:w-64">
                <SlidersHorizontal
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <select className="w-full appearance-none rounded-full bg-white py-2.5 pl-11 pr-8 text-xs font-bold text-on-surface outline-none focus:ring-2 focus:ring-primary/10">
                  <option>Últimos 30 días</option>
                  <option>Trimestre actual</option>
                  <option>Año completo</option>
                </select>
              </div>
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-500 transition-colors hover:text-primary shadow-sm">
                <Download size={18} />
              </button>
            </div>
          </section>

          {/* Main Grid */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Featured Task Card */}
            <div className="group rounded-[2.5rem] bg-surface-container-lowest p-8 transition-all duration-500 hover:shadow-[0_10px_40px_rgba(25,28,29,0.06)] lg:col-span-8">
              <div className="mb-10 flex items-start justify-between">
                <div className="flex items-center gap-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary-fixed text-primary">
                    <Gauge size={28} />
                  </div>
                  <div>
                    <h3 className="font-jakarta text-xl font-bold text-on-surface">
                      Optimización Core Web Vitals
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Completado ayer a las 18:45
                    </p>
                  </div>
                </div>
                <span className="rounded-full border border-emerald-100 bg-emerald-50 px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-emerald-600">
                  Critical Success
                </span>
              </div>

              <div className="mb-10 grid grid-cols-1 gap-12 md:grid-cols-2">
                <div>
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Impacto Directo
                  </p>
                  <p className="text-sm leading-relaxed text-on-surface-variant">
                    Reducción del LCP de 4.2s a 1.1s en dispositivos móviles mediante compresión WebP y carga diferida de scripts críticos.
                  </p>
                </div>
                <div>
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Keywords Afectadas
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-surface-container px-3 py-1.5 text-[10px] font-bold text-on-surface-variant">
                      E-commerce Hosting
                    </span>
                    <span className="rounded-full bg-surface-container px-3 py-1.5 text-[10px] font-bold text-on-surface-variant">
                      Web Performance
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-outline-variant/15 pt-6">
                <div className="flex -space-x-3">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqh3yCKkpTZA1WDAGOsgN08ekMJpcwgPVqO8_uLH0oVDBKmTWFbs-zQ3e_1mY_qh7UhS8Bn22pYKEDXeXONzNxZVrDP-unzW771Ec3zpkCAvPK_kZOJhoEtps3ScAyGrqzlJWpw56Y1X_lMBlIvxpHfXP9Ppk7zwNaCETjntRaf0bNJ99srE2Za6OaxYx6tJoxnDGb9_ZPcOgzx_jDEaVYiSnH8jK7AyMtNTEQPIzx_NfZu_VGt72K6Zaziiln0_YMIdzFrYI51U_d"
                    alt="Team member"
                    className="h-10 w-10 rounded-full border-4 border-white object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_6sEnvYWlX-NiR7f6xSuH14cZvR2QxZFrQvoV-WErBH_r8r3RmkjaFiT4DDxSJQXWV-yQo5mCUmS_HYtrbl3t1wdtAVcIbi65SwgVKSzGe-OtepYoUEuMWNolpu1inCuv6SsQEkUCJ6Wzktpr0NqKwGYITmhS201kRM7ajBAlHAviklvXN8spAjNbNSDG3sMwcBAg4CeZvCGXw28noz5iLgsK9BmTSEwwLi9f-_kTGEUJ3eSRkLJSSxNeiL5w6cQoMs5hlTrR3sZd"
                    alt="Team member"
                    className="h-10 w-10 rounded-full border-4 border-white object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-surface-container-high text-[10px] font-bold text-slate-500">
                    +2
                  </div>
                </div>
                <button className="flex items-center gap-2 text-sm font-bold text-primary transition-transform group-hover:translate-x-1">
                  Ver informe detallado <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Side Cards */}
            <div className="space-y-8 lg:col-span-4">
              {/* Monthly Goal */}
              <div className="rounded-[2.5rem] bg-gradient-to-br from-primary to-primary-container p-8 text-white shadow-lg shadow-primary/10">
                <h4 className="font-jakarta mb-6 text-lg font-bold">Meta Mensual</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/80">Progreso de Tareas</span>
                    <span className="text-sm font-bold">85%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
                    <div className="h-full w-[85%] rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.4)]"></div>
                  </div>
                  <p className="text-[11px] leading-tight text-white/70">
                    Estás a 4 tareas de completar el objetivo estratégico del Q3.
                  </p>
                </div>
              </div>

              {/* Categories */}
              <div className="rounded-[2.5rem] bg-surface-container p-8">
                <h4 className="font-jakarta mb-6 text-lg font-bold text-on-surface">
                  Categorías
                </h4>
                <ul className="space-y-5">
                  <CategoryItem color="bg-blue-500" label="On-Page" value="42%" />
                  <CategoryItem color="bg-purple-500" label="Enlazado Interno" value="28%" />
                  <CategoryItem color="bg-amber-500" label="Contenido AI" value="30%" />
                </ul>
              </div>
            </div>

            {/* Recent History List */}
            <div className="space-y-5 lg:col-span-12">
              <h3 className="font-jakarta mb-6 flex items-center gap-4 text-xl font-bold">
                <span className="h-[2px] w-8 bg-primary"></span>
                Historial Reciente
              </h3>
              <div className="space-y-4">
                <HistoryItem
                  date="12 OCT"
                  icon={<CheckCircle2 size={20} />}
                  title="Auditoría de Enlaces Tóxicos"
                  desc="Desautorización de 12 dominios de baja autoridad (SPAM)."
                  category="MediaFlow Crawler V2"
                />
                <HistoryItem
                  date="10 OCT"
                  icon={<FileText size={20} />}
                  title="Redacción de 5 Pillar Pages"
                  desc="Estructura basada en Keyword Gap de competidores directos."
                  category="Content Engine AI"
                />
                <HistoryItem
                  date="08 OCT"
                  icon={<LinkIcon size={20} />}
                  title="Fix de Arquitectura SILO"
                  desc="Corrección de redirecciones 301 en categorías huérfanas."
                  category="Technical SEO"
                />
              </div>
            </div>
          </div>

          {/* Pagination */}
          <footer className="flex justify-center pt-6 pb-10">
            <div className="flex items-center gap-2 rounded-full bg-surface-container-lowest px-4 py-2 shadow-sm border border-outline-variant/10">
              <button className="flex h-8 w-8 items-center justify-center text-slate-400 transition-colors hover:text-primary">
                <ChevronLeft size={18} />
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white shadow-sm shadow-primary/20">
                1
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-slate-600 transition-colors hover:bg-surface-container-low">
                2
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-slate-600 transition-colors hover:bg-surface-container-low">
                3
              </button>
              <span className="mx-1 text-slate-300">...</span>
              <button className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-slate-600 transition-colors hover:bg-surface-container-low">
                12
              </button>
              <button className="flex h-8 w-8 items-center justify-center text-slate-400 transition-colors hover:text-primary">
                <ChevronRight size={18} />
              </button>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}

function NavItem({
  icon,
  label,
  active = false,
  className = '',
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  className?: string;
}) {
  return (
    <a
      href="#"
      className={`flex cursor-pointer items-center gap-4 rounded-xl px-4 py-3 transition-all duration-200 hover:translate-x-1 ${
        active
          ? 'bg-secondary-fixed text-primary'
          : 'text-on-surface-variant hover:bg-surface-container-low'
      } ${className}`}
    >
      <span className={active ? 'text-primary' : 'text-slate-400'}>{icon}</span>
      <span className={`text-sm ${active ? 'font-bold' : 'font-medium'}`}>
        {label}
      </span>
    </a>
  );
}

function CategoryItem({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <li className="group flex cursor-pointer items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`h-2 w-2 rounded-full ${color}`}></div>
        <span className="text-sm font-medium text-on-surface transition-colors group-hover:text-primary">
          {label}
        </span>
      </div>
      <span className="text-xs font-bold text-slate-400">{value}</span>
    </li>
  );
}

function HistoryItem({
  date,
  icon,
  title,
  desc,
  category,
}: {
  date: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  category: string;
}) {
  return (
    <div className="group flex flex-col justify-between rounded-3xl bg-surface-container-lowest p-6 transition-all hover:bg-surface-container md:flex-row md:items-center border border-transparent hover:border-outline-variant/10">
      <div className="flex items-center gap-6">
        <span className="font-jakarta min-w-[60px] text-xs font-bold text-slate-400">
          {date}
        </span>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-high text-primary transition-colors group-hover:bg-primary group-hover:text-white">
          {icon}
        </div>
        <div>
          <h5 className="text-sm font-bold text-on-surface">{title}</h5>
          <p className="mt-0.5 text-[11px] text-slate-500">{desc}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-8 md:mt-0">
        <span className="text-xs font-medium text-slate-400">{category}</span>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-blue-500"></span>
          <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
            Procesado
          </span>
        </div>
        <button className="p-2 text-slate-400 opacity-0 transition-opacity hover:text-primary group-hover:opacity-100">
          <MoreVertical size={18} />
        </button>
      </div>
    </div>
  );
}
