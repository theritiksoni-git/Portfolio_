import React, { useEffect, useState } from 'react';

const WebGLFallback = ({ children }) => {
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setHasWebGL(Boolean(gl && gl instanceof WebGLRenderingContext));
    } catch (e) {
      setHasWebGL(false);
    }
  }, []);

  if (!hasWebGL) {
    return (
      <div className="relative min-h-screen bg-zinc-950 text-white overflow-hidden">
        {/* 2D Cinematic Fallback Ambient Glows */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-900/20 rounded-full blur-[140px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-900/20 rounded-full blur-[140px]" />
        </div>
        <div className="relative z-10">{children}</div>
      </div>
    );
  }

  return children;
};

export default WebGLFallback;
