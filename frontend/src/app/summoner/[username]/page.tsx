import MatchCard from "../../components/MatchCard";
import { Match } from "./mockData";

interface SummonerPageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function SummonerPage({ params }: SummonerPageProps) {
  const { username } = await params;
  const summonerName = decodeURIComponent(username);
  const [gameName, tagLine] = summonerName.split("#");

  const res = await fetch(
    `http://localhost:8000/summoners/${gameName}/${tagLine}/matches`
  );
  const data = await res.json();
  const matches: Match[] = data.matches;

  return (
    <main className="flex min-h-screen flex-col bg-zinc-950 px-4 py-12">
      <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white">{summonerName}</h1>
          <p className="text-zinc-400 mt-1">Recent matches</p>
        </div>
        <div className="flex flex-col gap-3">
          {matches.map((match) => (
            <MatchCard key={match.matchId} match={match} />
          ))}
        </div>
      </div>
    </main>
    );
}