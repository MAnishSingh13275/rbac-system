export type User = {
    id: string;
    email: string;
    name?: string;
    role: { id: string; name: string } | null;
    permissions: { name: string }[];
    createdAt: Date;
    updatedAt: Date;
};