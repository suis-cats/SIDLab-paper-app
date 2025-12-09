"use client";

import { User } from "@/lib/types";
import { ACHIEVEMENTS } from "./constants";
import PremiumBadge from "./PremiumBadge";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Lock, ChevronDown, ChevronUp } from "lucide-react";

interface Props {
    currentUser: User | null; // The user viewing the page (for unlocking logic)
    allUsers: User[]; // For ranking
}

export default function AchievementShowcase({ currentUser, allUsers }: Props) {
    const [isGalleryOpen, setGalleryOpen] = useState(false);
    const [selectedBadgeId, setSelectedBadgeId] = useState<string | null>(null);

    // Calculate stats
    const unlockedIds = useMemo(() => currentUser?.badges || [], [currentUser]);
    const totalCount = ACHIEVEMENTS.length;
    const unlockedCount = unlockedIds.length;
    const progress = Math.round((unlockedCount / totalCount) * 100);

    // Get Recent Unlocks (from Ranking logic or Current user?) 
    // Let's show "My Recent Unlocks" prominently if user is logged in
    const myRecentBadges = useMemo(() => {
        if (!currentUser) return [];
        // Filter unlocked and take top 3 (Assuming ACHIEVEMENTS is roughly sorted by order)
        // Ideally we'd have timestamps, but for now just show highest order unlocked?
        // Or just the first 3 unlocked.
        return ACHIEVEMENTS.filter(a => unlockedIds.includes(a.id)).slice(0, 3);
    }, [currentUser, unlockedIds]);

    return (
        <div className="space-y-12">
            
            {/* 1. Hero Section: My Progress */}
            <section className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 overflow-hidden relative">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                 
                 <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-3xl font-black text-gray-900 mb-2">My Badge Collection</h2>
                        <p className="text-gray-500 mb-6">
                            現在の獲得数: <strong className="text-gray-900 text-xl">{unlockedCount}</strong> / {totalCount}
                        </p>
                        
                        {/* Progress Bar */}
                        <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden mb-2">
                            <motion.div 
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                            />
                        </div>
                        <p className="text-xs text-right text-gray-400">{progress}% Complete</p>
                    </div>

                    {/* Spotlight: 3 Best Badges */}
                    <div className="flex -space-x-4">
                        {myRecentBadges.length > 0 ? (
                            myRecentBadges.map((badge, idx) => (
                                <div key={badge.id} className="relative transition-transform hover:scale-110 hover:z-20 z-10">
                                    <PremiumBadge achievement={badge} size="md" />
                                </div>
                            ))
                        ) : (
                            <div className="text-gray-400 text-sm">No badges yet...</div>
                        )}
                        {/* Placeholder for locked slots if few badges */}
                        {Array.from({ length: Math.max(0, 3 - myRecentBadges.length) }).map((_, i) => (
                            <div key={i} className="w-32 h-32 rounded-full border-4 border-dashed border-gray-100 flex items-center justify-center bg-gray-50/50">
                                <Lock className="text-gray-300" />
                            </div>
                        ))}
                    </div>
                 </div>
            </section>

            {/* 2. Gallery Dropdown */}
            <section className="bg-white/50 backdrop-blur-md rounded-3xl p-6 border border-gray-200">
                <button 
                    onClick={() => setGalleryOpen(!isGalleryOpen)}
                    className="w-full flex justify-between items-center group py-2"
                >
                    <h3 className="text-xl font-bold text-gray-800">📘 全実績カタログ</h3>
                    <div className={`p-2 rounded-full bg-white shadow-sm transition-transform duration-300 ${isGalleryOpen ? "rotate-180" : ""}`}>
                        <ChevronDown className="text-gray-600" />
                    </div>
                </button>

                <AnimatePresence>
                    {isGalleryOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 pt-8 pb-4">
                                {ACHIEVEMENTS.map((achievement) => {
                                    const isUnlocked = unlockedIds.includes(achievement.id);
                                    return (
                                        <div 
                                            key={achievement.id}
                                            className="flex flex-col items-center gap-3 group cursor-pointer"
                                            onClick={() => setSelectedBadgeId(achievement.id)}
                                        >
                                            <div className="relative transition-all duration-300 group-hover:scale-110 drop-shadow-sm group-hover:drop-shadow-xl">
                                                <PremiumBadge achievement={achievement} size="sm" unlocked={isUnlocked} interactive={true} />
                                            </div>
                                            <div className="text-center">
                                                <p className={`font-bold text-sm ${isUnlocked ? "text-gray-900" : "text-gray-400"}`}>
                                                    {achievement.title}
                                                </p>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${isUnlocked ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-400"}`}>
                                                    {isUnlocked ? "UNLOCKED" : "LOCKED"}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>
        </div>
    );
}
