import type { Permission } from "../types/token.types";

export const PERMISSIONS: {
    key: string;
    title: string;
    items: { value: Permission; label: string }[];
}[] = [
    {
        key: "domains",
        title: "Domaines",
        items: [
            { value: "domains.read", label: "Lire les domaines" },
            { value: "domains.create", label: "Créer des domaines" },
            { value: "domains.disable", label: "Désactiver des domaines" },
            { value: "domains.enable", label: "Activer des domaines" },
        ],
    },
    {
        key: "users",
        title: "Utilisateurs",
        items: [
            { value: "users.read", label: "Lire les boîtes mails" },
            { value: "users.create", label: "Créer des boîtes mails" },
            { value: "users.disable", label: "Désactiver des boîtes mails" },
            { value: "users.enable", label: "Activer des boîtes mails" },
            { value: "users.update_password", label: "Modifier les mots de passe" },
        ],
    },
    {
        key: "aliases",
        title: "Aliases",
        items: [
            { value: "aliases.read", label: "Lire les aliases" },
            { value: "aliases.create", label: "Créer des aliases" },
            { value: "aliases.delete", label: "Supprimer des aliases" },
        ],
    },
    {
        key: "mail",
        title: "Mail",
        items: [
            { value: "mail.send", label: "Envoyer des emails" },
        ],
    },
];