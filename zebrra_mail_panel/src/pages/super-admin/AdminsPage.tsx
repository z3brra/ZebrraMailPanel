import { useEffect, useState } from "react";
import { AdminFilters } from "@/features/admins/components/AdminFilters";
import { AdminList } from "@/features/admins/components/AdminList";
import type { AdminSearchQuery } from "@/features/admins/types/admin.types";

import { useAdminsList } from "@/features/admins/hooks/useAdminsList";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

export function AdminsPage() {
    const [query, setQuery] = useState<AdminSearchQuery>({
        sort: "createdAt",
        order: "desc",
    });

    const [page, setPage] = useState(1);
    const limit = 2;

    const debouncedQ = useDebouncedValue(query.q ?? "", 350);

    const queryDebounced = {
        ...query,
        q: debouncedQ.trim() === "" ? undefined : debouncedQ,
    };

    useEffect(() => {
        setPage(1);
    }, [debouncedQ]);

    const {
        items,
        meta,
        isLoading,
        error
    } = useAdminsList({ query: queryDebounced, page, limit });

    return (
        <div className="p-6 space-y-4">
            <AdminFilters
                value={query}
                onChange={(next) => {
                    setQuery(next);
                    setPage(1);
                }}
                onReset={() => {
                    setQuery({ sort: "createdAt", order: "desc" });
                    setPage(1);
                }}
            />

            <AdminList
                items={items}
                meta={meta}
                isLoading={isLoading}
                error={error}
                onPageChange={setPage}
                onView={() => {}}
                onEnable={() => {}}
                onDisable={() => {}}
                onSoftDelete={() => {}}
                onResetPassword={() => {}}
            />
        </div>
    );
}