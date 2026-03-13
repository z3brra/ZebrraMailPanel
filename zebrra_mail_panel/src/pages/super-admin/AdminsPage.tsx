import { useMemo, useState } from "react";
import { AdminFilters } from "@/features/admins/components/AdminFilters";
// import { AdminList } from "@/features/admins/components/AdminList";
import { AdminList } from "@/features/admins/components/AdminList";
import { mockAdmins } from "@/features/admins/data/admin.mock";
import type { AdminSearchQuery } from "@/features/admins/types/admin.types";

export function AdminsPage() {
    const [query, setQuery] = useState<AdminSearchQuery>({
        sort: "createdAt",
        order: "desc",
    });

    const [page, setPage] = useState(1);
    const perPage = 10;

    const items = useMemo(() => mockAdmins, []);

    return (
        <div className="p-6 space-y-4">
            <AdminFilters
                value={query}
                onChange={(next) => {
                setQuery(next);
                setPage(1); // reset page si query change
                }}
                onReset={() => {
                setQuery({ sort: "createdAt", order: "desc" });
                setPage(1);
                }}
            />

            <AdminList
                items={items}
                query={query}
                page={page}
                perPage={perPage}
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