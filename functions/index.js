const functions = require('firebase-functions')
const admin = require('firebase-admin')
const firebaseHelper = require('firebase-functions-helper')
const express = require('express')
const bodyParser = require('body-parser')

admin.initializeApp(functions.config().firebase)
const db = admin.firestore()

const app = express()
const main = express()

const productsCollection = 'Products'

main.use('/api/v1', app)
main.use(bodyParser.json())
main.use(bodyParser.urlencoded({ extended: false }))

// REST API
app.post('/products', (req, res) => {
    firebaseHelper.firestore
        .createNewDocument(db, productsCollection, req.body)
    res.send('Create new product')
})

app.patch('/products/:productId', (req, res) => {
    firebaseHelper.firestore
        .updateCollection(db, productsCollection, 
        req.params.productId, req.body)
    res.send('Update a product ', req.params.productId)
})

app.get('/products/:productId', (req, res) => {
    firebaseHelper.firestore
        .getDocument(db, productsCollection, req.params.productId)
        .then(doc => res.status(200).send(doc))
        .catch((err) => {
            console.log(err)
            res.error(404)
        })
})

app.get('/products', (req, res) => {
    firebaseHelper.firestore
        .backup(db, productsCollection)
        .then(data => res.status(200).send(data))
        .catch((err) => {
            console.log(err)
            res.error(404)
        })
})

app.delete('/products/:productId', (req, res) => {
    firebaseHelper.firestore
        .deleteDocument(db, productsCollection,
        req.params.productId)
    res.send('Product deleted')
})

exports.webApi = functions.https.onRequest(main)