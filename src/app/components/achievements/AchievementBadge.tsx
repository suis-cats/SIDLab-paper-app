"use client";

import { motion } from "framer-motion";
import { Achievement } from "./types";
import { clsx } from "clsx";
import { useState } from "react";
import { Lock } from "lucide-react";

interface Props {
    achievement: Achievement;
    isUnlocked: boolean;
    size?: "sm" | "md" | "lg";
}

export default function AchievementBadge({ achievement, isUnlocked, size = "md" }: Props) {
    const [isHovered, setIsHovered] = useState(false);

    const sizeClasses = {
        sm: "w-8 h-8 p-1.5",
        md: "w-12 h-12 p-2.5",
        lg: "w-16 h-16 p-3",
    };

    const iconSize = {
        sm: 14,
        md: 20,
        lg: 28,
    };

    return (
        <motion.div
            className="relative group cursor-pointer perspective-1000"
            initial={isUnlocked ? { scale: 0.8, opacity: 0 } : false}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ perspective: "1000px" }}
        >
            <motion.div
                className={clsx(
                    "relative rounded-full flex items-center justify-center transition-all duration-300",
                    sizeClasses[size],
                    isUnlocked 
                        ? `shadow-lg` 
                        : "bg-gray-100 text-gray-300 border border-gray-200"
                )}
                // Continuous subtle 3D sway
                animate={isUnlocked ? {
                    rotateX: [0, 5, 0, -5, 0],
                    rotateY: [0, 5, 0, -5, 0],
                    transition: {
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }
                } : {}}
                whileHover={isUnlocked ? {
                    scale: 1.1,
                    rotateX: 0,
                    rotateY: 180,
                    transition: { duration: 0.4 }
                } : {}}
                style={isUnlocked ? {
                    background: achievement.rarity === "LEGENDARY" 
                        ? "linear-gradient(135deg, #fcd34d 0%, #d97706 50%, #78350f 100%)" // Gold
                        : achievement.rarity === "EPIC"
                        ? "linear-gradient(135deg, #e9d5ff 0%, #a855f7 50%, #581c87 100%)" // Purple
                        : achievement.rarity === "RARE"
                        ? "linear-gradient(135deg, #bfdbfe 0%, #3b82f6 50%, #1e3a8a 100%)" // Blue
                        : "linear-gradient(135deg, #f1f5f9 0%, #94a3b8 50%, #475569 100%)", // Silver/Common,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3), inset 0 2px 4px rgba(255,255,255,0.5)"
                } : {}}
            >
                {/* Sheen effect overlay */}
                {isUnlocked && (
                    <div className="absolute inset-0 rounded-full overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-white/40 to-transparent opacity-50 pointer-events-none" />
                        <div className="absolute -inset-full w-[200%] h-[200%] bg-gradient-to-tr from-transparent via-white/20 to-transparent rotate-45 animate-shine pointer-events-none" />
                    </div>
                )}
                
                {/* Content */}
                <div className="relative z-10 text-white drop-shadow-md">
                    {isUnlocked ? (
                         // For common badges, text might be dark, but let's stick to white for "Fitness" look with colored bg
                        <achievement.icon size={iconSize[size]} strokeWidth={2.5} className={achievement.rarity === "COMMON" ? "text-slate-700" : "text-white"} />
                    ) : (
                        <Lock size={iconSize[size]} />
                    )}
                </div>
            </motion.div>

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                <div className="bg-gray-900/90 backdrop-blur-sm text-white text-xs rounded-lg py-2 px-3 shadow-xl text-center">
                    <p className="font-bold mb-0.5 text-yellow-400">{achievement.title}</p>
                    <p className="text-gray-300 leading-tight">{achievement.description}</p>
                    {!isUnlocked && <p className="mt-1 text-gray-500 font-mono text-[10px]">未解除</p>}
                </div>
                {/* Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900/90" />
            </div>
        </motion.div>
    );
}
