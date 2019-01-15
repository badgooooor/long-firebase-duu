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

export const webApi = functions.https.onRequest(main)