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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = __importDefault(require("express"));
const pg = __importStar(require("pg"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
let POOL;
const onlyLettersPattern = /^[A-Za-z]+$/;
const numbersAndLettersPattern = /^[A-Za-z0-9]+$/;
function startClientPG() {
    return __awaiter(this, void 0, void 0, function* () {
        // clients will also use environment variables
        // for connection information
        let connectionConfig = {
            user: "postgres",
            database: "csgames",
            password: "admin",
            port: 5432,
            host: "localhost",
            keepAlive: true,
        };
        POOL = new pg.Pool(connectionConfig);
    });
}
function checkIllegalSQLSymbols(str) {
    let illegalSymbols = [
        "'",
        '"',
        ";",
        "--",
        "/*",
        "*/",
        "xp_",
        "sp_",
        "exec",
        "execute",
        "select",
        "insert",
        "update",
        "delete",
        "drop",
        "create",
        "alter",
    ];
    for (let i = 0; i < illegalSymbols.length; i++) {
        if (str.includes(illegalSymbols[i])) {
            return true;
        }
    }
    return false;
}
function setupExpress() {
    let jsonParser = body_parser_1.default.json();
    app.use((0, cookie_parser_1.default)());
    app.use((req, res, next) => {
        res.set("Access-Control-Allow-Origin", "http://localhost:4200");
        res.set("Access-Control-Allow-Methods", "POST, OPTIONS, GET");
        res.set("Access-Control-Allow-Headers", "Content-Type, mode, Access-Control-Allow-Origin, Access-Control-Allow-Credentials, Authorization, Credentials");
        res.set("Access-Control-Allow-Credentials", "true");
        res.set("Access-Control-Max-Age", "86400");
        next();
    });
    app.listen(PORT, () => {
        console.log("Server is Successfully Running,and App is listening on port " + PORT);
    });
    app.use(express_1.default.static(path_1.default.join(__dirname, "/tbhacked")));
    app.get("/api/test", (req, res) => {
        console.log("GET /test");
        res.json(`Working? \n DBState: ${POOL ? "Connected" : "Disconnected"}`);
    });
    app.get("/api/flag", (req, res) => {
        res.json("You really thought it would be that easy? FLAGTO0EASY");
    });
    app.get("/api/posts", (req, res) => __awaiter(this, void 0, void 0, function* () {
        let client;
        try {
            client = yield POOL.connect();
            let id = req.cookies.id;
            const check = yield client.query("SELECT ISADMIN FROM csgames.USERS WHERE USERNAME = '" + id + "';");
            if (!check.rows[0] || !check.rows[0].isadmin) {
                const validation = yield client.query("SELECT ID,TITLE,CONTENT,AUTHOR FROM csgames.POSTS WHERE ISSECRET = false;");
                //console.log(validation.rows);
                res.json(validation.rows);
            }
            else {
                const validation = yield client.query("SELECT ID,TITLE,CONTENT,AUTHOR FROM csgames.POSTS;");
                //console.log(validation.rows);
                res.json(validation.rows);
            }
        }
        catch (error) {
            console.log(error);
            res.status(404).json(error);
        }
        if (client) {
            client.release();
        }
    }));
    app.get("/api/checkposts", (req, res) => __awaiter(this, void 0, void 0, function* () {
        let client;
        let query;
        console.log("GET /checkposts");
        try {
            client = yield POOL.connect();
            let id = req.cookies.id;
            const check = yield client.query("SELECT ISADMIN FROM csgames.USERS WHERE USERNAME = '" + id + "';");
            if (!check.rows[0] || !check.rows[0].isadmin) {
                query =
                    "SELECT ID,TITLE,CONTENT,AUTHOR FROM csgames.POSTS WHERE ISSECRET = false AND TITLE LIKE '" +
                        req.query.id +
                        "%';";
                console.log(query);
                const validation = yield client.query(query);
                res.json(validation);
            }
            else {
                query = "SELECT ID,TITLE,CONTENT,AUTHOR FROM csgames.POSTS WHERE TITLE LIKE '" + req.query.id + "%';";
                const validation = yield client.query(query);
                res.json(validation);
            }
        }
        catch (error) {
            if (typeof error === "object" && error !== null && error.message) {
                let string = JSON.stringify({ error, query, message: error.message });
                console.log(string);
                res.status(206).send(string);
            }
            else {
                let string = JSON.stringify({ error, query });
                console.log(string);
                res.status(206).send(string);
            }
        }
        if (client) {
            client.release();
        }
    }));
    // QUERY HAS ID, NOT URL TODO VERIFY
    app.get("/api/users", (req, res) => __awaiter(this, void 0, void 0, function* () {
        let client;
        try {
            client = yield POOL.connect();
            const validation = yield client.query("SELECT (ID,USERNAME,FIRSTNAME,LASTNAME) FROM csgames.USERS WHERE USERNAME LIKE '%" + req.query.id + "%';");
            res.json(validation.rows);
        }
        catch (error) {
            console.log(error);
            res.status(404).json(error);
        }
        if (client) {
            client.release();
        }
    }));
    app.post("/api/new-user", jsonParser, (req, res) => __awaiter(this, void 0, void 0, function* () {
        let body = req.body;
        if (!body || !body.name || !body.password || !body.firstname || !body.lastname) {
            console.log(body);
            res.status(404).json("Please provide name and desc in body");
            return;
        }
        if (!onlyLettersPattern.test(body.name) ||
            !onlyLettersPattern.test(body.firstname) ||
            !onlyLettersPattern.test(body.lastname) ||
            !numbersAndLettersPattern.test(body.password)) {
            res.status(404).json("Please provide only letters in name, firstname and lastname, numbers allowed for password");
            return;
        }
        let user = body;
        try {
            let client = yield POOL.connect();
            const validation = yield client.query("INSERT INTO csgames.USERS (USERNAME,PASSWORD,FIRSTNAME,LASTNAME,ISADMIN) VALUES ('" +
                user.name +
                "','" +
                user.password +
                "','" +
                user.firstname +
                "','" +
                user.lastname +
                "',false);");
        }
        catch (error) {
            console.log(error);
            res.status(404).json("Error");
            return;
        }
        res.cookie("id", user.name, { httpOnly: false, maxAge: 900000 });
        res.json("Success");
    }));
    app.post("/api/login", jsonParser, (req, res) => __awaiter(this, void 0, void 0, function* () {
        console.log("POST /login");
        let body = req.body;
        if (!body || !body.username || !body.password) {
            console.log(body);
            console.log('Missing "username" or "password" in body');
            res.status(404).json("Please provide name and desc in body");
            return;
        }
        if (typeof body.username != "string" ||
            typeof body.password != "string" ||
            checkIllegalSQLSymbols(body.username) ||
            checkIllegalSQLSymbols(body.password)) {
            res.status(404).json("Please provide a valid name, firstname and lastname, password");
            return;
        }
        let user = body;
        try {
            let client = yield POOL.connect();
            const validation = yield client.query("SELECT ID,ISADMIN,USERNAME FROM csgames.USERS WHERE USERNAME = '" +
                user.username +
                "' AND PASSWORD = '" +
                user.password +
                "';");
            console.log(validation.rows[0]);
            if (!validation.rows[0]) {
                res.status(404).json("User not found");
                return;
            }
            if (validation.rows[0].isadmin) {
                console.log('Admin logged in, setting cookie "flag" to "FLAGCOOKIESAREDELICIOUS"');
                res.cookie("flag", "FLAGCOOKIESAREDELICIOUS", { httpOnly: false, maxAge: 900000 });
            }
            res.cookie("id", validation.rows[0].username, { httpOnly: false, maxAge: 900000 });
        }
        catch (error) {
            console.log(error);
            res.status(404).json("Error");
            return;
        }
        console.log("Success");
        res.json("Success");
    }));
    // app.post("/api/post", jsonParser, async (req, res) => {
    //   let body = req.body;
    //   if (!body || !body.name || !body.content || !body.title) {
    //     console.log(body);
    //     res.json("Please provide name and desc in body").status(404);
    //     return;
    //   }
    //   if (typeof body.name != "string" || checkIllegalSQLSymbols(body.name)) {
    //     // Let the other one be injectable for the sake of the challenge
    //     res.json("Please provide a valid name, firstname and lastname, password").status(404);
    //     return;
    //   }
    //   let post = body;
    //   try {
    //     let client = await POOL.connect();
    //     // TODO: Fix SQL Injection
    //     let id = await client.query(`SELECT ID FROM csgames.USERS WHERE USERNAME = '${req.body.name}';`);
    //     if (!id) {
    //       res.status(404).json("User not found");
    //       return;
    //     }
    //     //console.log("ID : " + id.rows[0].id);
    //     const validation = await client.query(
    //       "INSERT INTO csgames.POSTS (TITLE,CONTENT,AUTHOR,ISSECRET) VALUES ('" +
    //         post.title +
    //         "','" +
    //         post.content +
    //         "','" +
    //         id.rows[0].id +
    //         "'," +
    //         "false);"
    //     );
    //   } catch (error) {
    //     console.log(error);
    //     res.status(404).json(error);
    //     return;
    //   }
    //   res.json("Success");
    // });
    app.post("/api/reset", (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield execQueries();
        }
        catch (error) {
            res.status(500).json("Error Resetting DB");
            return;
        }
        res.json("DB Reset");
    }));
    app.post("/api/new-post", jsonParser, (req, res) => __awaiter(this, void 0, void 0, function* () {
        let body = req.body;
        if (!body || !body.title || !body.content || !body.id) {
            console.log(body);
            res.status(404).json("Please provide title and content in body");
            return;
        }
        console.log(body);
        if (typeof body.title != "string" ||
            typeof body.id != "string" ||
            checkIllegalSQLSymbols(body.title) ||
            checkIllegalSQLSymbols(body.id)) {
            res.status(404).json("Please provide a valid title and id");
            return;
        }
        let post = body;
        try {
            let client = yield POOL.connect();
            const ids = yield client.query("SELECT ID FROM csgames.USERS WHERE USERNAME = '" + post.id + "';");
            if (!ids.rows[0]) {
                res.status(404).json("User not found");
                return;
            }
            const validation = yield client.query("INSERT INTO csgames.POSTS (TITLE,CONTENT,AUTHOR,ISSECRET) VALUES ('" +
                post.title +
                "','" +
                post.content +
                "','" +
                ids.rows[0].id +
                "'," +
                "false);");
        }
        catch (error) {
            console.log(error);
            res.status(400).json(error);
            return;
        }
        res.json("Success");
    }));
    app.get("*", (req, res) => {
        res.sendFile(path_1.default.join(__dirname, "/tbhacked/index.html"));
    });
    console.log("Done Setting up Express");
}
function execQueries() {
    return __awaiter(this, void 0, void 0, function* () {
        let client;
        try {
            client = yield POOL.connect();
            const validation = yield client.query("DROP SCHEMA IF EXISTS csgames CASCADE;" +
                "CREATE SCHEMA IF NOT EXISTS csgames;" +
                "set search_path = csgames;" +
                "CREATE TABLE USERS (" +
                "ID SERIAL PRIMARY KEY," +
                "USERNAME VARCHAR(255) UNIQUE NOT NULL," +
                "PASSWORD VARCHAR(255) NOT NULL," +
                "FIRSTNAME VARCHAR(255) NOT NULL," +
                "LASTNAME VARCHAR(255) NOT NULL," +
                "ISADMIN BOOLEAN NOT NULL" +
                ");" +
                "CREATE TABLE POSTS (" +
                "ID SERIAL PRIMARY KEY," +
                "TITLE VARCHAR(255) NOT NULL," +
                "CONTENT TEXT NOT NULL," +
                "AUTHOR INTEGER NOT NULL," +
                "ISSECRET BOOLEAN NOT NULL," +
                "FOREIGN KEY (AUTHOR) REFERENCES USERS(ID));");
            const insert_dummy = yield client.query("INSERT INTO csgames.USERS (USERNAME,PASSWORD,FIRSTNAME,LASTNAME,ISADMIN) VALUES ('admin','wontguesstooeasily','admin','admin',true);" +
                "INSERT INTO csgames.USERS (USERNAME,PASSWORD,FIRSTNAME,LASTNAME,ISADMIN) VALUES ('dumb','user','dumb','user',false);" +
                "INSERT INTO csgames.POSTS (TITLE,CONTENT,AUTHOR,ISSECRET) VALUES ('First Post','This is my first post, I hope you like it!',2,false);" +
                "INSERT INTO csgames.POSTS (TITLE,CONTENT,AUTHOR,ISSECRET) VALUES ('Second Post','This is my second post, I hope you like it!',2,false);" +
                "INSERT INTO csgames.POSTS (TITLE,CONTENT,AUTHOR,ISSECRET) VALUES ('Third Post','FlagOhOHOOhSNEAKY',2,true);" +
                "INSERT INTO csgames.POSTS (TITLE,CONTENT,AUTHOR,ISSECRET) VALUES ('Fourth Post','This is my fourth post, Help, I dont have the 3rd post, im desperate!',2,false);");
        }
        catch (error) {
            console.log(error);
        }
        if (client) {
            client.release();
        }
        console.log("Done Setting up DB");
    });
}
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        // clients will also use environment variables
        // for connection information
        startClientPG();
        yield execQueries();
        setupExpress();
    });
}
startServer();
