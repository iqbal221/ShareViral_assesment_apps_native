// sqlite.ts
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("courses.db");

db.execSync(`
  CREATE TABLE IF NOT EXISTS courses (
    id TEXT PRIMARY KEY,
    title TEXT,
    instructor TEXT,
    tags TEXT,
    price REAL,
    rating REAL,
    duration REAL,
    isPremium INTEGER,
    isEnrolled INTEGER
  );
`);

export default db;
