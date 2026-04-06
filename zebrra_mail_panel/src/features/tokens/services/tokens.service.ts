import { http } from "@/lib/http";
import type {
    ListResponse,
    TokenCreatePayload,
    TokenCreateResponse,
    TokenListItem,
    TokenListQuery,
    TokenRead
} from "../types/token.types";

function buildBody(input: Record<string, unknown>) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(input)) {
        if (v === undefined || v === null) {
            continue;
        }
        if (typeof v === "string" && v.trim() === "") {
            continue;
        }
        if (Array.isArray(v) && v.length === 0) {
            continue;
        }
        out[k] = v;
    }
    return out;
}

export const tokenService = {
    async list(params?: { page?: number, limit?: number }): Promise<ListResponse<TokenListItem>> {
        const response = await http.get("/admin/tokens", { params: buildBody(params ?? {}) });
        return response.data;
    },

    async search(
        query: TokenListQuery,
        params?: { page?: number, limit?: number }
    ): Promise<ListResponse<TokenListItem>> {
        const body = buildBody({
            q: query.q,
            active: query.active,
            revoked: query.revoked,
            expired: query.expired,
            createdByAdminUuid: query.createdByAdminUuid,
            sort: query.sort,
            order: query.order,
        });

        const response = await http.post("/admin/tokens/search", body, {
            params: buildBody(params ?? {}),
        });

        return response.data;
    },

    hasAnyFilter(query: TokenListQuery): boolean {
        return (
            (query.q !== undefined && query.q.trim() !== "") ||
            typeof query.active === "boolean" ||
            typeof query.revoked === "boolean" ||
            typeof query.expired === "boolean" ||
            (query.createdByAdminUuid !== undefined && query.createdByAdminUuid.trim() !== "")
        );
    },

    async crete(payload: TokenCreatePayload): Promise<TokenCreateResponse> {
        const body = buildBody({
            name: payload.name,
            permissions: payload.permissions,
            scopedDomainUuids: payload.scopedDomainUuids,
            expiresAt: payload.expiresAt,
        });

        const response = await http.post("/admin/tokens", body);
        return response.data.data;
    },

    async get(uuid: string): Promise<TokenRead> {
        const response = await http.get(`/admin/tokens/${uuid}`);
        return response.data.data;
    },

    async revoke(uuid: string): Promise<void> {
        await http.post(`/admin/tokens/${uuid}/revoke`);
    },

    async rotate(uuid: string): Promise<TokenCreateResponse> {
        const response = await http.post(`/admin/tokens/${uuid}/rotate`);
        return response.data.data;
    },
};