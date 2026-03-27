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

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";


import { MoreHorizontal, CheckCircle2, Ban, Trash2, KeyRound, Copy, Check } from "lucide-react";



type AdminRowActionsProps = {
    admin: AdminListItem;
    onEnable?: (uuid: string) => void;
    onDisable?: (uuid: string) => void;
    onSoftDelete?: (uuid: string) => void;
    onResetPassword?: (uuid: string) => Promise<{ adminUuid: string; email: string; newPassword: string }>;
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

    const canEnable = !admin.active && !admin.isDeleted;
    const canDisable = admin.active && !admin.isDeleted;
    const canDelete = !admin.isDeleted;
    const canResetPassword = !admin.isDeleted;

    const [resetResult, setResetResult] = useState<{ email: string; newPassword: string } | null>(null);
    const [copied, setCopied] = useState<boolean>(false);

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

    async function confirmReset() {
        const response = await onResetPassword?.(admin.uuid);
        if (response) {
            setResetResult({ email: response.email, newPassword: response.newPassword });
            setCopied(false);
            setConfirmResetOpen(false);
            setResetResultOpen(true);
        } else {
            setConfirmResetOpen(false);
        }
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

            <AlertDialog open={confirmResetOpen} onOpenChange={setConfirmResetOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Réinitialiser le mot de passe ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Un nouveau mot de passe va être généré. Il ne sera affiché qu'une seule fois.
                            <br />
                            <span className="font-bold">{admin.email}</span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isBusy}>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                void confirmReset();
                            }}
                            disabled={isBusy}
                        >
                            Réinitialiser
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Dialog
                open={resetResultOpen}
                onOpenChange={(open) => {
                    setResetResultOpen(open);
                    if (!open) setResetResult(null);
                }}
            >
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Nouveau mot de passe</DialogTitle>
                        <DialogDescription>
                            Copie ce mot de passe maintenant : il ne sera plus affiché ensuite.
                        </DialogDescription>
                    </DialogHeader>

                    { resetResult ? (
                        <div className="space-y-3">
                            <div className="text-sm">
                                Compte : <span className="font-bold">{resetResult.email}</span>
                            </div>

                            <div className="rounded-md bg-muted p-3 font-mono text-sm break-all">
                                {resetResult.newPassword}
                            </div>

                            <div className="flex gap-2 justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={async () => {
                                        await navigator.clipboard.writeText(resetResult.newPassword);
                                        setCopied(true);
                                        window.setTimeout(() => setCopied(false), 1200);
                                    }}
                                >
                                    {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                                    {copied ? "Copié" : "Copier"}
                                </Button>
                            </div>
                        </div>
                    ) : null}

                    <DialogFooter>
                        <Button type="button" onClick={() => setResetResultOpen(false)}>
                            Fermer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
