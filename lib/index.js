"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkOS = void 0;
const workos_1 = require("./workos");
Object.defineProperty(exports, "WorkOS", { enumerable: true, get: function () { return workos_1.WorkOS; } });
__exportStar(require("./audit-logs/interfaces"), exports);
__exportStar(require("./audit-trail/interfaces"), exports);
__exportStar(require("./common/exceptions"), exports);
__exportStar(require("./common/interfaces"), exports);
__exportStar(require("./directory-sync/interfaces"), exports);
__exportStar(require("./organizations/interfaces"), exports);
__exportStar(require("./passwordless/interfaces"), exports);
__exportStar(require("./portal/interfaces"), exports);
__exportStar(require("./sso/interfaces"), exports);
__exportStar(require("./webhooks/interfaces"), exports);
// tslint:disable-next-line:no-default-export
exports.default = workos_1.WorkOS;