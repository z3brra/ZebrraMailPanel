import { useCallback, useState } from "react";
import type { TokenCreateResponse } from "../types/token.types";
import { tokenService } from "../services/tokens.service";
import { extractUiErrorFromUnknown } from "@/services/api-error-messages";

export function useRotateToken() {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<{ title: string; message: string } | null>(null);

    const rotate = useCallback(async (uuid: string): Promise<TokenCreateResponse> => {
        setIsSubmitting(true);
        setError(null);

        try {
            return await tokenService.rotate(uuid);
        } catch (error) {
            const ui = extractUiErrorFromUnknown(error);
            setError(ui ?? {
                title: "Erreur",
                message: "Impossible de faire la rotation du token."
            });
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    }, []);

    return {
        rotate,
        isSubmitting,
        error,
        clearError: () => setError(null)
    };
}