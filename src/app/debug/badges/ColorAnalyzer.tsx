"use client";

import { useState } from "react";

interface Props {
  targetRef: React.RefObject<HTMLDivElement | null>;
  expectedHue?: number;
}

export default function ColorAnalyzer({ targetRef, expectedHue }: Props) {
  const [result, setResult] = useState<{ color: string; h: number; s: number; l: number; status: "OK" | "WARNING" | "ERROR"; msg: string } | null>(null);

  const analyzeColor = () => {
    if (!targetRef.current) return;

    // 1. Find the global canvas
    const canvas = document.querySelector("canvas");
    if (!canvas) {
      setResult({ color: "#000", h: 0, s: 0, l: 0, status: "ERROR", msg: "Canvas not found" });
      return;
    }

    // 2. Get target position
    const rect = targetRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // 3. Handle High DPI (Retina)
    const dpr = window.devicePixelRatio || 1;
    // Canvas is fixed inset-0, so client coordinates map directly usually, but need to account for canvas internal resolution
    // If canvas width/height match window innerWidth/Height * dpr
    
    // WebGL often draws from bottom-left, but getContext('2d') is top-left. 
    // However, we can't get 2d context from a webgl canvas.
    // We must use WebGL readPixels.
    
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) {
        setResult({ color: "#000", h: 0, s: 0, l: 0, status: "ERROR", msg: "WebGL Context not accessible" });
        return;
    }

    // WebGL coordinates: (0,0) is Bottom-Left. DOM is Top-Left.
    // Also need to scale by DPR.
    const canvasRect = canvas.getBoundingClientRect(); // Should be window size
    const glX = (centerX - canvasRect.left) * dpr;
    const glY = (canvasRect.height - (centerY - canvasRect.top)) * dpr; // Flip Y

    const pixels = new Uint8Array(4);
    // readPixels(x, y, width, height, format, type, pixels)
    if (gl instanceof WebGL2RenderingContext || gl instanceof WebGLRenderingContext) {
        gl.readPixels(Math.round(glX), Math.round(glY), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    }
    
    const [r, g, b, a] = [pixels[0], pixels[1], pixels[2], pixels[3]];

    // Convert to HSL
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;

    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
        case gNorm: h = (bNorm - rNorm) / d + 2; break;
        case bNorm: h = (rNorm - gNorm) / d + 4; break;
      }
      h /= 6;
    }

    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    // Diagnosis Logic
    let status: "OK" | "WARNING" | "ERROR" = "OK";
    let msg = "Color looks healthy.";

    if (l < 10) {
        status = "ERROR";
        msg = "Too Dark! Possible 'Black Sphere' artifact.";
    } else if (l > 95) {
        status = "WARNING";
        msg = "Very Bright. Maybe overexposed?";
    } else if (s < 10 && l > 20 && l < 90) {
        // Only warn for low saturation if it's not black or white
        status = "WARNING";
        msg = "Low Saturation. Appears grey/washed out.";
    } else if (expectedHue !== undefined) {
        // Check Hue Match (Accounting for 360 wrap)
        let diff = Math.abs(h - expectedHue);
        if (diff > 180) diff = 360 - diff;

        if (diff > 20) { // Allow +/- 20 degrees tolerance for lighting shift
            status = "WARNING";
            msg = `Color Mismatch! Expected Hue ~${expectedHue}, got ${h}.`;
        }
    }

    setResult({
        color: `rgb(${r}, ${g}, ${b})`,
        h, s, l,
        status, 
        msg
    });
  };

  return (
    <div className="mt-4 p-4 border rounded-xl bg-gray-50">
      <h3 className="font-bold text-sm mb-2">🔍 Color Validator</h3>
      <button 
        onClick={analyzeColor}
        className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition"
      >
        Analyze Center Pixel
      </button>

      {result && (
        <div className="mt-3 text-xs space-y-2">
          
          {/* Measured */}
          <div>
              <div className="font-bold text-gray-500 mb-1">MEASURED:</div>
              <div className="flex items-center gap-2 mb-1">
                 <div className="w-8 h-8 rounded border border-gray-300 shadow-sm" style={{ backgroundColor: result.color }}></div>
                 <span className="font-mono">{result.color}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 font-mono text-gray-600">
                <span>H: {result.h}°</span>
                <span>S: {result.s}%</span>
                <span>L: {result.l}%</span>
              </div>
          </div>

          {/* Expected Comparison */}
          {expectedHue !== undefined && (
             <div className="border-t pt-2">
                 <div className="font-bold text-gray-500 mb-1">EXPECTED HUE:</div>
                 <div className="flex items-center gap-2">
                    <span className="font-mono text-lg">{expectedHue}°</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${Math.abs(result.h - expectedHue) < 20 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        Diff: {Math.abs(result.h - expectedHue)}°
                    </span>
                 </div>
             </div>
          )}

          <div className={`mt-2 font-bold ${
              result.status === "OK" ? "text-green-600" : 
              result.status === "WARNING" ? "text-yellow-600" : "text-red-600"
          }`}>
              [{result.status}] {result.msg}
          </div>
        </div>
      )}
    </div>
  );
}
