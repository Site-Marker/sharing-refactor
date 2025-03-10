export type SharingPermission = {
    id?: number;
    user_id: number;
    creator_id?: number;
    project_id?: number;
    document_id?: number;
    report_id?: number;
    access_level: 'full access' | 'edit' | 'view';
    resource_type: 'project' | 'document' | 'report';
}

export type DeleteSharingPermission = {
    user_id: number;
    project_id?: number;
    document_id?: number;
    report_id?: number;
    resource_type: 'project' | 'document' | 'report';
}