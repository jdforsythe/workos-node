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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Portal = void 0;
class Portal {
    constructor(workos) {
        this.workos = workos;
    }
    generateLink({ intent, organization, returnUrl, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.workos.post('/portal/generate_link', {
                intent,
                organization,
                return_url: returnUrl,
            });
            return data;
        });
    }
}
exports.Portal = Portal;