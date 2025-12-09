"use client";

import { useRef } from "react";
import PremiumBadge from "@/app/components/achievements/PremiumBadge";
import SceneCanvas from "@/app/components/achievements/SceneCanvas";
import { ACHIEVEMENTS } from "@/app/components/achievements/constants";
import ColorAnalyzer from "./ColorAnalyzer";
import BatchColorVerifier from "./BatchColorVerifier";
import Link from "next/link";

export default function BadgeDebugPage() {
  // Use the first achievement for testing
  const testAchievement = ACHIEVEMENTS[0]; 
  const compositeRef = useRef<HTMLDivElement>(null); 

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <SceneCanvas />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">🛠️ Badge Debugger</h1>
            <Link href="/" className="text-blue-600 underline">Back to App</Link>
        </div>

        <div className="flex flex-col gap-16">
            
            {/* SECTION 1: COMPONENT BREAKDOWN */}
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                <h2 className="text-2xl font-bold mb-8 border-b pb-4">🔧 Layer Diagnosis</h2>
                <div className="grid grid-cols-4 gap-4 text-center">
                    
                    {/* 1. BODY ONLY */}
                    <div className="flex flex-col items-center">
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-2">
                             <PremiumBadge achievement={testAchievement} size="lg" unlocked={true} debugLayer="body" />
                        </div>
                        <span className="font-mono text-sm font-bold text-slate-500">1. CORE BODY</span>
                        <p className="text-xs text-gray-400">Should be a colored cylinder</p>
                    </div>

                    {/* 2. RIM ONLY */}
                    <div className="flex flex-col items-center">
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-2">
                             <PremiumBadge achievement={testAchievement} size="lg" unlocked={true} debugLayer="rim" />
                        </div>
                        <span className="font-mono text-sm font-bold text-slate-500">2. RIM</span>
                        <p className="text-xs text-gray-400">Should be a ring</p>
                    </div>

                     {/* 3. ICON ONLY */}
                     <div className="flex flex-col items-center">
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-2">
                             <PremiumBadge achievement={testAchievement} size="lg" unlocked={true} debugLayer="icon" />
                        </div>
                        <span className="font-mono text-sm font-bold text-slate-500">3. ICON (HTML)</span>
                        <p className="text-xs text-gray-400">Should be just the icon</p>
                    </div>

                    {/* 4. FULL COMPOSITE */}
                    <div className="flex flex-col items-center">
                        <div ref={compositeRef} className="bg-green-50 border border-green-200 rounded-xl p-4 mb-2 shadow-inner">
                             <PremiumBadge achievement={testAchievement} size="lg" unlocked={true} debugLayer="all" />
                        </div>
                        <span className="font-mono text-sm font-bold text-green-600">4. COMPOSITE</span>
                        <p className="text-xs text-gray-400">Final Result</p>
                        <ColorAnalyzer targetRef={compositeRef} expectedHue={(() => {
                            let hash = 0;
                            for (let i = 0; i < testAchievement.id.length; i++) hash = testAchievement.id.charCodeAt(i) + ((hash << 5) - hash);
                            return Math.abs(hash % 360);
                        })()} />
                    </div>

                </div>
            </div>

            {/* SECTION 2: STATES */}
            <div className="grid grid-cols-2 gap-8">
                <div className="card bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center">
                    <h2 className="text-xl font-bold mb-4">✅ Unlocked</h2>
                    <div className="border border-red-500/20 bg-gray-50 rounded-xl p-4">
                        <PremiumBadge achievement={testAchievement} size="lg" unlocked={true} />
                    </div>
                </div>

                <div className="card bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center">
                    <h2 className="text-xl font-bold mb-4">🔒 Locked</h2>
                    <div className="border border-red-500/20 bg-gray-50 rounded-xl p-4">
                        <PremiumBadge achievement={testAchievement} size="lg" unlocked={false} />
                    </div>
                </div>
            </div>

            {/* SECTION 3: VOLUME TEST (100 Badges) */}
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                <h2 className="text-2xl font-bold mb-8 border-b pb-4">📊 Volume Test (100 Badges)</h2>
                
                <div className="grid grid-cols-6 md:grid-cols-8 gap-4 mb-8">
                    {Array.from({ length: 100 }).map((_, i) => {
                        // Create synthetic ID to test wide rang of colors
                        const testId = `badge-vol-${i}`;
                        // Calculate Expected Hue for this ID
                        let hash = 0;
                        for (let j = 0; j < testId.length; j++) hash = testId.charCodeAt(j) + ((hash << 5) - hash);
                        const expectedHue = Math.abs(hash % 360);

                        return (
                            <div 
                                key={i} 
                                className="flex flex-col items-center test-volume-badge"
                                data-expected-hue={expectedHue}
                            >
                                <PremiumBadge 
                                    achievement={{ ...ACHIEVEMENTS[0], id: testId }}
                                    size="sm" 
                                    unlocked={true} 
                                />
                                <span className="text-[10px] text-gray-400 mt-1">#{i + 1}</span>
                            </div>
                        );
                    })}
                </div>

                <BatchColorVerifier />
            </div>
        </div>
      </div>
    </div>
  );
}
