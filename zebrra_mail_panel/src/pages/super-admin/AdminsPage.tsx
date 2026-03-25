import { useEffect, useState } from "react";
import { AdminFilters } from "@/features/admins/components/AdminFilters";
import { AdminList } from "@/features/admins/components/AdminList";
import type { AdminSearchQuery } from "@/features/admins/types/admin.types";

import { AdminCreateDialog } from "@/features/admins/components/AdminCreateDialog";

import { useAdminsList } from "@/features/admins/hooks/useAdminsList";
import { useDeleteAdmin } from "@/features/admins/hooks/useDeleteAdmin";

import { useDebouncedValue } from "@/hooks/useDebouncedValue";


export function AdminsPage() {
    const [query, setQuery] = useState<AdminSearchQuery>({
        sort: "createdAt",
        order: "desc",
    });

    const [page, setPage] = useState(1);
    const limit = 20;

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
        error,
        refetch
    } = useAdminsList({ query: queryDebounced, page, limit });

    const { deleteAdmin, isSubmitting: isDeleting } = useDeleteAdmin();

    async function handleSoftDelete(uuid: string) {
        await deleteAdmin(uuid);
        refetch();
    }

    return (
        <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-lg font-semibold">Admins</div>
                    <div className="text-sm text-muted-foreground">
                        Gestion des comptes admin (réservé super-admin).
                    </div>
                </div>

                <AdminCreateDialog onCreated={refetch} />
            </div>
            
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
                onSoftDelete={handleSoftDelete}
                onResetPassword={() => {}}
                isDeleting={isDeleting}
            />
        </div>
    );
}