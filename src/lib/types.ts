export interface User {
    id: string;
    name: string;
    totalPages: number;
    updatedAt: Date;
    // Gamification fields
    currentStreak: number;
    logCount: number; // For frequency achievements
    lastLogDate: Date;
    badges: string[]; // List of unlocked Achievement IDs
}

export interface ReadingLog {
    id: string;
    userId: string;
    userName: string;
    pages: number;
    createdAt: Date;
}
