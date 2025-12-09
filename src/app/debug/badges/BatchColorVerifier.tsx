"use client";

import { useState } from "react";

export default function BatchColorVerifier() {
  const [report, setReport] = useState<{ total: number; passed: number; failed: number; skipped: number; detailedLog: string[] } | null>(null);

  const runVerification = () => {
    // 1. Find the canvas & WebGL Context
    const canvas = document.querySelector("canvas");
    if (!canvas) return;
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) return;

    const dpr = window.devicePixelRatio || 1;
    const canvasRect = canvas.getBoundingClientRect();

    // 2. Find all badge containers
    const badgeElements = document.querySelectorAll(".test-volume-badge");
    const logs: string[] = [];
    let passed = 0;
    let failed = 0;
    let skipped = 0;

    badgeElements.forEach((el, index) => {
        const expectedHue = parseInt(el.getAttribute("data-expected-hue") || "0");
        const rect = el.getBoundingClientRect();
        
        // Check standard viewport visibility
        if (rect.bottom < 0 || rect.top > window.innerHeight) {
            skipped++;
            logs.push(`#${index + 1}: Skipped (Off-screen)`);
            return;
        }
        
        // Center of the badge
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        // Convert to WebGL coordinates
        const glX = (cx - canvasRect.left) * dpr;
        const glY = (canvasRect.height - (cy - canvasRect.top)) * dpr;

        // Read Pixel
        const pixels = new Uint8Array(4);
        if (gl instanceof WebGL2RenderingContext || gl instanceof WebGLRenderingContext) {
            gl.readPixels(Math.round(glX), Math.round(glY), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        }
        
        // Convert to HSL
        const r = pixels[0] / 255;
        const g = pixels[1] / 255;
        const b = pixels[2] / 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0, s = 0, l = (max + min) / 2;

        if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            // Fix: the above switch logic was slightly mixed in my previous mental model, let's stick to standard formula but be careful with var names
            // Correcting standard formula in-place:
             switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        h = Math.round(h * 360);
        l = Math.round(l * 100);

        // Check Diff
        let diff = Math.abs(h - expectedHue);
        if (diff > 180) diff = 360 - diff;
        
        // Check Validity
        const isMatch = diff <= 25; // Slightly looser tolerance for small badges
        const isVisible = l > 10;   // Must not be black

        if (isMatch && isVisible) {
            passed++;
        } else {
            failed++;
            logs.push(`#${index + 1}: Expected ${expectedHue}, Got ${h} (Diff ${diff}), L=${l}% [FAIL]`);
        }
    });

    setReport({
        total: badgeElements.length,
        passed,
        failed,
        skipped,
        detailedLog: logs
    });
  };

  return (
    <div className="mt-8 p-6 bg-slate-800 text-white rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">🤖 Batch Auto-Verifier</h3>
        <button 
            onClick={runVerification}
            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition"
        >
            Scan Visible Badges
        </button>
      </div>

      {report && (
         <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4 text-center">
                <div className="p-4 bg-slate-700 rounded-lg">
                    <div className="text-2xl font-bold">{report.total}</div>
                    <div className="text-xs text-slate-400">Total Found</div>
                </div>
                <div className="p-4 bg-gray-700 rounded-lg border border-gray-600">
                    <div className="text-2xl font-bold">{report.skipped}</div>
                    <div className="text-xs text-gray-400">Skipped (Off-screen)</div>
                </div>
                <div className="p-4 bg-green-900/50 text-green-400 rounded-lg border border-green-800">
                    <div className="text-2xl font-bold">{report.passed}</div>
                    <div className="text-xs">Passed</div>
                </div>
                <div className={`p-4 rounded-lg border ${report.failed > 0 ? "bg-red-900/50 text-red-400 border-red-800" : "bg-slate-700 border-slate-600"}`}>
                    <div className="text-2xl font-bold">{report.failed}</div>
                    <div className="text-xs">Failed</div>
                </div>
            </div>

            {report.failed > 0 && (
                <div className="p-4 bg-red-950/30 border border-red-900/50 rounded-lg max-h-40 overflow-y-auto text-xs font-mono">
                    {report.detailedLog.filter(l => l.includes("[FAIL]")).map((log, i) => (
                        <div key={i} className="text-red-300">{log}</div>
                    ))}
                </div>
            )}
            
            {report.passed > 0 && report.failed === 0 && (
                <div className="p-2 bg-green-900/20 text-green-400 text-center text-sm font-bold rounded">
                     ✨ ALL VISIBLE BADGES VERIFIED PERFECTLY! ✨
                </div>
            )}
         </div>
      )}
    </div>
  );
}
