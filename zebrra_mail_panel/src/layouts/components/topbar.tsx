import { PanelLeft } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/custom/theme-toggle";
import { getSectionByPath } from "@/data/navigation";

type TopbarProps = {
    onToggleSidebar: () => void;
};

export function Topbar({ onToggleSidebar }: TopbarProps) {
    const location = useLocation();
    const section = getSectionByPath(location.pathname);

    const Icon = section?.icon;

    return (
        <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="h-14 px-4 flex items-center gap-3">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={onToggleSidebar}
                    aria-label="Ouvrir / fermer le menu latéral"
                    title="Menu latéral"
                >
                    <PanelLeft className="h-4 w-4" />
                </Button>

                <Separator orientation="vertical" className="h-6" />

                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 min-w-0">
                        { Icon ? <Icon className="h-4 w-4 shrink-0 opacity-80" /> : null }
                        <h1 className="text-sm font-semibold truncate">
                            {section?.label ?? "Administration"}
                        </h1>
                    </div>
                    <p className="text-xs opacity-70 truncate">
                        {section?.description ?? "Gestion et configuration"}
                    </p>
                </div>

                <ThemeToggle />
            </div>
        </header>
    );
}