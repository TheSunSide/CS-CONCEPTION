import express, { Express, Request, Response } from "express";
import { Pool, Client } from "pg";
import * as pg from "pg";
import bodyparser from "body-parser";
import cookieParser from "cookie-parser";
const app: Express = express();
const PORT = process.env.PORT || 3000;

let POOL: pg.Pool;

const onlyLettersPattern = /^[A-Za-z]+$/;
const numbersAndLettersPattern = /^[A-Za-z0-9]+$/;

async function startClientPG() {
  // clients will also use environment variables
  // for connection information
  let connectionConfig: pg.ConnectionConfig = {
    user: "postgres",
    database: "csgames",
    password: "admin",
    port: 5432,
    host: "localhost",
    keepAlive: true,
  };

  POOL = new pg.Pool(connectionConfig);
}

function checkIllegalSQLSymbols(str: string) {
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
  let jsonParser = bodyparser.json();
  app.use(cookieParser());
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
    res.send("You really thought it would be that easy? FLAGTO0EASY");
  });

  app.get("/posts", async (req, res) => {
    let client;
    try {
      client = await POOL.connect();
      const validation = await client.query("SELECT (ID,TITLE,CONTENT,AUTHOR) FROM csgames.POSTS;");
      res.send(validation.rows);
    } catch (error) {
      console.log(error);
    }
    if (client) {
      client.release();
    }
  });

  // QUERY HAS ID, NOT URL TODO VERIFY
  app.get("/users", async (req, res) => {
    let client;
    try {
      client = await POOL.connect();
      const validation = await client.query(
        "SELECT (ID,USERNAME,FIRSTNAME,LASTNAME) FROM csgames.USERS WHERE USERNAME LIKE '%" + req.query.id + "%';"
      );
      res.send(validation.rows);
    } catch (error) {
      console.log(error);
      res.send("Error").status(404);
    }
    if (client) {
      client.release();
    }
  });

  app.post("/new-user", jsonParser, async (req, res) => {
    let body = req.body;
    if (!body || !body.name || !body.password || !body.firstname || !body.lastname) {
      console.log(body);
      res.send("Please provide name and desc in body").status(404);
      return;
    }

    if (
      !onlyLettersPattern.test(body.name) ||
      !onlyLettersPattern.test(body.firstname) ||
      !onlyLettersPattern.test(body.lastname) ||
      !numbersAndLettersPattern.test(body.password)
    ) {
      res.send("Please provide only letters in name, firstname and lastname, numbers allowed for password").status(404);
      return;
    }

    let user = body;

    try {
      let client = await POOL.connect();
      const validation = await client.query(
        "INSERT INTO csgames.USERS (USERNAME,PASSWORD,FIRSTNAME,LASTNAME,ISADMIN) VALUES ('" +
          user.name +
          "','" +
          user.password +
          "','" +
          user.firstname +
          "','" +
          user.lastname +
          "',false);"
      );
    } catch (error) {
      console.log(error);
      res.send("Error").status(404);
      return;
    }
    res.send("Success");
  });

  app.post("/login", jsonParser, async (req, res) => {
    let body = req.body;
    if (!body || !body.name || !body.password) {
      console.log(body);
      res.send("Please provide name and desc in body").status(404);
      return;
    }

    if (checkIllegalSQLSymbols(body.name) || checkIllegalSQLSymbols(body.password)) {
      res.send("Please provide a valid name, firstname and lastname, password").status(404);
      return;
    }

    let user = body;

    try {
      let client = await POOL.connect();
      const validation = await client.query(
        "SELECT ID FROM csgames.USERS WHERE USERNAME = '" + user.name + "' AND PASSWORD = '" + user.password + "';"
      );
      if (!validation.rows[0]) {
        res.send("User not found").status(404);
        return;
      }
      if (validation.rows[0].isadmin) {
        res.cookie("flag", "FLAGCOOKIESAREDELICIOUS");
        return;
      }
      res.cookie("id", validation.rows[0].id);
    } catch (error) {
      console.log(error);
      res.send("Error").status(404);
      return;
    }
    res.send("Success");
  });

  app.post("/post", jsonParser, async (req, res) => {
    let body = req.body;
    if (!body || !body.name || !body.content || !body.title) {
      console.log(body);
      res.send("Please provide name and desc in body").status(404);
      return;
    }

    if (checkIllegalSQLSymbols(body.name)) {
      // Let the other one be injectable for the sake of the challenge
      res.send("Please provide a valid name, firstname and lastname, password").status(404);
      return;
    }

    let post = body;

    try {
      let client = await POOL.connect();
      // TODO: Fix SQL Injection
      let id = await client.query(`SELECT ID FROM csgames.USERS WHERE USERNAME = '${req.body.name}';`);
      if (!id) {
        res.send("User not found").status(404);
        return;
      }
      //console.log("ID : " + id.rows[0].id);
      const validation = await client.query(
        "INSERT INTO csgames.POSTS (TITLE,CONTENT,AUTHOR,ISSECRET) VALUES ('" +
          post.title +
          "','" +
          post.content +
          "','" +
          id.rows[0].id +
          "'," +
          "false);"
      );
    } catch (error) {
      console.log(error);
      res.send("Error").status(404);
      return;
    }
    res.send("Success");
  });

  app.post("/reset", async (req, res) => {
    try {
      await execQueries();
    } catch (error) {
      res.send("Error Resetting DB").status(500);
      return;
    }
    res.send("DB Reset");
  });
}

async function execQueries() {
  let client;
  try {
    client = await POOL.connect();
    const validation = await client.query(
      "DROP SCHEMA IF EXISTS csgames CASCADE;" +
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
        "FOREIGN KEY (AUTHOR) REFERENCES USERS(ID));"
    );

    const insert_dummy = await client.query(
      "INSERT INTO csgames.USERS (USERNAME,PASSWORD,FIRSTNAME,LASTNAME,ISADMIN) VALUES ('admin','wontguesstooeasily','admin','admin',true);" +
        "INSERT INTO csgames.USERS (USERNAME,PASSWORD,FIRSTNAME,LASTNAME,ISADMIN) VALUES ('dumb','user','dumb','user',false);" +
        "INSERT INTO csgames.POSTS (TITLE,CONTENT,AUTHOR,ISSECRET) VALUES ('First Post','This is my first post, I hope you like it!',2,false);" +
        "INSERT INTO csgames.POSTS (TITLE,CONTENT,AUTHOR,ISSECRET) VALUES ('Second Post','This is my second post, I hope you like it!',2,false);" +
        "INSERT INTO csgames.POSTS (TITLE,CONTENT,AUTHOR,ISSECRET) VALUES ('Third Post','FlagOhOHOOhSNEAKY',2,false);" +
        "INSERT INTO csgames.POSTS (TITLE,CONTENT,AUTHOR,ISSECRET) VALUES ('Fourth Post','This is my fourth post, Help, I dont have it, im desperate!',2,false);"
    );
  } catch (error) {
    console.log(error);
  }
  if (client) {
    client.release();
  }
  console.log("Done Setting up DB");
}

async function startServer() {
  // clients will also use environment variables
  // for connection information
  startClientPG();
  await execQueries();
  setupExpress();
}

startServer();
