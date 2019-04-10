// POLYFILLS
window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB,
    IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.OIDBTransaction || window.msIDBTransaction

const version = 1

const dbRequest = indexedDB.open('elephants', version)

console.log('dbRequest: ', dbRequest)

dbRequest.onsuccess = e => {
	const db = e.target.result
	console.log('db: ', db)

	const transaction = db.transaction(['elephants'], 'readwrite')
	const put = transaction.objectStore('elephants').put('Terry Davis like elephants', 'elephantWisdom')

	transaction.objectStore('elephants').get('elephantWisdom').onsuccess = e => {
		const elephantWisdom = e.target.result
		console.log('elephantWisdom: ', elephantWisdom)
	}
}

dbRequest.onupgradeneeded = e => {
	console.log('on upgrade needed event: ', e)
	const db = e.target.result
	const objectStore = db.createObjectStore('elephants')
	// objectStore.createIndex('datadatadata', "data", {unique: false})
}

