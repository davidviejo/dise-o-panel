import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { ArrowLeft, Lock } from 'lucide-react';
import { PortalShell } from '../../components/shell/ShellVariants';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const ClientsLogin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.authClientsArea(password);
      if (res.token) {
        navigate('/clientes/dashboard');
      } else {
        setError('Contraseña incorrecta');
      }
    } catch {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PortalShell contentClassName="flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Área de Clientes</h1>
          <p className="mt-2 text-muted">Introduce la contraseña global para acceder.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Contraseña</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="py-3"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="rounded-lg border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="h-12 w-full"
          >
            {loading ? 'Verificando...' : 'Acceder'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            className="text-sm text-muted"
          >
            <ArrowLeft className="h-4 w-4" /> Volver al inicio
          </Button>
        </div>
      </Card>
    </PortalShell>
  );
};

export default ClientsLogin;
