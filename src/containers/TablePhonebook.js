import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Button, Form, Table, Spinner } from 'react-bootstrap'
import ModalDelete from '../components/ModalDelete'
import PaginationButton from '../components/PaginationButton'
import SearchForm from '../components/SearchForm'
import { loadPhonebook, removePhonebook, resendPhonebook, cancelResend, editPhonebook, searchPhonebook } from '../actions/phonebook'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'

export default function TablePhonebook({ showAlertCon, setShowAlertCon }) {
  const { phonebooks, live } = useSelector((state) => ({
    phonebooks: state.phonebook.phonebooks,
    live: state.phonebook.live
  }), shallowEqual)
  const dispatch = useDispatch()

  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage] = useState(3)
  const [editId, setEditId] = useState('')
  const [editName, setEditName] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [deleteId, setDeleteId] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [sortBy, setSortBy] = useState('')
  const [loading, setLoading] = useState(false)

  const inputSearchName = useRef()
  const inputSearchPhone = useRef()

  useEffect(() => {
    setLoading(true)
    dispatch(loadPhonebook()).then(() => {
      setLoading(false)
    })
  }, [dispatch])

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
    dispatch(editPhonebook(editId, editName, editPhone)).then(() => {
      if (live) {
        setShowAlertCon(false)
      } else {
        setShowAlertCon(true)
      }
    })
    setEditId('')
  }
  function handleResend(id, name, phone) {
    dispatch(resendPhonebook(id, name, phone)).then(() => {
      if (live) {
        setShowAlertCon(false)
      } else {
        setShowAlertCon(true)
      }
    })
  }
  function searchPhonebooks(sort) {
    setLoading(true)
    if (!/^[0-9]*$/.test(inputSearchPhone.current.value)) {
      inputSearchPhone.current.value = null
    }
    dispatch(searchPhonebook(inputSearchName.current.value, inputSearchPhone.current.value, sort)).then(() => {
      if (live) {
        setShowAlertCon(false)
      } else {
        setShowAlertCon(true)
      }
      setLoading(false)
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
    dispatch(removePhonebook(deleteId)).then(() => {
      if (live) {
        setShowAlertCon(false)
      } else {
        setShowAlertCon(true)
      }
    })
    setDeleteId('')
    setModalOpen(false)
  }
  function handleSort(sort) {
    setSortBy(sort)
    searchPhonebooks(sort)
  }
  const cancel = useCallback((id) => {
    dispatch(cancelResend(id))
  }, [dispatch])

  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = phonebooks.slice(indexOfFirstPost, indexOfLastPost)
  if (currentPosts.length <= 0 && currentPage > 1) {
    setCurrentPage(currentPage - 1)
  }
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber)
  }
  const pageNumbers = []
  for (let i = 1; i <= Math.ceil(phonebooks.length / postsPerPage); i++) {
    pageNumbers.push(i)
  }

  return (
    <>
      <SearchForm
        searchPhonebooks={searchPhonebooks}
        inputSearchName={inputSearchName}
        inputSearchPhone={inputSearchPhone}
      />
      <Table className="mt-4" striped bordered hover>
        <thead>
          <tr>
            <th># <i onClick={() => { sortBy === 'id-asc' ? handleSort() : handleSort('id-asc') }} className={`fas fa-long-arrow-alt-up ${sortBy === 'id-asc' ? 'text-primary' : ''}`}></i><i onClick={() => { sortBy === 'id-desc' ? handleSort() : handleSort('id-desc') }} className={`fas fa-long-arrow-alt-down ${sortBy === 'id-desc' ? 'text-primary' : ''}`}></i></th>
            <th>Name <i onClick={() => { sortBy === 'name-asc' ? handleSort() : handleSort('name-asc') }} className={`fas fa-long-arrow-alt-up ${sortBy === 'name-asc' ? 'text-primary' : ''}`}></i><i onClick={() => { sortBy === 'name-desc' ? handleSort() : handleSort('name-desc') }} className={`fas fa-long-arrow-alt-down ${sortBy === 'name-desc' ? 'text-primary' : ''}`}></i></th>
            <th>Phone <i onClick={() => { sortBy === 'phone-asc' ? handleSort() : handleSort('phone-asc') }} className={`fas fa-long-arrow-alt-up ${sortBy === 'phone-asc' ? 'text-primary' : ''}`}></i><i onClick={() => { sortBy === 'phone-desc' ? handleSort() : handleSort('phone-desc') }} className={`fas fa-long-arrow-alt-down ${sortBy === 'phone-desc' ? 'text-primary' : ''}`}></i></th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading && (<tr><td colSpan="4" className="text-center"><Spinner animation="border" /></td></tr>)}
          {currentPosts.map((item, index) => {
            if (editId === item._id) {
              return (
                <tr key={item._id}>
                  <td className="align-middle">{index + 1 + ((currentPage - 1) * postsPerPage)}</td>
                  <td className="align-middle"><Form onSubmit={handleSubmitEdit}><Form.Control size="sm" type="text" value={editName} onChange={handleEditName} /></Form></td>
                  <td className="align-middle"><Form onSubmit={handleSubmitEdit}><Form.Control size="sm" type="text" value={editPhone} onChange={handleEditPhone} /></Form></td>
                  <td className="align-middle"><Button onClick={submitEdit} variant="primary" type="submit" className="me-1" size="sm"><i className="bi bi-pencil"></i> Save</Button><Button variant="secondary" size="sm" onClick={() => { setEditId('') }}><i className="bi bi-x-circle"></i> Cancel</Button></td>
                </tr>
              )
            } else if (item.sent === false) {
              return (
                <tr key={item._id}>
                  <td className="align-middle text-danger">{index + 1 + ((currentPage - 1) * postsPerPage)}</td>
                  <td className="align-middle text-danger">{item.name}</td>
                  <td className="align-middle text-danger">{item.phone}</td>
                  <td className="align-middle"><Button onClick={() => { handleResend(item._id, item.name, item.phone) }} variant="warning" className="me-1" size="sm"><i className="bi bi-arrow-clockwise"></i> Retry</Button><Button variant="secondary" size="sm" onClick={() => cancel(item._id)}><i className="bi bi-x-circle"></i> Cancel</Button></td>
                </tr>
              )
            } else {
              return (
                <tr key={item._id}>
                  <td className="align-middle">{index + 1 + ((currentPage - 1) * postsPerPage)}</td>
                  <td className="align-middle">{item.name}</td>
                  <td className="align-middle">{item.phone}</td>
                  <td className="align-middle"><Button onClick={() => { handleEdit(item._id, item.name, item.phone) }} variant="success" className="me-1" size="sm"><i className="bi bi-pencil"></i> Edit</Button><Button variant="danger" size="sm" onClick={() => handleDelete(item._id)}><i className="bi bi-trash"></i> Delete</Button></td>
                </tr>
              )
            }
          })}
        </tbody>
      </Table>
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
    </>
  )
}
