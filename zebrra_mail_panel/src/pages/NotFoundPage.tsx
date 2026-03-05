import { Link } from "react-router-dom";

export function NotFoundPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-semibold">Accès refusé</h1>
                <p className="text-sm opacity-80">Tu nas pas les droits pour accéder à cette page.</p>
                <Link className="underline text-sm" to="/">
                    Retour au dashboard
                </Link>
            </div>
        </div>
    );
}