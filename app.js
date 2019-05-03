// SET UP DATABAS WEB WORKER
// initialize dehydrated dataWorker variable for environmental access
let dataWorker = null
// if the browser supports 
if(!!Worker) {
	// wait for page load
    window.addEventListener('load', () => {
    	// hydrate the dataWorker variable
        dataWorker = new Worker('ww_local_data.js')

        // Setup the listener for incoming messages from the web worker
        dataWorker.onmessage = e => {
        	const password = document.getElementById('password').value,
				encData = e.data 
			try {
				const decodedData = CryptoJS.AES.decrypt(encData, password).toString(CryptoJS.enc.Utf8);
				const parsedData = JSON.parse(decodedData)
				console.log('parsedData: ', parsedData)
				// set parsed data to the model here
			} catch {
				console.log(new Error('Undecryptable'))
			} 
			// do regular login stuff here, making server calls and
			// updating the model if necessary
		}
    })
}

// DUMMY DATA TO TEST OPERATIONS
// IN PRODUCTION, THIS IS THE ENTERPRISE OBJECTS
// IN THE MODEL. I.E.: 
/*
    users: [],
    unmanaged_users: [],
    nodes: [],
    roles: [],
    teams: [],
    bridges: [],
    enforcements: {},
    role_users: [],
    team_users: [],
    managed_nodes: [],
    role_keys: [],
    security_keys: [],
    queued_team_users: [],
    queued_teams: [],
    role_enforcements: [],
    role_privileges: [],
    sso_services: [],
    scims: [],
    email_provision: [],
    user_privileges: [],
    order_history: []
*/
const dummyData = {
	license: [{type: 1, createdAt: 234563456}], 
	settings: {colorScheme: 'light', save2faToken: true}, 
	enforcements: [{type: 'duo', allowed: ['push', 'sms']}], 
	images: ['https://imgur.com/wtoGirlsOneCup'],
	users: [{id: 1, username: 'johnathan', email: 'whatever@gmail.com'}, {id: 1, username: 'johnathan', email: 'whatever@gmail.com'}, {id: 1, username: 'johnathan', email: 'whatever@gmail.com'}, {id: 1, username: 'johnathan', email: 'whatever@gmail.com'}],
	roles: [{roleId: 2, name: 'manager', priviges: [2, 5]}, {roleId: 2, name: 'manager', priviges: [2, 5]}, {roleId: 2, name: 'manager', priviges: [2, 5]}, {roleId: 2, name: 'manager', priviges: [2, 5]}],
	nodes: [{id: 3, name: 'root', users: [1, 1, 1]}, {id: 3, name: 'notRoot', users: [1, 1, 1]}, {id: 3, name: 'notRoot', users: [1, 1, 1]}]
}

// SETUP LOGIN SUBMIT HANDLERS
document.getElementById('loginForm').addEventListener('submit', e => {
	e.preventDefault()
	const password = document.getElementById('password').value,
		username = document.getElementById('username').value,
		encryptedDummy = CryptoJS.AES.encrypt(JSON.stringify(dummyData), password).toString()

	if(dataWorker) {
		// type 0: login data sent to fetch user data
		//   @param message
		//     container for requests, data, and flags
		dataWorker.postMessage({type: 0, data: [username,password]})
		// type 1: data sent to save/set
		// dataWorker.postMessage({type: 1, data: [username, encryptedDummy]})

	} else {
		// regular login
	}
}) 



