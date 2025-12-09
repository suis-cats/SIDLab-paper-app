"use client";

import { motion, AnimatePresence } from "framer-motion";
import { User } from "@/lib/types";
import { ACHIEVEMENTS } from "./constants";
import { X, Lock } from "lucide-react";
import PremiumBadge from "./PremiumBadge";

interface Props {
    user: User | null;
    onClose: () => void;
}

export default function AchievementModal({ user, onClose }: Props) {
    if (!user) return null;

    // Separate into unlocked and locked
    const sortedAchievements = [...ACHIEVEMENTS].sort((a, b) => {
        const isUnlockedA = user.badges?.includes(a.id) || a.condition(user);
        const isUnlockedB = user.badges?.includes(b.id) || b.condition(user);
        
        // Show unlocked first
        if (isUnlockedA && !isUnlockedB) return -1;
        if (!isUnlockedA && isUnlockedB) return 1;
        return a.order - b.order;
    });

    const unlockedCount = sortedAchievements.filter(a => user.badges?.includes(a.id) || a.condition(user)).length;
    const totalCount = sortedAchievements.length;
    const progress = Math.round((unlockedCount / totalCount) * 100);

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                />

                {/* Modal Content */}
                <motion.div
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative z-50"
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100 flex items-start justify-between bg-gray-50/50">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                {user.name}の実績
                                <span className="text-sm font-normal text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                                    Lv.{Math.floor(unlockedCount / 5) + 1}
                                </span>
                            </h2>
                            <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                                <span>獲得数: <strong className="text-gray-900">{unlockedCount}</strong> / {totalCount}</span>
                                <div className="flex-1 w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${progress}%` }} />
                                </div>
                                <span>{progress}% 完了</span>
                            </div>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Scrollable list - Steam Style */}
                    <div className="overflow-y-auto flex-1 p-6 bg-gray-50">
                        <div className="grid grid-cols-1 gap-3">
                            {sortedAchievements.map((achievement) => {
                                const isUnlocked = user.badges?.includes(achievement.id) || achievement.condition(user);
                                return (
                                    <div 
                                        key={achievement.id}
                                        className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                                            isUnlocked 
                                                ? "bg-white border-blue-100 shadow-sm"
                                                : "bg-[#e5e7eb]/30 border-gray-200 grayscale opacity-60"
                                        }`}
                                    >
                                        <div className="shrink-0 relative w-16 h-16 flex items-center justify-center">
                                            {/* Using standard badge here for clarity in list, or small 3D? Standard is clearer for lists */}
                                            <PremiumBadge achievement={achievement} size="xl" interactive={true} unlocked={isUnlocked} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className={`font-bold text-base ${isUnlocked ? "text-gray-900" : "text-gray-500"}`}>
                                                    {achievement.title}
                                                </h3>
                                                {isUnlocked && (
                                                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                                        解除済み
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500 leading-relaxed">
                                                {achievement.description}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
