"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkOS = void 0;
const axios_1 = __importDefault(require("axios"));
const audit_trail_1 = require("./audit-trail/audit-trail");
const exceptions_1 = require("./common/exceptions");
const directory_sync_1 = require("./directory-sync/directory-sync");
const organizations_1 = require("./organizations/organizations");
const passwordless_1 = require("./passwordless/passwordless");
const portal_1 = require("./portal/portal");
const sso_1 = require("./sso/sso");
const webhooks_1 = require("./webhooks/webhooks");
const mfa_1 = require("./mfa/mfa");
const audit_logs_1 = require("./audit-logs/audit-logs");
const bad_request_exception_1 = require("./common/exceptions/bad-request.exception");
const VERSION = '2.11.0';
const DEFAULT_HOSTNAME = 'api.workos.com';
class WorkOS {
    constructor(key, options = {}) {
        this.key = key;
        this.options = options;
        this.auditLogs = new audit_logs_1.AuditLogs(this);
        this.auditTrail = new audit_trail_1.AuditTrail(this);
        this.directorySync = new directory_sync_1.DirectorySync(this);
        this.organizations = new organizations_1.Organizations(this);
        this.passwordless = new passwordless_1.Passwordless(this);
        this.portal = new portal_1.Portal(this);
        this.sso = new sso_1.SSO(this);
        this.webhooks = new webhooks_1.Webhooks();
        this.mfa = new mfa_1.Mfa(this);
        if (!key) {
            this.key = process.env.WORKOS_API_KEY;
            if (!this.key) {
                throw new exceptions_1.NoApiKeyProvidedException();
            }
        }
        if (this.options.https === undefined) {
            this.options.https = true;
        }
        const protocol = this.options.https ? 'https' : 'http';
        const apiHostname = this.options.apiHostname || DEFAULT_HOSTNAME;
        const port = this.options.port;
        this.baseURL = `${protocol}://${apiHostname}`;
        if (port) {
            this.baseURL = this.baseURL + `:${port}`;
        }
        this.client = axios_1.default.create({
            baseURL: this.baseURL,
            headers: {
                Authorization: `Bearer ${this.key}`,
                'User-Agent': `workos-node/${VERSION}`,
            },
            httpsAgent: this.options.httpsAgent,
        });
    }
    post(path, entity, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestHeaders = {};
            if (options.idempotencyKey) {
                requestHeaders['Idempotency-Key'] = options.idempotencyKey;
            }
            try {
                return yield this.client.post(path, entity, {
                    params: options.query,
                    headers: requestHeaders,
                });
            }
            catch (error) {
                this.handleAxiosError({ path, error });
                throw error;
            }
        });
    }
    get(path, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { accessToken } = options;
                return yield this.client.get(path, {
                    params: options.query,
                    headers: accessToken
                        ? {
                            Authorization: `Bearer ${accessToken}`,
                        }
                        : undefined,
                });
            }
            catch (error) {
                this.handleAxiosError({ path, error });
                throw error;
            }
        });
    }
    put(path, entity, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestHeaders = {};
            if (options.idempotencyKey) {
                requestHeaders['Idempotency-Key'] = options.idempotencyKey;
            }
            try {
                return yield this.client.put(path, entity, {
                    params: options.query,
                    headers: requestHeaders,
                });
            }
            catch (error) {
                this.handleAxiosError({ path, error });
                throw error;
            }
        });
    }
    delete(path, query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.client.delete(path, {
                    params: query,
                });
            }
            catch (error) {
                this.handleAxiosError({ path, error });
                throw error;
            }
        });
    }
    emitWarning(warning) {
        if (typeof process.emitWarning !== 'function') {
            //  tslint:disable:no-console
            return console.warn(`WorkOS: ${warning}`);
        }
        return process.emitWarning(warning, 'WorkOS');
    }
    handleAxiosError({ path, error }) {
        const { response } = error;
        if (response) {
            const { status, data, headers } = response;
            const requestID = headers['X-Request-ID'];
            const { code, error_description: errorDescription, error, errors, message, } = data;
            switch (status) {
                case 401: {
                    throw new exceptions_1.UnauthorizedException(requestID);
                }
                case 422: {
                    const { errors } = data;
                    throw new exceptions_1.UnprocessableEntityException({
                        code,
                        errors,
                        message,
                        requestID,
                    });
                }
                case 404: {
                    throw new exceptions_1.NotFoundException({
                        code,
                        message,
                        path,
                        requestID,
                    });
                }
                default: {
                    if (error || errorDescription) {
                        throw new exceptions_1.OauthException(status, requestID, error, errorDescription);
                    }
                    else if (code && errors) {
                        // Note: ideally this should be mapped directly with a `400` status code.
                        // However, this would break existing logic for the `OauthException` exception.
                        throw new bad_request_exception_1.BadRequestException({
                            code,
                            errors,
                            message,
                            requestID,
                        });
                    }
                    else {
                        throw new exceptions_1.GenericServerException(status, data.message, requestID);
                    }
                }
            }
        }
    }
}
exports.WorkOS = WorkOS;