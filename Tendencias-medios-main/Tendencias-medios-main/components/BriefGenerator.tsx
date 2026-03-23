import React from 'react';
import { Play, Loader2, FileText, ExternalLink, Send, AlertCircle, Settings, RefreshCw, BarChart2 } from 'lucide-react';
import { NewsCluster, NewsPriority, ClusterCategory } from '../types';
import { PipelineStatus } from '../App';
import { getSettings } from '../services/storage';

interface BriefGeneratorProps {
  items: NewsCluster[];
  pipelineStatus: PipelineStatus;
  statusMessage: string;
  onRunPipeline: () => void;
  onNavigateToSettings: () => void;
}

const PriorityBadge: React.FC<{ priority: NewsPriority }> = ({ priority }) => {
  const colors = {
    [NewsPriority.P1]: 'bg-red-100 text-red-700 border-red-200',
    [NewsPriority.P2]: 'bg-amber-100 text-amber-700 border-amber-200',
    [NewsPriority.P3]: 'bg-blue-100 text-blue-700 border-blue-200',
    [NewsPriority.DISCARD]: 'bg-slate-100 text-slate-500 border-slate-200',
  };
  return (
    <span className={`px-2 py-1 rounded-md text-xs font-bold border ${colors[priority] || colors[NewsPriority.DISCARD]}`}>
      {priority}
    </span>
  );
};

const ClusterBadge: React.FC<{ category: ClusterCategory }> = ({ category }) => (
  <span className="px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
    {category}
  </span>
);

export const BriefGenerator: React.FC<BriefGeneratorProps> = ({ 
    items, 
    pipelineStatus, 
    statusMessage, 
    onRunPipeline, 
    onNavigateToSettings 
}) => {
  const settings = getSettings();
  
  const handleSendToEditorial = () => {
    alert("Brief enviado a Slack (#redaccion-valencia) y Notion DB.");
  };

  // 1. Loading State
  if (pipelineStatus === 'fetching' || pipelineStatus === 'analyzing') {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-6 animate-fade-in">
            <div className="relative">
                <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
                <div className="relative bg-white p-4 rounded-full shadow-md">
                     <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
            </div>
            <div className="text-center">
                <h3 className="text-xl font-bold text-slate-800">
                    {pipelineStatus === 'fetching' ? 'Recopilando y Procesando...' : 'Analizando con IA...'}
                </h3>
                <p className="text-slate-500 mt-2 text-sm animate-pulse">
                    {statusMessage}
                </p>
            </div>
        </div>
    );
  }

  // 2. Empty State
  if (pipelineStatus === 'idle' && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6 animate-fade-in">
        <div className="bg-slate-50 p-6 rounded-full border border-slate-100">
          <RefreshCw className="w-12 h-12 text-slate-400" />
        </div>
        <div className="max-w-md">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Generador de Briefs</h2>
          <p className="text-slate-500 mb-6">
            Pipeline listo. Inicia el análisis para buscar noticias en tiempo real, agruparlas por clusters y puntuarlas.
          </p>
          <button
            onClick={onRunPipeline}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-all flex items-center justify-center space-x-2 w-full"
          >
            <Play className="w-5 h-5" />
            <span>Iniciar Pipeline</span>
          </button>
          
          {!settings.serpApiKey && (
             <div onClick={onNavigateToSettings} className="mt-4 text-xs text-red-500 bg-red-50 p-2 rounded cursor-pointer hover:bg-red-100 flex items-center justify-center">
                <Settings className="w-3 h-3 mr-1" />
                Falta SerpApi Key. (Usando Mocks)
             </div>
          )}
        </div>
      </div>
    );
  }

  const p1Items = items.filter(i => i.ai_analysis?.priority === NewsPriority.P1);
  const p2Items = items.filter(i => i.ai_analysis?.priority === NewsPriority.P2);
  const discardItems = items.filter(i => i.ai_analysis?.priority === NewsPriority.DISCARD || i.ai_analysis?.priority === NewsPriority.P3);
  const validItems = [...p1Items, ...p2Items];

  return (
    <div className="animate-fade-in space-y-6 pb-20">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 sticky top-0 z-10 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Brief Generado
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {items.length} clusters • {p1Items.length} prioritarios • {new Date().toLocaleTimeString()}
          </p>
        </div>
        <div className="flex space-x-3">
            <button
                onClick={handleSendToEditorial}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 shadow-sm transition-colors"
            >
                <Send className="w-4 h-4" />
                <span>Enviar a Redacción</span>
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center space-x-2 mb-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600">
                Temas Prioritarios
            </h3>
          </div>
          
          {validItems.map((item) => (
            <div key={item.cluster_id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
               
               <div className="flex justify-between items-start mb-3">
                 <div className="flex space-x-2">
                   <PriorityBadge priority={item.ai_analysis?.priority as NewsPriority} />
                   <ClusterBadge category={item.ai_analysis?.category as ClusterCategory} />
                 </div>
                 {/* Technical Score Badge */}
                 <div className="flex items-center space-x-1 bg-slate-50 px-2 py-1 rounded text-xs text-slate-500 border border-slate-100" title="Technical Score">
                    <BarChart2 className="w-3 h-3" />
                    <span className="font-mono font-bold">{item.score}</span>
                 </div>
               </div>
               
               <h3 className="text-xl font-bold text-slate-800 mb-2 leading-tight group-hover:text-blue-700 transition-colors">
                 {item.ai_analysis?.suggestedTitle}
               </h3>
               
               <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                 {item.ai_analysis?.summary}
               </p>
               
               <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4">
                 <p className="text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">Interés para Economía 3</p>
                 <p className="text-xs text-slate-700 italic">"{item.ai_analysis?.reasoning}"</p>
               </div>

               <div className="flex justify-between items-center text-xs text-slate-400 border-t border-slate-50 pt-3 mt-3">
                 <div className="flex items-center space-x-4">
                     <span>Fuente Principal: <span className="font-medium text-slate-600">{item.top_source}</span></span>
                     {item.coverage_count > 1 && (
                         <span className="text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded">
                             +{item.coverage_count - 1} fuentes extra
                         </span>
                     )}
                 </div>
                 <a href={item.articles[0].url} target="_blank" rel="noreferrer" className="flex items-center hover:text-blue-600">
                     Leer Original <ExternalLink className="w-3 h-3 ml-1" />
                 </a>
               </div>
            </div>
          ))}
          
          {validItems.length === 0 && (
             <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                <p className="text-slate-400 italic">No se encontraron noticias de alta prioridad en esta ejecución.</p>
             </div>
          )}
        </div>

        {/* Sidebar - Discarded */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 ml-1">
            Descartados / Baja Prioridad
          </h3>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm max-h-[80vh] overflow-y-auto custom-scrollbar">
            {discardItems.length === 0 ? (
                <div className="p-6 text-center">
                    <p className="text-sm text-slate-400 italic">No hay items descartados.</p>
                </div>
            ) : (
                <div className="divide-y divide-slate-100">
                    {discardItems.map((item) => (
                    <div key={item.cluster_id} className="p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="text-sm font-medium text-slate-700 line-clamp-2 leading-snug">{item.title}</h4>
                            <div className="ml-2 shrink-0">
                                <PriorityBadge priority={item.ai_analysis?.priority as NewsPriority} />
                            </div>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-xs text-slate-500 font-medium">{item.top_source}</p>
                            <span className="text-xs text-slate-300">Score: {item.score}</span>
                        </div>
                        <p className="text-xs text-red-500 bg-red-50 p-2 rounded border border-red-100 italic">
                            {item.ai_analysis?.reasoning}
                        </p>
                    </div>
                    ))}
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
