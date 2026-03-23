import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardStats } from './components/DashboardStats';
import { BriefGenerator } from './components/BriefGenerator';
import { Settings } from './components/Settings';
import { MOCK_TRENDS } from './constants';
import { DashboardStats as StatsType, AppSettings, NewsCluster, NewsPriority } from './types';
import { getSettings } from './services/storage';
import { fetchSerpResults } from './services/serp';
import { processNews } from './services/newsProcessor';
import { analyzeNewsWithGemini } from './services/gemini';
import { RefreshCw, Play, Settings as SettingsIcon, Loader2 } from 'lucide-react';

export type PipelineStatus = 'idle' | 'fetching' | 'analyzing' | 'done' | 'error';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [settings, setSettings] = useState<AppSettings>(getSettings());
  
  // App-wide state for news clusters
  const [newsClusters, setNewsClusters] = useState<NewsCluster[]>([]);
  const [pipelineStatus, setPipelineStatus] = useState<PipelineStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const [stats, setStats] = useState<StatsType>({
    sourcesScanned: 0,
    itemsFound: 0,
    highPriority: 0,
    duplicatesRemoved: 0, 
  });

  const runPipeline = async () => {
    // Note: SerpApi key check is handled inside fetchSerpResults gracefully now (mocks)
    
    try {
      // 1. Fetching
      setPipelineStatus('fetching');
      setStatusMessage(`Escaneando Google News (${settings.searchQueries.length} queries)...`);
      
      if (currentView === 'dashboard') {
          setCurrentView('brief');
      }

      // Fetch Raw Articles
      const rawArticles = await fetchSerpResults(settings);
      
      // 2. Processing (Dedupe, Cluster, Score)
      setStatusMessage("Procesando: Deduplicando y Calculando Scores...");
      const processedClusters = processNews(rawArticles);

      // 3. Analyzing (Gemini)
      setPipelineStatus('analyzing');
      setStatusMessage(`Analizando ${processedClusters.length} temas con Gemini AI...`);
      
      const analyzedClusters = await analyzeNewsWithGemini(processedClusters, settings.geminiApiKey);
      
      // 4. Done
      setNewsClusters(analyzedClusters);
      setPipelineStatus('done');
      
      // Update Stats
      const p1Count = analyzedClusters.filter(c => c.ai_analysis?.priority === NewsPriority.P1).length;
      setStats(prev => ({
        ...prev,
        sourcesScanned: prev.sourcesScanned + rawArticles.length, 
        itemsFound: analyzedClusters.length,
        highPriority: p1Count,
        duplicatesRemoved: rawArticles.length - processedClusters.length 
      }));

    } catch (error: any) {
      console.error(error);
      setPipelineStatus('error');
      setStatusMessage(error.message || "Error desconocido");
      // Optional: keep old data if error
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar currentView={currentView} onChangeView={setCurrentView} />
      
      <main className="flex-1 overflow-auto flex flex-col">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-20 px-8 py-4 flex justify-between items-center shadow-sm">
            <div>
                <h2 className="text-xl font-bold text-slate-800 capitalize">
                    {currentView === 'dashboard' ? 'Panel de Control' : 
                     currentView === 'brief' ? 'Generador de Contenido' : 
                     currentView === 'settings' ? 'Configuración' :
                     currentView}
                </h2>
                <p className="text-sm text-slate-500">Comunidad Valenciana • Noticias & Eventos</p>
            </div>
            <div className="flex items-center space-x-3">
                <button 
                  onClick={runPipeline}
                  disabled={pipelineStatus === 'fetching' || pipelineStatus === 'analyzing'}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all shadow-sm
                    ${(pipelineStatus === 'fetching' || pipelineStatus === 'analyzing') ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
                  `}
                >
                  {pipelineStatus === 'fetching' || pipelineStatus === 'analyzing' ? (
                     <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                     <RefreshCw className="w-4 h-4" />
                  )}
                  <span>{newsClusters.length > 0 ? 'Actualizar SERPs' : 'Analizar SERPs'}</span>
                </button>

                <button 
                    onClick={() => setCurrentView('settings')}
                    className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                >
                    <SettingsIcon className="w-5 h-5" />
                </button>
            </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto flex-1 w-full">
          {currentView === 'dashboard' && (
            <div className="animate-fade-in space-y-8">
                <DashboardStats stats={stats} trends={MOCK_TRENDS} />
                
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                        <h3 className="text-lg font-semibold text-slate-800">Últimas Noticias Detectadas</h3>
                        {newsClusters.length > 0 && <span className="text-xs font-medium text-slate-500">{newsClusters.length} clusters</span>}
                    </div>
                    
                    {newsClusters.length === 0 ? (
                        <div className="p-12 text-center text-slate-400">
                            <p className="mb-4">No hay datos analizados todavía.</p>
                            <button 
                                onClick={runPipeline}
                                className="text-blue-600 font-medium hover:underline flex items-center justify-center mx-auto"
                            >
                                <Play className="w-4 h-4 mr-1" /> Ejecutar Análisis ahora
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-3 w-24">Prio</th>
                                        <th className="px-6 py-3">Score</th>
                                        <th className="px-6 py-3">Titular Sugerido</th>
                                        <th className="px-6 py-3">Cluster</th>
                                        <th className="px-6 py-3">Fuente Top</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {newsClusters.slice(0, 5).map(item => (
                                        <tr key={item.cluster_id} className="hover:bg-slate-50">
                                            <td className="px-6 py-3">
                                                <span className={`px-2 py-0.5 rounded text-xs font-bold 
                                                    ${item.ai_analysis?.priority === 'P1' ? 'bg-red-100 text-red-700' : 
                                                      item.ai_analysis?.priority === 'P2' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                                                    {item.ai_analysis?.priority}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 font-mono text-xs text-blue-600 font-bold">
                                                {item.score}
                                            </td>
                                            <td className="px-6 py-3 font-medium text-slate-800">{item.ai_analysis?.suggestedTitle}</td>
                                            <td className="px-6 py-3 text-slate-500">{item.ai_analysis?.category}</td>
                                            <td className="px-6 py-3 text-slate-400">{item.top_source}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {newsClusters.length > 5 && (
                                <div className="p-3 text-center border-t border-slate-100">
                                    <button onClick={() => setCurrentView('brief')} className="text-xs font-medium text-blue-600 hover:text-blue-800">
                                        Ver todos ({newsClusters.length}) →
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
          )}

          {currentView === 'brief' && (
            <BriefGenerator 
                items={newsClusters}
                pipelineStatus={pipelineStatus}
                statusMessage={statusMessage}
                onRunPipeline={runPipeline}
                onNavigateToSettings={() => setCurrentView('settings')}
            />
          )}

           {currentView === 'settings' && (
             <Settings onSettingsChanged={setSettings} />
          )}
        </div>
      </main>
    </div>
  );
}
