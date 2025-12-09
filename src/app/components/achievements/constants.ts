import { 
    Award, BookOpen, Flame, Zap, Star, Trophy, Target, 
    Calendar, Clock, Coffee, Feather, Scroll, Crown, 
    Medal, Sparkles, Rocket, Hourglass, Sunrise, Moon,
    PenTool, GraduationCap, PartyPopper, Lightbulb,
    Swords, Shield, Music, Heart, Smile, ThumbsUp
} from "lucide-react";
import { Achievement, AchievementType } from "./types";
import { User } from "@/lib/types";

export const ACHIEVEMENTS: Achievement[] = [
    // --- Page Milestones (1-50+) ---
    {
        id: "page-1",
        title: "はじめの一歩",
        description: "記念すべき最初の1ページ！",
        type: AchievementType.MILESTONE,
        condition: (user: User) => user.totalPages >= 1,
        icon: Feather,
        color: "text-blue-500",
        bgColor: "bg-blue-100",
        order: 1,
        rarity: "COMMON"
    },
    {
        id: "page-2",
        title: "二歩目",
        description: "歩みを止めない。",
        type: AchievementType.MILESTONE,
        condition: (user: User) => user.totalPages >= 2,
        icon: Feather,
        color: "text-blue-500",
        bgColor: "bg-blue-100",
        order: 2,
        rarity: "COMMON"
    },
    {
        id: "page-3",
        title: "三日坊主脱出？",
        description: "3ページ突破。ここからが本番。",
        type: AchievementType.MILESTONE,
        condition: (user: User) => user.totalPages >= 3,
        icon: BookOpen,
        color: "text-indigo-500",
        bgColor: "bg-indigo-100",
        order: 3,
        rarity: "COMMON"
    },
    {
        id: "page-5",
        title: "ノッてきた！",
        description: "5ページ達成。リズムが出てきました。",
        type: AchievementType.MILESTONE,
        condition: (user: User) => user.totalPages >= 5,
        icon: Zap,
        color: "text-yellow-500",
        bgColor: "bg-yellow-100",
        order: 5,
        rarity: "COMMON"
    },
    {
        id: "page-7",
        title: "ラッキーセブン",
        description: "7ページ達成。いいことあるかも。",
        type: AchievementType.MILESTONE,
        condition: (user: User) => user.totalPages >= 7,
        icon: Star,
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        order: 7,
        rarity: "COMMON"
    },
    {
        id: "page-10",
        title: "2桁突入！",
        description: "ついに10ページ。論文らしくなってきました。",
        type: AchievementType.MILESTONE,
        condition: (user: User) => user.totalPages >= 10,
        icon: Trophy,
        color: "text-orange-500",
        bgColor: "bg-orange-100",
        order: 10,
        rarity: "RARE"
    },
    {
        id: "page-15",
        title: "中間目標達成！",
        description: "15ページ。全体の構成が見えてきた頃？",
        type: AchievementType.MILESTONE,
        condition: (user: User) => user.totalPages >= 15,
        icon: Target,
        color: "text-red-500",
        bgColor: "bg-red-100",
        order: 15,
        rarity: "RARE"
    },
    {
        id: "page-20",
        title: "積み上げの達人",
        description: "20ページ。かなりのボリュームです。",
        type: AchievementType.MILESTONE,
        condition: (user: User) => user.totalPages >= 20,
        icon: Scroll,
        color: "text-emerald-500",
        bgColor: "bg-emerald-100",
        order: 20,
        rarity: "RARE"
    },
    {
        id: "page-30",
        title: "ラストスパート",
        description: "30ページ。ゴールは近い！",
        type: AchievementType.MILESTONE,
        condition: (user: User) => user.totalPages >= 30,
        icon: Rocket,
        color: "text-purple-500",
        bgColor: "bg-purple-100",
        order: 30,
        rarity: "EPIC"
    },
    {
        id: "page-40",
        title: "大台目前",
        description: "40ページ。圧倒的な厚み。",
        type: AchievementType.MILESTONE,
        condition: (user: User) => user.totalPages >= 40,
        icon: Crown,
        color: "text-pink-500",
        bgColor: "bg-pink-100",
        order: 40,
        rarity: "EPIC"
    },
    {
        id: "page-50",
        title: "卒業論文完成？",
        description: "50ページ！！よくぞここまで書き上げました。",
        type: AchievementType.MILESTONE,
        condition: (user: User) => user.totalPages >= 50,
        icon: GraduationCap,
        color: "text-amber-500",
        bgColor: "bg-amber-100",
        order: 50,
        rarity: "LEGENDARY"
    },
    
    // --- Fine-grained Pages (Filling the gaps for constant rewards) ---
    ...[4, 6, 8, 9, 11, 12, 13, 14, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29].map(p => ({
        id: `page-${p}`,
        title: `Page ${p}`,
        description: `${p}ページ目。着実な進歩。`,
        type: AchievementType.MILESTONE,
        condition: (user: User) => user.totalPages >= p,
        icon: PenTool,
        color: "text-slate-400",
        bgColor: "bg-slate-100",
        order: p,
        rarity: "COMMON" as const
    })),
    ...[31, 32, 33, 34, 35, 36, 37, 38, 39, 41, 42, 43, 44, 45, 46, 47, 48, 49].map(p => ({
        id: `page-${p}`,
        title: `Page ${p}`,
        description: `${p}ページ目。ラストスパート！`,
        type: AchievementType.MILESTONE,
        condition: (user: User) => user.totalPages >= p,
        icon: PenTool,
        color: "text-slate-400",
        bgColor: "bg-slate-100",
        order: p,
        rarity: "COMMON" as const
    })),

    // --- Streak Achievements ---
    {
        id: "streak-2",
        title: "継続の始まり",
        description: "2日連続執筆。",
        type: AchievementType.STREAK,
        condition: (user: User) => user.currentStreak >= 2,
        icon: Flame,
        color: "text-orange-500",
        bgColor: "bg-orange-50",
        order: 102,
        rarity: "COMMON"
    },
    {
        id: "streak-3",
        title: "三日坊主回避",
        description: "3日連続！素晴らしい。",
        type: AchievementType.STREAK,
        condition: (user: User) => user.currentStreak >= 3,
        icon: Flame,
        color: "text-orange-600",
        bgColor: "bg-orange-100",
        order: 103,
        rarity: "COMMON"
    },
    {
        id: "streak-5",
        title: "平日コンプリート？",
        description: "5日連続執筆。",
        type: AchievementType.STREAK,
        condition: (user: User) => user.currentStreak >= 5,
        icon: Flame,
        color: "text-red-500",
        bgColor: "bg-red-100",
        order: 105,
        rarity: "RARE"
    },
    {
        id: "streak-7",
        title: "習慣の鬼",
        description: "1週間連続執筆！もはや生活の一部。",
        type: AchievementType.STREAK,
        condition: (user: User) => user.currentStreak >= 7,
        icon: Flame,
        color: "text-red-600",
        bgColor: "bg-red-200",
        order: 107,
        rarity: "EPIC"
    },
    {
        id: "streak-14",
        title: "ゾーン突入",
        description: "2週間連続。誰もあなたを止められない。",
        type: AchievementType.STREAK,
        condition: (user: User) => user.currentStreak >= 14,
        icon: Flame,
        color: "text-purple-600",
        bgColor: "bg-purple-200",
        order: 114,
        rarity: "EPIC"
    },
    {
        id: "streak-30",
        title: "伝説の執筆者",
        description: "30日連続。この狂気、賞賛に値する。",
        type: AchievementType.STREAK,
        condition: (user: User) => user.currentStreak >= 30,
        icon: Flame,
        color: "text-rose-600",
        bgColor: "bg-rose-200",
        order: 130,
        rarity: "LEGENDARY"
    },

    // --- Frequency (Log Count) Achievements ---
    {
        id: "log-1",
        title: "Hello World",
        description: "初めての進捗報告。",
        type: AchievementType.FREQUENCY,
        condition: (user: User) => user.logCount >= 1,
        icon: HandMetal, // 'Hand' icon placeholder
        color: "text-blue-400",
        bgColor: "bg-blue-50",
        order: 201,
        rarity: "COMMON"
    },
    {
        id: "log-5",
        title: "報告の習慣",
        description: "5回の記録。",
        type: AchievementType.FREQUENCY,
        condition: (user: User) => user.logCount >= 5,
        icon: Scroll,
        color: "text-cyan-500",
        bgColor: "bg-cyan-100",
        order: 205,
        rarity: "COMMON"
    },
    {
        id: "log-10",
        title: "常連さん",
        description: "10回の記録。",
        type: AchievementType.FREQUENCY,
        condition: (user: User) => user.logCount >= 10,
        icon: UserCheck,
        color: "text-teal-500",
        bgColor: "bg-teal-100",
        order: 210,
        rarity: "COMMON"
    },
    {
        id: "log-50",
        title: "積み重ね",
        description: "50回の記録。塵も積もれば山となる。",
        type: AchievementType.FREQUENCY,
        condition: (user: User) => user.logCount >= 50,
        icon: Layers,
        color: "text-indigo-500",
        bgColor: "bg-indigo-100",
        order: 250,
        rarity: "EPIC"
    },

    // --- Time/Special (Placeholder for Badge-based) ---
    // Note: These need 'badges' array check in condition, 
    // assuming 'badges' are manually awarded or checked separately.
    {
        id: "night-owl",
        title: "真夜中の哲学者",
        description: "深夜2時から4時の間に執筆。",
        type: AchievementType.TIME,
        condition: (user: User) => user.badges?.includes("night-owl"),
        icon: Moon,
        color: "text-violet-400",
        bgColor: "bg-gray-900",
        order: 301,
        rarity: "RARE"
    },
    {
        id: "early-bird",
        title: "早起きは三文の徳",
        description: "朝5時から8時の間に執筆。",
        type: AchievementType.TIME,
        condition: (user: User) => user.badges?.includes("early-bird"),
        icon: Sunrise,
        color: "text-orange-400",
        bgColor: "bg-orange-50",
        order: 302,
        rarity: "RARE"
    },
    {
        id: "speed-demon",
        title: "筆が止まらない",
        description: "1日で5ページ以上進捗。",
        type: AchievementType.SPEED,
        condition: (user: User) => user.badges?.includes("speed-demon"),
        icon: Zap,
        color: "text-yellow-500",
        bgColor: "bg-yellow-100",
        order: 401,
        rarity: "EPIC"
    }
];

// Helper icons
import { HandMetal, UserCheck, Layers } from "lucide-react";
