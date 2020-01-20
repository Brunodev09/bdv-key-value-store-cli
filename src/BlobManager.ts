import { BUFFERS } from "./Dictionary";
import { encode, decode } from "./BufferTranslation";
import Files from "./tools/Files";
import * as __keyboard from 'clipboardy';

class BlobManager {
    private readonly accessCodes: string[];
    private _json: any;
    constructor() {
        this._json = require("./blob.json");
        this.accessCodes = [encode(BUFFERS.X1), encode(BUFFERS.X2), encode(BUFFERS.X3), encode(BUFFERS.X4)];
    }

    write(user?: string, password?: string) {
        if (user && password) {
            this._json[this.accessCodes[0]].push({ [this.accessCodes[1]]: encode(user), [this.accessCodes[2]]: encode(password), [this.accessCodes[3]]: {} });
        }
        Files.touch(__dirname, "blob.json", JSON.stringify(this._json));
        return this._json[this.accessCodes[0]][this._json[this.accessCodes[0]].length - 1];
    }

    is(user: string, password: string) {
        let table = { "ok": false, "unauthorized": false, "not": false, user: null };
        table.user = this._json[this.accessCodes[0]].find(k => {
            if (k[this.accessCodes[1]] === encode(user)) {
                if (k[this.accessCodes[2]] === encode(password)) {
                    table['ok'] = true;
                    return k;
                }
                else table["unauthorized"] = true;
            }
        });
        if (!table.user && !table["unauthorized"]) table["not"] = true;
        return table;
    }

    findMeta(user: string, key: string) {
        if (!user[this.accessCodes[3]][encode(key)]) return false;

        __keyboard.write(decode(user[this.accessCodes[3]][encode(key)]));

        return true;
    }

    createMeta(user: string, key: string, value: string) {
        user[this.accessCodes[3]][encode(key)] = encode(value);
        this.write();
    }

    get getBlob() {
        return this._json;
    }
}

export default new BlobManager();