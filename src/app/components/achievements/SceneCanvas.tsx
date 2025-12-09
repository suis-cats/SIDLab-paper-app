"use client";

import { Canvas } from "@react-three/fiber";
import { View, Preload, Environment } from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useState } from "react";

export default function SceneCanvas() {
  const [eventSource, setEventSource] = useState<HTMLElement | undefined>(undefined);

  useEffect(() => {
    const element = document.getElementById('main-content');
    if (element) {
      setEventSource(element);
    }
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 50 }}>
      <Canvas
        className="w-full h-full"
        eventSource={eventSource}
        gl={{ 
            alpha: true, 
            antialias: true, 
            toneMapping: THREE.ACESFilmicToneMapping, 
            outputColorSpace: THREE.SRGBColorSpace,
            preserveDrawingBuffer: true // Required for color picking/screenshots
        }}
        dpr={[1, 2]} // Optimize DPR
        shadows
      >
        <View.Port />
        {/* Global Lighting System - Ensures everything is always lit */}
        <Environment preset="warehouse" />
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={2} />
        <Preload all />
      </Canvas>
    </div>
  );
}
