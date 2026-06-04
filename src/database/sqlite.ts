import SQLite from "react-native-sqlite-storage";

const db = SQLite.openDatabase(
  { name: "courses.db" },
  () => console.log("opened"),
  (error: any) => console.log(error),
);

export default db;

// Create table:
db.transaction((tx) => {
  tx.executeSql(`
    CREATE TABLE IF NOT EXISTS courses(
      id INTEGER PRIMARY KEY,
      title TEXT,
      instructor TEXT,
      description TEXT,
      category TEXT,
      enrolled INTEGER
    )
  `);
});
