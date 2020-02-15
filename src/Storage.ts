import _ from "./tools/Terminal";
import { Question } from "./tools/Header";
import BlobManager from "./BlobManager";

class Storage {
    loggedUser: any;
    currentJSON: any;
    val: string[];
    constructor() {
        this.loggedUser = null;
        this.currentJSON = null;
        this.val = null;
    }

    async loop() {
        await _.ask([new Question("input", "menu", "Type help for a list of commands.\n", async (command) => {
            if (!command) return false;
            let parse;
            try {
                parse = command.split(' ');

            } catch (e) {
                _.say(e.message, "red");
                process.exit(1);
            }
            this.val = parse;

            return true;

        })]);
    }

    async run() {
        let user, password;

        await _.ask([new Question("input", "one", "Enter your username: ", async (userInput) => {
            if (!userInput) return false;
            user = userInput;
            return true;
        })]);

        await _.ask([new Question("password", "two", "Enter your password", async (pw) => {
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
            process.exit(1);
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

        let cmd = {
            help: (...args) => {
                _.say("new <key> <value> | Registers a key associated with a value.", "yellow");
                _.say("get <key> | Searches for a value associated with the key and copies to the clipboard if found.", "yellow");
                _.say("list | List all your stored data by key.", "yellow");
            },
            list: () => {
                const arrOfMeta: string[] = BlobManager.findAllMeta(this.loggedUser);
                if (arrOfMeta.length) {
                    _.say('---------------------');
                    for (let meta of arrOfMeta) {
                        _.say("- " + meta);
                    }
                    _.say('---------------------');
                }
            },
            get: (...args) => {
                if (BlobManager.findMeta(this.loggedUser, args[0])) {
                    _.say("Your data has been copied to your clipboard.");
                }
                else _.say("There is no data associated with this key.", "red");
            },
            new: (...args) => {
                BlobManager.createMeta(this.loggedUser, args[0], args[1]);
                _.say("Your data has been stored!");
            },
            exit: (...args) => {
                _.say("Alright, bye!", "blue");
            }
        };
        try {
            await this.loop();
            cmd[this.val[0]](this.val[1], this.val[2]);
        } catch (e) {
            _.say("Invalid command!", "red");
        }

        while (this.val[0] !== "exit") {
            try {
                await this.loop();
                cmd[this.val[0]](this.val[1], this.val[2]);
            } catch (e) {
                _.say("Invalid command!", "red");
            }
        }

    }
}

export default new Storage();