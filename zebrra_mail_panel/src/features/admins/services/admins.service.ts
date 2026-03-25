import { http } from "@/lib/http";
import type {
    AdminCreatePayload,
    AdminListItem,
    AdminSearchQuery,
    ListResponse
} from "@/features/admins/types/admin.types";

type AdminListResponse = ListResponse<AdminListItem>;

function buildBody(input: Record<string, unknown>) {
    const out: Record<string, unknown> = {};

    for (const [k, v] of Object.entries(input)) {
        if (v === undefined || v === null) {
            continue;
        }

        if (typeof v === "string" && v.trim() === "") {
            continue;
        }
        out[k] = v;
    }
    return out;
}

function hasAnyFilter(q: AdminSearchQuery): boolean {
    return (
        (q.q !== undefined && q.q.trim() !== "") ||
        typeof q.active === "boolean" ||
        typeof q.deleted === "boolean" ||
        // typeof q.hasMailbox === "boolean"
        typeof q.hasMailbox === "boolean" ||
        (q.sort !== undefined && q.sort !== null) ||
        (q.order !== undefined && q.order !== null)
    );
}

export const adminsService = {
    async list(params?: { page?: number; limit?: number }): Promise<AdminListResponse> {
        const response = await http.get<AdminListResponse>("/admin/super-admin", {
            params: buildBody({
                page: params?.page,
                limit: params?.limit,
            }),
        });
        return response.data;
    },

    async search(
        query: AdminSearchQuery,
        params?: { page?: number; limit?: number }
    ): Promise<AdminListResponse> {
        const body = buildBody({
            q: query.q,
            active: query.active,
            deleted: query.deleted,
            hasMailbox: query.hasMailbox,
            sort: query.sort,
            order: query.order,
        });

        const response = await http.post<AdminListResponse>(
            "/admin/super-admin/search",
            body,
            {
                params: buildBody({
                    page: params?.page,
                    limit: params?.limit,
                }),
            }
        );

        return response.data;
    },

    async create(payload: AdminCreatePayload): Promise<void> {
        const body = buildBody({
            email: payload.email,
            plainPassword: payload.plainPassword,
            roles: payload.roles,
            active: payload.active,
            createMailUser: payload.createMailUser,
        });

        await http.post("/admin/super-admin", body);
    },

    hasAnyFilter,
}