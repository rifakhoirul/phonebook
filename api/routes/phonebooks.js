var express = require('express');
var router = express.Router();
const Phonebooks = require('../models/Phonebooks')
const Response = require('../models/Response')

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

const serviceAccount = require('../serviceAccountKey.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

router.get('/', async function (req, res, next) {
  try {
    const snapshot = await db.collection('phonebook').orderBy('createdAt').get();
    console.log(snapshot)
    let phonebooks = []
    snapshot.forEach((doc) => {
      phonebooks.push({ _id: doc.id, ...doc.data() })
    });
    res.json(phonebooks)
  } catch (error) {
    console.log(error)
    res.status(500).json(new Response({ message: err }, false))
  }
});

router.post('/search', async function (req, res, next) {
  try {
    let { name, phone, sort } = req.body

    let snapshot
    switch (sort) {
      case 'id-asc':
        snapshot = await db.collection('phonebook').orderBy('createdAt').get();
        break
      case 'id-desc':
        snapshot = await db.collection('phonebook').orderBy('createdAt', 'desc').get();
        break
      case 'name-asc':
        snapshot = await db.collection('phonebook').orderBy('name').get();
        break
      case 'name-desc':
        snapshot = await db.collection('phonebook').orderBy('name', 'desc').get();
        break
      case 'phone-asc':
        snapshot = await db.collection('phonebook').orderBy('phone').get();
        break
      case 'phone-desc':
        snapshot = await db.collection('phonebook').orderBy('phone', 'desc').get();
        break
      default:
        snapshot = await db.collection('phonebook').orderBy('createdAt').get();
        break
    }

    let phonebooks = []
    snapshot.forEach((doc) => {
      phonebooks.push({ _id: doc.id, ...doc.data() })
    });

    if (name) {
      phonebooks = phonebooks.filter(item => item.name.toLowerCase().includes(name.toLowerCase()))
    }
    if (phone) {
      phonebooks = phonebooks.filter(item => item.phone.includes(phone))
    }

    res.json(phonebooks)
  } catch (error) {
    console.log(error)
    res.status(500).json(new Response({ message: error }, false))
  }
});

router.post('/', async function (req, res, next) {
  try {
    const add = await db.collection('phonebook').add({ ...req.body, createdAt: Date.now() })
    const snapshot = await db.collection('phonebook').doc(add.id).get();
    const phonebook = snapshot.data()
    res.json(new Response({ _id: add.id, ...phonebook }))
  } catch (error) {
    console.log(error)
    res.status(500).json(new Response({ message: error }, false))
  }
});

router.put('/:id', async function (req, res, next) {
  try {
    const update = await db.collection('phonebook').doc(req.params.id).update({ ...req.body });
    const snapshot = await db.collection('phonebook').doc(req.params.id).get();
    const phonebook = snapshot.data()
    res.json(new Response(phonebook))
  } catch (error) {
    console.log(error)
    res.status(500).json(new Response({ message: error }, false))
  }
});

router.delete('/:id', async function (req, res, next) {
  try {
    const del = await db.collection('phonebook').doc(req.params.id).delete();
    res.json(new Response({ message: 'deleted success' }))
  } catch (error) {
    console.log(error)
    res.status(500).json(new Response({ message: error }, false))
  }
});


module.exports = router;
