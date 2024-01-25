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
function setupExpress() {
    let jsonParser = body_parser_1.default.json();
    app.listen(PORT, () => {
        console.log("Server is Successfully Running,and App is listening on port " + PORT);
    });
    app.get("/", (req, res) => {
        res.send("Hello World");
    });
    app.get("/test", (req, res) => {
        res.send(`Working? \n DBState: ${POOL ? "Connected" : "Disconnected"}`);
    });
    app.get("/flag", (req, res) => {
        res.send("FLAG{FLAG}");
    });
    app.get("/posts", (req, res) => __awaiter(this, void 0, void 0, function* () {
        let client;
        try {
            client = yield POOL.connect();
            const validation = yield client.query("SELECT (ID,TITLE,CONTENT,AUTHOR) FROM csgames.POSTS;");
            res.send(validation.rows);
        }
        catch (error) {
            console.log(error);
        }
        if (client) {
            client.release();
        }
    }));
    app.post("/user", jsonParser, (req, res) => __awaiter(this, void 0, void 0, function* () {
        let body = req.body;
        if (!body || !body.name || !body.password || !body.firstname || !body.lastname) {
            console.log(body);
            res.send("Please provide name and desc in body");
            return;
        }
        if (!onlyLettersPattern.test(body.name) ||
            !onlyLettersPattern.test(body.firstname) ||
            !onlyLettersPattern.test(body.lastname) ||
            !numbersAndLettersPattern.test(body.password)) {
            res.send("Please provide only letters in name, firstname and lastname, numbers allowed for password");
            return;
        }
        let user = body;
        try {
            let client = yield POOL.connect();
            // TODO: Fix SQL Injection
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
            res.send("Error");
            return;
        }
        res.send("Success");
    }));
    app.post("/post", jsonParser, (req, res) => __awaiter(this, void 0, void 0, function* () {
        let body = req.body;
        if (!body || !body.name || !body.content || !body.title) {
            console.log(body);
            res.send("Please provide name and desc in body");
            return;
        }
        let post = body;
        try {
            let client = yield POOL.connect();
            // TODO: Fix SQL Injection
            let id = yield client.query(`SELECT ID FROM csgames.USERS WHERE USERNAME = '${req.body.name}';`);
            if (!id) {
                res.send("User not found");
                return;
            }
            //console.log("ID : " + id.rows[0].id);
            const validation = yield client.query("INSERT INTO csgames.POSTS (TITLE,CONTENT,AUTHOR,ISSECRET) VALUES ('" +
                post.title +
                "','" +
                post.content +
                "','" +
                id.rows[0].id +
                "'," +
                "false);");
        }
        catch (error) {
            console.log(error);
            res.send("Error");
            return;
        }
        res.send("Success");
    }));
    app.post("/reset", (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield execQueries();
        }
        catch (error) {
            res.send("Error Resetting DB");
            return;
        }
        res.send("DB Reset");
    }));
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
                "TITLE VARCHAR(255) UNIQUE NOT NULL," +
                "CONTENT TEXT NOT NULL," +
                "AUTHOR INTEGER NOT NULL," +
                "ISSECRET BOOLEAN NOT NULL," +
                "FOREIGN KEY (AUTHOR) REFERENCES USERS(ID));");
            const insert_dummy = yield client.query("INSERT INTO csgames.USERS (USERNAME,PASSWORD,FIRSTNAME,LASTNAME,ISADMIN) VALUES ('admin','wontguesstooeasily','admin','admin',true);" +
                "INSERT INTO csgames.USERS (USERNAME,PASSWORD,FIRSTNAME,LASTNAME,ISADMIN) VALUES ('dumb','user','dumb','user',false);" +
                "INSERT INTO csgames.POSTS (TITLE,CONTENT,AUTHOR,ISSECRET) VALUES ('First Post','This is my first post, I hope you like it!',2,false);" +
                "INSERT INTO csgames.POSTS (TITLE,CONTENT,AUTHOR,ISSECRET) VALUES ('Second Post','This is my second post, I hope you like it!',2,false);" +
                "INSERT INTO csgames.POSTS (TITLE,CONTENT,AUTHOR,ISSECRET) VALUES ('Third Post','FlagOhOHOOhSNEAKY',2,false);" +
                "INSERT INTO csgames.POSTS (TITLE,CONTENT,AUTHOR,ISSECRET) VALUES ('Fourth Post','This is my fourth post, Help, I dont have it, im desperate!',2,false);");
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
