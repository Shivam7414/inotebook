require('./db');

const express = require('express')
const app = express()
var cors = require('cors')

app.use(cors())
const port = 5000
app.use(express.json())
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(port, () => {
    console.log(`iNoteBook app listening on port ${port}`)
})
