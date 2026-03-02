export const resolveApiUrl = (): string => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  if (typeof window !== 'undefined' && window.location.hostname === '192.168.1.133') {
    return 'http://192.168.1.133:5000';
  }

  return 'http://127.0.0.1:5000';
};

export const resolveEngineUrl = (): string => {
  if (import.meta.env.VITE_PYTHON_ENGINE_URL) {
    return import.meta.env.VITE_PYTHON_ENGINE_URL;
  }

  return resolveApiUrl();
};
