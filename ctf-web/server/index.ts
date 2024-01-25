import express, { Express, Request, Response } from "express";
import { Pool, Client } from "pg";
import * as pg from "pg";
import bodyparser from "body-parser";

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

function setupExpress() {
  let jsonParser = bodyparser.json();
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

  app.post("/user", jsonParser, async (req, res) => {
    let body = req.body;
    if (!body || !body.name || !body.password || !body.firstname || !body.lastname) {
      console.log(body);
      res.send("Please provide name and desc in body");
      return;
    }

    if (
      !onlyLettersPattern.test(body.name) ||
      !onlyLettersPattern.test(body.firstname) ||
      !onlyLettersPattern.test(body.lastname) ||
      !numbersAndLettersPattern.test(body.password)
    ) {
      res.send("Please provide only letters in name, firstname and lastname, numbers allowed for password");
      return;
    }

    let user = body;

    try {
      let client = await POOL.connect();

      // TODO: Fix SQL Injection
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
      res.send("Error");
      return;
    }
    res.send("Success");
  });

  app.post("/post", jsonParser, async (req, res) => {
    let body = req.body;
    if (!body || !body.name || !body.content || !body.title) {
      console.log(body);
      res.send("Please provide name and desc in body");
      return;
    }
    let post = body;

    try {
      let client = await POOL.connect();
      // TODO: Fix SQL Injection
      let id = await client.query(`SELECT ID FROM csgames.USERS WHERE USERNAME = '${req.body.name}';`);
      if (!id) {
        res.send("User not found");
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
      res.send("Error");
      return;
    }
    res.send("Success");
  });

  app.post("/reset", async (req, res) => {
    try {
      await execQueries();
    } catch (error) {
      res.send("Error Resetting DB");
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
