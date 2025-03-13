import { User } from "./User";

export type Project = {
    id?: number;
    name: string;
    description: string;
    created_at?: string;
    updated_at?: string;
    user_id?: number;
    sharing_permissions?: User[]
}