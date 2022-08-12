export interface AuditLogExport {
    object: 'audit_log_export';
    id: string;
    state: 'pending' | 'ready' | 'error';
    url?: string;
    created_at: string;
    updated_at: string;
}
