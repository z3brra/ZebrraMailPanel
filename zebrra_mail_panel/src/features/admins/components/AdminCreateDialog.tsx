import React, { useMemo, useState } from "react";
import { Plus, Mail, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";

import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldContent,
    FieldDescription,
    FieldError
} from "@/components/ui/field";

import {
    Alert,
    AlertTitle,
    AlertDescription
} from "@/components/ui/alert";

import { cn } from "@/lib/utils";

import { useCreateAdmin } from "../hooks/useCreateAdmin";


type AdminCreateForm = {
    email: string;
    password: string;
    confirmPassword: string;
    createMailbox: boolean;
};

type AdminCreateDialogProps = {
    onCreated?: () => void;
};

export function AdminCreateDialog({
    onCreated,
}: AdminCreateDialogProps) {
    const [open, setOpen] = useState<boolean>(false);

    const {
        createAdmin,
        isSubmitting,
        error,
        clearError
    } = useCreateAdmin();

    const [form, setForm] = useState<AdminCreateForm>({
        email: "",
        password: "",
        confirmPassword: "",
        createMailbox: false,
    });

    const [errors, setErrors] = useState<Partial<Record<keyof AdminCreateForm, string>>>({});

    const canSubmit = useMemo(() => {
        return form.email.trim() !== "" && form.password !== "" && form.confirmPassword !== "";
    }, [form]);

    function reset() {
        setForm({ email: "", password: "", confirmPassword: "", createMailbox: false });
        setErrors({});
        clearError();
    }

    function validate(): boolean {
        const next: Partial<Record<keyof AdminCreateForm, string>> = {};

        const email = form.email.trim();
        if (!email) {
            next.email = "Email requis.";
        }

        if (!form.password) {
            next.password = "Mot de passe requis.";
        }

        if (!form.confirmPassword) {
            next.confirmPassword = "Confirmation requise.";
        }

        if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
            next.confirmPassword = "La confirmation ne correspond pas.";
        }

        setErrors(next);

        return Object.keys(next).length === 0;
    }

    function handleClose(nextOpen: boolean) {
        setOpen(nextOpen);
        if (!nextOpen) {
            reset();
        }
    }

    async function handleSubmit(event: React.ChangeEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!validate()) {
            return;
        }

        // onSubmit?.({
        //     email: form.email.trim(),
        //     plainPassword: form.password,
        //     createMailUser: form.createMailbox
        // });

        // handleClose(false);
        await createAdmin({
            email: form.email.trim(),
            plainPassword: form.password,
            createMailUser: form.createMailbox,
        });

        onCreated?.();
        handleClose(false);
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un admin
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Créer un admin</DialogTitle>
                    <DialogDescription>
                        Renseigne l'email et un mot de passe. Le compte sera créer avec le rôle admin.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    { error ? (
                        <Alert variant="destructive">
                            <AlertTitle>{error.title}</AlertTitle>
                            <AlertDescription>{error.message}</AlertDescription>
                        </Alert>
                    ) : null}

                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <FieldContent>
                                <div className="relative">
                                    <Mail className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-70" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="mail@example.com"
                                        className="pl-9"
                                        value={form.email}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setForm((s) => ({ ...s, email: event.target.value}))}
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </FieldContent>
                            { errors.email ? <FieldError>{errors.email}</FieldError> : null}
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
                            <FieldContent>
                                <div className="relative">
                                    <Lock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-70" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Mot de passe"
                                        className="pl-9"
                                        value={form.password}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setForm((s) => ({ ...s, password: event.target.value}))}
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </FieldContent>
                            { errors.password ? <FieldError>{errors.password}</FieldError> : null }
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="confirmPassword">Confirmer le mot de passe</FieldLabel>
                            <FieldContent>
                                <div className="relative">
                                    <Lock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-70" />
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="Confirmer le mot de passe"
                                        className="pl-9"
                                        value={form.confirmPassword}
                                        onChange={(e) => setForm((s) => ({ ...s, confirmPassword: e.target.value }))}
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </FieldContent>
                            {errors.confirmPassword ? <FieldError>{errors.confirmPassword}</FieldError> : null}
                        </Field>
                    </FieldGroup>

                    <div className={cn("rounded-lg border p-4", "bg-muted/40")}>
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                                <div className="text-sm font-medium">Créer une boîte mail</div>
                                <FieldDescription>
                                    Créer automatiquement une boîte mail pour ce compte.
                                </FieldDescription>
                            </div>

                            <Switch
                                checked={form.createMailbox}
                                onCheckedChange={(checked) =>
                                    setForm((s) => ({ ...s, createMailbox: checked }))
                                }
                                aria-label="Créer une boîte mail"
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleClose(false)}
                            disabled={isSubmitting}
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            disabled={!canSubmit || isSubmitting}
                        >
                            {isSubmitting ? "Création..." : "Créer"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}