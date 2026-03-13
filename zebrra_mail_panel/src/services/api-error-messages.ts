import type { ApiErrorCode, ApiErrorResponse } from "@/lib/api.types";

export type UiError = {
    title: string;
    message: string;
};

const DEFAULT: UiError = {
    title: "Erreur",
    message: "Une erreur est survenue. Merci de réessayer.",
};

const CODE_MAP: Record<ApiErrorCode, UiError> = {
    AUTH_REQUIRED: {
        title: "Connexion requise",
        message: "La session n'est pas valide. Merci de vous connecter.",
    },
    AUTH_INVALID: {
        title: "Identifiants invalides",
        message: "Email ou mot de passe incorrect.",
    },
    BAD_REQUEST: {
        title: "Requête invalide",
        message: "La requête est incorrecte. Vérifiez les informations envoyées.",
    },
    FORBIDDEN: {
        title: "Accès refusé",
        message: "Vous n'avez pas les droits nécessaire pour effectuer cette action.",
    },
    SCOPE_VIOLATION: {
        title: "Accès refusé",
        message: "Vous n'avez pas le périmètre requis pour cette action.",
    },
    NOT_FOUND: {
        title: "Introuvable",
        message: "La ressource demandée est introuvable.",
    },
    CONFLICT: {
        title: "Conflit",
        message: "Cette action est en conflit avec l'état actuel des données.",
    },
    VALIDATION_ERROR: {
        title: "Données invalides",
        message: "Certaines informations sont invalides. Vérifiez les champs saisis.",
    },
    RATE_LIMITED: {
        title: "Trop de requêtes",
        message: "Trop de tentatives. Merci de réessayer dans quelques minutes.",
    },
    INTERNAL_ERROR: {
        title: "Erreur survenue",
        message: "Une erreur interne est survenue. Merci de réessayer plus tard."
    },
};

function clean(s: string) {
    return String(s ?? "").trim();
}

export function toUiError(
    apiError: ApiErrorResponse["error"],
    opts?: { preferApiMessage?: boolean }
): UiError {
    const mapped = CODE_MAP[apiError.code] ?? DEFAULT;

    const apiMessage = clean(apiError.message);
    const preferApiMessage = opts?.preferApiMessage ?? false;

    return {
        title: mapped.title,
        message: preferApiMessage && apiMessage ? apiMessage : mapped.message,
    };
}

export function extractUiErrorFromUnknown(error: unknown): UiError | null {
    const anyError = error as any;
    const data = anyError?.response?.data;

    if (data && typeof data === "object" && typeof data.error?.code === "string") {
        const error = data.error as ApiErrorResponse["error"];
        return toUiError(error);
    }

    return null;
}