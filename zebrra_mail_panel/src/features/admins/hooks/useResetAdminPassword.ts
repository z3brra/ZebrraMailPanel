import { useCallback, useState } from "react";
import { adminsService } from "../services/admins.service";
import { extractUiErrorFromUnknown } from "@/services/api-error-messages";

export type ResetPasswordResult = {
    adminUuid: string;
    email: string;
    newPassword: string;
};

export function useResetAdminPassword() {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<{ title: string; message: string } | null>(null);

    const clearError = useCallback(() => setError(null), []);

    const resetPassword = useCallback(async (uuid: string): Promise<ResetPasswordResult> => {
        setIsSubmitting(true);
        setError(null);

        try {
            return await adminsService.resetPassword(uuid);
        } catch (error) {
            const ui = extractUiErrorFromUnknown(error);
            setError(
                ui ?? {
                    title: "Erreur",
                    message: "Impossible de réinitialiser le mot de passe.",
                }
            );
            throw error
        } finally {
            setIsSubmitting(false);
        }
    }, []);

    return {
        resetPassword,
        isSubmitting,
        error,
        clearError
    };
}