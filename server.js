const express = require('express')
const app = express()

app.use(express.static(__dirname + '/'))
app.use(express.static(__dirname + '/app.js'))

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html')
})

app.listen(3000, () => console.log('listening on port 3000...'))