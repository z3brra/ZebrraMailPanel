import { NavLink } from "react-router-dom";
import {
    Shield,
    LogOut,
    ChevronLeft,
    ChevronRight
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { navItems } from "@/data/navigation";
import { useAuth } from "@/features/auth";

type AppSidebarProps = {
    collapsed: boolean;
    onToggleCollapse: () => void;
};

function RoleBadge({ roles }: { roles: string[] }) {
    const isSuperAdmin = roles.includes("ROLE_SUPER_ADMIN");
    const label = isSuperAdmin ? "Super-admin" : "Admin";

    const bg = isSuperAdmin ? "bg-[var(--chart-2)]": "bg-[var(--chart-5)]";

    return (
        <Badge className={cn("gap-1 text-white border-transparent", bg)} variant="secondary">
            <Shield className="h-3.5 w-3.5" />
            <span>{label}</span>
        </Badge>
    );
}

export function AppSidebar({ collapsed, onToggleCollapse }: AppSidebarProps) {
    const { user, logout, hasRole, isSubmittingLogout } = useAuth();

    const items = navItems.filter((item) => {
        if (item.superAdminOnly) {
            return hasRole("ROLE_SUPER_ADMIN");
        }
        return true;
    });

    return (
        <aside
            className={cn(
                "h-screen sticky top-0 border-r bg-background",
                "flex flex-col",
                collapsed ? "w-16" : "w-64"
            )}
        >
            <div className={cn("p-3 flex items-center justify-between gap-2", collapsed && "justify-center")}>
                <div className={cn("min-w-0", collapsed && "hidden")}>
                    <div className={cn("text-sm font-semibold leading-tight")}>Zebrra MCS</div>
                    <div className={cn("text-xs opacity-70 leading-tight")}>Panel d'administration</div>
                </div>

                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={onToggleCollapse}
                    aria-label={collapsed ? "Ouvrir le menu latéral" : "Réduire le menu latéral"}
                    title={collapsed ? "Ouvrir" : "Réduire"}
                >
                    { collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" /> }
                </Button>
            </div>

            <Separator />

            <div className={cn("p-3", collapsed && "px-2")}>
                { user ? (
                    collapsed ? (
                        <div className="flex justify-center">
                            <div
                                className={cn(
                                    "h-8 w-8 rounded-md flex items-center justify-center text-white",
                                    user.roles.includes("ROLE_SUPER_ADMIN") ? "bg-[var(--chart-2)]": "bg-[var(--chart-5)]"
                                )}
                                title={user.roles.includes("ROLE_SUPER_ADMIN") ? "Super-admin" : "Admin"}
                            >
                                <Shield className="h-4 w-4" />
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between gap-2">
                            <div className="min-w-0">
                                <div className="text-sm font-medium truncate">{user.email}</div>
                                <div className="text-xs opacity-70">Connecté</div>
                            </div>
                            <RoleBadge roles={user.roles} />
                        </div>
                    )
                ) : null}
            </div>

            <Separator />

            <nav className={cn("p-2 flex-1 space-y-1", collapsed && "px-2")} aria-label="Navigation">
                { items.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.key}
                            to={item.to}
                            className={({ isActive }) =>
                                cn(
                                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm",
                                    "hover:bg-accent hover:text-accent-foreground",
                                    isActive && "bg-accent text-accent-foreground",
                                    collapsed && "justify-center px-2"
                                )
                            }
                            title={collapsed ? item.label : undefined}
                        >
                            <Icon className="h-4 w-4 shrink-0" />
                            {!collapsed && <span className="truncate">{item.label}</span>}
                        </NavLink>
                    );
                })}
            </nav>

            <Separator />

            <div className={cn("p-2", collapsed && "px-2")}>
                <Button
                    type="button"
                    variant="ghost"
                    className={cn("w-full justify-start gap-2", collapsed && "justify-center")}
                    onClick={async () => {
                        await logout();
                    }}
                    disabled={isSubmittingLogout}
                    title={collapsed ? "Déconnextion" : undefined}
                >
                    <LogOut className="h-4 w-4" />
                    { !collapsed && <span>Déconnextion</span>}
                </Button>
            </div>
        </aside>
    )
}