import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { Plus } from "lucide-react";

// import { Button } from "@/components/ui/button";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

import type { TokenListQuery } from "@/features/tokens/types/token.types";
import { useTokensList } from "@/features/tokens/hooks/useTokenList";
import { useRotateToken } from "@/features/tokens/hooks/useRotateToken";
import { useRevokeToken } from "@/features/tokens/hooks/useRevokeToken";

import { TokensFilter } from "@/features/tokens/components/TokensFilters";
import { TokensList } from "@/features/tokens/components/TokensList";

import { CreateTokenDialog } from "@/features/tokens/components/CreateTokenDialog";

export function TokensPage() {
    const navigate = useNavigate();

    const [query, setQuery] = useState<TokenListQuery>({
        sort: "createdAt",
        order: "desc",
    });

    const [page, setPage] = useState<number>(1);
    const limit = 20;

    const debouncedQ = useDebouncedValue(query.q ?? "", 350);

    useEffect(() => {
        setPage(1);
    }, [debouncedQ]);

    const queryDebounced: TokenListQuery = {
        ...query,
        q: debouncedQ.trim() === "" ? undefined : debouncedQ,
    };

    const {
        items,
        meta,
        isLoading,
        error,
        refetch
    } = useTokensList({ query: queryDebounced, page, limit });

    const { rotate, isSubmitting: isRotating } = useRotateToken();
    const {revoke, isSubmitting: isRevoking } = useRevokeToken();

    const isBusy = isRotating || isRevoking;

    async function handleRotate(uuid: string) {
        return await rotate(uuid);
    }

    async function handleRevoke(uuid: string) {
        await revoke(uuid);
        refetch();
    }

    return (
        <>
            <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-lg font-semibold">API Tokens</div>
                        <div className="text-sm text-muted-foreground">
                            Gestion des clés d'accès API.
                        </div>
                    </div>

                    {/* <Button
                        onClick={() => navigate("/tokens/create")}
                        disabled
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Créer un token
                    </Button> */}
                    <CreateTokenDialog onCreated={refetch} />
                </div>

                <TokensFilter
                    value={query}
                    onChange={(next) => {
                        setQuery(next);
                        setPage(1);
                    }}
                    onReset={() => {
                        setQuery({ sort: "createdAt", order: "desc"});
                        setPage(1);
                    }}
                />

                <TokensList
                    items={items}
                    meta={meta}
                    isLoading={isLoading}
                    error={error}
                    onPageChange={setPage}
                    onView={(uuid) => navigate(`/tokens/${uuid}`)}
                    onRotate={handleRotate}
                    onRevoke={handleRevoke}
                    isBusy={isBusy}
                    onAfterRotate={refetch}
                />
            </div>
        </>
    );
}