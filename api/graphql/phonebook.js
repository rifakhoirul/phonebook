const { buildSchema } = require('graphql');
const Phonebooks = require('../models/Phonebooks')

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

const serviceAccount = require('../serviceAccountKey.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

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
      const snapshot = await db.collection('phonebook').orderBy('createdAt').get();
      let phonebooks = []
      snapshot.forEach((doc) => {
        phonebooks.push({ _id: doc.id, ...doc.data() })
      });
      return phonebooks
    } catch (err) {
      throw new Error('gagal ambil data');
    }
  },
  searchPhonebooks: async ({ name, phone, sort }) => {
    try {
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

      return phonebooks
    } catch (err) {
      throw new Error('gagal ambil data');
    }
  },
  createPhonebook: async ({ input }) => {
    try {
      const add = await db.collection('phonebook').add({ ...input, createdAt: Date.now() })
      const snapshot = await db.collection('phonebook').doc(add.id).get();
      const phonebook = snapshot.data()
      return { _id: add.id, ...phonebook }
    } catch (err) {
      throw new Error('gagal ambil data');
    }
  },
  updatePhonebook: async ({ _id, input }) => {
    try {
      const update = await db.collection('phonebook').doc(_id).update({ ...input });
      const snapshot = await db.collection('phonebook').doc(_id).get();
      const phonebook = snapshot.data()
      return {_id:_id, ...phonebook}
    } catch (err) {
      throw new Error('gagal ambil data');
    }
  },
  deletePhonebook: async ({ _id }) => {
    try {
      const del = await db.collection('phonebook').doc(_id).delete();
      return
    } catch (err) {
      throw new Error('gagal ambil data');
    }
  },
};

module.exports = { schema, solution }