/// <reference types="node" />
import { Agent } from 'https';
export interface WorkOSOptions {
    apiHostname?: string;
    https?: boolean;
    port?: number;
    httpsAgent?: Agent;
}
