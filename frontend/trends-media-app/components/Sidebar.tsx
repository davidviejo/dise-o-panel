import React from 'react';
import { Newspaper, LayoutDashboard, Settings, Activity } from 'lucide-react';
import { APP_NAME } from '../constants';

interface SidebarProps {
  currentView: string;
  onChangeView: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'brief', label: 'Generar Brief', icon: <Newspaper className="w-5 h-5" /> },
    { id: 'trends', label: 'Tendencias', icon: <Activity className="w-5 h-5" /> },
    { id: 'settings', label: 'Configuración', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-64 bg-slate-900 h-full text-slate-300 flex flex-col shadow-xl z-20">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">E3</span>
            {APP_NAME}
        </h1>
        <p className="text-xs text-slate-500 mt-2">Editorial Automation v1.0</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === item.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800 rounded-lg p-3 text-xs">
          <p className="font-semibold text-slate-300 mb-1">Estado del Sistema</p>
          <div className="flex items-center space-x-2 text-emerald-400">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span>API Conectada</span>
          </div>
          <div className="mt-2 text-slate-500">
              Última ejecución: Hoy 08:00
          </div>
        </div>
      </div>
    </aside>
  );
};