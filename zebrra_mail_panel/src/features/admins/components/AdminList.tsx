import type { AdminListItem, PaginationMeta } from "@/features/admins/types/admin.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

// import { applyAdminQuery, paginate } from "@/features/admins/utils/admin.filters";
import { AdminItem } from "./AdminItem";

// import { ActiveBadge, DeletedBadge, MailboxBadge, RoleBadge } from "./AdminBadges";
// import { AdminRowActions } from "./AdminRowActions";

type AdminListProps = {
    items: AdminListItem[];
    meta: PaginationMeta | null;
    isLoading?: boolean;
    error?: { title: string; message: string } | null;

    onPageChange: (page: number) => void;

    onView?: (uuid: string) => void;
    onEnable?: (uuid: string) => void;
    onDisable?: (uuid: string) => void;
    onSoftDelete?: (uuid: string) => void;
    onResetPassword?: (uuid: string) => void;
};

// function buildMeta(
//     page: number,
//     perPage: number,
//     total: number,
//     totalPages: number,
//     query: AdminSearchQuery
// ): PaginationMeta {
//     return {
//         page,
//         perPage,
//         total,
//         totalPages,
//         sort: query.sort ?? null,
//         order: query.order ?? null,
//     };
// }

export function AdminList({
    items,
    meta,
    isLoading,
    error,
    onPageChange,
    onView,
    onEnable,
    onDisable,
    onSoftDelete,
    onResetPassword
}: AdminListProps) {
    const totalPages = meta?.totalPages ?? 1;
    const page = meta?.page ?? 1;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Admins</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                
                { meta ? (
                    <div className="text-sm text-muted-foreground">
                        Total : <span className="font-medium text-foreground">{meta.total}</span>
                    </div>
                ) : null}

                { error ? (
                    <div className="text-sm">
                        <div className="font-medium">{error.title}</div>
                        <div className="text-muted-foreground">{error.message}</div>
                    </div>
                ) : null}

                { isLoading ? (
                    <div className="text-sm text-muted-foreground">Chargement...</div>
                ) : (
                    <div className="space-y-3">
                        { items.length === 0 ? (
                            <div className="tex-sm text-muted-foreground">Aucun résultat</div>
                        ) : (
                            items.map((a) => (
                                <AdminItem
                                    key={a.uuid}
                                    admin={a}
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
                )}
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Page <span className="font-medium text-foreground">{page}</span> / {totalPages}
                    </div>

                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious onClick={() => onPageChange(Math.max(1, page - 1))} />
                            </PaginationItem>

                            {pages.map((p) => (
                                <PaginationItem key={p}>
                                    <PaginationLink isActive={p === page} onClick={() => onPageChange(p)}>
                                        {p}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}

                            <PaginationItem>
                                <PaginationNext onClick={() => onPageChange(Math.min(totalPages, page + 1))} />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </CardContent>
        </Card>
    );
}