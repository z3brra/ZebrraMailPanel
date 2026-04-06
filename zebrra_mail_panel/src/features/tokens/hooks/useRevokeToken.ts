import { useCallback, useState } from "react";
import { tokenService } from "../services/tokens.service";
import { extractUiErrorFromUnknown } from "@/services/api-error-messages";

export function useRevokeToken() {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<{title: string; message: string } | null>(null);

    const revoke = useCallback(async (uuid: string) => {
        setIsSubmitting(true);
        setError(null);

        try {
            await tokenService.revoke(uuid);
        } catch (error) {
            const ui = extractUiErrorFromUnknown(error);
            setError(ui ?? {
                title: "Erreur",
                message: "Impossible de révoquer le token."
            });
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    }, []);

    return {
        revoke,
        isSubmitting,
        error,
        clearError: () => setError(null)
    };
}