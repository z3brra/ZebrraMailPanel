import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

import type { AdminSearchQuery, AdminSort, SortOrder } from "@/features/admins/types/admin.types";

type AdminFilterProps = {
    value: AdminSearchQuery;
    onChange: (next: AdminSearchQuery) => void;
    onReset: () => void;
};

function boolToSelectValue(value: boolean | undefined): string {
    if (value === true) {
        return "true";
    }
    if (value === false) {
        return "false";
    }
    return "all";
}

function selectValueToBool(value: string): boolean | undefined {
    if (value === "true") {
        return true;
    }
    if (value === "false") {
        return false;
    }
    return undefined;
}

export function AdminFilters({
    value,
    onChange,
    onReset
}: AdminFilterProps) {
    return (
        <div className="flex flex-col gap-3 md:flex-row md:items-end">
            <div className="flex-1">
                <div className="text-sm mb-1">Recherche</div>
                <Input
                    placeholder="Email..."
                    value={value.q ?? ""}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChange({ ...value, q: event.target.value })}
                />
            </div>

            <div className="w-full md:w-44">
                <div className="text-sm mb-1">Actif</div>
                <Select
                    value={boolToSelectValue(value.active)}
                    onValueChange={(v) => onChange({ ...value, active: selectValueToBool(v) })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Tous" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous</SelectItem>
                        <SelectItem value="true">Actifs</SelectItem>
                        <SelectItem value="false">Inactifs</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="w-full md:w-44">
                <div className="text-sm mb-1">Supprimé</div>
                <Select
                    value={boolToSelectValue(value.deleted)}
                    onValueChange={(v) => onChange({ ...value, deleted: selectValueToBool(v) })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Tous" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous</SelectItem>
                        <SelectItem value="false">Non</SelectItem>
                        <SelectItem value="true">Oui</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="w-full md:w-44">
                <div className="text-sm mb-1">Tri</div>
                <Select
                    value={(value.sort ?? "createdAt") as AdminSort}
                    onValueChange={(v) => onChange({ ...value, sort: v as AdminSort })}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="createdAt">Date de création</SelectItem>
                        <SelectItem value="active">Actif</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="w-full md:w-32">
                <div className="text-sm mb-1">Ordre</div>
                <Select
                    value={(value.order ?? "desc") as SortOrder}
                    onValueChange={(v) => onChange({ ...value, order: v as SortOrder })}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="asc">Asc</SelectItem>
                        <SelectItem value="desc">Desc</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Button
                variant="outline"
                type="button"
                onClick={onReset}
            >
                Réinitialiser
            </Button>
        </div>
    );
}