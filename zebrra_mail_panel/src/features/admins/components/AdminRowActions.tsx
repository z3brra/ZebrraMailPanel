import { useState } from "react";
import type { AdminListItem } from "@/features/admins/types/admin.types";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ConfirmActionDialog } from "@/components/dialogs/ConfirmActionDialog";
// import { PasswordRevealDialog } from "@/components/dialogs/PasswordRevealDialog";


import { MoreHorizontal, CheckCircle2, Ban, Trash2, KeyRound } from "lucide-react";
import { SecretRevealDialog } from "@/components/dialogs/SecretRevealDialog";

type ResetPasswordResponse = {
    adminUuid: string;
    email: string;
    newPassword: string;
};


type AdminRowActionsProps = {
    admin: AdminListItem;
    onEnable?: (uuid: string) => void;
    onDisable?: (uuid: string) => void;
    onSoftDelete?: (uuid: string) => void;
    onResetPassword?: (uuid: string) => Promise<ResetPasswordResponse>;
    isBusy: boolean;
}

export function AdminRowActions({
    admin,
    onEnable,
    onDisable,
    onSoftDelete,
    onResetPassword,
    isBusy = false,
}: AdminRowActionsProps) {
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false)
    const [confirmEnableOpen, setConfirmEnableOpen] = useState<boolean>(false);
    const [confirmDisableOpen, setConfirmDisableOpen] = useState<boolean>(false);
    const [confirmResetOpen, setConfirmResetOpen] = useState<boolean>(false);

    const [resetResultOpen, setResetResultOpen] = useState<boolean>(false);
    const [resetResult, setResetResult] = useState<{ email: string; newPassword: string } | null>(null);

    const canEnable = !admin.active && !admin.isDeleted;
    const canDisable = admin.active && !admin.isDeleted;
    const canDelete = !admin.isDeleted;
    const canResetPassword = !admin.isDeleted;

    async function handleResetConfirm() {
        const response = await onResetPassword?.(admin.uuid);
        if (!response) {
            setConfirmResetOpen(false);
            return;
        }
        setResetResult({ email: response.email, newPassword: response.newPassword });
        setConfirmResetOpen(false);
        setResetResultOpen(true);
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Actions">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        onClick={() => setConfirmEnableOpen(true)}
                        disabled={!canEnable || isBusy}
                    >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Activer
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={() => setConfirmDisableOpen(true)}
                        disabled={!canDisable || isBusy}
                    >
                        <Ban className="h-4 w-4 mr-2" />
                        Désactiver
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        onClick={() => setConfirmResetOpen(true)}
                        disabled={!canResetPassword || isBusy}
                    >
                        <KeyRound className="h-4 w-4 mr-2" />
                        Réinitialiser le mot de passe
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        onClick={() => setConfirmDeleteOpen(true)}
                        disabled={!canDelete}
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <ConfirmActionDialog
                open={confirmEnableOpen}
                onOpenChange={setConfirmEnableOpen}
                title="Activer cet admin ?"
                description={
                    <>
                        Le compte pourra se connecter.
                        <br />
                        <span className="font-bold">{admin.email}</span>
                    </>
                }
                confirmLabel="Activer"
                isBusy={isBusy}
                onConfirm={async () => {
                    await onEnable?.(admin.uuid);
                    setConfirmEnableOpen(false);
                }}
            />

            <ConfirmActionDialog
                open={confirmDisableOpen}
                onOpenChange={setConfirmDisableOpen}
                title="Désactiver cet admin ?"
                description={
                    <>
                        Le compte ne pourra plus se connecter.
                        <br />
                        <span className="font-bold">{admin.email}</span>
                    </>
                }
                confirmLabel="Désactiver"
                isBusy={isBusy}
                onConfirm={async () => {
                    await onDisable?.(admin.uuid);
                    setConfirmDisableOpen(false);
                }}
            />

            <ConfirmActionDialog
                open={confirmResetOpen}
                onOpenChange={setConfirmResetOpen}
                title="Réinitialiser le mot de passe ?"
                description={
                    <>
                        Un nouveau mot de passe va être généré. Il ne sera affiché qu'une seul fois.
                        <br />
                        <span className="font-bold">{admin.email}</span>
                    </>
                }
                confirmLabel="Réinitialiser"
                isBusy={isBusy}
                onConfirm={handleResetConfirm}
            />

            <ConfirmActionDialog
                open={confirmDeleteOpen}
                onOpenChange={setConfirmDeleteOpen}
                title="Supprimer cet admin ?"
                description={
                    <>
                        Cette action effectue une suppression partielle. Le compte ne pourra plus se connecter et sera marqué comme supprimé.
                        <br />
                        <span className="font-bold">{admin.email}</span>
                    </>
                }
                confirmLabel="Supprimer"
                isBusy={isBusy}
                onConfirm={async () => {
                    await onSoftDelete?.(admin.uuid);
                    setConfirmDeleteOpen(false);
                }}
            />

            {resetResult ? (
                // <PasswordRevealDialog
                //     open={resetResultOpen}
                //     onOpenChange={(open) => {
                //         setResetResultOpen(open);
                //         if (!open) setResetResult(null);
                //     }}
                //     email={resetResult.email}
                //     password={resetResult.newPassword}
                // />
                <SecretRevealDialog
                    open={resetResultOpen}
                    onOpenChange={(open) => {
                        setResetResultOpen(open);
                        if (!open) setResetResult(null);
                    }}
                    title="Nouveau mot de passe"
                    description="Copie ce mot de passe maitnenant : il ne sera plus affiché ensuite."
                    label="Compte"
                    labelValue={resetResult.email}
                    secret={resetResult.newPassword}
                />
            ) : null}
        </>
    );
}
