import { BUFFERS } from "./Dictionary";

export function encode(buffer: BUFFERS | string) {
    return (Buffer.from(buffer)).toString("base64");
}

export function decode(buffer: string) {
    return (Buffer.from(buffer, "base64")).toString();
}
