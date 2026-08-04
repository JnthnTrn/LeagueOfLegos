import { Match } from "../summoner/[username]/mockData";

interface MatchCardProps {
  match: Match;
}

export default function MatchCard({ match }: MatchCardProps) {
  const kda = ((match.kills + match.assists) / Math.max(match.deaths, 1)).toFixed(2);

  return (
    <div className={`rounded-xl p-4 flex items-center gap-6 ${match.win ? "bg-blue-950" : "bg-red-950"}`}>
      
      {/* Win/Loss */}
      <div className="w-12 text-center">
        <p className={`text-sm font-bold ${match.win ? "text-blue-400" : "text-red-400"}`}>
          {match.win ? "WIN" : "LOSS"}
        </p>
      </div>

      {/* Champion */}
      <div className="w-24">
        <p className="text-white font-semibold">{match.champion}</p>
        <p className="text-zinc-400 text-sm">{match.gameDurationMinutes}m</p>
      </div>

      {/* KDA */}
      <div className="flex-1">
        <p className="text-white font-semibold">
          {match.kills} / <span className="text-red-400">{match.deaths}</span> / {match.assists}
        </p>
        <p className="text-zinc-400 text-sm">{kda} KDA</p>
      </div>

      {/* Stats */}
      <div className="text-right">
        <p className="text-zinc-300 text-sm">{match.csPerMin} CS/min</p>
        <p className="text-zinc-300 text-sm">{match.visionScore} vision</p>
      </div>

    </div>
  );
}