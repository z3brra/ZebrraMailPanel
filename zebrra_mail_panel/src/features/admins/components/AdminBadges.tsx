import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export function ActiveBadge({ active }: { active: boolean }) {
    return (
        <Badge
            className={cn(
                "border-transparent",
                active
                    ? "bg-badge-active text-badge-active-foreground"
                    : "bg-badge-inactive text-badge-inactive-foreground"
            )}
        >
            { active ? "Actif" : "Inactif" }
        </Badge>
    );
}

export function DeletedBadge({ isDeleted }: { isDeleted: boolean }) {
    if (!isDeleted) {
        return null;
    }

    return (
        <Badge className="border-transparent bg-badge-deleted text-badge-deleted-foreground">
            Supprimé
        </Badge>
    );
}

export function MailboxBadge({ hasMailbox }: { hasMailbox: boolean }) {
    return (
        <Badge variant="outline">
            { hasMailbox ? "Boîte mail" : "Aucune boîte"}
        </Badge>
    );
}


export function RoleBadge({ roles }: { roles: string[] }) {
    const isSuperAdmin = roles.includes("ROLE_SUPER_ADMIN");
    return (
        <Badge
            className={cn(
                "gap-1 border-transparent",
                isSuperAdmin
                    ? "bg-badge-role-super text-badge-role-super-foreground"
                    : "bg-badge-role-admin text-badge-role-admin-foreground"
            )}
            variant="secondary"
        >
            <Shield className="h-3.5 w-3.5" />
            {isSuperAdmin ? "Super-admin" : "Admin"}
        </Badge>
    );
}