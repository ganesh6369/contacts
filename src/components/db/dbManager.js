export const dbInfo = {
  UIResources: {
    name: "UIResources",
    lastestVersion: 2,
  },
};

const dbUpgradeVersionInfo = {
  UIResources: {
    1: {
      tablesConfig: [
        {
          name: "details",
          config: { keyPath: "id" },
          indexes: [],
        },
      ],
    },
  },
};

const dbManager = (dbName, version, upgradeInfo) => {
  let dbInfo = {};

  const getObjectStore = (db, tableName) => {
    var objectStore = db
      .transaction([tableName], "readwrite")
      .objectStore(tableName);

    return objectStore;
  };

  const attachCallbacks = (request, callback, method) => {
    request.onerror = function (event) {
      console.log(`Error occured in ${method}`);
      callback && callback(null);
    };
    request.onsuccess = function (event) {
      var data = event.target.result;
      callback && callback(data);
    };
  };

  const openDatabaseConnection = (
    upgradeCb = () => {},
    successCb = () => {}
  ) => {
    var request = indexedDB.open(dbName, version);
    request.onerror = function (event) {
      console.log("error occured while opening databse connection");
    };
    request.onsuccess = function (event) {
      const db = event.target.result;
      dbInfo = {
        name: dbName,
        version: version,
        db: event.target.result,
      };
      db.onversionchange = function (event) {
        db.close();
        console.log(
          "A new version of databse found. Closing previous connection."
        );
      };
      successCb && successCb(event);
    };
    request.onupgradeneeded = function (event) {
      const oldVersion = event.oldVersion;
      const newVersion = event.newVersion;
      for (let version = oldVersion + 1; version <= newVersion; version++) {
        if (
          upgradeInfo[dbName] &&
          upgradeInfo[dbName][version] &&
          upgradeInfo[dbName][version].tablesConfig
        ) {
          var db = event.target.result;
          for (let tableConfig of upgradeInfo[dbName][version].tablesConfig) {
            const store = db.createObjectStore(
              tableConfig.name,
              tableConfig.config
            );
            if (Array.isArray(tableConfig.indexes)) {
              for (let index of tableConfig.indexes) {
                store.createIndex(index.name, index.key, index.objectParam);
              }
            }
          }
        }
      }
      upgradeCb && upgradeCb(event);
    };
  };

  const addRecords = (tableName, records, callback) => {
    const addAllRecord = (db, table, records) => {
      const objectStore = getObjectStore(db, table);
      for (let record of records) {
        objectStore.add(record);
      }
      callback && callback();
    };
    if (!dbInfo.db) {
      openDatabaseConnection(null, (evt) => {
        addAllRecord(evt.target.result, tableName, records);
      });
    } else {
      addAllRecord(dbInfo.db, tableName, records);
    }
  };

  const getRecord = (tableName, recordId, callback) => {
    const getRecordbyId = (db, tableName, recordId) => {
      const objectStore = getObjectStore(db, tableName);
      const request = objectStore.get(recordId);
      attachCallbacks(request, callback, "getRecord");
    };
    if (!dbInfo.db) {
      openDatabaseConnection(null, (evt) => {
        getRecordbyId(evt.target.result, tableName, recordId);
      });
    } else {
      getRecordbyId(dbInfo.db, tableName, recordId);
    }
  };

  const getAllrecords = (tableName, callback) => {
    const getAll = (db, tableName) => {
      var objectStore = getObjectStore(db, tableName);
      const data = [];
      objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
          data.push(cursor.value);
          cursor.continue();
        } else {
          callback && callback(data);
        }
      };
      objectStore.openCursor().onerror = function (event) {
        console.log(`Error occured in getAllrecords`);
        callback && callback(null);
      };
    };
    if (!dbInfo.db) {
      openDatabaseConnection(null, (evt) => {
        getAll(evt.target.result, tableName);
      });
    } else {
      getAll(dbInfo.db, tableName);
    }
  };

  const updateRecord = (tableName, record, callback) => {
    const putRecord = (db, record) => {
      const objectStore = getObjectStore(db, tableName);
      const request = objectStore.put(record);
      attachCallbacks(request, callback, "updateRecord");
    };
    if (!dbInfo.db) {
      openDatabaseConnection(null, (evt) => {
        putRecord(evt.target.result, record);
      });
    } else {
      putRecord(dbInfo.db, record);
    }
  };

  const removeRecord = (tableName, recordId, callback) => {
    const removeRecordbyId = (db, tableName, recordId) => {
      var objectStore = getObjectStore(db, tableName);
      var request = objectStore.delete(recordId);
      attachCallbacks(request, callback, "removeRecord");
    };
    if (!dbInfo.db) {
      openDatabaseConnection(null, (evt) => {
        removeRecordbyId(evt.target.result, tableName, recordId);
      });
    } else {
      removeRecordbyId(dbInfo.db, tableName, recordId);
    }
  };

  const removeAll = (tableName, callback) => {
    const removeAllRecord = (db, tableName) => {
      var objectStore = getObjectStore(db, tableName);
      var request = objectStore.clear();
      attachCallbacks(request, callback, "removeAll");
    };
    if (!dbInfo.db) {
      openDatabaseConnection(null, (evt) => {
        removeAllRecord(evt.target.result, tableName);
      });
    } else {
      removeAllRecord(dbInfo.db, tableName);
    }
  };

  const getDbInfo = () => {
    return dbInfo;
  };

  return {
    openDatabaseConnection,
    getDbInfo,
    addRecords,
    getRecord,
    getAllrecords,
    updateRecord,
    removeRecord,
    removeAll,
  };
};

let dbManagerObj = null;

const getDbManager = () => {
  if (dbManagerObj) return dbManagerObj;
  dbManagerObj = {
    UIResources: dbManager(
      dbInfo.UIResources.name,
      dbInfo.UIResources.lastestVersion,
      dbUpgradeVersionInfo
    ),
  };

  return dbManagerObj;
};

const databaseManager = getDbManager();

export default databaseManager;
