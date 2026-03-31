import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

import type { TokenListQuery } from "../tokens/types/token.types";

type Props = {
    value: TokenListQuery;
    onChange: (next: TokenListQuery) => void;
    onReset: () => void;
};

function boolToSelectValue(v: boolean | undefined): string {
    if (v === true) {
        return "true";
    }
    if (v === false) {
        return "false";
    }
    return "all";
}

function selectValueToBool(v: string): boolean | undefined {
    if (v === "true") {
        return true;
    }
    if (v === "false") {
        return false;
    }
    return undefined;
}

export function TokensFilter({ value, onChange, onReset}: Props) {
    return (
        <div className="rounded-lg border p-4 space-y-3">
            <Input
                placeholder="Rechercher par UUID ou nom..."
                value={value.q ?? ""}
                onChange={(e) => onChange({ ...value, q: e.target.value })}
            />

            <div className="flex flex-col gap-3 md:flex-row md:items-end">
                <div className="w-full md:w-44">
                    <div className="text-sm mb-1">Actif</div>
                    <Select
                        value={boolToSelectValue(value.active)}
                        onValueChange={(v) => onChange({ ...value, active: selectValueToBool(v) })}
                    >
                        <SelectTrigger><SelectValue placeholder="Tous" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tous</SelectItem>
                            <SelectItem value="true">Actifs</SelectItem>
                            <SelectItem value="false">Inactifs</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="w-full md:w-44">
                    <div className="text-sm mb-1">Révoqué</div>
                    <Select
                        value={boolToSelectValue(value.revoked)}
                        onValueChange={(v) => onChange({ ...value, revoked: selectValueToBool(v) })}
                    >
                        <SelectTrigger><SelectValue placeholder="Tous" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all" >Tous</SelectItem>
                            <SelectItem value="true" >Oui</SelectItem>
                            <SelectItem value="false" >Non</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="w-full md:w-44">
                    <div className="text-sm mb-1">Expiré</div>
                    <Select
                        value={boolToSelectValue(value.expired)}
                        onValueChange={(v) => onChange({ ...value, expired: selectValueToBool(v) })}
                    >
                        <SelectTrigger><SelectValue placeholder="Tous" /></SelectTrigger>
                        <SelectContent>
                        <SelectItem value="all">Tous</SelectItem>
                        <SelectItem value="true">Oui</SelectItem>
                        <SelectItem value="false">Non</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="w-full md:w-52">
                    <div className="text-sm mb-1">Créé par</div>
                    <Select
                        value={value.createdByAdminUuid ?? "all"}
                        onValueChange={(v) => onChange({ ...value, createdByAdminUuid: v === "all" ? undefined : v })}
                        disabled
                    >
                        <SelectTrigger><SelectValue placeholder="(bientôt)" /></SelectTrigger>
                        <SelectContent>
                        <SelectItem value="all">Tous</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Button variant="outline" type="button" onClick={onReset}>
                    Réinitialiser
                </Button>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-end">
                <div className="w-full md:w-52">
                    <div className="text-sm mb-1">Tri</div>
                    <Select
                        value={value.sort ?? "createdAt"}
                        onValueChange={(v) => onChange({ ...value, sort: v as any })}
                    >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="createdAt">Date de création</SelectItem>
                            <SelectItem value="expiresAt">Expiration</SelectItem>
                            <SelectItem value="lastUsedAt">Dernière utilisation</SelectItem>
                            <SelectItem value="name">Nom</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="w-full md:w-44">
                    <div className="text-sm mb-1">Ordre</div>
                    <Select
                        value={value.order ?? "desc"}
                        onValueChange={(v) => onChange({ ...value, order: v as any })}
                    >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="desc">Descendant</SelectItem>
                            <SelectItem value="asc">Ascendant</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}