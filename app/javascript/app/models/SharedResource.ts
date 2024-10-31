export type SharedResource = {
  id?: number;
  shareable_type?: "Project" | "Document" | "Report";
  shareable_id?: number;
  user_id: number;
  permission_level: 'full access' | 'edit' | 'view';
  created_at?: string;
  updated_at?: string;
}

  