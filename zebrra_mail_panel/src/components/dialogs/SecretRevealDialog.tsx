import { useEffect, useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "../ui/dialog";

type SecretRevealDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;

    title: string;
    description: string;

    label: string;
    labelValue: string;

    secret: string;
};

export function SecretRevealDialog({
    open,
    onOpenChange,
    title,
    description,
    label,
    labelValue,
    secret,
}: SecretRevealDialogProps) {
    const [copied, setCopied] = useState<boolean>(false);

    useEffect(() => {
        if (!open) {
            setCopied(false);
        }
    }, [open]);

    return (
        <>
            <Dialog
                open={open}
                onOpenChange={onOpenChange}
            >
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>{description}</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3">
                        <div className="text-sm">
                            {label} : <span className="font-bold">{labelValue}</span>
                        </div>

                        <div className="rounded-md bg-muted p-3 font-mono text-sm break-all">
                            {secret}
                        </div>

                        <div className="flex justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={async () => {
                                    await navigator.clipboard.writeText(secret);
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
        </>
    )
}