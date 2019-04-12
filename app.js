// POLYFILLS
window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB,
    IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.OIDBTransaction || window.msIDBTransaction

// ENVIRONMENTAL VARIABLES
const version = 1,
	model = {
		quotes: []
	}

// DEV FUNCTION HELPERS
const externalDatabase = {
	terrySays: {
		quotes: ['CIA niggers', 'Indian niggers']
	}
}
const pretendExternalService = (key) => new Promise((resolve, reject) => {
	setTimeout(() => externalDatabase[key] ? resolve(externalDatabase[key]) : reject('Error: User not found'), 2000)
})

// HELPERS
const copy = item => {
	return !item ? item
			: Array.isArray(item) ? deepArrayCopy(item)
			: Object.prototype.toString.call(item).includes('Date') ? new Date(item.getTime())
			: typeof item === 'object' ? deepCopy(item)
			: item
}

const deepCopy = obj => {
	const objKeys = Object.keys(obj)
	const newObj = {}

	let i = objKeys.length
	let key, item
	while(i--) {
		key = objKeys[i]
		item = obj[key]
		newObj[key] = copy(item)
	}
	return newObj
}

const deepArrayCopy = arr => {
	let i = arr.length
	let item
	const newArr = []
	while(i--) {
		item = arr[i]
		newArr[i] = copy(item)
	}
	return newArr
}

const propogateModelUpdate = () => {

}

const updateModel = () => {

}

const diffModelsData = (newModel) => {
	// get the first dimension of keys
	const newKeys = Object.keys(newModel)

	const oldModelCopy = deepCopy(model)

	// iterate over them and check whether 
	newKeys.forEach(key => {

	})
}

const fetchData = (transaction, key) => {
	pretendExternalService(key)
		.then(data => diffModelsData(data))
		.catch(err => console.log('User not found. Awk'))
}

const setLocalData = (transaction, key, data) => {
	const put = transaction.put(data, key)
	put.onsuccess = e => fetchLocalData(transaction, 'terrySays')
}

const handleUninitializedIndex = (transaction, key) => {
	// this is where we initialize it with the server data
	setLocalData(transaction, key, {quotes: ['I like elephants']})
	fetchData(transaction, key)
}

const handleSuccessfulFetch = (transaction, result, key) => {
	// put the data in the model, 
	console.log('Success! Terry says: ', result)
	// then fetch the server data
	fetchData(transaction, key)
}

const fetchLocalData = (transaction, key) => new Promise((resolve, reject) => {
	const getTerry = transaction.get(key)
	getTerry.onsuccess = e => e.target.result !== undefined ? resolve(e.target.result, key) : reject(key)
	getTerry.onerror = e => reject(key)
})


// INIT THE APP... GET LOCAL DATA BY OPENING THE LOCAL DATABASE:
const dbRequest = indexedDB.open('elephants', version)

dbRequest.onsuccess = e => {
	const db = e.target.result

	// open transactions interface with the indexed database
	const transaction = db.transaction('elephants', 'readwrite').objectStore('elephants')

	fetchLocalData(transaction, 'terrySays')
		.then((result, key) => handleSuccessfulFetch(transaction, result, key))
		.catch(key => handleUninitializedIndex(transaction, key))
}

dbRequest.onupgradeneeded = e => {
	const db = e.target.result
	db.createObjectStore('elephants')
}
