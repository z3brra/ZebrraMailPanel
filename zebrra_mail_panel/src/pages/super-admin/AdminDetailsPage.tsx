import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Mail,
    Shield,
    Calendar,
    UserRound,
    Ban,
    CheckCircle2,
    KeyRound,
    Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";

import { RoleBadge, ActiveBadge, MailboxBadge, DeletedBadge } from "@/features/admins/components/AdminBadges";

import { ConfirmActionDialog } from "@/components/dialogs/ConfirmActionDialog";
import { PasswordRevealDialog } from "@/components/dialogs/PasswordRevealDialog";

import { useAdminDetails } from "@/features/admins/hooks/useAdminDetails";
import { useAdminStatus } from "@/features/admins/hooks/useAdminStatus";
import { useDeleteAdmin } from "@/features/admins/hooks/useDeleteAdmin";
import { useResetAdminPassword } from "@/features/admins/hooks/useResetAdminPassword";

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

export function AdminDetailsPage() {
    const { uuid } = useParams<{ uuid: string }>();
    const navigate = useNavigate();

    const { admin, isLoading, error } = useAdminDetails(uuid ?? "");

    const { setStatus, isSubmitting: isStatusBusy } = useAdminStatus();
    const { deleteAdmin, isSubmitting: isDeleteBusy } = useDeleteAdmin();
    const { resetPassword, isSubmitting: isResetBusy } = useResetAdminPassword();

    const isBusy = isStatusBusy || isDeleteBusy || isResetBusy;

    const [confirmEnableOpen, setConfirmEnableOpen] = useState(false);
    const [confirmDisableOpen, setConfirmDisableOpen] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [confirmResetOpen, setConfirmResetOpen] = useState(false);

    const [resetResultOpen, setResetResultOpen] = useState(false);
    const [resetResult, setResetResult] = useState<{ email: string; newPassword: string } | null>(null);

    const canEnable = !!admin && !admin.isDeleted && !admin.active;
    const canDisable = !!admin && !admin.isDeleted && admin.active;
    const canDelete = !!admin && !admin.isDeleted;
    const canReset = !!admin && !admin.isDeleted;

    const title = admin?.email ?? "Admin";

    const updatedAtLabel = useMemo(() => {
        if (!admin?.updatedAt) {
            return "_";
        }
        return formatDateTimeFR(admin.updatedAt);
    }, [admin?.updatedAt]);

    if (!uuid) {
        return <div className="p-6">UUID manquant.</div>;
    }

    if (isLoading) {
        return <div className="p-6 text-sm text-muted-foreground">Chargement...</div>
    }

    if (error) {
        return (
            <div className="p-6 space-y-2">
                <div className="text-lg font-semibold">{error.title}</div>
                <div className="text-sm text-muted-foreground">{error.message}</div>
                <Button variant="outline" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour
                </Button>
            </div>
        );
    }

    if (!admin) {
        return (
            <div className="p-6">Admin introuvable.</div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                    <Button variant="ghost" className="px-0" onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Retour
                    </Button>

                    <div className="space-y-1">
                        <div className="text-2xl font-semibold break-all">{title}</div>

                        <div className="flex flex-wrap gap-2">
                            <RoleBadge roles={admin.roles} />
                            <ActiveBadge active={admin.active} />
                            <MailboxBadge hasMailbox={admin.hasMailbox} />
                            <DeletedBadge isDeleted={admin.isDeleted} />
                        </div>

                        <div className="text-sm text-muted-foreground">
                            UUID : <span className="font-medium text-foreground">{admin.uuid}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 justify-start lg:justify-end">
                    <Button
                        variant="outline"
                        disabled={!canDisable || isBusy}
                        onClick={() => setConfirmDisableOpen(true)}
                    >
                        <Ban className="h-4 w-4 mr-2" />
                        Désactiver
                    </Button>

                    <Button
                        variant="outline"
                        disabled={!canEnable || isBusy}
                        onClick={() => setConfirmEnableOpen(true)}
                    >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Activer
                    </Button>

                    <Button
                        variant="outline"
                        disabled={!canReset || isBusy}
                        onClick={() => setConfirmResetOpen(true)}
                    >
                        <KeyRound className="h-4 w-4 mr-2" />
                        Réinitialiser le mot de passe
                    </Button>

                    <Button
                        variant="destructive"
                        disabled={!canDelete || isBusy}
                        onClick={() => setConfirmDeleteOpen(true)}
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserRound className="h-5 w-5 opacity-80" />
                            Informations du compte
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={admin.email} />
                        <InfoRow icon={<Shield className="h-4 w-4" />} label="Rôle" value={<RoleBadge roles={admin.roles} />} />

                        <Separator />

                        <InfoRow icon={<Calendar className="h-4 w-4" />} label="Créé le" value={formatDateTimeFR(admin.createdAt)} />
                        <InfoRow icon={<Calendar className="h-4 w-4" />} label="Mis à jour le" value={updatedAtLabel} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5 opacity-80" />
                            Statut & sécurité
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between rounded-lg border p-3">
                            <div className="text-sm font-medium">Statut du compte</div>
                            <ActiveBadge active={admin.active} />
                        </div>

                        <div className="flex items-center justify-between rounded-lg border p-3">
                            <div className="text-sm font-medium">Boîte mail</div>
                            <MailboxBadge hasMailbox={admin.hasMailbox} />
                        </div>

                        <div className="flex items-center justify-between rounded-lg border p-3">
                            <div className="text-sm font-medium">Suppression</div>
                            <DeletedBadge isDeleted={admin.isDeleted} />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <ConfirmActionDialog
                open={confirmEnableOpen}
                onOpenChange={setConfirmEnableOpen}
                title="Activer cet admin ?"
                description={<><span className="font-bold">{admin.email}</span></>}
                confirmLabel="Activer"
                isBusy={isBusy}
                onConfirm={async () => {
                    await setStatus(admin.uuid, "enable");
                    setConfirmEnableOpen(false);
                    navigate(0);
                }}
            />

            <ConfirmActionDialog
                open={confirmDisableOpen}
                onOpenChange={setConfirmDisableOpen}
                title="Désactiver cet admin ?"
                description={<><span className="font-bold">{admin.email}</span></>}
                confirmLabel="Désactiver"
                isBusy={isBusy}
                onConfirm={async () => {
                    await setStatus(admin.uuid, "disable");
                    setConfirmDisableOpen(false);
                    navigate(0);
                }}
            />

            <ConfirmActionDialog
                open={confirmResetOpen}
                onOpenChange={setConfirmResetOpen}
                title="Réinitialiser le mot de passe ?"
                description={
                    <>
                        Un nouveau mot de passe va être généré. Il ne sera affiché qu&apos;une seule fois.
                        <br />
                        <span className="font-bold">{admin.email}</span>
                    </>
                }
                confirmLabel="Réinitialiser"
                isBusy={isBusy}
                onConfirm={async () => {
                    const res = await resetPassword(admin.uuid);
                    setResetResult({ email: res.email, newPassword: res.newPassword });
                    setConfirmResetOpen(false);
                    setResetResultOpen(true);
                }}
            />

            <ConfirmActionDialog
                open={confirmDeleteOpen}
                onOpenChange={setConfirmDeleteOpen}
                title="Supprimer cet admin ?"
                description={
                    <>
                        Suppression logique (soft-delete). Le compte ne pourra plus se connecter.
                        <br />
                        <span className="font-bold">{admin.email}</span>
                    </>
                }
                confirmLabel="Supprimer"
                isBusy={isBusy}
                onConfirm={async () => {
                    await deleteAdmin(admin.uuid);
                    setConfirmDeleteOpen(false);
                    navigate("/super-admin/admins");
                }}
            />

            {resetResult ? (
                <PasswordRevealDialog
                    open={resetResultOpen}
                    onOpenChange={(open) => {
                        setResetResultOpen(open);
                        if (!open) setResetResult(null);
                    }}
                    email={resetResult.email}
                    password={resetResult.newPassword}
                />
            ) : null}
        </div>
    );
}