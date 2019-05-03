
/*
	* Wrapper promise providing a straightforward methods for 
	*  getting and setting data to IndexedDB

	* Uses:
	* 1. inject stored user data before login data from the server is fetched,
	* 2. queue user data to update the database for next login


	* The data structure of the data looks something like this: 
	* IndexedDB: {
	* 	databaseName: { // databaseName: username
	*     storeName: { // storeName: username
	*	    key: data // key: 'userData'
	*	  }
	* 	}
	* }
	*
	* @param string store
	*   Name of the store in the database
	* @param number|string optional version
	*   Current version of the database, used to hook 
	*   updates to the stores 
*/
const openLocalDB = (store, version=1) => new Promise((resolve, reject) => {
	const dbRequest = indexedDB.open(store, version)

	dbRequest.onupgradeneeded = e => {
		const db = e.target.result
		db.createObjectStore(store)
	}

	dbRequest.onsuccess = e => {
		const db = e.target.result	
		const tempDB = {}

		const getData = (key='userData') => new Promise((resolve, reject) => {
			const dbStore = db.transaction(store, 'readonly').objectStore(store)
			const get = dbStore.get(key)

			get.onsuccess = e => e.target.result !== undefined ? resolve(e.target.result, key) : reject('Dataless')
			get.onerror = e => reject('Ungettable')
		})
		
		const setData = (data, key='userData') => new Promise((resolve, reject) => {
			const dbStore = db.transaction(store, 'readwrite').objectStore(store)
			const put = dbStore.put(data, key)
			put.onsuccess = e => resolve(true)
			put.onerror = e => reject(e)
		})
		
		const pumpData = (data, key='userData') => new Promise((resolve, reject) => {
			tempDB[store] = {[key]: data}
			resolve()
		})
		
		const dumpData = () => new Promise((resolve, reject) => {
			const dbStore = db.transaction(store, 'readwrite').objectStore(store),
				tempStore = tempDB[store],
				storeKeys = Object.keys(tempStore)
			
			storeKeys.forEach(dataKey => {
				const put = dbStore.put(tempStore[dataKey], dataKey)
				put.onerror = e => reject(e)
			})
			resolve(true)
		})

		resolve({ getData, setData, pumpData, dumpData })
	}

	dbRequest.onerror = e => reject(e)
})


self.onmessage = e => {
	const dataContainer = e.data,
		data = dataContainer.data
		type = dataContainer.type
	if(type === 0) {
		const username = data[0],
			password = data[1]
		openLocalDB(username).then(db => {
			db.getData()
				.then((encData, key) => self.postMessage(encData))
				.catch(error => console.log(new Error(error)))
		})

	} else if(type === 1) {
		const username = data[0],
			payload = data[1]
		openLocalDB(username).then(db => {
			db.pumpData(payload)
				.then(data => db.dumpData().then(success => console.log('Data set!')).catch(err => console.log(new Error(err))))
				.catch(error => console.log(new Error(error)))
		})
	} else {
		self.postMessage(`MESSAGE TYPE: ${type} UNKNOWN`)
	}
}



