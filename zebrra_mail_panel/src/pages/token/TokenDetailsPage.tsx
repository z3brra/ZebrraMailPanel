import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Shield,
    Calendar,
    KeyRound,
    RotateCcw,
    Ban,
    CheckCircle2,
    AlertTriangle
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { ConfirmActionDialog } from "@/components/dialogs/ConfirmActionDialog";
import { SecretRevealDialog } from "@/components/dialogs/SecretRevealDialog";

import { useTokenDetails } from "@/features/tokens/hooks/useTokenDetails";
import { useRotateToken } from "@/features/tokens/hooks/useRotateToken";
import { useRevokeToken } from "@/features/tokens/hooks/useRevokeToken";

import { useDomainOptions } from "@/features/tokens/hooks/useDomainOptions";
import { TokenStatusBadge } from "@/features/tokens/components/TokenStatusBadge";

import { PERMISSIONS } from "@/features/tokens/data/permissions";
import type { Permission, TokenRead } from "@/features/tokens/types/token.types";

function isExpired(expiresAt: string): boolean {
    const d = new Date(expiresAt);
    return Number.isFinite(d.getTime()) && d.getTime() < Date.now();
}

function formatDateTimeFR(iso: string) {
    const d = new Date(iso);
    return d.toLocaleString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function InfoRow({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
}) {
    return (
        <div className="flex items-start gap-3">
            <div className="mt-0.5 opacity-70">{icon}</div>
            <div className="min-w-0">
                <div className="text-sm text-muted-foreground">{label}</div>
                <div className="text-sm font-medium break-all">{value}</div>
            </div>
        </div>
    );
}

function groupPermissions(token: TokenRead) {
    const set = new Set(token.permissions as Permission[]);
    return PERMISSIONS.map((g) => ({
        ...g,
        items: g.items.filter((p) => set.has(p.value)),
    })).filter((g) => g.items.length > 0);
}

export function TokenDetailsPage() {
    const { uuid } = useParams<{ uuid: string }>();
    const navigate = useNavigate();

    const { token, isLoading, error } = useTokenDetails(uuid ?? "");

    const { items: domainOptions } = useDomainOptions(true);

    const { rotate, isSubmitting: isRotating } = useRotateToken();
    const { revoke, isSubmitting: isRevoking } = useRevokeToken();
    const isBusy = isRotating || isRevoking;

    const [confirmRotateOpen, setConfirmRotateOpen] = useState<boolean>(false);
    const [confirmRevokeOpen, setConfirmRevokeOpen] = useState<boolean>(false);

    const [revealOpen, setRevealOpen] = useState<boolean>(false);
    const [rotatedTokenValue, setRotatedTokenValue] = useState<string | null>(null);

    const status = useMemo(() => {
        if (!token) {
            return null;
        }
        const revoked = !!token.revokedAt;
        const expired = isExpired(token.expiresAt);
        return { revoked, expired, active: token.active };
    }, [token]);

    const scopedDomainNames = useMemo(() => {
        if (!token) {
            return [];
        }
        const map = new Map(domainOptions.map((d) => [d.uuid, d.name] as const));
        return token.scopedDomainUuids.map((id) => map.get(id) ?? id);
    }, [token, domainOptions]);

    const permissionGroups = useMemo(() => (token ? groupPermissions(token) : []), [token]);

    if (!uuid) {
        return <div className="p-6">UUID manquant.</div>;
    }
    if (isLoading) {
        return <div className="p-6 text-sm textg-muted-foreground">Chargement...</div>;
    }

    if (error) {
        return (
            <div className="p-6 space-y-2">
                <div className="text-lg font-semibold">{error.title}</div>
                <div className="text-sm text-muted-foreground">{error.message}</div>
                <Button
                    variant="outline"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour
                </Button>
            </div>
        );
    }

    if (!token) {
        return <div className="p-6">Token introuvable.</div>;
    }

    const canRevoke = token.active && !token.revokedAt;
    const expired = isExpired(token.expiresAt);

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                    <Button
                        variant="ghost"
                        className="px-0"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Retour
                    </Button>

                    <div className="space-y-1">
                        <div className="text-2xl font-semibold break-all">{token.name}</div>

                        <div className="flex flex-wrap gap-2">
                            <TokenStatusBadge
                                active={token.active}
                                revokedAt={token.revokedAt}
                                expiresAt={token.expiresAt}
                            />
                        </div>

                        <div className="text-sm text-muted-foreground">
                            UUID : <span className="font-medium text-foreground">{token.uuid}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 justify-start lg:justify-end">
                    <Button
                        variant="outline"
                        disabled={isBusy}
                        onClick={() => setConfirmRotateOpen(true)}
                    >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Rotation
                    </Button>

                    <Button
                        variant="outline"
                        disabled={!canRevoke || isBusy}
                        onClick={() => setConfirmRevokeOpen(true)}
                    >
                        <Ban className="h-4 w-4 mr-2" />
                        Révoquer
                    </Button>
                </div>
            </div>

            {token.revokedAt ? (
                <Alert variant="destructive">
                    <AlertTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Ce token a été révoqué
                    </AlertTitle>
                    <AlertDescription>
                        Il ne peut plus être utilisé. Révoqué le {formatDateTimeFR(token.revokedAt)}.
                    </AlertDescription>
                </Alert>
            ) : expired ? (
                <Alert>
                    <AlertTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Ce token est expiré
                    </AlertTitle>
                    <AlertDescription>
                        Il a expiré le {formatDateTimeFR(token.expiresAt)}. Crée un nouveau token ou fais une rotation.
                    </AlertDescription>
                </Alert>
            ) : (
                <Alert>
                    <AlertTitle className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Token opérationnel
                    </AlertTitle>
                    <AlertDescription>
                        Le token est actif et non expiré.
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <KeyRound className="h-5 w-5 opacity-80" />
                            Informations du token
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <InfoRow icon={<Calendar className="h-4 w-4" />} label="Créé le" value={formatDateTimeFR(token.createdAt)} />
                        <InfoRow icon={<Calendar className="h-4 w-4" />} label="Expire le" value={formatDateTimeFR(token.expiresAt)} />
                        <InfoRow
                            icon={<Calendar className="h-4 w-4" />}
                            label="Dernière utilisation"
                            value={token.lastUsedAt ? formatDateTimeFR(token.lastUsedAt) : "Jamais"}
                        />

                        <Separator />

                        <InfoRow
                            icon={<Shield className="h-4 w-4" />}
                            label="Statut"
                            value={<TokenStatusBadge active={token.active} revokedAt={token.revokedAt} expiresAt={token.expiresAt} />}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5 opacity-80" />
                            Aperçu du statut
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between rounded-lg border p-3">
                            <div className="text-sm font-medium">Actif</div>
                            <TokenStatusBadge active={token.active} revokedAt={null} expiresAt={"2999-01-01T00:00:00+00:00"} />
                        </div>

                        <div className="flex items-center justify-between rounded-lg border p-3">
                            <div className="text-sm font-medium">Révocation</div>
                            <span className="text-sm font-medium">
                                {token.revokedAt ? "Révoqué" : "Valide"}
                            </span>
                        </div>

                        <div className="flex items-center justify-between rounded-lg border p-3">
                            <div className="text-sm font-medium">Expiration</div>
                            <span className="text-sm font-medium">
                                {expired ? "Expiré" : "Valide"}
                            </span>
                        </div>

                        <div className="text-sm text-muted-foreground">
                            Santé globale :{" "}
                            <span className="font-medium text-foreground">
                                {token.revokedAt || expired || !token.active ? "Non opérationnel" : "Opérationnel"}
                            </span>
                        </div>

                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 opacity-80" />
                        Permissions ({token.permissions.length})
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    {permissionGroups.length === 0 ? (
                        <div className="text-sm text-muted-foreground">Aucune permission.</div>
                    ) : (
                        permissionGroups.map((g) => (
                            <Card key={g.key}>
                                <CardHeader>
                                    <CardTitle className="text-base">{g.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {g.items.map((p) => (
                                        <div key={p.value} className="text-sm">
                                            {p.label}
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        ))
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 opacity-80" />
                        Domaines scoppés
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {token.scopedDomainUuids.length === 0 ? (
                        <div className="text-smm text-muted-foreground">
                            Aucun scope : ce token peut accéder à tous les domaines.
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {scopedDomainNames.map((name) => (
                                <span key={name} className="text-sm rounded-md border px-2 py-1">
                                    {name}
                                </span>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <ConfirmActionDialog
                open={confirmRotateOpen}
                onOpenChange={setConfirmRotateOpen}
                title="Faire une rotation du token ?"
                description={
                    <>
                        Un nouveau token sera généré. Copie-le, puis remplace l’ancien côté intégration.
                        <br />
                        <span className="font-bold">{token.name}</span>
                    </>
                }
                confirmLabel="Rotation"
                isBusy={isBusy}
                onConfirm={async () => {
                    const res = await rotate(token.uuid);
                    setConfirmRotateOpen(false);
                    setRotatedTokenValue(res.token);
                    setRevealOpen(true);
                }}
            />

            <ConfirmActionDialog
                open={confirmRevokeOpen}
                onOpenChange={setConfirmRevokeOpen}
                title="Révoquer ce token ?"
                description={
                    <>
                        Le token ne pourra plus être utilisé.
                        <br />
                        <span className="font-bold">{token.name}</span>
                    </>
                }
                confirmLabel="Révoquer"
                isBusy={isBusy}
                onConfirm={async () => {
                    await revoke(token.uuid);
                    setConfirmRevokeOpen(false);
                    navigate(0);
                }}
            />

            {rotatedTokenValue ? (
                <SecretRevealDialog
                    open={revealOpen}
                    onOpenChange={(open) => {
                        setRevealOpen(open);
                        if (!open) setRotatedTokenValue(null);
                    }}
                    title="Nouveau token généré"
                    description="Copie ce token maintenant : il ne sera plus affiché ensuite."
                    label="Token"
                    labelValue={token.name}
                    secret={rotatedTokenValue}
                />
            ) : null}
        </div>
    );
}