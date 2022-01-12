import * as actions from '../constants'
import { v4 as uuidv4 } from 'uuid';
import { request, gql } from 'graphql-request'

const endpoint = 'http://localhost:3001/graphql'

const loadPhonebookSuccess = phonebooks => ({
    type: actions.LOAD_PHONEBOOK_SUCCESS,
    phonebooks
})
const loadPhonebookFailure = () => ({
    type: actions.LOAD_PHONEBOOK_FAILURE
})

export const loadPhonebook = () => (dispatch) => {
    const queryLoad = gql`
    query{
        getPhonebooks{
          _id
          name
          phone
              createdAt
        }
      }
    `
    return request(endpoint, queryLoad).then((response) => {
        response.getPhonebooks.map(i => {
            return i.sent = true
        })
        dispatch(loadPhonebookSuccess(response.getPhonebooks))
    }).catch(err => {
        dispatch(loadPhonebookFailure())
    })
}

const addPhonebookSuccess = (oldId, phonebook) => ({
    type: actions.ADD_PHONEBOOK_SUCCESS,
    oldId, phonebook
})
const addPhonebookFailure = (_id) => ({
    type: actions.ADD_PHONEBOOK_FAILURE,
    _id
})
const addDrawPhonebook = (_id, name, phone) => ({
    type: actions.ADD_DRAW_PHONEBOOK,
    _id, name, phone
})

export const addPhonebook = (name, phone) => (dispatch) => {
    const _id = uuidv4()
    dispatch(addDrawPhonebook(_id, name, phone))

    const mutationAdd = gql`
    mutation createPhonebook($name: String, $phone: String){
        createPhonebook(input: {name:$name, phone:$phone}){
            _id
           name
           phone
         } 
       }
    `
    const variablesAdd = {
        name: name,
        phone: phone,
    }

    return request(endpoint, mutationAdd, variablesAdd).then((response) => {
        dispatch(addPhonebookSuccess(_id, response.createPhonebook))
    }).catch(err => {
        dispatch(addPhonebookFailure(_id))
    })
}

const removePhonebookSuccess = _id => ({
    type: actions.REMOVE_PHONEBOOK_SUCCESS,
    _id
})
const removePhonebookFailure = () => ({
    type: actions.REMOVE_PHONEBOOK_FAILURE,
})

export const removePhonebook = (_id) => (dispatch) => {
    const mutationDelete = gql`
    mutation deletePhonebook($_id:ID!){
        deletePhonebook(_id:$_id){
            _id
           name
           phone
         } 
       }
    `
    const variablesDelete = {
        _id: _id,
    }

    return request(endpoint, mutationDelete, variablesDelete).then((response) => {
        dispatch(removePhonebookSuccess(_id))
    }).catch(err => {
        dispatch(removePhonebookFailure(_id))
    })
}

const resendPhonebookSuccess = (oldId, newId) => ({
    type: actions.RESEND_PHONEBOOK_SUCCESS,
    oldId, newId
})
const resendPhonebookFailure = () => ({
    type: actions.RESEND_PHONEBOOK_FAILURE,
})
const resendPhonebookCancel = (_id) => ({
    type: actions.RESEND_PHONEBOOK_CANCEL,
    _id
})

export const resendPhonebook = (_id, name, phone) => (dispatch) => {
    const mutationResend = gql`
    mutation createPhonebook($name: String, $phone: String){
        createPhonebook(input: {name:$name, phone:$phone}){
            _id
           name
           phone
         } 
       }
    `
    const variablesResend = {
        name: name,
        phone: phone,
    }

    return request(endpoint, mutationResend, variablesResend).then((response) => {
        dispatch(resendPhonebookSuccess(_id, response.createPhonebook._id))
    }).catch(err => {
        dispatch(resendPhonebookFailure())
    })
}

export const cancelResend = (_id) => (dispatch) => {
    return dispatch(resendPhonebookCancel(_id))
}

const editPhonebookSuccess = (_id, name, phone) => ({
    type: actions.EDIT_PHONEBOOK_SUCCESS,
    _id, name, phone
})
const editPhonebookFailure = () => ({
    type: actions.EDIT_PHONEBOOK_FAILURE,
})

export const editPhonebook = (id, name, phone) => (dispatch) => {
    const mutationEdit = gql`
    mutation updatePhonebook($_id:ID!, $name: String, $phone: String){
        updatePhonebook(_id:$_id, input: {name:$name, phone:$phone}){
            _id
           name
           phone
         } 
       }
    `
    const variablesEdit = {
        _id:id,
        name: name,
        phone: phone,
    }

    return request(endpoint, mutationEdit, variablesEdit).then((response) => {
        dispatch(editPhonebookSuccess(id, name, phone))
    }).catch(err => {
        console.error(err)
        dispatch(editPhonebookFailure())
    })
}

const searchPhonebookSuccess = phonebooks => ({
    type: actions.SEARCH_PHONEBOOK_SUCCESS,
    phonebooks
})
const searchPhonebookFailure = () => ({
    type: actions.SEARCH_PHONEBOOK_FAILURE,
})

export const searchPhonebook = (name, phone, sort) => (dispatch) => {
    const querySearch = gql`
    query searchPhonebooks($name: String, $phone: String, $sort: String){
        searchPhonebooks(name: $name, phone: $phone, sort: $sort){
          _id
          name
          phone
          createdAt
        }
      }
    `
    const variablesSearch = {
        name: name,
        phone: phone,
        sort: sort
    }

    return request(endpoint, querySearch, variablesSearch).then((response) => {
        dispatch(searchPhonebookSuccess(response.searchPhonebooks))
    }).catch(err => {
        console.error(err)
        dispatch(searchPhonebookFailure())
    })
}




