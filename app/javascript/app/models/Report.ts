import { User } from "./User";

export type Report = {
    id?: number;
    title: string;
    created_at?: string;
    sharing_permissions?: User[];
}