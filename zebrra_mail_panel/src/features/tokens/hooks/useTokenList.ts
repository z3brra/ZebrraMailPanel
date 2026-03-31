import { useEffect, useMemo, useState } from "react";
import type { TokenListItem, TokenListQuery, PaginationMeta } from "../types/token.types";
import { tokenService } from "../services/tokens.service";
import { extractUiErrorFromUnknown } from "@/services/api-error-messages";

export function useTokensList(args: { query: TokenListQuery; page: number; limit: number }) {
    const { query, page, limit } = args;

    const [items, setItems] = useState<TokenListItem[]>([]);
    const [meta, setMeta] = useState<PaginationMeta | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<{ title: string; message: string } | null>(null);

    const [refreshKey, setRefreshKey] = useState<number>(0);
    const refetch = () => setRefreshKey((k) => k + 1);

    const queryKey = useMemo(() => JSON.stringify(query), [query]);

    useEffect(() => {
        let cancelled = false;

        async function run() {
            setIsLoading(true);
            setError(null);

            try {
                const shouldSearch = tokenService.hasAnyFilter(query);
                const response = shouldSearch
                    ? await tokenService.search(query, { page, limit })
                    : await tokenService.list({ page, limit });

                if (cancelled) {
                    return;
                }

                setItems(response.data);
                setMeta(response.meta);
            } catch (error) {
                if (cancelled) {
                    return;
                }
                const ui = extractUiErrorFromUnknown(error);
                setError(
                    ui ?? {
                        title: "Erreur",
                        message: "Impossible de charger les tokens."
                    }
                );
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }
        void run();
        return () => {
            cancelled = true;
        }
    }, [queryKey, page, limit, refreshKey]);

    return {
        items,
        meta,
        isLoading,
        error,
        refetch
    };
}