var express = require('express');
var router = express.Router();
const Phonebooks = require('../models/Phonebooks')
const Response = require('../models/Response')

router.get('/', async function (req, res, next) {
  try {
    const phonebooks = await Phonebooks.find()
    res.json(phonebooks)
  } catch (error) {
    console.log(error)
    res.status(500).json(new Response({ message: err }, false))
  }
});

router.post('/search', async function (req, res, next) {
  let { name, phone, sort } = req.body
  if (sort) {
    switch (sort) {
      case 'id-desc':
        sort = { createdAt: -1 }
        break
      case 'name-asc':
        sort = { name: 1 }
        break
      case 'name-desc':
        sort = { name: -1 }
        break
      case 'phone-asc':
        sort = { phone: 1 }
        break
      case 'phone-desc':
        sort = { phone: -1 }
        break
      case 'id-asc':
      default:
        break
    }
  }
  try {
    let phonebooks
    if (!name && !phone) {
      phonebooks = await Phonebooks.find().sort(sort)
    } else if (!name && phone) {
      phonebooks = await Phonebooks.find({ 'phone': { $regex: new RegExp(phone, 'i') } }).sort(sort)
    } else if (name && !phone) {
      phonebooks = await Phonebooks.find({ 'name': { $regex: new RegExp(name, 'i') } }).sort(sort)
    } else if (name && phone) {
      phonebooks = await Phonebooks.find({ 'name': { $regex: new RegExp(name, 'i') }, 'phone': { $regex: new RegExp(phone, 'i') } }).sort(sort)
    }
    res.json(phonebooks)
  } catch (error) {
    console.log(error)
    res.status(500).json(new Response({ message: error }, false))
  }
});

router.post('/', async function (req, res, next) {
  try {
    const phonebooks = await Phonebooks.create({ ...req.body })
    res.json(new Response(phonebooks))
  } catch (error) {
    console.log(error)
    res.status(500).json(new Response({ message: error }, false))
  }
});

router.put('/:id', async function (req, res, next) {
  try {
    await Phonebooks.findByIdAndUpdate(req.params.id, { ...req.body })
    const phonebook = await Phonebooks.find()
    res.json(new Response(phonebook))
  } catch (error) {
    console.log(error)
    res.status(500).json(new Response({ message: error }, false))
  }
});

router.delete('/:id', async function (req, res, next) {
  try {
    const phonebook = await Phonebooks.findByIdAndDelete(req.params.id)
    res.json(new Response(phonebook))
  } catch (error) {
    console.log(error)
    res.status(500).json(new Response({ message: error }, false))
  }
});


module.exports = router;
