import { useEffect, useState } from "react";
import { extractUiErrorFromUnknown } from "@/services/api-error-messages";
import { fetchDomainOptions } from "../services/domains-options.service";
import type { DomainOption } from "../services/domains-options.service";

export function useDomainOptions(open: boolean) {
    const [items, setItems] = useState<DomainOption[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<{ title: string; message: string } | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function run() {
            setIsLoading(true);
            setError(null);

            try {
                const data = await fetchDomainOptions();
                if (!cancelled) {
                    setItems(data);
                }
            } catch (error) {
                if (!cancelled) {
                    const ui = extractUiErrorFromUnknown(error);
                    setError(ui ?? {
                        title: "Erreur",
                        message: "Impossible de charger les domaines."
                    })
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }

        if (open) void run();

        return () => {
            cancelled = true;
        }
    }, [open]);

    return {
        items,
        isLoading,
        error
    };
}