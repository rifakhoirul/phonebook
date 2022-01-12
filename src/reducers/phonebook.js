import * as actions from '../constants'

const phonebook = (state = { phonebooks: [], live: false }, action) => {
    switch (action.type) {
        case actions.LOAD_PHONEBOOK_SUCCESS:
            return { phonebooks: action.phonebooks, live: true }
        case actions.ADD_DRAW_PHONEBOOK:
            return {
                phonebooks: [...state.phonebooks, {
                    _id: action._id, name: action.name, phone: action.phone, sent: true
                }],
                live: false
            }
        case actions.ADD_PHONEBOOK_SUCCESS:
            return {
                phonebooks: state.phonebooks.map(item => {
                    if (item._id === action.oldId)
                        item._id = action.phonebook._id
                    return item
                }),
                live: true
            }
        case actions.ADD_PHONEBOOK_FAILURE:
            return {
                phonebooks: state.phonebooks.map(item => {
                    if (item._id === action._id)
                        item.sent = false
                    return item
                }),
                live: false
            }
        case actions.REMOVE_PHONEBOOK_SUCCESS:
            return {
                phonebooks: state.phonebooks.filter(item => {
                    return item._id !== action._id
                }),
                live: true
            }
        case actions.RESEND_PHONEBOOK_SUCCESS:
            return {
                phonebooks: state.phonebooks.map(item => {
                    if (item._id === action.oldId) {
                        item.sent = true
                        item._id = action.newId
                    }
                    return item
                }),
                live: true
            }
        case actions.RESEND_PHONEBOOK_CANCEL:
            return {
                phonebooks: state.phonebooks.filter(i => { return i._id !== action._id }),
                live: true
            }
        case actions.EDIT_PHONEBOOK_SUCCESS:
            return {
                phonebooks: state.phonebooks.map(item => {
                    if (item._id === action._id) {
                        item.name = action.name
                        item.phone = action.phone
                    }
                    return item
                }),
                live: true
            }
        case actions.SEARCH_PHONEBOOK_SUCCESS:
            return { phonebooks: action.phonebooks, live: true }
        case actions.RESEND_PHONEBOOK_FAILURE:
        case actions.SEARCH_PHONEBOOK_FAILURE:
        case actions.EDIT_PHONEBOOK_FAILURE:
        case actions.LOAD_PHONEBOOK_FAILURE:
        case actions.REMOVE_PHONEBOOK_FAILURE:
        default:
            return {
                phonebooks: state.phonebooks,
                live: false
            }
    }
}

export default phonebook