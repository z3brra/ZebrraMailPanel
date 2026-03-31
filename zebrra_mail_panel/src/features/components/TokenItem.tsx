import type { TokenListItem } from "../tokens/types/token.types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KeyRound, Eye } from "lucide-react";
import { TokenStatusBadge } from "./TokenStatusBadge";

function formatDateFR(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "short",
        day: "2-digit",
    });
}

function formatDateTimeFR(iso: string) {
    const d = new Date(iso);
    return d.toLocaleString("fr-FR", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    });
}

type TokenItemProps = {
    token: TokenListItem;
    onView?: (uuid: string) => void;
    viewDisabled?: boolean;
}

export function TokenItem({
    token,
    onView,
    viewDisabled = false,
}: TokenItemProps) {
    return (
        <>
            <Card>
                <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 space-y-2">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="h-9 w-9 rounded-md bg-muted flex items-center justify-center">
                                    <KeyRound className="h-4 w-4 opacity-80" />
                                </div>

                                <div className="min-w-0">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className="font-medium truncate">{token.name}</div>
                                        <TokenStatusBadge
                                            active={token.active}
                                            revokedAt={token.revokedAt}
                                            expiresAt={token.expiresAt}
                                        />
                                    </div>

                                    <div className="text-xs text-muted-foreground">
                                        Crée : {formatDateFR(token.createdAt)} . Expire : {formatDateFR(token.expiresAt)}
                                        {token.lastUsedAt ? ` · Dernière utilisation : ${formatDateTimeFR(token.lastUsedAt)}` : ""}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="shrink-0">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => onView?.(token.uuid)}
                                disabled={viewDisabled}
                            >
                                <Eye className="h-4 w-4 mr-2" />
                                Détails
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
