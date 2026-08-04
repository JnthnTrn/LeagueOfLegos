export interface Match {
  matchId: string;
  champion: string;
  kills: number;
  deaths: number;
  assists: number;
  win: boolean;
  csPerMin: number;
  visionScore: number;
  gameDurationMinutes: number;
}

export const mockMatches: Match[] = [
  {
    matchId: "NA1_001",
    champion: "Jinx",
    kills: 8,
    deaths: 3,
    assists: 7,
    win: true,
    csPerMin: 7.2,
    visionScore: 18,
    gameDurationMinutes: 34,
  },
  {
    matchId: "NA1_002",
    champion: "Thresh",
    kills: 1,
    deaths: 4,
    assists: 18,
    win: false,
    csPerMin: 0.8,
    visionScore: 42,
    gameDurationMinutes: 28,
  },
  {
    matchId: "NA1_003",
    champion: "Ahri",
    kills: 12,
    deaths: 5,
    assists: 4,
    win: true,
    csPerMin: 8.1,
    visionScore: 14,
    gameDurationMinutes: 41,
  },
];