import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import type { DomainOption } from "../services/domains-options.service";

type DomainScopePickerProps = {
    options: DomainOption[];
    selectedUuids: string[];
    onChange: (next: string[]) => void;
    disabled?: boolean;
};

export function DomainScopePicker({
    options,
    selectedUuids,
    onChange,
    disabled,
}: DomainScopePickerProps) {
    const selected = selectedUuids
        .map((uuid) => options.find((option) => option.uuid === uuid))
        .filter(Boolean) as DomainOption[];

    return (
        <div className="space-y-2">
            <Select
                disabled={disabled}
                value="__none__"
                onValueChange={(uuid) => {
                    if (uuid === "__none__") return;
                    if (selectedUuids.includes(uuid)) return;
                    onChange([...selectedUuids, uuid]);
                }}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un domaine..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="__none__">_</SelectItem>
                    {options.map((domain) => (
                        <SelectItem key={domain.uuid} value={domain.uuid}>
                            {domain.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {selected.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {selected.map((d) => (
                        <Badge key={d.uuid} className="gap-1 border-transparent">
                            {d.name}
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5"
                                onClick={() => onChange(selectedUuids.filter((u) => u !== d.uuid))}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    ))}
                </div>
            ) : (
                <div className="text-xs text-muted-foreground">
                    Aucun scope : le token pourra accéder à tous les domaines.
                </div>
            )}
        </div>
    );
}