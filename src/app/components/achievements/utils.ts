import { User } from "@/lib/types";
import { ACHIEVEMENTS } from "./constants";
import { Achievement } from "./types";

export function getUnlockedAchievements(user: User): Achievement[] {
    return ACHIEVEMENTS.filter(achievement => {
        const hasBadge = user.badges?.includes(achievement.id);
        const metCondition = achievement.condition(user);
        return hasBadge || metCondition;
    }).sort((a, b) => {
        // Sort by order descending (assuming higher order is "better" or newer)
        return b.order - a.order;
    });
}
