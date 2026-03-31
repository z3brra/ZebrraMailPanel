import { useCallback, useState } from "react";
import type { TokenCreatePayload, TokenCreateResponse } from "../types/token.types";
import { tokenService } from "../services/tokens.service";
import { extractUiErrorFromUnknown } from "@/services/api-error-messages";

export function useCreateToken() {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<{ title: string; message: string } | null>(null);

    const create = useCallback(async (payload: TokenCreatePayload): Promise<TokenCreateResponse> => {
        setIsSubmitting(true);
        setError(null);
        
        try {
            return await tokenService.crete(payload);
        } catch (error) {
            const ui = extractUiErrorFromUnknown(error);
            setError(ui ?? {
                title: "Erreur",
                message: "Impossible de créer le token."
            });
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    }, []);

    return {
        create,
        isSubmitting,
        error,
        clearError: () => setError(null)
    };
}