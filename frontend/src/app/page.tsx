"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [summonerName, setSummonerName] = useState("");
  const router = useRouter();

  function handleSearch() {
    if (!summonerName.trim()) return;
    router.push(`/summoner/${encodeURIComponent(summonerName)}`);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md flex flex-col items-center gap-6">
        <h1 className="text-4xl font-bold text-white tracking-tight">
          LoL Analyzer
        </h1>
        <p className="text-zinc-400 text-center">
          Enter your Riot ID to get AI-powered feedback on your gameplay.
        </p>
        <div className="w-full flex gap-2">
          <input
            type="text"
            placeholder="Username#TAG"
            value={summonerName}
            onChange={(e) => setSummonerName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 rounded-lg bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-500 transition-colors"
          >
            Search
          </button>
        </div>
      </div>
    </main>
  );
}