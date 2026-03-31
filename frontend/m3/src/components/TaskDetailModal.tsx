import React, { useState, useMemo } from 'react';
import { Task } from '../types';
import { X, Save, FileText, CheckCircle2, Circle, Calendar } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  moduleId: number | null;
  onUpdateTaskDetails: (moduleId: number, taskId: string, updates: Partial<Task>) => void;
  onToggleTask: (moduleId: number, taskId: string) => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  isOpen,
  onClose,
  task,
  moduleId,
  onUpdateTaskDetails,
  onToggleTask,
}) => {
  const taskDraft = useMemo(() => ({
    notes: task?.userNotes || '',
    impact: task?.impact || 'Medium',
    title: task?.title || '',
    description: task?.description || '',
    dueDate: task?.dueDate || '',
  }), [task]);

  const [notes, setNotes] = useState(taskDraft.notes);
  const [impact, setImpact] = useState<'High' | 'Medium' | 'Low'>(taskDraft.impact);
  const [title, setTitle] = useState(taskDraft.title);
  const [description, setDescription] = useState(taskDraft.description);
  const [dueDate, setDueDate] = useState(taskDraft.dueDate);

  if (!isOpen || !task || moduleId === null) return null;

  const handleSave = () => {
    onUpdateTaskDetails(moduleId, task.id, {
      userNotes: notes,
      impact: impact,
      title: title,
      description: description,
      dueDate: dueDate,
    });
    onClose();
  };

  return (
    <div className="overlay-backdrop animate-in fade-in duration-200" onClick={onClose}>
      <Card className="w-full max-w-2xl flex max-h-[90vh] flex-col overflow-hidden animate-in zoom-in-95 duration-200 p-0" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-border bg-surface-container-low px-6 py-5">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold text-foreground">
              <FileText size={20} className="text-primary" />
              Detalles de la Tarea
            </h2>
            <p className="mt-1 text-sm text-muted">Módulo {moduleId}</p>
          </div>
          <Button onClick={onClose} variant="ghost" size="sm" className="rounded-full"><X size={20} className="text-muted" /></Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <label className="mb-2 block text-sm font-bold text-foreground">
              Título
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="font-medium"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold text-foreground">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea h-24 resize-y"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="mb-2 block text-sm font-bold text-foreground">
                Impacto
              </label>
              <select
                value={impact}
                onChange={(e) => setImpact(e.target.value as 'High' | 'Medium' | 'Low')}
                className="form-control"
              >
                <option value="High">🔥 Alto Impacto</option>
                <option value="Medium">⚡ Impacto Medio</option>
                <option value="Low">☕ Bajo Impacto</option>
              </select>
            </div>

            <div>
              <label className="mb-2 flex items-center gap-1 text-sm font-bold text-foreground">
                <Calendar size={16} />
                Fecha o Mes
              </label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="cursor-pointer font-medium"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-foreground">
                Estado
              </label>
              <button
                onClick={() => onToggleTask(moduleId, task.id)}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-colors font-medium border ${
                  task.status === 'completed'
                    ? 'bg-success-soft border-success/30 text-success'
                    : 'bg-surface-container-low border-border text-foreground'
                }`}
              >
                {task.status === 'completed' ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                {task.status === 'completed' ? 'Completada' : 'Pendiente'}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-foreground">
              Mis Notas
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Añade notas, enlaces o contexto adicional aquí..."
              className="form-textarea h-32 resize-y"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-border bg-surface-container-low px-6 py-5">
          <Button onClick={onClose} variant="secondary">Cancelar</Button>
          <Button onClick={handleSave} className="px-6">
            <Save size={18} />
            Guardar Cambios
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default TaskDetailModal;
