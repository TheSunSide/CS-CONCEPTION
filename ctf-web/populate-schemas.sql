-- For PostgreSQL 14
DROP SCHEMA IF EXISTS csgames CASCADE;
CREATE SCHEMA IF NOT EXISTS csgames;
set search_path = csgames;

CREATE TABLE USERS (
    ID SERIAL PRIMARY KEY,
    USERNAME VARCHAR(255) NOT NULL,
    PASSWORD VARCHAR(255) NOT NULL,
    EMAIL VARCHAR(255) NOT NULL,
    FIRSTNAME VARCHAR(255) NOT NULL,
    LASTNAME VARCHAR(255) NOT NULL,
    ISADMIN BOOLEAN NOT NULL
);

CREATE TABLE POSTS (
    ID SERIAL PRIMARY KEY,
    TITLE VARCHAR(255) NOT NULL,
    CONTENT TEXT NOT NULL,
    AUTHOR INTEGER NOT NULL,
    FOREIGN KEY (AUTHOR) REFERENCES USERS(ID)
);
