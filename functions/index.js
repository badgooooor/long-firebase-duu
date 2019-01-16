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
// Endpoint                    Request       Description
// /products                   GET           list all products
//                             POST          add new product
// /products/:productId        GET           get individual product(from Id of document)
//                             PATCH         update product's data
//                             DELETE        delete product
app.post('/products', (req, res) => {
    firebaseHelper.firestore
        .createNewDocument(db, productsCollection, req.body)
        .then(docRef => {
            return res.status(200).send('Create new product')
        })
        .catch((err) => {
            console.log(err)
            res.error(400)
        })
})

app.patch('/products/:productId', (req, res) => {
    firebaseHelper.firestore
        .updateCollection(db, productsCollection, 
        req.params.productId, req.body)
        .then(res.status(200).send('Update a product'))
        .catch((err) => {
            console.log(err)
            res.error(400)
        })
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