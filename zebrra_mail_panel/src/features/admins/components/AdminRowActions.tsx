import type { AdminListItem } from "@/features/admins/types/admin.types";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, CheckCircle2, Ban, Trash2, KeyRound } from "lucide-react";

type AdminRowActionsProps = {
    admin: AdminListItem;
    onEnable?: (uuid: string) => void;
    onDisable?: (uuid: string) => void;
    onSoftDelete?: (uuid: string) => void;
    onResetPassword?: (uuid: string) => void;
}

export function AdminRowActions({
    admin,
    onEnable,
    onDisable,
    onSoftDelete,
    onResetPassword,
}: AdminRowActionsProps) {
    const canEnable = !admin.active && !admin.isDeleted;
    const canDisable = admin.active && !admin.isDeleted;
    const canDelete = !admin.isDeleted;
    const canResetPassword = !admin.isDeleted;

    return (
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
                    onClick={() => onSoftDelete?.(admin.uuid)}
                    disabled={!canDelete}
                >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
