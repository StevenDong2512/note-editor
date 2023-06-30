import { openDB } from "idb";

const initdb = async () =>
  openDB("jate", 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains("jate")) {
        console.log("jate database already exists");
        return;
      }
      db.createObjectStore("jate", { keyPath: "id", autoIncrement: true });
      console.log("jate database created");
    },
  });

// TODO: Add logic to a method that accepts some content and adds it to the database
export const putDb = async (content) => {
  const isExisting = (await window.indexedDB.databases())
    .map((db) => db.name)
    .includes(DB_NAME);
  if (!isExisting) {
    await initdb();
  }
  const jateDb = await openDB(DB_NAME, DB_VERSION);
  const tx = jateDb.transaction(DB_NAME, "readwrite");
  const store = tx.objectStore(DB_NAME);
  const request = store.put({ value: content, id: 1 });
  const result = await request;
  console.log("text saved to the database", result);
};

// TODO: Add logic for a method that gets all the content from the database
export const getDb = async () => {
  const isExisting = (await window.indexedDB.databases())
    .map((db) => db.name)
    .includes(DB_NAME);
  if (!isExisting) {
    await initdb();
  }
  const jateDb = await openDB(DB_NAME, DB_VERSION);
  const tx = jateDb.transaction(DB_NAME, "readonly");
  const store = tx.objectStore(DB_NAME);
  const request = store.get(1);
  const result = await request;
  console.log("result.value", result);
  return result ? result.value : false;
};

initdb();
