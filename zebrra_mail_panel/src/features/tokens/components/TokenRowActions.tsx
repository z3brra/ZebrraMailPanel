import { useState } from "react";
import type { TokenListItem } from "../types/token.types";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { ConfirmActionDialog } from "@/components/dialogs/ConfirmActionDialog";
import { SecretRevealDialog } from "@/components/dialogs/SecretRevealDialog";

import { MoreHorizontal, RotateCcw, Ban } from "lucide-react";

type RotateResult = {
    uuid: string;
    token: string;
};

type TokenRowActionsProps = {
    token: TokenListItem;
    onRotate?: (uuid: string) => Promise<RotateResult>
    onRevoke?: (uuid: string) => Promise<void>;
    isBusy?: boolean;
    onAfterRotate?: () => void;
};

export function TokenRowActions({
    token,
    onRotate,
    onRevoke,
    isBusy = false,
    onAfterRotate,
}: TokenRowActionsProps) {
    const [confirmRotateOpen, setConfirmRotateOpen] = useState<boolean>(false);
    const [confirmRevokeOpen, setConfirmRevokeOpen] = useState<boolean>(false);

    const [revealOpen, setRevealOpen] = useState<boolean>(false);
    const [rotatedToken, setRotatedToken] = useState<string | null>(null);

    const canRevoke = token.active && !token.revokedAt;
    const canRotate = token.active && !token.revokedAt;

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Actions"
                        disabled={isBusy}
                    >
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        onClick={() => setConfirmRotateOpen(true)}
                        disabled={!canRotate || isBusy}
                    >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Rotation
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        onClick={() => setConfirmRevokeOpen(true)}
                        disabled={!canRevoke || isBusy}
                    >
                        <Ban className="h-4 w-4 mr-2" />
                        Révoquer
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <ConfirmActionDialog
                open={confirmRotateOpen}
                onOpenChange={setConfirmRotateOpen}
                title="Faire une rotation du token ?"
                description={
                    <>
                        Un nouveau token sera généré et l'ancien ne devra plus être utilisé.
                        <br />
                        <span className="font-bold">{token.name}</span>
                    </>
                }
                confirmLabel="Rotation"
                isBusy={isBusy}
                onConfirm={async () => {
                    const response = await onRotate?.(token.uuid);
                    setConfirmRotateOpen(false);

                    if (response?.token) {
                        setRotatedToken(response.token);
                        setRevealOpen(true);
                    }
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
                    await onRevoke?.(token.uuid);
                    setConfirmRevokeOpen(false);
                }}
            />

            {rotatedToken ? (
                <SecretRevealDialog
                    open={revealOpen}
                    onOpenChange={(open) => {
                        setRevealOpen(open);
                        if (!open) {
                            setRotatedToken(null);
                            onAfterRotate?.();
                        }
                    }}
                    title="Nouveau token généré"
                    description="Copie ce token maintenant : Il ne sera plus affiché ensuite."
                    label="Token"
                    labelValue={token.name}
                    secret={rotatedToken}
                />
            ) : null}
        </>
    )
}