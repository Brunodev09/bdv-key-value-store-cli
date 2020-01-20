import _ from "./tools/Terminal";
import { Question } from "./tools/Header";
import { BUFFERS } from "./Dictionary";
import { encode } from "./BufferTranslation";
import BlobManager from "./BlobManager";

class Storage {
    private readonly accessCodes: string[];
    loggedUser: any;
    currentJSON: any;
    constructor() {
        this.accessCodes = [encode(BUFFERS.X1), encode(BUFFERS.X2), encode(BUFFERS.X3), encode(BUFFERS.X4)];
        this.loggedUser = null;
        this.currentJSON = null;
    }

    async run() {
        let user, password;

        await _.ask([new Question("input", "one", "Enter your username: ", async (userInput) => {
            if (!userInput) return false;
            user = userInput;
            return true;
        })]);

        await _.ask([new Question("input", "two", "Enter your password", async (pw) => {
            if (!pw) return false;
            password = pw;
            return true;
        })]);

        if (!password) return false;

        let table = BlobManager.is(user, password);
        this.loggedUser = table.user;

        if (table["ok"]) {
            _.say(`Logged in with the username of ${user}.`);
        }
        else if (table["unauthorized"]) {
            _.say(`Incorrect credentials for this account.`, "red");
        }
        else {
            await _.ask([new Question("input", "create", `No account for the user ${user}, create one? (y/n)`, async (answer) => {
                if (answer.toLowerCase() === "y" || answer.toLowerCase() === "yes" || answer.includes("y")) {
                    return true;
                }
                _.say("\nAlright, bye!", "blue");
                process.exit(0);
            })]);
            this.loggedUser = BlobManager.write(user, password);
        }
    }
}

export default new Storage();