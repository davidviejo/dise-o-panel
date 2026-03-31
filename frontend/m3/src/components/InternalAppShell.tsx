import React from 'react';
import { Client, ClientVertical, ModuleData } from '../types';
import AppSidebar from './AppSidebar';
import AppTopbar from './AppTopbar';
import AppContentCanvas from './AppContentCanvas';

interface InternalAppShellProps {
  children: React.ReactNode;
  modules: ModuleData[];
  clients?: Client[];
  currentClientId?: string;
  onSwitchClient?: (id: string) => void;
  onAddClient?: (name: string, vertical: ClientVertical) => void;
  onDeleteClient?: (id: string) => void;
}

const InternalAppShell: React.FC<InternalAppShellProps> = ({
  children,
  modules,
  clients,
  currentClientId,
  onSwitchClient,
  onAddClient,
  onDeleteClient,
}) => {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <AppSidebar modules={modules} />

      <main className="min-h-screen lg:ml-64">
        <AppTopbar
          clients={clients}
          currentClientId={currentClientId}
          onSwitchClient={onSwitchClient}
          onAddClient={onAddClient}
          onDeleteClient={onDeleteClient}
        />
        <AppContentCanvas>{children}</AppContentCanvas>
      </main>
    </div>
  );
};

export default InternalAppShell;
