export type User = {
    id: number;
    name: string;
    email: string;
    avatar_url?: string;
    projectRole?: 'admin' | 'editor' | 'viewer';
    reportRole?: 'admin' | 'editor' | 'viewer';
    documentRole?: 'admin' | 'editor' | 'viewer';
    permission?: 'admin' | 'edit' | 'view';
}
