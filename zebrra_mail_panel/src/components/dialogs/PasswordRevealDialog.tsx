import { useEffect, useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";

type PasswordRevealDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;

    title?: string;
    description?: string;

    email: string;
    password: string;
};

export function PasswordRevealDialog({
    open,
    onOpenChange,
    title = "Nouveau mot de passe",
    description = "Copie ce mot de passe maintenant : Il ne sera plus affiché ensuite.",
    email,
    password,
}: PasswordRevealDialogProps) {
    const [copied, setCopied] = useState<boolean>(false);

    useEffect(() => {
        if (!open) {
            setCopied(false);
        }
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <div className="space-y-3">
                    <div className="text-sm">
                        Compte : <span className="font-bold">{email}</span>
                    </div>

                    <div className="rounded-md bg-muted p-3 font-mono text-sm break-all">
                        {password}
                    </div>

                    <div className="flex justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={async () => {
                                await navigator.clipboard.writeText(password);
                                setCopied(true);
                                window.setTimeout(() => setCopied(false), 1200);
                            }}
                        >
                            {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                            {copied ? "Copié" : "Copier"}
                        </Button>
                    </div>
                </div>

                <DialogFooter>
                    <Button type="button" onClick={() => onOpenChange(false)}>
                        Fermer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}