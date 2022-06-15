import express from 'express'
import dotenv from 'dotenv'
import { MongoClient } from 'mongodb'
import eventRoutes from './routes/events.js'

dotenv.config()
const app = express()
app.use(express.json())

const client = new MongoClient(process.env.DB_URI, {
    useUnifiedTopology: true
})

export let collection

client.connect().then(result => {
    const database = client.db('deep-thought')
    collection = database.collection('events')
}, error => {
    console.log(error)
})

const PORT = process.env.PORT || 3333

app.use('/api/v3/app/events', eventRoutes)

app.listen(PORT, () =>{ 
    console.log(`Server started at http://localhost:${PORT}`)
})