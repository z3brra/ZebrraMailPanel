import type { TokenListItem, PaginationMeta } from "../types/token.types";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";

import { TokenItem } from "./TokenItem";

type TokenListProps = {
    items: TokenListItem[];
    meta: PaginationMeta | null;
    isLoading?: boolean;
    error?: { title: string; message: string } | null;

    onPageChange: (page: number) => void;
    onView?: (uuid: string) => void;

    onRotate?: (uuid: string) => Promise<{ uuid: string; token: string }>;
    onRevoke?: (uuid: string) => Promise<void>;
    isBusy?: boolean;

    onAfterRotate?: () => void;
};

export function TokensList({
    items,
    meta,
    isLoading,
    error,
    onPageChange,
    onView,
    onRotate,
    onRevoke,
    isBusy = false,
    onAfterRotate,
}: TokenListProps) {
    const totalPages = meta?.totalPages ?? 1;
    const page = meta?.page ?? 1;
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <Card>
            <CardHeader>
                <CardTitle>API Tokens</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                {meta ? (
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
                            items.map((t) =>
                                <TokenItem
                                    key={t.uuid}
                                    token={t}
                                    onView={onView}
                                    onRotate={onRotate}
                                    onRevoke={onRevoke}
                                    isBusy={isBusy}
                                    onAfterRotate={onAfterRotate}
                                />
                            )
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
    )
}