import { mockMatches } from "./mockData";
import MatchCard from "../../components/MatchCard";

interface SummonerPageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function SummonerPage({ params }: SummonerPageProps) {
  const { username } = await params;
  const summonerName = decodeURIComponent(username);

  return (
    <main className="flex min-h-screen flex-col bg-zinc-950 px-4 py-12">
      <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white">{summonerName}</h1>
          <p className="text-zinc-400 mt-1">Recent matches</p>
        </div>
        <div className="flex flex-col gap-3">
          {mockMatches.map((match) => (
            <MatchCard key={match.matchId} match={match} />
          ))}
        </div>
      </div>
    </main>
  );
}