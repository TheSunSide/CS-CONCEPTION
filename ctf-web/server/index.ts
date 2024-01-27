import express, { Express, Request, Response } from "express";
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
  app.use((req, res, next) => {
    res.set("Access-Control-Allow-Origin", "http://localhost:4200");
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS, GET");
    res.set(
      "Access-Control-Allow-Headers",
      "Content-Type, mode, Access-Control-Allow-Origin, Access-Control-Allow-Credentials, Authorization, Credentials"
    );
    res.set("Access-Control-Allow-Credentials", "true");
    res.set("Access-Control-Max-Age", "86400");
    next();
  });
  app.listen(PORT, () => {
    console.log("Server is Successfully Running,and App is listening on port " + PORT);
  });

  app.get("/api/test", (req, res) => {
    console.log("GET /test");
    res.json(`Working? \n DBState: ${POOL ? "Connected" : "Disconnected"}`);
  });

  app.get("/api/flag", (req, res) => {
    res.json("You really thought it would be that easy? FLAGTO0EASY");
  });

  app.get("/api/posts", async (req, res) => {
    let client;
    try {
      client = await POOL.connect();

      let id = req.cookies.id;
      const check = await client.query("SELECT ISADMIN FROM csgames.USERS WHERE USERNAME = '" + id + "';");
      if (!check.rows[0] || !check.rows[0].isadmin) {
        const validation = await client.query(
          "SELECT ID,TITLE,CONTENT,AUTHOR FROM csgames.POSTS WHERE ISSECRET = false;"
        );
        //console.log(validation.rows);
        res.json(validation.rows);
      } else {
        const validation = await client.query("SELECT ID,TITLE,CONTENT,AUTHOR FROM csgames.POSTS;");
        //console.log(validation.rows);
        res.json(validation.rows);
      }
    } catch (error) {
      console.log(error);
      res.status(404).json(error);
    }
    if (client) {
      client.release();
    }
  });

  app.get("/api/checkposts", async (req, res) => {
    let client;
    try {
      client = await POOL.connect();

      let id = req.cookies.id;
      const check = await client.query("SELECT ISADMIN FROM csgames.USERS WHERE USERNAME = '" + id + "';");
      if (!check.rows[0] || !check.rows[0].isadmin) {
        const queryString =
          "SELECT ID,TITLE,CONTENT,AUTHOR FROM csgames.POSTS WHERE ISSECRET = false AND TITLE LIKE '" +
          req.query.id +
          "%';";
        console.log(queryString);
        const validation: pg.QueryResult<any> = await client.query(queryString);
        res.json(validation);
      } else {
        const validation = await client.query(
          "SELECT ID,TITLE,CONTENT,AUTHOR FROM csgames.POSTS WHERE TITLE LIKE '" + req.query.id + "%';"
        );
        res.json(validation);
      }
    } catch (error) {
      console.log(error);
      res.status(404).json(error);
    }
    if (client) {
      client.release();
    }
  });

  // QUERY HAS ID, NOT URL TODO VERIFY
  app.get("/api/users", async (req, res) => {
    let client;
    try {
      client = await POOL.connect();
      const validation = await client.query(
        "SELECT (ID,USERNAME,FIRSTNAME,LASTNAME) FROM csgames.USERS WHERE USERNAME LIKE '%" + req.query.id + "%';"
      );
      res.json(validation.rows);
    } catch (error) {
      console.log(error);
      res.status(404).json(error);
    }
    if (client) {
      client.release();
    }
  });

  app.post("/api/new-user", jsonParser, async (req, res) => {
    let body = req.body;
    if (!body || !body.name || !body.password || !body.firstname || !body.lastname) {
      console.log(body);
      res.status(404).json("Please provide name and desc in body");
      return;
    }

    if (
      !onlyLettersPattern.test(body.name) ||
      !onlyLettersPattern.test(body.firstname) ||
      !onlyLettersPattern.test(body.lastname) ||
      !numbersAndLettersPattern.test(body.password)
    ) {
      res.status(404).json("Please provide only letters in name, firstname and lastname, numbers allowed for password");
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
      res.status(404).json("Error");
      return;
    }
    res.cookie("id", user.name, { httpOnly: false, maxAge: 900000 });
    res.json("Success");
  });

  app.post("/api/login", jsonParser, async (req, res) => {
    console.log("POST /login");
    let body = req.body;
    if (!body || !body.username || !body.password) {
      console.log(body);
      console.log('Missing "username" or "password" in body');
      res.status(404).json("Please provide name and desc in body");
      return;
    }

    if (
      typeof body.username != "string" ||
      typeof body.password != "string" ||
      checkIllegalSQLSymbols(body.username) ||
      checkIllegalSQLSymbols(body.password)
    ) {
      res.status(404).json("Please provide a valid name, firstname and lastname, password");
      return;
    }

    let user = body;

    try {
      let client = await POOL.connect();
      const validation = await client.query(
        "SELECT ID,ISADMIN,USERNAME FROM csgames.USERS WHERE USERNAME = '" +
          user.username +
          "' AND PASSWORD = '" +
          user.password +
          "';"
      );
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
    } catch (error) {
      console.log(error);
      res.status(404).json("Error");
      return;
    }
    console.log("Success");
    res.json("Success");
  });

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

  app.post("/api/reset", async (req, res) => {
    try {
      await execQueries();
    } catch (error) {
      res.status(500).json("Error Resetting DB");
      return;
    }
    res.json("DB Reset");
  });

  app.post("/api/new-post", jsonParser, async (req, res) => {
    let body = req.body;
    if (!body || !body.title || !body.content || !body.id) {
      console.log(body);
      res.status(404).json("Please provide title and content in body");
      return;
    }

    console.log(body);
    if (
      typeof body.title != "string" ||
      typeof body.id != "string" ||
      checkIllegalSQLSymbols(body.title) ||
      checkIllegalSQLSymbols(body.id)
    ) {
      res.status(404).json("Please provide a valid title and id");
      return;
    }

    let post = body;

    try {
      let client = await POOL.connect();
      const ids = await client.query("SELECT ID FROM csgames.USERS WHERE USERNAME = '" + post.id + "';");
      if (!ids.rows[0]) {
        res.status(404).json("User not found");
        return;
      }
      const validation = await client.query(
        "INSERT INTO csgames.POSTS (TITLE,CONTENT,AUTHOR,ISSECRET) VALUES ('" +
          post.title +
          "','" +
          post.content +
          "','" +
          ids.rows[0].id +
          "'," +
          "false);"
      );
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
      return;
    }
    res.json("Success");
  });

  console.log("Done Setting up Express");
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
        "TITLE VARCHAR(255) NOT NULL," +
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
        "INSERT INTO csgames.POSTS (TITLE,CONTENT,AUTHOR,ISSECRET) VALUES ('Third Post','FlagOhOHOOhSNEAKY',2,true);" +
        "INSERT INTO csgames.POSTS (TITLE,CONTENT,AUTHOR,ISSECRET) VALUES ('Fourth Post','This is my fourth post, Help, I dont have the 3rd post, im desperate!',2,false);"
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
