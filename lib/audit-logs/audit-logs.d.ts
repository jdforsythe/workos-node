import { WorkOS } from '../workos';
import { CreateAuditLogEventOptions, CreateAuditLogEventRequestOptions } from './interfaces';
import { AuditLogExportOptions } from './interfaces/audit-log-export-options.interface';
import { AuditLogExport } from './interfaces/audit-log-export.interface';
export declare class AuditLogs {
    private readonly workos;
    constructor(workos: WorkOS);
    createEvent(organization: string, event: CreateAuditLogEventOptions, options?: CreateAuditLogEventRequestOptions): Promise<void>;
    createExport(options: AuditLogExportOptions): Promise<AuditLogExport>;
    getExport(auditLogExportId: string): Promise<AuditLogExport>;
}
