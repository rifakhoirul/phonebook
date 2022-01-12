import React, { Component } from 'react'
import axios from 'axios'
import { Container } from 'react-bootstrap'
import AddPhonebook from './AddPhonebook'
import ModalDelete from './ModalDelete'
import PaginationButton from './PaginationButton'
import SearchForm from './SearchForm'
import TablePhonebook from './TablePhonebook'
import Title from './Title'
import { v4 as uuidv4 } from 'uuid';

const request = axios.create({
    baseURL: 'http://localhost:3001/api/',
    timeout: 10000
})

export default class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false,
            phonebooks: [],
            addName: '',
            addPhone: '',
            editId: '',
            editName: '',
            editPhone: '',
            modalOpen: false,
            showAlert: false,
            deleteId: '',
            sortBy: '',
            loading: false,
            currentPage: 1,
            postsPerPage: 3,
            showAlertCon: false
        }
        this.inputSearchName = React.createRef();
        this.inputSearchPhone = React.createRef();

        this.handleAddName = this.handleAddName.bind(this)
        this.handleAddPhone = this.handleAddPhone.bind(this)
        this.handleSubmitAdd = this.handleSubmitAdd.bind(this)
        this.handleEditName = this.handleEditName.bind(this)
        this.handleEditPhone = this.handleEditPhone.bind(this)
        this.handleEdit = this.handleEdit.bind(this)
        this.handleSubmitEdit = this.handleSubmitEdit.bind(this)
        this.submitEdit = this.submitEdit.bind(this)
        this.searchPhonebooks = this.searchPhonebooks.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
        this.closeModal = this.closeModal.bind(this)
        this.deletePhonebook = this.deletePhonebook.bind(this)
        this.handleSort = this.handleSort.bind(this)
        this.setOpen = this.setOpen.bind(this)
        this.setShowAlert = this.setShowAlert.bind(this)
        this.setEditId = this.setEditId.bind(this)
        this.setShowAlertCon = this.setShowAlertCon.bind(this)
        this.handleResend = this.handleResend.bind(this)
        this.handleCancelResend = this.handleCancelResend.bind(this)
    }

    componentDidMount() {
        this.setState({ loading: true })
        request.get('phonebooks').then(response => {
            response.data.map(i => {
                return i.sent = true
            })
            this.setState({
                loading: false,
                phonebooks: response.data,
                showAlertCon: false,
            })
        }).catch(err => {
            console.error(err)
            this.setState({
                showAlertCon: true,
            })
        })
    }

    handleAddName(e) {
        this.setState({
            addName: e.target.value
        })
    }
    handleAddPhone(e) {
        if (/^[0-9]*$/.test(e.target.value)) {
            this.setState({
                addPhone: e.target.value
            })
        } else {
            this.setState({
                addPhone: ''
            })
        }
    }
    handleSubmitAdd(e) {
        e.preventDefault()
        request.post(`phonebooks`, {
            name: this.state.addName,
            phone: this.state.addPhone
        }).then(response => {
            this.setState({
                phonebooks: [...this.state.phonebooks, response.data.data],
                addName: '',
                addPhone: '',
                showAlert: true,
                showAlertCon: false
            })
        }).catch(err => {
            this.setState({
                phonebooks: [...this.state.phonebooks, { _id: uuidv4(), name: this.state.addName, phone: this.state.addPhone, sent: false }],
                addName: '',
                addPhone: '',
                showAlertCon: true
            })
        })
    }
    handleEditName(e) {
        this.setState({
            editName: e.target.value
        })
    }
    handleEditPhone(e) {
        if (/^[0-9]*$/.test(e.target.value)) {
            this.setState({
                editPhone: e.target.value
            })
        } else {
            this.setState({
                editPhone: ''
            })
        }
    }
    handleEdit(id, name, phone) {
        this.setState({
            editId: id,
            editName: name,
            editPhone: phone
        })
    }
    handleSubmitEdit(e) {
        e.preventDefault()
        this.submitEdit()
    }
    submitEdit() {
        request.put(`phonebooks/${this.state.editId}`, {
            name: this.state.editName,
            phone: this.state.editPhone,
        }).then(response => {
            this.setState({
                phonebooks: response.data.data,
                editId: '',
                showAlertCon: false
            })
            this.inputSearchName.current.value = null
            this.inputSearchPhone.current.value = null
            this.handleSort()
        }).catch(err => {
            this.setState({
                showAlertCon: true
            })
        })
    }
    searchPhonebooks(sort) {
        this.setState({
            loading: true
        })
        if (!/^[0-9]*$/.test(this.inputSearchPhone.current.value)) {
            this.inputSearchPhone.current.value = null
        }
        request.post(`phonebooks/search`, {
            name: this.inputSearchName.current.value,
            phone: this.inputSearchPhone.current.value,
            sort: sort
        }).then(response => {
            this.setState({
                loading: false,
                phonebooks: response.data,
                showAlertCon: false
            })
        }).catch(err => {
            this.setState({
                showAlertCon: true
            })
        })
    }
    handleDelete(id) {
        this.setState({
            deleteId: id,
            modalOpen: true
        })
    }
    closeModal() {
        this.setState({
            deleteId: '',
            modalOpen: false
        })
    }
    deletePhonebook() {
        request.delete(`phonebooks/${this.state.deleteId}`).then(response => {
            this.setState({
                phonebooks: this.state.phonebooks.filter(i => { return i._id !== this.state.deleteId }),
                deleteId: '',
                modalOpen: false,
                showAlertCon: false
            })
        }).catch(err => {
            this.setState({
                showAlertCon: true
            })
        })
    }
    handleSort(sort) {
        this.setState({
            sortBy: sort
        })
        this.searchPhonebooks(sort)
    }
    setOpen(o) {
        this.setState({
            open: o
        })
    }
    setShowAlert(s) {
        this.setState({
            showAlert: s
        })
    }
    setEditId(i) {
        this.setState({
            editId: i
        })
    }
    setShowAlertCon(s) {
        this.setState({
            showAlertCon: s
        })
    }
    handleResend(id, name, phone) {
        request.post(`phonebooks`, {
            name: name,
            phone: phone
        }).then(response => {
            response.data.data.sent = true
            this.setState({
                phonebooks: [...this.state.phonebooks.filter(i => { return i._id !== id }), response.data.data],
                showAlertCon: false
            })
        }).catch(err => {
            this.setState({
                showAlertCon: true
            })
        })
    }
    handleCancelResend(id) {
        this.setState({
            phonebooks: this.state.phonebooks.filter(i => { return i._id !== id }),
        })
    }
    render() {
        const indexOfLastPost = this.state.currentPage * this.state.postsPerPage
        const indexOfFirstPost = indexOfLastPost - this.state.postsPerPage
        const currentPosts = this.state.phonebooks.slice(indexOfFirstPost, indexOfLastPost)
        const paginate = (pageNumber) => {
            this.setState({
                currentPage: pageNumber
            })
        }
        const pageNumbers = []
        for (let i = 1; i <= Math.ceil(this.state.phonebooks.length / this.state.postsPerPage); i++) {
            pageNumbers.push(i)
        }
        return (
            <Container className="mt-4">
                <Title />
                <AddPhonebook
                    open={this.state.open}
                    setOpen={this.setOpen}
                    handleSubmitAdd={this.handleSubmitAdd}
                    handleAddName={this.handleAddName}
                    addName={this.state.addName}
                    handleAddPhone={this.handleAddPhone}
                    addPhone={this.state.addPhone}
                    showAlert={this.state.showAlert}
                    setShowAlert={this.setShowAlert}
                    showAlertCon={this.state.showAlertCon}
                    setShowAlertCon={this.setShowAlertCon}
                />
                <SearchForm
                    searchPhonebooks={this.searchPhonebooks}
                    inputSearchName={this.inputSearchName}
                    inputSearchPhone={this.inputSearchPhone}
                />
                <TablePhonebook
                    sortBy={this.state.sortBy}
                    handleSort={this.handleSort}
                    loading={this.state.loading}
                    currentPosts={currentPosts}
                    editId={this.state.editId}
                    currentPage={this.state.currentPage}
                    handleSubmitEdit={this.handleSubmitEdit}
                    submitEdit={this.submitEdit}
                    editName={this.state.editName}
                    handleEditName={this.handleEditName}
                    editPhone={this.state.editPhone}
                    handleEditPhone={this.handleEditPhone}
                    setEditId={this.setEditId}
                    handleEdit={this.handleEdit}
                    handleDelete={this.handleDelete}
                    postsPerPage={this.state.postsPerPage}
                    handleResend={this.handleResend}
                    handleCancelResend={this.handleCancelResend}
                />
                <PaginationButton
                    paginate={paginate}
                    currentPage={this.state.currentPage}
                    pageNumbers={pageNumbers}
                />
                <ModalDelete
                    modalOpen={this.state.modalOpen}
                    closeModal={this.closeModal}
                    deletePhonebook={this.deletePhonebook}
                />
            </Container>
        )
    }
}