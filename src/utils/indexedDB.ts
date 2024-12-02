export const DB_NAME = 'QuranAudioDB';
export const STORE_NAME = 'audioFiles';
export const DB_VERSION = 1;

export const openDB = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'key' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
};

export const deleteFromDB = async (keys: string[]) => {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  return Promise.all(keys.map(key => store.delete(key)));
};

export const checkIfExists = async (key: string) => {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);
  const result = await store.get(key);
  return !!result;
};

export const storeInDB = async (data: any) => {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  await store.put(data);
};

export const getAllKeysForSurah = async (reciter: string, surahNumber: number) => {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);
  const request = store.getAll();
  
  return new Promise<string[]>((resolve, reject) => {
    request.onsuccess = () => {
      const allRecords = request.result;
      const keys = allRecords
        .filter(record => 
          record.key.startsWith(`${reciter}_${surahNumber}_`)
        )
        .map(record => record.key);
      resolve(keys);
    };
    request.onerror = () => reject(request.error);
  });
};