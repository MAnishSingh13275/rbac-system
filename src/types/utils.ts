export type User = {
    id: string;
    email: string;
    name?: string;
    role: { id: string; name: string } | null;
    permissions: { name: string }[];
    status: string;
    createdAt: Date;
    updatedAt: Date;

};