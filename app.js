const express = require('express')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 3000
const cors = require('cors')
const route = require("./routes");

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/", route);

app.listen(port, () => console.log(`App listening at http://localhost:${port}`))