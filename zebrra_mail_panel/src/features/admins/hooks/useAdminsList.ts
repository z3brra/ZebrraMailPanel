import { useEffect, useMemo, useRef, useState } from "react";
import type { AdminListItem, AdminSearchQuery, PaginationMeta } from "../types/admin.types";
import { adminsService } from "../services/admins.service";
import { extractUiErrorFromUnknown } from "@/services/api-error-messages";

type UseAdminsListArgs = {
    query: AdminSearchQuery;
    page: number;
    limit: number;
};

type UseAdminsListResult = {
    items: AdminListItem[],
    meta: PaginationMeta | null;
    isLoading: boolean;
    error: { title: string; message: string } | null;
    refetch: () => void;
};

export function useAdminsList({ query, page, limit }: UseAdminsListArgs): UseAdminsListResult {
    const [items, setItems] = useState<AdminListItem[]>([]);
    const [meta, setMeta] = useState<PaginationMeta | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<{ title: string; message: string } | null>(null);

    const refreshIndex = useRef(0);
    const refetch = () => {
        refreshIndex.current += 1;
        setIsLoading((v) => v);
    };

    const refreshKey = useMemo(
        () => `${refreshIndex.current}|${page}|${limit}|${JSON.stringify(query)}`,
        [page, limit, query]
    );

    useEffect(() => {
        let cancelled = false;

        async function run() {
            setIsLoading(true);
            setError(null);

            try {
                const shouldSearch = adminsService.hasAnyFilter(query);

                const response = shouldSearch
                    ? await adminsService.search(query, { page, limit })
                    : await adminsService.list({ page, limit });

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
                        message: "Impossible de charger la liste des admins.",
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
        };
    }, [refreshKey]);

    return {
        items,
        meta,
        isLoading,
        error,
        refetch
    };
}