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
const workos_1 = require("./workos");
const exceptions_1 = require("./common/exceptions");
const mock = new axios_mock_adapter_1.default(axios_1.default);
describe('WorkOS', () => {
    describe('constructor', () => {
        const OLD_ENV = process.env;
        beforeEach(() => {
            jest.resetModules();
            process.env = Object.assign({}, OLD_ENV);
            delete process.env.NODE_ENV;
        });
        afterEach(() => {
            process.env = OLD_ENV;
        });
        describe('when no API key is provided', () => {
            it('throws a NoApiKeyFoundException error', () => __awaiter(void 0, void 0, void 0, function* () {
                expect(() => new workos_1.WorkOS()).toThrowError(exceptions_1.NoApiKeyProvidedException);
            }));
        });
        describe('when API key is provided with environment variable', () => {
            it('initializes', () => __awaiter(void 0, void 0, void 0, function* () {
                process.env.WORKOS_API_KEY = 'sk_test_Sz3IQjepeSWaI4cMS4ms4sMuU';
                expect(() => new workos_1.WorkOS()).not.toThrow();
            }));
        });
        describe('when API key is provided with constructor', () => {
            it('initializes', () => __awaiter(void 0, void 0, void 0, function* () {
                expect(() => new workos_1.WorkOS('sk_test_Sz3IQjepeSWaI4cMS4ms4sMuU')).not.toThrow();
            }));
        });
        describe('with https option', () => {
            it('sets baseURL', () => {
                const workos = new workos_1.WorkOS('foo', { https: false });
                expect(workos.baseURL).toEqual('http://api.workos.com');
            });
        });
        describe('with apiHostname option', () => {
            it('sets baseURL', () => {
                const workos = new workos_1.WorkOS('foo', { apiHostname: 'localhost' });
                expect(workos.baseURL).toEqual('https://localhost');
            });
        });
        describe('with port option', () => {
            it('sets baseURL', () => {
                const workos = new workos_1.WorkOS('foo', {
                    apiHostname: 'localhost',
                    port: 4000,
                });
                expect(workos.baseURL).toEqual('https://localhost:4000');
            });
        });
    });
    describe('post', () => {
        describe('when the api responds with a 404', () => {
            it('throws a NotFoundException', () => __awaiter(void 0, void 0, void 0, function* () {
                const message = 'Not Found';
                mock.onPost().reply(404, {
                    message,
                }, { 'X-Request-ID': 'a-request-id' });
                const workos = new workos_1.WorkOS('sk_test_Sz3IQjepeSWaI4cMS4ms4sMuU');
                yield expect(workos.post('/path', {})).rejects.toStrictEqual(new exceptions_1.NotFoundException({
                    message,
                    path: '/path',
                    requestID: 'a-request-id',
                }));
            }));
            it('preserves the error code, status, and message from the underlying response', () => __awaiter(void 0, void 0, void 0, function* () {
                const message = 'The thing you are looking for is not here.';
                const code = 'thing-not-found';
                mock.onPost().reply(404, {
                    code,
                    message,
                }, { 'X-Request-ID': 'a-request-id' });
                const workos = new workos_1.WorkOS('sk_test_Sz3IQjepeSWaI4cMS4ms4sMuU');
                yield expect(workos.post('/path', {})).rejects.toMatchObject({
                    code,
                    message,
                    status: 404,
                });
            }));
            it('includes the path in the message if there is no message in the response', () => __awaiter(void 0, void 0, void 0, function* () {
                const code = 'thing-not-found';
                const path = '/path/to/thing/that-aint-there';
                mock.onPost().reply(404, {
                    code,
                }, { 'X-Request-ID': 'a-request-id' });
                const workos = new workos_1.WorkOS('sk_test_Sz3IQjepeSWaI4cMS4ms4sMuU');
                yield expect(workos.post(path, {})).rejects.toMatchObject({
                    code,
                    message: `The requested path '${path}' could not be found.`,
                    status: 404,
                });
            }));
        });
        describe('when the api responds with a 500 and no error/error_description', () => {
            it('throws an GenericServerException', () => __awaiter(void 0, void 0, void 0, function* () {
                mock.onPost().reply(500, {}, {
                    'X-Request-ID': 'a-request-id',
                });
                const workos = new workos_1.WorkOS('sk_test_Sz3IQjepeSWaI4cMS4ms4sMuU');
                yield expect(workos.post('/path', {})).rejects.toStrictEqual(new exceptions_1.GenericServerException(500, undefined, 'a-request-id'));
            }));
        });
        describe('when the api responds with a 400 and an error/error_description', () => {
            it('throws an OauthException', () => __awaiter(void 0, void 0, void 0, function* () {
                mock.onPost().reply(400, { error: 'error', error_description: 'error description' }, {
                    'X-Request-ID': 'a-request-id',
                });
                const workos = new workos_1.WorkOS('sk_test_Sz3IQjepeSWaI4cMS4ms4sMuU');
                yield expect(workos.post('/path', {})).rejects.toStrictEqual(new exceptions_1.OauthException(400, 'a-request-id', 'error', 'error description'));
            }));
        });
    });
});