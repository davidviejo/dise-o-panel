import React, { useEffect, useState } from 'react';
import { AlertTriangle, DollarSign, Check } from 'lucide-react';
import { SeoChecklistSettings, Capabilities } from '../../types/seoChecklist';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedCount: number;
  settings: SeoChecklistSettings;
  capabilities: Capabilities | null;
  analysisMode: 'basic' | 'advanced';
}

const COST_PER_PROVIDER_FALLBACK: Record<string, number> = {
  serpapi: 0.01,
  dataforseo: 0.002,
  internal: 0,
};

export const BatchAnalysisConfirmationModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
  selectedCount,
  settings,
  capabilities,
  analysisMode,
}) => {
  const [confirmed, setConfirmed] = useState(false);
  const { serp, budgets } = settings;
  const isAdvancedMode = analysisMode === 'advanced';

  useEffect(() => {
    const resetTimer = window.setTimeout(() => {
      setConfirmed(false);
    }, 0);

    return () => window.clearTimeout(resetTimer);
  }, [isOpen]);

  if (!isOpen) return null;
  const estimatedKeywords = selectedCount * serp.maxKeywordsPerUrl;

  let costPerKeyword = 0;
  let providerAvailable = true;

  if (isAdvancedMode) {
    if (capabilities) {
      if (!capabilities.serpProviders[serp.provider]) {
        providerAvailable = false;
      }

      if (capabilities.costModel[serp.provider]) {
        costPerKeyword = capabilities.costModel[serp.provider].estimatedCostPerQuery;
      } else {
        costPerKeyword = COST_PER_PROVIDER_FALLBACK[serp.provider] || 0;
      }
    } else {
      costPerKeyword = COST_PER_PROVIDER_FALLBACK[serp.provider] || 0;
    }
  }

  const estimatedCost = estimatedKeywords * costPerKeyword;
  const isOverBudget = isAdvancedMode && estimatedCost > budgets.maxEstimatedCostPerBatch;
  const isOverDaily = isAdvancedMode && estimatedCost > budgets.dailyBudget;
  const needsConfirmation = isAdvancedMode && providerAvailable && !isOverBudget && !isOverDaily;
  const isConfirmDisabled =
    (needsConfirmation && !confirmed) || isOverBudget || isOverDaily || (isAdvancedMode && !providerAvailable);

  return (
    <div className="overlay-backdrop" onClick={onClose}>
      <Card className="w-full max-w-md flex flex-col p-0" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-border bg-surface-container-low">
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <DollarSign className="text-success" />
            Confirmar Análisis en Lote
          </h3>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-2 text-sm text-muted">
            <div className="flex justify-between">
              <span>URLs seleccionadas:</span>
              <span className="font-medium">{selectedCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Keywords estimadas:</span>
              <span className="font-medium">{estimatedKeywords}</span>
            </div>
            {!isAdvancedMode ? (
              <div className="pt-2 border-t border-border text-success font-medium">
                Análisis básico sin coste SERP
              </div>
            ) : (
              <div className="flex justify-between text-base font-semibold pt-2 border-t border-border">
                <span>Coste Estimado:</span>
                <span
                  className={
                    estimatedCost > budgets.maxEstimatedCostPerBatch
                      ? 'text-red-500'
                      : 'text-emerald-500'
                  }
                >
                  €{estimatedCost.toFixed(3)}
                </span>
              </div>
            )}
          </div>

          {isAdvancedMode && !providerAvailable && (
            <div className="p-4 bg-danger-soft text-danger rounded-xl text-sm flex items-start gap-3 border border-danger/20">
              <AlertTriangle size={18} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Proveedor No Disponible</p>
                <p>
                  El proveedor seleccionado ({serp.provider}) no está disponible en este momento.
                </p>
              </div>
            </div>
          )}

          {isAdvancedMode && providerAvailable && (isOverBudget || isOverDaily) && (
            <div className="p-4 bg-danger-soft text-danger rounded-xl text-sm flex items-start gap-3 border border-danger/20">
              <AlertTriangle size={18} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Presupuesto Excedido</p>
                <p>
                  {isOverBudget
                    ? `El coste estimado supera el límite por lote (€${budgets.maxEstimatedCostPerBatch}).`
                    : `El coste estimado supera el presupuesto diario (€${budgets.dailyBudget}).`}
                </p>
                <p className="mt-2 text-xs opacity-80">
                  Por favor, reduce el número de URLs o ajusta los límites en Configuración.
                </p>
              </div>
            </div>
          )}

          {needsConfirmation && (
            <label className="flex items-start gap-3 p-4 bg-surface-container-low rounded-xl cursor-pointer border border-border">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-1 text-success focus:ring-success"
              />
              <span className="text-sm text-foreground">
                Confirmo ejecutar el análisis con un coste estimado de{' '}
                <strong>€{estimatedCost.toFixed(3)}</strong>.
              </span>
            </label>
          )}
        </div>

        <div className="p-6 border-t border-border bg-surface-container-low rounded-b-2xl">
          {needsConfirmation && !confirmed && (
            <p className="mb-3 text-xs text-warning text-right">
              Marca la confirmación para continuar
            </p>
          )}
          <div className="flex justify-end gap-3">
            <Button onClick={onClose} variant="secondary">Cancelar</Button>
            <Button
              onClick={onConfirm}
              disabled={isConfirmDisabled}
              className="bg-success text-on-primary hover:bg-success/90"
            >
              <Check size={18} />
              Ejecutar
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
