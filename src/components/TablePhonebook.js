import React from 'react'
import { Button, Form, Table, Spinner } from 'react-bootstrap'

export default function TablePhonebook({ sortBy, handleSort, loading, currentPosts, editId, handleSubmitEdit, submitEdit, editName, handleEditName, editPhone, handleEditPhone, setEditId, handleEdit, currentPage, handleDelete, postsPerPage, handleResend, handleCancelResend }) {
  return (
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
                <td className="align-middle">{index + 1 + currentPage}</td>
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
                <td className="align-middle"><Button onClick={() => { handleResend(item._id, item.name, item.phone) }} variant="warning" className="me-1" size="sm"><i className="bi bi-arrow-clockwise"></i> Retry</Button><Button variant="secondary" size="sm" onClick={() => handleCancelResend(item._id)}><i className="bi bi-x-circle"></i> Cancel</Button></td>
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
  )
}
