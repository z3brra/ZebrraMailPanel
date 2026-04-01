import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function isExpired(expiresAt: string): boolean {
    const d = new Date(expiresAt);
    return Number.isFinite(d.getTime()) && d.getTime() < Date.now();
}

export function TokenStatusBadge({
    active,
    revokedAt,
    expiresAt,
}: {
    active: boolean;
    revokedAt: string | null;
    expiresAt: string;
}) {
    const expired = isExpired(expiresAt);
    const revoked = !!revokedAt;

    const label = revoked ? "Révoqué" : expired ? "Expiré" : active ? "Actif": "Inactif";

    const cls = revoked
        ? "bg-destructive text-destructive-foreground border-transparent"
        : expired
            ? "bg-muted text-muted-foreground border-transparent"
            : "bg-badge-active text-badge-active-foreground border-transparent";
    
    return <Badge className={cn(cls)}>{label}</Badge>;
}