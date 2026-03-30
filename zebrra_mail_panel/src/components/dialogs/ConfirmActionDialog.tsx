import React from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../ui/alert-dialog";

type ConfirmActionDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;

    title: string;
    description?: React.ReactNode;

    confirmLabel?: string;
    cancelLabel?: string;

    isBusy?: boolean;

    onConfirm: () => void | Promise<void>;
};

export function ConfirmActionDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmLabel = "Confirmer",
    cancelLabel = "Annuler",
    isBusy = false,
    onConfirm,
}: ConfirmActionDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    { description ? <AlertDialogDescription>{description}</AlertDialogDescription> : null }
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isBusy}>{cancelLabel}</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={isBusy}
                        onClick={(e) => {
                            e.preventDefault();
                            void onConfirm();
                        }}
                    >
                        {confirmLabel}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}