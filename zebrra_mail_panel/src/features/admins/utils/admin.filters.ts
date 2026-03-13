import type {
    AdminListItem,
    AdminSearchQuery,
    AdminSort,
    SortOrder
} from "@/features/admins/types/admin.types";

export function applyAdminQuery(items: AdminListItem[], query: AdminSearchQuery): AdminListItem[]
{
    let out = [...items];

    if (query.q && query.q.trim()) {
        const q = query.q.trim().toLowerCase();
        out = out.filter((admin) => admin.email.toLowerCase().includes(q));
    }

    if (typeof query.active === "boolean") {
        out = out.filter((admin) => admin.active === query.active);
    }

    if (typeof query.deleted === "boolean") {
        out = out.filter((admin) => admin.isDeleted === query.deleted);
    }

    const sort: AdminSort = query.sort ?? "createdAt";
    const order: SortOrder = query.order ?? "desc";

    out.sort((a, b) => {
        let va: string | number | boolean = "";
        let vb: string | number | boolean = "";

        if (sort === "email") {
            va = a.email.toLowerCase();
            vb = b.email.toLowerCase();
        } else if (sort === "createdAt") {
            va = new Date(a.createdAt).getTime();
            vb = new Date(b.createdAt).getTime();
        } else if (sort === "active") {
            va = a.active ? 1 : 0;
            vb = b.active ? 1 : 0;
        }

        if (va < vb) {
            return order === "asc" ? -1 : 1;
        }
        if (va > vb) {
            return order === "asc" ? 1 : -1;
        }
        return 0;
    });

    return out;
}

export function paginate<T>(items: T[], page: number, perPage: number) {
    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const start = (safePage - 1) * perPage;
    const data = items.slice(start, start + perPage);

    return { data, total, totalPages, page: safePage, perPage };
}