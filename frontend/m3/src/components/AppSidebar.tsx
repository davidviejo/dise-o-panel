import React, { useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ListChecks,
  Zap,
  Newspaper,
  Map,
  Sparkles,
  KanbanSquare,
  ClipboardList,
  Settings as SettingsIcon,
  Lightbulb,
  Search,
  Layers,
  BookOpen,
  Cpu,
  Activity,
  Globe,
  BarChart3,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ModuleData } from '../types';

type NavSection = 'analitica' | 'estrategia' | 'acciones' | 'admin';

interface AppSidebarProps {
  modules: ModuleData[];
}

const getIcon = (name: string) => {
  switch (name) {
    case 'Search':
      return <Search size={18} />;
    case 'Layers':
      return <Layers size={18} />;
    case 'BookOpen':
      return <BookOpen size={18} />;
    case 'Cpu':
      return <Cpu size={18} />;
    case 'Activity':
      return <Activity size={18} />;
    case 'Globe':
      return <Globe size={18} />;
    case 'BarChart3':
      return <BarChart3 size={18} />;
    case 'Sparkles':
      return <Sparkles size={18} />;
    default:
      return <Search size={18} />;
  }
};

const AppSidebar: React.FC<AppSidebarProps> = ({ modules }) => {
  const { t } = useTranslation();
  const location = useLocation();

  const section = useMemo<NavSection>(() => {
    const path = location.pathname;
    if (path.startsWith('/app/client-roadmap') || path.startsWith('/app/ai-roadmap') || path.startsWith('/app/module')) {
      return 'estrategia';
    }
    if (path.startsWith('/app/kanban') || path.startsWith('/app/settings') || path.startsWith('/app/completed-tasks')) {
      return 'acciones';
    }
    if (path.startsWith('/app/admin')) {
      return 'admin';
    }
    return 'analitica';
  }, [location.pathname]);

  const baseItemClass =
    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors';

  const linkClassName = ({ isActive }: { isActive: boolean }) =>
    `${baseItemClass} ${
      isActive
        ? 'bg-primary text-white shadow-sm'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
    }`;

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-slate-200/70 bg-slate-50/95 px-4 py-6 dark:border-slate-800 dark:bg-slate-900/95 lg:flex">
      <div className="mb-8 px-2">
        <h1 className="text-xl font-extrabold tracking-tight text-primary">MediaFlow</h1>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">SEO Intelligence</p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
        {section === 'analitica' && (
          <>
            <NavLink to="/app" end className={linkClassName}>
              <LayoutDashboard size={18} />
              <span>{t('nav.dashboard')}</span>
            </NavLink>
            <NavLink to="/app/checklist" className={linkClassName}>
              <ListChecks size={18} />
              <span>Agrupación y Clusterización</span>
            </NavLink>
            <NavLink to="/app/challenge" className={linkClassName}>
              <Zap size={18} />
              <span>{t('nav.breaking_sim')}</span>
            </NavLink>
            <NavLink to="/app/trends-media" className={linkClassName}>
              <Newspaper size={18} />
              <span>Trends Media</span>
            </NavLink>
          </>
        )}

        {section === 'estrategia' && (
          <>
            <NavLink to="/app/client-roadmap" className={linkClassName}>
              <Map size={18} />
              <span>{t('nav.client_roadmap')}</span>
            </NavLink>
            <NavLink to="/app/ai-roadmap" className={linkClassName}>
              <Sparkles size={18} />
              <span>{t('nav.ai_roadmap')}</span>
            </NavLink>
            <div className="my-3 border-t border-slate-200 dark:border-slate-700" />
            {modules.map((mod) => (
              <NavLink key={mod.id} to={`/app/module/${mod.id}`} className={linkClassName}>
                {getIcon(mod.iconName)}
                <span className="truncate">M{mod.id}: {mod.title}</span>
              </NavLink>
            ))}
          </>
        )}

        {section === 'acciones' && (
          <>
            <NavLink to="/app/kanban" className={linkClassName}>
              <KanbanSquare size={18} />
              <span>{t('nav.kanban_board')}</span>
            </NavLink>
            <NavLink to="/app/completed-tasks" className={linkClassName}>
              <ClipboardList size={18} />
              <span>{t('nav.completed_tasks')}</span>
            </NavLink>
            <NavLink to="/app/settings" className={linkClassName}>
              <SettingsIcon size={18} />
              <span>{t('nav.settings')}</span>
            </NavLink>
          </>
        )}

        {section === 'admin' && (
          <NavLink to="/app/admin/ideas" className={linkClassName}>
            <Lightbulb size={18} />
            <span>Mejoras Back/Front</span>
          </NavLink>
        )}
      </nav>
    </aside>
  );
};

export default AppSidebar;
