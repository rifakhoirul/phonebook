import { useState, useEffect, useRef } from 'react'
import { Container } from 'react-bootstrap'
import AddPhonebook from './AddPhonebook'
import ModalDelete from './ModalDelete'
import PaginationButton from './PaginationButton'
import SearchForm from './SearchForm'
import TablePhonebook from './TablePhonebook'
import Title from './Title'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';

const request = axios.create({
    baseURL: 'http://localhost:3001/api/',
    timeout: 10000
})

function App() {
    const [open, setOpen] = useState(false);
    const [phonebooks, setPhonebooks] = useState([])
    const [addName, setAddName] = useState()
    const [addPhone, setAddPhone] = useState()
    const [editId, setEditId] = useState()
    const [editName, setEditName] = useState()
    const [editPhone, setEditPhone] = useState()
    const [modalOpen, setModalOpen] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const [deleteId, setDeleteId] = useState()
    const [sortBy, setSortBy] = useState()
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [postsPerPage] = useState(3)
    const inputSearchName = useRef();
    const inputSearchPhone = useRef();
    const [showAlertCon, setShowAlertCon] = useState(false)

    useEffect(() => {
        const fetchPhonebooks = () => {
            setLoading(true)
            request.get('phonebooks').then(response => {
                response.data.map(i => {
                    return i.sent = true
                })
                setLoading(false)
                setPhonebooks(response.data)
                setShowAlertCon(false)
            }).catch(err => {
                console.log(err)
                setShowAlertCon(true)
            })
        }
        fetchPhonebooks()
    }, [])

    function handleAddName(e) {
        setAddName(e.target.value)
    }
    function handleAddPhone(e) {
        if (/^[0-9]*$/.test(e.target.value)) {
            setAddPhone(e.target.value)
        } else {
            setAddPhone('')
        }
    }
    function handleSubmitAdd(e) {
        e.preventDefault()
        request.post(`phonebooks`, {
            name: addName,
            phone: addPhone
        }).then(response => {
            response.data.data.sent = true
            setPhonebooks(old => [...old, response.data.data])
            setAddName('')
            setAddPhone('')
            setShowAlert(true)
        }).catch(err => {
            setPhonebooks(old => [...old, {_id:uuidv4(), name: addName, phone: addPhone, sent:false }])
            setAddName('')
            setAddPhone('')
            setShowAlertCon(true)
        })
    }
    function handleEditName(e) {
        setEditName(e.target.value)
    }
    function handleEditPhone(e) {
        if (/^[0-9]*$/.test(e.target.value)) {
            setEditPhone(e.target.value)
        } else {
            setEditPhone('')
        }
    }
    function handleEdit(id, name, phone) {
        setEditId(id)
        setEditName(name)
        setEditPhone(phone)
    }
    function handleSubmitEdit(e) {
        e.preventDefault()
        submitEdit()
    }
    function submitEdit() {
        request.put(`phonebooks/${editId}`, {
            name: editName,
            phone: editPhone,
        }).then(response => {
            setPhonebooks(response.data.data)
            setEditId('')
            handleSort()
            inputSearchName.current.value = null
            inputSearchPhone.current.value = null
            setShowAlertCon(false)
        }).catch(err => {
            setShowAlertCon(true)
        })
    }

    function searchPhonebooks(sort) {
        setLoading(true)
        if (!/^[0-9]*$/.test(inputSearchPhone.current.value)) {
            inputSearchPhone.current.value = null
        }
        request.post(`phonebooks/search`, {
            name: inputSearchName.current.value,
            phone: inputSearchPhone.current.value,
            sort: sort
        }).then(response => {
            setLoading(false)
            setPhonebooks(response.data)
            setShowAlertCon(false)
        }).catch(err => {
            setShowAlertCon(true)
        })
    }
    function handleDelete(id) {
        setDeleteId(id)
        setModalOpen(true)
    }
    function closeModal() {
        setDeleteId('')
        setModalOpen(false)
    }
    function deletePhonebook() {
        request.delete(`phonebooks/${deleteId}`).then(response => {
            setPhonebooks(phonebooks.filter(i => { return i._id !== deleteId }))
            setDeleteId('')
            setModalOpen(false)
            setShowAlertCon(false)
        }).catch(err => {
            setShowAlertCon(true)
        })
    }
    function handleSort(sort) {
        setSortBy(sort)
        searchPhonebooks(sort)
    }
    function handleResend(id, name, phone) {
        request.post(`phonebooks`, {
            name: name,
            phone: phone
        }).then(response => {
            response.data.data.sent = true
            setPhonebooks([...phonebooks.filter(i=>{return i._id !== id}), response.data.data])
            setShowAlertCon(false)
        }).catch(err => {
            setShowAlertCon(true)
        })
    }
    function handleCancelResend(id, name, phone) {
        setPhonebooks(phonebooks.filter(i=>{return i._id !== id}))
    }


    const indexOfLastPost = currentPage * postsPerPage
    const indexOfFirstPost = indexOfLastPost - postsPerPage
    const currentPosts = phonebooks.slice(indexOfFirstPost, indexOfLastPost)
    const paginate = pageNumber => setCurrentPage(pageNumber)
    const pageNumbers = []
    for (let i = 1; i <= Math.ceil(phonebooks.length / postsPerPage); i++) {
        pageNumbers.push(i)
    }

    return (
        <Container className="mt-4">
            <Title />
            <AddPhonebook
                open={open}
                setOpen={setOpen}
                handleSubmitAdd={handleSubmitAdd}
                handleAddName={handleAddName}
                addName={addName}
                handleAddPhone={handleAddPhone}
                addPhone={addPhone}
                showAlert={showAlert}
                setShowAlert={setShowAlert}
                showAlertCon={showAlertCon}
                setShowAlertCon={setShowAlertCon}
            />
            <SearchForm
                searchPhonebooks={searchPhonebooks}
                inputSearchName={inputSearchName}
                inputSearchPhone={inputSearchPhone}
            />
            <TablePhonebook
                sortBy={sortBy}
                handleSort={handleSort}
                loading={loading}
                currentPosts={currentPosts}
                editId={editId}
                currentPage={currentPage}
                handleSubmitEdit={handleSubmitEdit}
                submitEdit={submitEdit}
                editName={editName}
                handleEditName={handleEditName}
                editPhone={editPhone}
                handleEditPhone={handleEditPhone}
                setEditId={setEditId}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                postsPerPage={postsPerPage}
                handleResend={handleResend}
                handleCancelResend={handleCancelResend}
            />
            <PaginationButton
                paginate={paginate}
                currentPage={currentPage}
                pageNumbers={pageNumbers}
            />
            <ModalDelete
                modalOpen={modalOpen}
                closeModal={closeModal}
                deletePhonebook={deletePhonebook}
            />
        </Container>
    );
}

export default App;
