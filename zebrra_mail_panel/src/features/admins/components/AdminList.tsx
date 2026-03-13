import { useMemo } from "react";
import type { AdminListItem, AdminSearchQuery, PaginationMeta } from "@/features/admins/types/admin.types";
import { applyAdminQuery, paginate } from "@/features/admins/utils/admin.filters";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination";
import { AdminItem } from "./AdminItem";

// import { ActiveBadge, DeletedBadge, MailboxBadge, RoleBadge } from "./AdminBadges";
// import { AdminRowActions } from "./AdminRowActions";

type AdminListProps = {
    items: AdminListItem[];
    query: AdminSearchQuery;
    page: number;
    perPage: number;
    onPageChange: (page: number) => void;

    onView?: (uuid: string) => void;
    onEnable?: (uuid: string) => void;
    onDisable?: (uuid: string) => void;
    onSoftDelete?: (uuid: string) => void;
    onResetPassword?: (uuid: string) => void;
};

function buildMeta(
    page: number,
    perPage: number,
    total: number,
    totalPages: number,
    query: AdminSearchQuery
): PaginationMeta {
    return {
        page,
        perPage,
        total,
        totalPages,
        sort: query.sort ?? null,
        order: query.order ?? null,
    };
}

export function AdminList({
    items,
    query,
    page,
    perPage,
    onPageChange,
    onView,
    onEnable,
    onDisable,
    onSoftDelete,
    onResetPassword
}: AdminListProps) {
    const filtered = useMemo(() => applyAdminQuery(items, query), [items, query]);
    const paged = useMemo(() => paginate(filtered, page, perPage), [filtered, page, perPage]);
    const meta = useMemo(
        () => buildMeta(paged.page, paged.perPage, paged.total, paged.totalPages, query),
        [paged, query]
    );

    const pages = useMemo(() => {
        return Array.from({ length: meta.totalPages }, (_, i) => i + 1);
    }, [meta.totalPages]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Admins</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                    Total : <span className="font-medium text-foreground">{meta.total}</span>
                </div>

                <div className="space-y-3">
                    { paged.data.length === 0 ? (
                        <div className="text-sm text-muted-foreground">Aucun résultat</div>
                    ) : (
                        paged.data.map((admin) => (
                            <AdminItem
                                key={admin.uuid}
                                admin={admin}
                                viewDisabled
                                onView={onView}
                                onEnable={onEnable}
                                onDisable={onDisable}
                                onSoftDelete={onSoftDelete}
                                onResetPassword={onResetPassword}
                            />
                        ))
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Page <span className="font-medium text-foreground">{meta.page}</span> / {meta.totalPages}
                    </div>

                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious onClick={() => onPageChange(Math.max(1, meta.page - 1))} />
                            </PaginationItem>

                            {pages.map((p) => (
                                <PaginationItem key={p}>
                                    <PaginationLink isActive={p === meta.page} onClick={() => onPageChange(p)}>
                                        {p}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}

                            <PaginationItem>
                                <PaginationNext onClick={() => onPageChange(Math.min(meta.totalPages, meta.page + 1))} />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </CardContent>
        </Card>
    );
}