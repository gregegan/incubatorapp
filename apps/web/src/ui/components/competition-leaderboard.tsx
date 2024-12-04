import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/components/table";
import { Badge } from "@/ui/components/badge";

interface Player {
  rank: number;
  username: string;
  points: number;
  isYou?: boolean;
}

interface CompetitionLeaderboardProps {
  players?: Player[];
}

export function CompetitionLeaderboard({
  players,
}: CompetitionLeaderboardProps) {
  if (!players?.length) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No leaderboard data available
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Rank</TableHead>
          <TableHead>Player</TableHead>
          <TableHead className="text-right">Points</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {players.map((player) => (
          <TableRow key={player.rank}>
            <TableCell className="font-medium">
              <span className="flex items-center gap-2">
                {player.rank === 1 && "🥇"}
                {player.rank === 2 && "🥈"}
                {player.rank === 3 && "🥉"}
                <span className={player.rank <= 3 ? "text-orange-500" : ""}>
                  #{player.rank}
                </span>
              </span>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {player.username}
                {player.isYou && (
                  <Badge variant="secondary" className="text-xs">
                    You
                  </Badge>
                )}
              </div>
            </TableCell>
            <TableCell className="text-right">
              {player.points.toLocaleString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
