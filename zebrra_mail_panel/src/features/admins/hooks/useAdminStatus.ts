import { useCallback, useState } from "react";
import { adminsService } from "../services/admins.service";
import { extractUiErrorFromUnknown } from "@/services/api-error-messages";

export function useAdminStatus() {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<{ title: string; message: string } | null>(null);

    const clearError = useCallback(() => setError(null), []);

    const setStatus = useCallback(async (uuid: string, action: "enable" | "disable") => {
        setIsSubmitting(true);
        setError(null);

        try {
            await adminsService.setStatus(uuid, action);
        } catch (error) {
            const ui = extractUiErrorFromUnknown(error);
            setError(
                ui ?? {
                    title: "Erreur",
                    message: action === "enable"
                        ? "Impossible d'activer cet admin."
                        : "Impossible de désactiver cet admin.",
                }
            );
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    }, []);

    return {
        setStatus,
        isSubmitting,
        error,
        clearError
    };
}