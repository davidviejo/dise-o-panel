import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Bell, Search, Settings } from 'lucide-react';
import ClientSwitcher from './ClientSwitcher';
import { Client, ClientVertical } from '../types';

interface AppTopbarProps {
  clients?: Client[];
  currentClientId?: string;
  onSwitchClient?: (id: string) => void;
  onAddClient?: (name: string, vertical: ClientVertical) => void;
  onDeleteClient?: (id: string) => void;
}

const AppTopbar: React.FC<AppTopbarProps> = ({
  clients,
  currentClientId,
  onSwitchClient,
  onAddClient,
  onDeleteClient,
}) => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-30 flex w-full items-center justify-between border-b border-slate-200/80 bg-slate-50/90 px-6 py-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/85">
      <div className="flex flex-1 items-center gap-6">
        <div className="relative w-full max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar tareas, módulos o reportes..."
            className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800"
          />
        </div>

        <nav className="hidden items-center gap-5 lg:flex">
          <NavLink to="/app" end className="text-sm text-slate-500 hover:text-primary">
            Dashboard
          </NavLink>
          <NavLink to="/app/client-roadmap" className="text-sm text-slate-500 hover:text-primary">
            Roadmap
          </NavLink>
          <NavLink to="/app/kanban" className="text-sm text-slate-500 hover:text-primary">
            Kanban
          </NavLink>
        </nav>
      </div>

      <div className="ml-4 flex items-center gap-3">
        {clients && currentClientId && onSwitchClient && onAddClient && onDeleteClient && (
          <div className="hidden w-64 lg:block">
            <ClientSwitcher
              clients={clients}
              currentClientId={currentClientId}
              onSwitchClient={onSwitchClient}
              onAddClient={onAddClient}
              onDeleteClient={onDeleteClient}
            />
          </div>
        )}

        <button className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-primary">
          <Bell size={20} />
        </button>

        <Link
          to="/app/settings"
          className={`rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-primary ${location.pathname.startsWith('/app/settings') ? 'text-primary' : ''}`}
        >
          <Settings size={20} />
        </Link>
      </div>
    </header>
  );
};

export default AppTopbar;
