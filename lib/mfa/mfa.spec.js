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
const axios_1 = __importDefault(require("axios"));
const axios_mock_adapter_1 = __importDefault(require("axios-mock-adapter"));
const exceptions_1 = require("../common/exceptions");
const workos_1 = require("../workos");
describe('MFA', () => {
    describe('getFactor', () => {
        it('throws an error for incomplete arguments', () => __awaiter(void 0, void 0, void 0, function* () {
            const mock = new axios_mock_adapter_1.default(axios_1.default);
            mock.onGet().reply(200, {});
            const workos = new workos_1.WorkOS('sk_test_Sz3IQjepeSWaI4cMS4ms4sMuU');
            const factor = yield workos.mfa.getFactor('test_123');
            expect(factor).toMatchInlineSnapshot(`Object {}`);
        }));
    });
    describe('deleteFactor', () => {
        it('sends request to delete a Factor', () => __awaiter(void 0, void 0, void 0, function* () {
            const mock = new axios_mock_adapter_1.default(axios_1.default);
            mock.onDelete().reply(200, {});
            const workos = new workos_1.WorkOS('sk_test_Sz3IQjepeSWaI4cMS4ms4sMuU');
            yield workos.mfa.deleteFactor('conn_123');
            expect(mock.history.delete[0].url).toEqual('/auth/factors/conn_123');
        }));
    });
    describe('enrollFactor', () => {
        describe('with generic', () => {
            it('enrolls a factor with generic type', () => __awaiter(void 0, void 0, void 0, function* () {
                const mock = new axios_mock_adapter_1.default(axios_1.default);
                mock.onPost('/auth/factors/enroll').reply(200, {
                    object: 'authentication_factor',
                    id: 'auth_factor_1234',
                    created_at: '2022-03-15T20:39:19.892Z',
                    updated_at: '2022-03-15T20:39:19.892Z',
                    type: 'generic_otp',
                });
                const workos = new workos_1.WorkOS('sk_test_Sz3IQjepeSWaI4cMS4ms4sMuU', {
                    apiHostname: 'api.workos.dev',
                });
                const enrollResponse = yield workos.mfa.enrollFactor({
                    type: 'generic_otp',
                });
                expect(enrollResponse).toMatchInlineSnapshot(`
          Object {
            "created_at": "2022-03-15T20:39:19.892Z",
            "id": "auth_factor_1234",
            "object": "authentication_factor",
            "type": "generic_otp",
            "updated_at": "2022-03-15T20:39:19.892Z",
          }
        `);
            }));
        });
        describe('with totp', () => {
            it('enrolls a factor with totp type', () => __awaiter(void 0, void 0, void 0, function* () {
                const mock = new axios_mock_adapter_1.default(axios_1.default);
                mock.onPost('/auth/factors/enroll').reply(200, {
                    object: 'authentication_factor',
                    id: 'auth_factor_1234',
                    created_at: '2022-03-15T20:39:19.892Z',
                    updated_at: '2022-03-15T20:39:19.892Z',
                    type: 'totp',
                    totp: {
                        qr_code: 'qr-code-test',
                        secret: 'secret-test',
                    },
                });
                const workos = new workos_1.WorkOS('sk_test_Sz3IQjepeSWaI4cMS4ms4sMuU', {
                    apiHostname: 'api.workos.dev',
                });
                const enrollResponse = yield workos.mfa.enrollFactor({
                    type: 'totp',
                    issuer: 'WorkOS',
                    user: 'some_user',
                });
                expect(enrollResponse).toMatchInlineSnapshot(`
          Object {
            "created_at": "2022-03-15T20:39:19.892Z",
            "id": "auth_factor_1234",
            "object": "authentication_factor",
            "totp": Object {
              "qr_code": "qr-code-test",
              "secret": "secret-test",
            },
            "type": "totp",
            "updated_at": "2022-03-15T20:39:19.892Z",
          }
        `);
            }));
        });
        describe('with sms', () => {
            it('enrolls a factor with sms type', () => __awaiter(void 0, void 0, void 0, function* () {
                const mock = new axios_mock_adapter_1.default(axios_1.default);
                mock.onPost('/auth/factors/enroll').reply(200, {
                    object: 'authentication_factor',
                    id: 'auth_factor_1234',
                    created_at: '2022-03-15T20:39:19.892Z',
                    updated_at: '2022-03-15T20:39:19.892Z',
                    type: 'sms',
                    sms: {
                        phone_number: '+15555555555',
                    },
                });
                const workos = new workos_1.WorkOS('sk_test_Sz3IQjepeSWaI4cMS4ms4sMuU', {
                    apiHostname: 'api.workos.dev',
                });
                const enrollResponse = yield workos.mfa.enrollFactor({
                    type: 'sms',
                    phoneNumber: '+1555555555',
                });
                expect(enrollResponse).toMatchInlineSnapshot(`
          Object {
            "created_at": "2022-03-15T20:39:19.892Z",
            "id": "auth_factor_1234",
            "object": "authentication_factor",
            "sms": Object {
              "phone_number": "+15555555555",
            },
            "type": "sms",
            "updated_at": "2022-03-15T20:39:19.892Z",
          }
        `);
            }));
            describe('when phone number is invalid', () => {
                it('throws an exception', () => __awaiter(void 0, void 0, void 0, function* () {
                    const mock = new axios_mock_adapter_1.default(axios_1.default);
                    mock.onPost('/auth/factors/enroll').reply(422, {
                        message: `Phone number is invalid: 'foo'`,
                        code: 'invalid_phone_number',
                    }, {
                        'X-Request-ID': 'req_123',
                    });
                    const workos = new workos_1.WorkOS('sk_test_Sz3IQjepeSWaI4cMS4ms4sMuU', {
                        apiHostname: 'api.workos.dev',
                    });
                    yield expect(workos.mfa.enrollFactor({
                        type: 'sms',
                        phoneNumber: 'foo',
                    })).rejects.toThrow(exceptions_1.UnprocessableEntityException);
                }));
            });
        });
    });
    describe('challengeFactor', () => {
        describe('with no sms template', () => {
            it('challenge a factor with no sms template', () => __awaiter(void 0, void 0, void 0, function* () {
                const mock = new axios_mock_adapter_1.default(axios_1.default);
                mock.onPost('/auth/factors/auth_factor_1234/challenge').reply(200, {
                    object: 'authentication_challenge',
                    id: 'auth_challenge_1234',
                    created_at: '2022-03-15T20:39:19.892Z',
                    updated_at: '2022-03-15T20:39:19.892Z',
                    expires_at: '2022-03-15T21:39:19.892Z',
                    code: '12345',
                    authentication_factor_id: 'auth_factor_1234',
                });
                const workos = new workos_1.WorkOS('sk_test_Sz3IQjepeSWaI4cMS4ms4sMuU', {
                    apiHostname: 'api.workos.dev',
                });
                const challengeResponse = yield workos.mfa.challengeFactor({
                    authenticationFactorId: 'auth_factor_1234',
                });
                expect(challengeResponse).toMatchInlineSnapshot(`
          Object {
            "authentication_factor_id": "auth_factor_1234",
            "code": "12345",
            "created_at": "2022-03-15T20:39:19.892Z",
            "expires_at": "2022-03-15T21:39:19.892Z",
            "id": "auth_challenge_1234",
            "object": "authentication_challenge",
            "updated_at": "2022-03-15T20:39:19.892Z",
          }
        `);
            }));
        });
        describe('with sms template', () => {
            it('challenge a factor with sms template', () => __awaiter(void 0, void 0, void 0, function* () {
                const mock = new axios_mock_adapter_1.default(axios_1.default);
                mock
                    .onPost('/auth/factors/auth_factor_1234/challenge', {
                    sms_template: 'This is your code: 12345',
                })
                    .reply(200, {
                    object: 'authentication_challenge',
                    id: 'auth_challenge_1234',
                    created_at: '2022-03-15T20:39:19.892Z',
                    updated_at: '2022-03-15T20:39:19.892Z',
                    expires_at: '2022-03-15T21:39:19.892Z',
                    code: '12345',
                    authentication_factor_id: 'auth_factor_1234',
                });
                const workos = new workos_1.WorkOS('sk_test_Sz3IQjepeSWaI4cMS4ms4sMuU', {
                    apiHostname: 'api.workos.dev',
                });
                const challengeResponse = yield workos.mfa.challengeFactor({
                    authenticationFactorId: 'auth_factor_1234',
                    smsTemplate: 'This is your code: 12345',
                });
                expect(challengeResponse).toMatchInlineSnapshot(`
          Object {
            "authentication_factor_id": "auth_factor_1234",
            "code": "12345",
            "created_at": "2022-03-15T20:39:19.892Z",
            "expires_at": "2022-03-15T21:39:19.892Z",
            "id": "auth_challenge_1234",
            "object": "authentication_challenge",
            "updated_at": "2022-03-15T20:39:19.892Z",
          }
        `);
            }));
        });
    });
    describe('verifyChallenge', () => {
        describe('verify with successful response', () => {
            it('verifies a successful factor', () => __awaiter(void 0, void 0, void 0, function* () {
                const mock = new axios_mock_adapter_1.default(axios_1.default);
                mock
                    .onPost('/auth/challenges/auth_challenge_1234/verify', {
                    code: '12345',
                })
                    .reply(200, {
                    challenge: {
                        object: 'authentication_challenge',
                        id: 'auth_challenge_1234',
                        created_at: '2022-03-15T20:39:19.892Z',
                        updated_at: '2022-03-15T20:39:19.892Z',
                        expires_at: '2022-03-15T21:39:19.892Z',
                        code: '12345',
                        authentication_factor_id: 'auth_factor_1234',
                    },
                    valid: true,
                });
                const workos = new workos_1.WorkOS('sk_test_Sz3IQjepeSWaI4cMS4ms4sMuU', {
                    apiHostname: 'api.workos.dev',
                });
                const verifyResponse = yield workos.mfa.verifyChallenge({
                    authenticationChallengeId: 'auth_challenge_1234',
                    code: '12345',
                });
                expect(verifyResponse).toMatchInlineSnapshot(`
          Object {
            "challenge": Object {
              "authentication_factor_id": "auth_factor_1234",
              "code": "12345",
              "created_at": "2022-03-15T20:39:19.892Z",
              "expires_at": "2022-03-15T21:39:19.892Z",
              "id": "auth_challenge_1234",
              "object": "authentication_challenge",
              "updated_at": "2022-03-15T20:39:19.892Z",
            },
            "valid": true,
          }
        `);
            }));
        });
        describe('when the challenge has been previously verified', () => {
            it('throws an exception', () => __awaiter(void 0, void 0, void 0, function* () {
                const mock = new axios_mock_adapter_1.default(axios_1.default);
                mock
                    .onPost('/auth/challenges/auth_challenge_1234/verify', {
                    code: '12345',
                })
                    .reply(422, {
                    message: `The authentication challenge '12345' has already been verified.`,
                    code: 'authentication_challenge_previously_verified',
                }, {
                    'X-Request-ID': 'req_123',
                });
                const workos = new workos_1.WorkOS('sk_test_Sz3IQjepeSWaI4cMS4ms4sMuU', {
                    apiHostname: 'api.workos.dev',
                });
                yield expect(workos.mfa.verifyChallenge({
                    authenticationChallengeId: 'auth_challenge_1234',
                    code: '12345',
                })).rejects.toThrow(exceptions_1.UnprocessableEntityException);
            }));
        });
        describe('when the challenge has expired', () => {
            it('throws an exception', () => __awaiter(void 0, void 0, void 0, function* () {
                const mock = new axios_mock_adapter_1.default(axios_1.default);
                mock
                    .onPost('/auth/challenges/auth_challenge_1234/verify', {
                    code: '12345',
                })
                    .reply(422, {
                    message: `The authentication challenge '12345' has expired.`,
                    code: 'authentication_challenge_expired',
                }, {
                    'X-Request-ID': 'req_123',
                });
                const workos = new workos_1.WorkOS('sk_test_Sz3IQjepeSWaI4cMS4ms4sMuU', {
                    apiHostname: 'api.workos.dev',
                });
                yield expect(workos.mfa.verifyChallenge({
                    authenticationChallengeId: 'auth_challenge_1234',
                    code: '12345',
                })).rejects.toThrow(exceptions_1.UnprocessableEntityException);
            }));
            it('exception has code', () => __awaiter(void 0, void 0, void 0, function* () {
                const mock = new axios_mock_adapter_1.default(axios_1.default);
                mock
                    .onPost('/auth/challenges/auth_challenge_1234/verify', {
                    code: '12345',
                })
                    .reply(422, {
                    message: `The authentication challenge '12345' has expired.`,
                    code: 'authentication_challenge_expired',
                }, {
                    'X-Request-ID': 'req_123',
                });
                const workos = new workos_1.WorkOS('sk_test_Sz3IQjepeSWaI4cMS4ms4sMuU', {
                    apiHostname: 'api.workos.dev',
                });
                try {
                    yield workos.mfa.verifyChallenge({
                        authenticationChallengeId: 'auth_challenge_1234',
                        code: '12345',
                    });
                }
                catch (error) {
                    expect(error).toMatchObject({
                        code: 'authentication_challenge_expired',
                    });
                }
            }));
        });
    });
});