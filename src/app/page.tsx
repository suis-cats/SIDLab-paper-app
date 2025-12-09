"use client";

import { User, ReadingLog } from "@/lib/types";
import { USERS_COLLECTION, LOGS_COLLECTION, db } from "@/lib/db";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import Link from "next/link";
import DeleteUserSection from "./components/DeleteUserSection";
import AchievementShowcase from "./components/achievements/AchievementShowcase";
import SceneCanvas from "./components/achievements/SceneCanvas";
import { useState, useEffect } from "react";

export default function Home() {
  const [ranking, setRanking] = useState<User[]>([]);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersSnap = await getDocs(
          query(collection(db, "users"), orderBy("totalPages", "desc"), limit(10))
        );
        const usersData = usersSnap.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          totalPages: doc.data().totalPages,
          currentStreak: doc.data().currentStreak || 0,
          logCount: doc.data().logCount || 0,
          lastLogDate: doc.data().lastLogDate?.toDate() || new Date(),
          badges: doc.data().badges || [],
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as User[];
        setRanking(usersData);
        if (usersData.length > 0) {
            setSelectedUserId(usersData[0].id);
        }

        const logsSnap = await getDocs(
          query(collection(db, "pageLogs"), orderBy("createdAt", "desc"), limit(5))
        );
        const logsData = logsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate(),
        }));
        setRecentLogs(logsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const currentUser = ranking.find(u => u.id === selectedUserId) || null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-20 relative">
      <SceneCanvas />
      
      {/* Header / Hero */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 bg-opacity-80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🎓 SIDLab Paper
          </h1>
          
          <div className="flex items-center gap-4">
             {/* User Selector for Demo */}
             <select 
                className="bg-gray-100 border-none rounded-full px-4 py-1 text-sm font-medium text-gray-700 max-w-[150px] sm:max-w-xs truncate"
                value={selectedUserId || ""}
                onChange={(e) => setSelectedUserId(e.target.value)}
             >
                {ranking.map(u => (
                    <option key={u.id} value={u.id}>Act as: {u.name}</option>
                ))}
             </select>
             <Link 
                href="/log" 
                className="bg-black text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-800 transition-colors"
                >
                記録する
             </Link>
          </div>
        </div>
      </header>

      <div id="main-content" className="container mx-auto px-4 py-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-12">
          {/* 1. Ranking List (TOP) */}
          <section className="card p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              🏆 現在のランキング
            </h2>
            <div className="space-y-0 divide-y divide-gray-100">
              {ranking.length === 0 ? (
                <p className="text-center text-gray-500 py-8 text-sm">データがありません。</p>
              ) : (
                ranking.map((user, index) => (
                  <div 
                    key={user.id} 
                    className={`flex items-center justify-between py-3 px-3 rounded-lg transition-colors cursor-pointer ${user.id === selectedUserId ? "bg-blue-50 border border-blue-100" : "hover:bg-gray-50"}`}
                    onClick={() => setSelectedUserId(user.id)}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${index < 3 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                        {index + 1}
                      </span>
                      <span className="text-gray-900 font-medium text-sm">{user.name}</span>
                      {user.id === selectedUserId && <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full">YOU</span>}
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-gray-900 font-semibold text-sm w-16 text-right">
                        {user.totalPages} <span className="text-xs text-gray-500 font-normal">p</span>
                        </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Recent Logs (Side) */}
          <section className="card p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              📝 最新の更新
            </h2>
            <div className="space-y-6">
              {recentLogs.length === 0 ? (
                <p className="text-center text-gray-500 py-8 text-sm">ログがありません。</p>
              ) : (
                recentLogs.map((log) => (
                  <div key={log.id} className="relative pl-4 border-l-2 border-gray-100">
                    <div className="mb-0.5 flex justify-between items-baseline">
                      <span className="font-semibold text-gray-900 text-sm">{log.userName}</span>
                      <span className="text-xs text-gray-400">
                        {log.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      <span className="font-bold text-blue-600">{log.pages}ページ</span> に到達しました。
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* 2. Unified Achievement Area */}
        <AchievementShowcase currentUser={currentUser} allUsers={ranking} />

        {/* Delete Section */}
        <DeleteUserSection users={ranking} />
      </div>
    </main>
  );
}
