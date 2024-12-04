import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/components/button";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-orange-500"
            >
              <Activity className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
