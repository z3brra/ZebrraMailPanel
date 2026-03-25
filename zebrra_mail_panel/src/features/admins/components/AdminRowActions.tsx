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
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false);

    const canEnable = !admin.active && !admin.isDeleted;
    const canDisable = admin.active && !admin.isDeleted;
    const canDelete = !admin.isDeleted;
    const canResetPassword = !admin.isDeleted;

    async function confirmDelete() {
        await onSoftDelete?.(admin.uuid);
        setConfirmOpen(false);
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
                        onClick={() => onEnable?.(admin.uuid)}
                        disabled={!canEnable}
                    >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Activer
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={() => onDisable?.(admin.uuid)}
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
                        onClick={() => setConfirmOpen(true)}
                        disabled={!canDelete}
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
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
        </>
    );
}
