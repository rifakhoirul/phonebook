const { buildSchema } = require('graphql');
const Phonebooks = require('../models/Phonebooks')

const schema = buildSchema(`
  scalar Date

  input PhonebookInput {
    name: String
    phone: String
  }

  type Phonebook {
    _id: ID!
    name: String
    phone: String
    createdAt: Date
  }

  type Query {
    getPhonebooks: [Phonebook]
    getPhonebook(_id: ID!): Phonebook
    searchPhonebooks(name: String, phone: String, sort: String): [Phonebook]
  }

  type Mutation {
    createPhonebook(input: PhonebookInput): Phonebook
    updatePhonebook(_id: ID!, input: PhonebookInput): Phonebook
    deletePhonebook(_id: ID!): Phonebook
  }
`);

const solution = {
  getPhonebooks: async () => {
    try {
      const phonebook = Phonebooks.find()
      return phonebook
    } catch (err) {
      throw new Error('gagal ambil data');
    }
  },
  getPhonebook: async ({ _id }) => {
    try {
      const phonebook = await Phonebooks.findOne({ _id: _id })
      return phonebook
    } catch (err) {
      throw new Error('gagal ambil data');
    }
  },
  searchPhonebooks: async ({ name, phone, sort }) => {
    try {
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
      let data
      if (!name && !phone) {
        data = await Phonebooks.find().sort(sort)
      } else if (!name && phone) {
        data = await Phonebooks.find({ 'phone': { $regex: new RegExp(phone, 'i') } }).sort(sort)
      } else if (name && !phone) {
        data = await Phonebooks.find({ 'name': { $regex: new RegExp(name, 'i') } }).sort(sort)
      } else if (name && phone) {
        data = await Phonebooks.find({ 'name': { $regex: new RegExp(name, 'i') }, 'phone': { $regex: new RegExp(phone, 'i') } }).sort(sort)
      }
      return data
    } catch (err) {
      throw new Error('gagal ambil data');
    }
  },
  createPhonebook: async ({ input }) => {
    try {
      const phonebooks = await Phonebooks.create(input)
      return phonebooks
    } catch (err) {
      throw new Error('gagal ambil data');
    }
  },
  updatePhonebook: async ({ _id, input }) => {
    try {
      const phonebook = await Phonebooks.findByIdAndUpdate(_id, input, { new: true })
      return phonebook
    } catch (err) {
      throw new Error('gagal ambil data');
    }
  },
  deletePhonebook: async ({ _id }) => {
    try {
      const phonebook = await Phonebooks.findByIdAndDelete(_id)
      return phonebook
    } catch (err) {
      throw new Error('gagal ambil data');
    }
  },
};

module.exports = { schema, solution }