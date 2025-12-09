import { LucideIcon } from "lucide-react";

export enum AchievementType {
    MILESTONE = "MILESTONE", // Total pages
    STREAK = "STREAK",       // Consecutive days
    SPEED = "SPEED",         // Speed (pages per day)
    FREQUENCY = "FREQUENCY", // Total logs
    TIME = "TIME",           // Time of day
    DAY = "DAY",             // Specific day of week
    SPECIAL = "SPECIAL",     // Manual or unique conditions
}

export interface Achievement {
    id: string;
    title: string;
    description: string;
    type: AchievementType;
    condition: (user: any, logs?: any[]) => boolean; // Flexible condition
    icon: LucideIcon;
    color: string; // Tailwind color class (e.g., "text-blue-500")
    bgColor: string; // Tailwind bg class (e.g., "bg-blue-100")
    order: number; // For sorting
    rarity: "COMMON" | "RARE" | "EPIC" | "LEGENDARY";
}
