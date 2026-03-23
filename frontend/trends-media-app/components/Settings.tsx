import React, { useState } from 'react';
import { Save, Key, Search, Database } from 'lucide-react';
import { getSettings, saveSettings } from '../services/storage';
import { AppSettings } from '../types';

interface SettingsProps {
  onSettingsChanged: (settings: AppSettings) => void;
}

export const Settings: React.FC<SettingsProps> = ({ onSettingsChanged }) => {
  const [settings, setSettings] = useState<AppSettings>(getSettings());
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    saveSettings(settings);
    onSettingsChanged(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleQueryChange = (text: string) => {
    setSettings({ ...settings, searchQueries: text.split('\n').filter(s => s.trim() !== '') });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
          <Key className="w-5 h-5 mr-2 text-blue-600" />
          Credenciales API
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
                Google Gemini API Key <span className="text-slate-400 font-normal">(Opcional)</span>
            </label>
            <input 
              type="password"
              className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Dejar vacío para usar variable de entorno (process.env.API_KEY)"
              value={settings.geminiApiKey}
              onChange={(e) => setSettings({...settings, geminiApiKey: e.target.value})}
            />
            <p className="text-xs text-slate-500 mt-1">
                Si no se especifica, el sistema utilizará la clave interna preconfigurada.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">SerpApi Key (Scraping Real)</label>
            <input 
              type="password"
              className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter SerpApi Key..."
              value={settings.serpApiKey}
              onChange={(e) => setSettings({...settings, serpApiKey: e.target.value})}
            />
            <p className="text-xs text-slate-500 mt-1">
              Necesaria para obtener resultados reales de Google. Regístrate en <a href="https://serpapi.com" target="_blank" className="text-blue-600 underline">serpapi.com</a> (Free tier disponible).
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
          <Search className="w-5 h-5 mr-2 text-emerald-600" />
          Configuración de Búsqueda (SERPs)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Queries Automatizadas</label>
            <textarea 
              className="w-full border border-slate-300 rounded-lg p-3 text-sm font-mono h-48 focus:ring-2 focus:ring-emerald-500 outline-none"
              value={settings.searchQueries.join('\n')}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Una query por línea..."
            />
            <p className="text-xs text-slate-500 mt-1">El sistema ejecutará estas búsquedas cada día.</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
             <h4 className="font-semibold text-slate-700 mb-2 text-sm">Fuentes Objetivo (Prioridad)</h4>
             <p className="text-sm text-slate-600 mb-2">El sistema priorizará noticias que provengan de:</p>
             <div className="flex flex-wrap gap-2">
               {settings.targetSources.map((s, i) => (
                 <span key={i} className="bg-white px-2 py-1 rounded border border-slate-200 text-xs font-medium text-slate-600">
                   {s}
                 </span>
               ))}
             </div>
             <p className="text-xs text-slate-400 mt-4 italic">Esta lista se usa en el prompt de sistema para dar contexto a la IA.</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={handleSave}
          className={`px-6 py-3 rounded-lg text-white font-semibold flex items-center space-x-2 transition-all ${saved ? 'bg-green-600' : 'bg-slate-900 hover:bg-slate-800'}`}
        >
          {saved ? <Database className="w-5 h-5" /> : <Save className="w-5 h-5" />}
          <span>{saved ? 'Guardado Correctamente' : 'Guardar Configuración'}</span>
        </button>
      </div>
    </div>
  );
};