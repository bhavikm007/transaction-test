import http from 'http'
import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { ErrorHandler, errorHandle } from './config/ErrorHandler.js'
import routes from './routes/index.js'

const PORT = process.env.PORT || 5000
const dbURI = 'mongodb://localhost:27017/transactionTest'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()

// Create http server
app.server = http.createServer(app)

// logger
app.use(morgan('dev'))

// body parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// // documents dir
// app.use('/docs', express.static(__dirname + 'docs'));

// To connect to database
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
})

// Check database connection 
let db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('Database connected succefully...')
})

// API routes
app.use('/api', routes)

// Doc route
app.use('/docs', function (req, res) {
  res.sendFile('./docs/index.html', { root: __dirname })
});

// favicon
app.get('/favicon.ico', (req, res) => {
  res.sendFile("./favicon.ico", { root: __dirname });
});

// Not found url
app.use((req, res, next) => {
  console.log('error', { message: 'Route Not found', url: req.originalUrl })
  throw new ErrorHandler(404, 'Route Not found!')
})

// Handle general error
app.use((err, req, res, next) => {
  console.log('error', err)
  errorHandle(500, err, res)
})

// Listening app on port
app.server.listen(PORT, () => {
  console.log(`you are running server on port: ${app.server.address().port}`)
})
