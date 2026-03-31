import React from 'react';

interface AppContentCanvasProps {
  children: React.ReactNode;
}

const AppContentCanvas: React.FC<AppContentCanvasProps> = ({ children }) => {
  return <div className="mx-auto w-full max-w-7xl p-6 lg:p-10">{children}</div>;
};

export default AppContentCanvas;
