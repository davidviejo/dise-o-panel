import React, { useState, useMemo } from 'react';
import { X, Check } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { useToast } from './ui/ToastContext';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface BulkActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ACTION_TYPES = [
  'Clúster',
  'Geolocalización',
  'Datos Estructurados',
  'Contenidos',
  'Snippets',
  'Imagenes',
  'Enlazado Interno',
  'Estructura',
  'UX',
  'WPO',
  'Enlace',
  'Oportunidades VS kw Objetivo',
  'Semántica',
  'GEO Imagenes',
  'LLamada a la accion / Estética / CRO',
];

const BulkActionsModal: React.FC<BulkActionsModalProps> = ({ isOpen, onClose }) => {
  const { modules, addTasksBulk } = useProject();
  const { success: showSuccess, error: showError } = useToast();

  const [selectedActions, setSelectedActions] = useState<Set<string>>(new Set());
  const [urls, setUrls] = useState('');

  // Find the first module with isCustom: true, or default to the last one if none found
  const defaultModuleId = useMemo(
    () => modules.find((m) => m.isCustom)?.id || modules[modules.length - 1]?.id || 0,
    [modules],
  );

  const [targetModuleId, setTargetModuleId] = useState<number>(defaultModuleId);

  const effectiveTargetModuleId = isOpen ? defaultModuleId : targetModuleId;

  const urlList = useMemo(
    () =>
      urls
        .split('\n')
        .map((u) => u.trim())
        .filter((u) => u.length > 0),
    [urls],
  );

  if (!isOpen) return null;

  const handleToggleAction = (action: string) => {
    const newSet = new Set(selectedActions);
    if (newSet.has(action)) {
      newSet.delete(action);
    } else {
      newSet.add(action);
    }
    setSelectedActions(newSet);
  };

  const handleSelectAll = () => {
    if (selectedActions.size === ACTION_TYPES.length) {
      setSelectedActions(new Set());
    } else {
      setSelectedActions(new Set(ACTION_TYPES));
    }
  };

  const handleCreate = () => {
    if (urlList.length === 0) {
      showError('Por favor, introduce al menos una URL.');
      return;
    }

    if (selectedActions.size === 0) {
      showError('Por favor, selecciona al menos una acción.');
      return;
    }

    const tasksToCreate: any[] = [];

    urlList.forEach((url) => {
      selectedActions.forEach((action) => {
        tasksToCreate.push({
          moduleId: effectiveTargetModuleId,
          title: `${action} - ${url}`,
          description: `Acción masiva: ${action} para la URL ${url}`,
          impact: 'Medium',
          category: 'Bulk Action',
          status: 'pending',
          isInRoadmap: true,
        });
      });
    });

    addTasksBulk(tasksToCreate);
    showSuccess(`${tasksToCreate.length} tareas creadas correctamente.`);

    // Reset and close
    setUrls('');
    setSelectedActions(new Set());
    onClose();
  };

  return (
    <div className="overlay-backdrop animate-in fade-in duration-200" onClick={onClose}>
      <Card className="w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 p-0" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-center border-b border-border bg-surface-container-low p-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">Acciones Masivas</h2>
            <p className="text-sm text-muted">
              Crea múltiples tareas para varias URLs.
            </p>
          </div>
          <Button onClick={onClose} variant="ghost" size="sm" className="rounded-full"><X size={20} className="text-muted" /></Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Module Selector */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Módulo Destino
            </label>
            <select
              value={effectiveTargetModuleId}
              onChange={(e) => setTargetModuleId(Number(e.target.value))}
              className="form-control"
            >
              {modules.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.id}. {m.title}
                </option>
              ))}
            </select>
          </div>

          {/* URLs Input */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              URLs (una por línea)
            </label>
            <textarea
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              placeholder="https://ejemplo.com/pagina1&#10;https://ejemplo.com/pagina2"
              className="form-textarea h-32 resize-none"
            />
            <p className="text-xs text-muted mt-1">
              Se crearán tareas para cada combinación de URL y Acción seleccionada.
            </p>
          </div>

          {/* Actions Selection */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-foreground">
                Seleccionar Acciones
              </label>
              <Button
                onClick={handleSelectAll}
                variant="ghost"
                size="sm"
                className="text-xs font-semibold text-primary"
              >
                {selectedActions.size === ACTION_TYPES.length
                  ? 'Deseleccionar todo'
                  : 'Seleccionar todo'}
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {ACTION_TYPES.map((action) => (
                <button
                  key={action}
                  onClick={() => handleToggleAction(action)}
                  className={`flex items-center gap-2 p-3 rounded-lg border text-left text-sm transition-all ${
                    selectedActions.has(action)
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'border-border bg-surface-container-low text-foreground hover:border-primary/40'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      selectedActions.has(action)
                        ? 'bg-primary border-primary'
                        : 'border-border bg-surface-container-lowest'
                    }`}
                  >
                    {selectedActions.has(action) && <Check size={10} className="text-white" />}
                  </div>
                  <span className="truncate">{action}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-border bg-surface-container-low p-6">
          <Button onClick={onClose} variant="secondary">Cancelar</Button>
          <Button
            onClick={handleCreate}
            disabled={urlList.length === 0 || selectedActions.size === 0}
            className="px-6"
          >
            <Check size={18} />
            Crear{' '}
            {urlList.length * selectedActions.size > 0
              ? urlList.length * selectedActions.size
              : ''}{' '}
            Tareas
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default BulkActionsModal;
