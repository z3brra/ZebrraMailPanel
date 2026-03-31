export type Permission = 
    | "domains.read"
    | "domains.create"
    | "domains.disable"
    | "domains.enable"
    | "users.read"
    | "users.create"
    | "users.disable"
    | "users.enable"
    | "users.update_password"
    | "aliases.read"
    | "aliases.create"
    | "aliases.delete"
    | "mail.send"
    | "audit.read";

export type TokenCreatePayload = {
    name: string;
    permissions: Permission[];
    scopedDomainUuids?: string[];
    expiresAt: string;
};

export type TokenCreateResponse = {
    uuid: string;
    token: string;
}

export type TokenCreatedBy = {
    uuid: string;
    email: string;
};

export type TokenListItem = {
    uuid: string;
    name: string;
    active: boolean;
    expiresAt: string;
    createdAt: string;
    lastUsedAt: string | null;
    revokedAt: string | null;
    createdBy: TokenCreatedBy;
};

export type TokenRead = {
    uuid: string;
    name: string;
    active: boolean;
    expiresAt: string;
    createdAt: string;
    lastUsedAt: string | null;
    revokedAt: string | null;
    permissions: Permission[];
    scopedDomainUuids: string[];
};

export type TokenListQuery = {
    q?: string;
    active?: boolean;
    revoked?: boolean;
    expired?: boolean;
    createdByAdminUuid?: string;
    sort?: "createdAt" | "lastUsedAt" | "expiresAt" | "name";
    order?: "asc" | "desc";
};

export type PaginationMeta = {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
    sort?: string | null;
    order?: string | null;
};

export type ListResponse<T> = {
    data: T[];
    meta: PaginationMeta;
};

