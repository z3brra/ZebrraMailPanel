import type { AdminListItem } from "@/features/admins/types/admin.types";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { MoreHorizontal, CheckCircle2, Ban, Trash2, KeyRound } from "lucide-react";
import { useState } from "react";

type AdminRowActionsProps = {
    admin: AdminListItem;
    onEnable?: (uuid: string) => void;
    onDisable?: (uuid: string) => void;
    onSoftDelete?: (uuid: string) => void;
    onResetPassword?: (uuid: string) => void;
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

    const canEnable = !admin.active && !admin.isDeleted;
    const canDisable = admin.active && !admin.isDeleted;
    const canDelete = !admin.isDeleted;
    const canResetPassword = !admin.isDeleted;

    async function confirmDelete() {
        await onSoftDelete?.(admin.uuid);
        setConfirmDeleteOpen(false);
    }

    async function confirmEnable() {
        await onEnable?.(admin.uuid);
        setConfirmEnableOpen(false);
    }

    async function confirmDisable() {
        await onDisable?.(admin.uuid);
        setConfirmDisableOpen(false);
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
                        disabled={!canEnable}
                    >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Activer
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={() => setConfirmDisableOpen(true)}
                        disabled={!canDisable}
                    >
                        <Ban className="h-4 w-4 mr-2" />
                        Désactiver
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        onClick={() => onResetPassword?.(admin.uuid)}
                        disabled={!canResetPassword}
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

            <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer cet admin ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action effectue une suppression partielle. Le compte ne pourra plus se connecter et sera marqué comme supprimé.
                            <br />
                            <span className="font-bold">{admin.email}</span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isBusy}>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                void confirmDelete();
                            }}
                            disabled={isBusy}
                        >
                            Supprimer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={confirmEnableOpen} onOpenChange={setConfirmEnableOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Activer cet admin ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Le compte pourra se connecter.
                            <br />
                            <span className="font-bold">{admin.email}</span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isBusy}>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                void confirmEnable();
                            }}
                            disabled={isBusy}
                        >
                            Activer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={confirmDisableOpen} onOpenChange={setConfirmDisableOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Désactiver cet admin ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Le compte ne pourra plus se connecter..
                            <br />
                            <span className="font-bold">{admin.email}</span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isBusy}>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                void confirmDisable();
                            }}
                            disabled={isBusy}
                        >
                            Désactiver
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
