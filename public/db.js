let db;
const request = window.indexedDB.open("budget", 1);

request.onupgradeneeded = function(event) {
  db = event.target.result;
  db.createObjectStore("pendingTransactions", { keyPath: "listID", autoIncrement: true });
};

request.onsuccess = function() {
  db = request.result;

  if (navigator.onLine) {
    checkDatabase();
  }
};

request.onerror = function(event) {
  console.log(event);
};

function saveRecord(record) {
  console.log(record);

  const transaction = db.transaction(["pendingTransactions"], "readwrite");
  const pendingStore = transaction.objectStore("pendingTransactions");

  pendingStore.add({ record });
}

function checkDatabase() {
  const transaction = db.transaction(["pendingTransactions"], "readwrite");
  const pendingStore = transaction.objectStore("pendingTransactions");
  
  const getAll = pendingStore.getAll();

  getAll.onsuccess = function() {
    if (getAll.result.length > 0) {
      console.log(getAll.result);
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
      .then(response => response.json())
      .then(() => {
          const transaction = db.transaction(["pendingTransactions"], "readwrite");
          const pendingStore = transaction.objectStore("pendingTransactions");

          const deleteAll = pendingStore.clear();
          deleteAll.onsuccess = () => {
            console.log("deleted all items");
          }
      });
    }
  };
}

window.addEventListener("online", checkDatabase);