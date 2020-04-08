const express = require('express')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 3000
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.get('/test', (req, res) => res.status(200).json({ msg: 'Hello World' }))

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))