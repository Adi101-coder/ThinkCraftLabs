import { useEffect, useState } from 'react';

interface STLViewerProps {
  modelUrl: string;
  showGrid?: boolean;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

export default function STLViewer({ modelUrl }: STLViewerProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load model-viewer script
    if (!document.querySelector('script[src*="model-viewer"]')) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js';
      document.head.appendChild(script);
    }

    // Listen for model load event
    const handleLoad = () => setIsLoaded(true);
    const modelViewer = document.querySelector('model-viewer');
    if (modelViewer) {
      modelViewer.addEventListener('load', handleLoad);
      return () => modelViewer.removeEventListener('load', handleLoad);
    }
  }, []);

  // Use the optimized GLB file
  const glbUrl = modelUrl.replace('Hogwarts_Castle.stl', 'Hogwarts_Castle_optimized.glb');

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-xl overflow-hidden">
      <model-viewer
        src={glbUrl}
        alt="Hogwarts Castle 3D Model"
        auto-rotate
        camera-controls
        shadow-intensity="1"
        exposure="1"
        camera-orbit="0deg 75deg 105%"
        field-of-view="45deg"
        min-camera-orbit="auto auto auto"
        max-camera-orbit="auto auto auto"
        min-field-of-view="10deg"
        max-field-of-view="90deg"
        interaction-prompt="auto"
        style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to bottom right, #0f172a, #1e293b)',
        }}
      >
        <div slot="progress-bar" style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          display: isLoaded ? 'none' : 'block',
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid rgba(255, 106, 0, 0.3)',
            borderTop: '4px solid #ff6a00',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px',
          }}></div>
          <p style={{ color: 'white', fontSize: '14px' }}>Loading 3D Model...</p>
        </div>
      </model-viewer>

      {/* Controls Info */}
      <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg px-4 py-2 text-sm text-white shadow-lg border border-white/10 z-20">
        <p className="font-semibold mb-1 text-[#ff6a00]">Controls:</p>
        <p className="text-xs">🖱️ Drag to rotate • Scroll to zoom • Two fingers to pan</p>
      </div>

      {/* Model Info */}
      <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg px-4 py-2 text-sm text-white shadow-lg border border-white/10 z-20">
        <p className="font-semibold text-[#ff6a00]">🏰 Hogwarts Castle</p>
        <p className="text-xs text-gray-300 mt-1">Interactive 3D Model</p>
      </div>

      {/* Live Indicator - Only show when loaded */}
      {isLoaded && (
        <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg px-4 py-2 text-sm text-white shadow-lg border border-white/10 z-20">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs">3D View Active</span>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
