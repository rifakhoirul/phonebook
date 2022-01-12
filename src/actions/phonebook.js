import axios from 'axios'
import * as actions from '../constants'
import { v4 as uuidv4 } from 'uuid';

const request = axios.create({
    baseURL: 'http://localhost:3001/api/',
    timeout: 10000
})

const loadPhonebookSuccess = phonebooks => ({
    type: actions.LOAD_PHONEBOOK_SUCCESS,
    phonebooks
})
const loadPhonebookFailure = () => ({
    type: actions.LOAD_PHONEBOOK_FAILURE
})

export const loadPhonebook = () => (dispatch) => {
    return request.get('phonebooks').then(response => {
        response.data.map(i => {
            return i.sent = true
        })
        dispatch(loadPhonebookSuccess(response.data))
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
    return request.post(`phonebooks`, {
        name: name,
        phone: phone
    }).then(response => {
        dispatch(addPhonebookSuccess(_id, response.data.data))
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
    return request.delete(`phonebooks/${_id}`).then(response => {
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
    return request.post(`phonebooks`, { name: name, phone: phone }).then(response => {
        console.log(response)
        dispatch(resendPhonebookSuccess(_id, response.data.data._id))
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
    return request.put(`phonebooks/${id}`, {
        name: name,
        phone: phone,
    }).then(response => {
        dispatch(editPhonebookSuccess(id, name, phone))
    }).catch(err => {
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
    return request.post(`phonebooks/search`, {
        name: name,
        phone: phone,
        sort: sort
    }).then(response => {
        dispatch(searchPhonebookSuccess(response.data))
    }).catch(err => {
        dispatch(searchPhonebookFailure())
    })
}




