// POLYFILLS
window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB,
    IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.OIDBTransaction || window.msIDBTransaction
const version = 1

const dbRequest = indexedDB.open('elephants', version)

dbRequest.onsuccess = e => {
	const db = e.target.result

	// open transactions interface with the indexed database
	const transaction = db.transaction(['elephants'], 'readwrite')

	// set the data in store to key
	const put = transaction.objectStore('elephants').put('Terry Davis like elephants', 'elephantWisdom')

	// set the data associated with the given key in the given object store
	transaction.objectStore('elephants').get('elephantWisdom').onsuccess = e => console.log('elephantWisdom: ', e.target.result)
}

dbRequest.onupgradeneeded = e => {
	const db = e.target.result
	db.createObjectStore('elephants')
}

