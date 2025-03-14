export type User = {
    id: number;
    name: string;
    email: string;
    avatar_url?: string;
    permission?: 'admin' | 'collaborator' | 'reviewer' | 'reader';
}
