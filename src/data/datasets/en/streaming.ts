/**
 * Streaming platform dataset (English).
 * Contains users, movies, watch history, and ratings
 * for streaming-related SQL exercises.
 */
import type { Dataset } from "@/types/exercise";

export const streamingDatasetEn: Dataset = {
  id: "streaming",
  name: "Streaming Platform",
  description:
    "A streaming platform with users, movies, watch history, and ratings.",
  tables: [
    {
      name: "users",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "name", type: "VARCHAR(100)", nullable: false },
        { name: "email", type: "VARCHAR(100)", nullable: false },
        { name: "subscription", type: "VARCHAR(20)", nullable: false },
        { name: "registered_at", type: "DATE", nullable: false },
      ],
    },
    {
      name: "movies",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "title", type: "VARCHAR(200)", nullable: false },
        { name: "genre", type: "VARCHAR(50)", nullable: false },
        { name: "year", type: "INTEGER", nullable: false },
        { name: "duration_min", type: "INTEGER", nullable: false },
        { name: "rating", type: "DECIMAL(3,2)", nullable: true },
      ],
    },
    {
      name: "watch_history",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "user_id", type: "INTEGER", nullable: false, references: "users.id" },
        { name: "movie_id", type: "INTEGER", nullable: false, references: "movies.id" },
        { name: "watched_at", type: "DATETIME", nullable: false },
        { name: "progress_percent", type: "INTEGER", nullable: false },
      ],
    },
    {
      name: "ratings",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "user_id", type: "INTEGER", nullable: false, references: "users.id" },
        { name: "movie_id", type: "INTEGER", nullable: false, references: "movies.id" },
        { name: "stars", type: "INTEGER", nullable: false },
        { name: "comment", type: "TEXT", nullable: true },
        { name: "rated_at", type: "DATETIME", nullable: false },
      ],
    },
  ],
  sql: `CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  subscription VARCHAR(20) NOT NULL,
  registered_at DATE NOT NULL
);
CREATE TABLE movies (
  id INTEGER PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  genre VARCHAR(50) NOT NULL,
  year INTEGER NOT NULL,
  duration_min INTEGER NOT NULL,
  rating DECIMAL(3,2)
);
CREATE TABLE watch_history (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  movie_id INTEGER NOT NULL REFERENCES movies(id),
  watched_at DATETIME NOT NULL,
  progress_percent INTEGER NOT NULL
);
CREATE TABLE ratings (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  movie_id INTEGER NOT NULL REFERENCES movies(id),
  stars INTEGER NOT NULL,
  comment TEXT,
  rated_at DATETIME NOT NULL
);
INSERT INTO users VALUES
(1,'Alex Stream','alex@stream.de','Premium','2022-01-15'),
(2,'Benny Watch','benny@stream.de','Standard','2022-03-20'),
(3,'Carla Movie','carla@stream.de','Premium','2022-05-10'),
(4,'Dennis Film','dennis@stream.de','Standard','2022-07-05'),
(5,'Emma Series','emma@stream.de','Premium','2022-09-12'),
(6,'Felix Cinema','felix@stream.de','Basic','2022-11-18'),
(7,'Greta Screen','greta@stream.de','Standard','2023-01-22'),
(8,'Hannes Binge','hannes@stream.de','Premium','2023-03-30'),
(9,'Ina Couch','ina@stream.de','Basic','2023-05-14'),
(10,'Jonas Series','jonas@stream.de','Premium','2023-07-01');
INSERT INTO movies VALUES
(1,'The Godfather','Drama',1972,175,4.80),
(2,'Inception','Sci-Fi',2010,148,4.70),
(3,'Pulp Fiction','Crime',1994,154,4.60),
(4,'Forrest Gump','Drama',1994,142,4.50),
(5,'Dark Knight','Action',2008,152,4.80),
(6,'Interstellar','Sci-Fi',2014,169,4.70),
(7,'Fight Club','Drama',1999,139,4.60),
(8,'Matrix','Sci-Fi',1999,136,4.50),
(9,'Goodfellas','Crime',1990,146,4.40),
(10,'Parasite','Thriller',2019,132,4.60),
(11,'Avengers: Endgame','Action',2019,181,4.30),
(12,'Titanic','Drama',1997,194,4.40),
(13,'Shawshank','Drama',1994,142,4.90),
(14,'Gladiator','Action',2000,155,4.50),
(15,'La La Land','Musical',2016,128,4.20);
INSERT INTO watch_history VALUES
(1,1,1,'2024-01-10 20:00:00',100),
(2,1,2,'2024-01-12 19:30:00',100),
(3,1,5,'2024-01-15 21:00:00',100),
(4,2,3,'2024-01-11 18:00:00',100),
(5,2,4,'2024-01-13 20:00:00',85),
(6,3,6,'2024-01-10 22:00:00',100),
(7,3,10,'2024-01-14 19:00:00',100),
(8,4,7,'2024-01-12 21:00:00',60),
(9,4,8,'2024-01-14 20:00:00',100),
(10,5,9,'2024-01-11 19:00:00',100),
(11,5,13,'2024-01-15 20:30:00',100),
(12,6,11,'2024-01-13 18:00:00',100),
(13,6,12,'2024-01-16 21:00:00',40),
(14,7,2,'2024-01-10 20:00:00',100),
(15,7,6,'2024-01-14 22:00:00',100),
(16,8,1,'2024-01-11 19:00:00',100),
(17,8,5,'2024-01-15 20:00:00',100),
(18,9,4,'2024-01-12 20:00:00',100),
(19,9,14,'2024-01-16 19:00:00',70),
(20,10,3,'2024-01-13 21:00:00',100),
(21,10,7,'2024-01-17 20:00:00',100),
(22,1,10,'2024-02-01 19:00:00',100),
(23,2,15,'2024-02-02 20:00:00',100),
(24,3,1,'2024-02-03 21:00:00',100),
(25,4,6,'2024-02-04 19:00:00',50),
(26,5,2,'2024-02-05 20:00:00',100),
(27,6,9,'2024-02-06 18:00:00',100),
(28,7,13,'2024-02-07 22:00:00',100),
(29,8,10,'2024-02-08 20:00:00',100),
(30,9,8,'2024-02-09 19:00:00',100);
INSERT INTO ratings VALUES
(1,1,1,5,'Masterpiece','2024-01-11 10:00:00'),
(2,1,2,5,'Brilliant film','2024-01-13 10:00:00'),
(3,2,3,4,'Very good','2024-01-12 10:00:00'),
(4,2,4,3,'Nice','2024-01-14 10:00:00'),
(5,3,6,5,'Breathtaking','2024-01-11 10:00:00'),
(6,3,10,4,'Exciting','2024-01-15 10:00:00'),
(7,4,7,2,'Too violent','2024-01-13 10:00:00'),
(8,4,8,4,'Cult classic','2024-01-15 10:00:00'),
(9,5,9,4,'Good crime film','2024-01-12 10:00:00'),
(10,5,13,5,'Best adaptation','2024-01-16 10:00:00'),
(11,6,11,3,'Too long','2024-01-14 10:00:00'),
(12,6,12,4,'Classic','2024-01-17 10:00:00'),
(13,7,2,4,'Complex','2024-01-11 10:00:00'),
(14,7,6,5,'Wonderful','2024-01-15 10:00:00'),
(15,8,1,5,'Unforgettable','2024-01-12 10:00:00'),
(16,8,5,4,'Good action','2024-01-16 10:00:00'),
(17,9,4,3,'Slow','2024-01-13 10:00:00'),
(18,9,14,4,'Good','2024-01-17 10:00:00'),
(19,10,3,4,'Stylish','2024-01-14 10:00:00'),
(20,10,7,3,'Confusing','2024-01-18 10:00:00');
`,
};