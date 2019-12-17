const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const responsaveis = require('./src/routes/responsaveis')
const PORT = 3001

app.use(cors())
app.use(bodyParser.json())
app.use('/responsaveis', responsaveis)


app.get('/', (request, response) => {
  response.send('Olá, mundo!')
})

app.listen(PORT)
console.info(`Rodando na porta ${PORT}`)