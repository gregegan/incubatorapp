import { Search } from "lucide-react";
import { Input } from "@/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/components/select";

export function UserFilters() {
  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search users..." className="pl-9" />
        </div>
      </div>
      <Select defaultValue="all">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="suspended">Suspended</SelectItem>
          <SelectItem value="banned">Banned</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue="newest">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
          <SelectItem value="points-high">Highest Points</SelectItem>
          <SelectItem value="points-low">Lowest Points</SelectItem>
          <SelectItem value="winrate-high">Highest Win Rate</SelectItem>
          <SelectItem value="winrate-low">Lowest Win Rate</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
