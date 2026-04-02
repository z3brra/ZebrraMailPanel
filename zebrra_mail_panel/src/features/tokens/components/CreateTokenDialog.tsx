import { useMemo, useState } from "react";
import { Plus, KeyRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { 
    Alert,
    AlertDescription,
    AlertTitle
} from "@/components/ui/alert";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";

import { ScrollArea } from "@/components/ui/scroll-area";

import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldContent,
    FieldError,
    FieldDescription
} from "@/components/ui/field";

import type { Permission } from "../types/token.types";
import { PERMISSIONS } from "../data/permissions";
import { useDomainOptions } from "../hooks/useDomainOptions";
import { useCreateToken } from "../hooks/useCreateToken";

import { DomainScopePicker } from "./DomainScopePicker";

import { SecretRevealDialog } from "@/components/dialogs/SecretRevealDialog";
import { DateTimePicker } from "@/components/custom/DateTimePicker";

type FormState = {
    name: string;
    expiresAt: string;
    permissions: Permission[];
    scopedDomainUuids: string[];
};

type CreateTokenDialogProps = {
    onCreated?: () => void;
};

export function CreateTokenDialog({
    onCreated,
}: CreateTokenDialogProps) {
    const [open, setOpen] = useState<boolean>(false);
    const {
        items: domainOptions,
        isLoading: domainsLoading,
        error: domainsError
    } = useDomainOptions(open);

    const { create, isSubmitting, error: createError, clearError } = useCreateToken();

    const [form, setForm] = useState<FormState>({
        name: "",
        expiresAt: "",
        permissions: [],
        scopedDomainUuids: [],
    });

    const [errors, setErrors] = useState<{ name?: string; expiresAt?: string; permissions?: string }>({});

    const [revealOpen, setRevealOpen] = useState<boolean>(false);
    const [createdToken, setCreatedToken] = useState<{ uuid: string; token: string } | null>(null);

    const canSubmit = useMemo(() => {
        return form.name.trim() !== "" && form.permissions.length > 0 && form.expiresAt.trim() !== "";
    }, [form]);

    function resetAll() {
        setForm({ name: "", expiresAt: "", permissions: [], scopedDomainUuids: [] });
        setErrors({});
        clearError();
        setCreatedToken(null);
        setRevealOpen(false);
    }

    function handleClose(next: boolean) {
        setOpen(next);
        if (!next) {
            resetAll();
        }
    }

    function togglePermission(p: Permission, checked: boolean) {
        setForm((s) => {
            const set = new Set(s.permissions);
            if (checked) {
                set.add(p);
            } else {
                set.delete(p);
            }
            return { ...s, permissions: Array.from(set) as Permission[] };
        });
    }

    function validate(): boolean {
        const next: typeof errors = {};
        if (!form.name.trim()) {
            next.name = "Nom requis.";
        }
        if (!form.expiresAt.trim()) {
            next.expiresAt = "Date d'expiration requise.";
        }
        if (form.permissions.length === 0) {
            next.permissions = "Sélectionne au moins une permission.";
        }
        setErrors(next);
        return Object.keys(next).length === 0;
    }

    async function submit(e: React.ChangeEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!validate()) {
            return;
        }

        const response = await create({
            name: form.name.trim(),
            permissions: form.permissions,
            scopedDomainUuids: form.scopedDomainUuids.length ? form.scopedDomainUuids : undefined,
            expiresAt: form.expiresAt,
        });

        setCreatedToken(response);
        setRevealOpen(true);
    }

    return (
        <>
            <Dialog open={open} onOpenChange={handleClose}>
                <DialogTrigger asChild>
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Créer un token
                    </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Créer un token API</DialogTitle>
                        <DialogDescription>
                            Définis un nom, les permissions, un scope éventuel par domaines et une expiration.
                        </DialogDescription>
                    </DialogHeader>

                    <ScrollArea className="max-h-[75vh] pr-4">
                        <form onSubmit={submit} className="space-y-6">
                            {createError ? (
                                <Alert variant="destructive">
                                    <AlertTitle>{createError.title}</AlertTitle>
                                    <AlertDescription>{createError.message}</AlertDescription>
                                </Alert>
                            ) : null}

                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="name">Nom</FieldLabel>
                                    <FieldContent>
                                        <Input
                                            id="name"
                                            placeholder="Ex : Accès API partenaire"
                                            value={form.name}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm((s) => ({ ...s, name: e.target.value }))}
                                            disabled={isSubmitting}
                                        />
                                    </FieldContent>
                                    {errors.name ? <FieldError>{errors.name}</FieldError> : null}
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="expiresAt">Expiration</FieldLabel>
                                    <FieldContent>
                                        <DateTimePicker
                                            value={form.expiresAt || undefined}
                                            onChange={(v) => setForm((s) => ({ ...s, expiresAt: v ?? ""}))}
                                            disabled={isSubmitting}
                                            placeholder="Choisir une date et une heure..."
                                        />
                                    </FieldContent>
                                    <FieldDescription>Date et heure d'expiration du token.</FieldDescription>
                                    {errors.expiresAt ? <FieldError>{errors.expiresAt}</FieldError> : null}
                                </Field>
                            </FieldGroup>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Scope domaines</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {domainsError ? (
                                        <div className="text-sm text-destructive">
                                            {domainsError.message}
                                        </div>
                                    ) : null}

                                    <DomainScopePicker
                                        options={domainOptions}
                                        selectedUuids={form.scopedDomainUuids}
                                        onChange={(next) => setForm((s) => ({ ...s, scopedDomainUuids: next }))}
                                        disabled={isSubmitting || domainsLoading}
                                    />
                                </CardContent>
                            </Card>

                            <div className="space-y-2">
                                <div className="text-sm font-medium">Permissions</div>
                                { errors.permissions ? <div className="text-sm text-destructive">{errors.permissions}</div> : null}

                                <div className="grid gap-4 md:grid-cols-2">
                                    {PERMISSIONS.map((group) => (
                                        <Card key={group.key}>
                                            <CardHeader>
                                                <CardTitle className="text-base flex items-center gap-2">
                                                    <KeyRound className="h-4 w-4 opacity-70" />
                                                    { group.title }
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                {group.items.map((p) => {
                                                    const checked = form.permissions.includes(p.value);
                                                    return (
                                                        <label key={p.value} className="flex items-center gap-2 text-sm">
                                                            <Checkbox
                                                                checked={checked}
                                                                onCheckedChange={(v) => togglePermission(p.value, v === true)}
                                                                disabled={isSubmitting}
                                                            />
                                                            <span>{p.label}</span>
                                                        </label>
                                                    );
                                                })}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>

                            <DialogFooter className="gap-2 sm:gap-0 pb-2">
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
                    </ScrollArea>
                </DialogContent>
            </Dialog>

            { createdToken ? (
                <SecretRevealDialog
                    open={revealOpen}
                    onOpenChange={(o) => {
                        setRevealOpen(o);
                        if (!o) {
                            setCreatedToken(null);
                            onCreated?.();
                            handleClose(false);
                        }
                    }}
                    title="Token crée"
                    description="Copie ce token maintenant : il ne sera plus affiché ensuite."
                    label="Token"
                    labelValue={form.name.trim() || "Token"}
                    secret={createdToken.token}
                />
            ) : null}
        </>
    );

}