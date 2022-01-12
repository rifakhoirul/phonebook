import React, { Component } from 'react'
import { Button, Form, Table, Spinner } from 'react-bootstrap'

export default class TablePhonebook extends Component {
  render() {
    return (
      <Table className="mt-4" striped bordered hover>
        <thead>
          <tr>
            <th># <i onClick={() => { this.props.sortBy === 'id-asc' ? this.props.handleSort() : this.props.handleSort('id-asc') }} className={`fas fa-long-arrow-alt-up ${this.props.sortBy === 'id-asc' ? 'text-primary' : ''}`}></i><i onClick={() => { this.props.sortBy === 'id-desc' ? this.props.handleSort() : this.props.handleSort('id-desc') }} className={`fas fa-long-arrow-alt-down ${this.props.sortBy === 'id-desc' ? 'text-primary' : ''}`}></i></th>
            <th>Name <i onClick={() => { this.props.sortBy === 'name-asc' ? this.props.handleSort() : this.props.handleSort('name-asc') }} className={`fas fa-long-arrow-alt-up ${this.props.sortBy === 'name-asc' ? 'text-primary' : ''}`}></i><i onClick={() => { this.props.sortBy === 'name-desc' ? this.props.handleSort() : this.props.handleSort('name-desc') }} className={`fas fa-long-arrow-alt-down ${this.props.sortBy === 'name-desc' ? 'text-primary' : ''}`}></i></th>
            <th>Phone <i onClick={() => { this.props.sortBy === 'phone-asc' ? this.props.handleSort() : this.props.handleSort('phone-asc') }} className={`fas fa-long-arrow-alt-up ${this.props.sortBy === 'phone-asc' ? 'text-primary' : ''}`}></i><i onClick={() => { this.props.sortBy === 'phone-desc' ? this.props.handleSort() : this.props.handleSort('phone-desc') }} className={`fas fa-long-arrow-alt-down ${this.props.sortBy === 'phone-desc' ? 'text-primary' : ''}`}></i></th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {this.props.loading && (<tr><td colSpan="4" className="text-center"><Spinner animation="border" /></td></tr>)}
          {this.props.currentPosts.map((item, index) => {
            if (this.props.editId === item._id) {
              return (
                <tr key={item._id}>
                  <td className="align-middle">{index + 1 + this.props.currentPage}</td>
                  <td className="align-middle"><Form onSubmit={this.props.handleSubmitEdit}><Form.Control size="sm" type="text" value={this.props.editName} onChange={this.props.handleEditName} /></Form></td>
                  <td className="align-middle"><Form onSubmit={this.props.handleSubmitEdit}><Form.Control size="sm" type="text" value={this.props.editPhone} onChange={this.props.handleEditPhone} /></Form></td>
                  <td className="align-middle"><Button onClick={this.props.submitEdit} variant="primary" type="submit" className="me-1" size="sm"><i className="bi bi-pencil"></i> Save</Button><Button variant="secondary" size="sm" onClick={() => { this.props.setEditId('') }}><i className="bi bi-x-circle"></i> Cancel</Button></td>
                </tr>
              )
            } else if (item.sent === false) {
              return (
                <tr key={item._id}>
                  <td className="align-middle text-danger">{index + 1 + ((this.props.currentPage - 1) * this.props.postsPerPage)}</td>
                  <td className="align-middle text-danger">{item.name}</td>
                  <td className="align-middle text-danger">{item.phone}</td>
                  <td className="align-middle"><Button onClick={() => { this.props.handleResend(item._id, item.name, item.phone) }} variant="warning" className="me-1" size="sm"><i className="bi bi-arrow-clockwise"></i> Retry</Button><Button variant="secondary" size="sm" onClick={() => this.props.handleCancelResend(item._id)}><i className="bi bi-x-circle"></i> Cancel</Button></td>
                </tr>
              )
            } else {
              return (
                <tr key={item._id}>
                  <td className="align-middle">{index + 1 + ((this.props.currentPage - 1) * this.props.postsPerPage)}</td>
                  <td className="align-middle">{item.name}</td>
                  <td className="align-middle">{item.phone}</td>
                  <td className="align-middle"><Button onClick={() => { this.props.handleEdit(item._id, item.name, item.phone) }} variant="success" className="me-1" size="sm"><i className="bi bi-pencil"></i> Edit</Button><Button variant="danger" size="sm" onClick={() => this.props.handleDelete(item._id)}><i className="bi bi-trash"></i> Delete</Button></td>
                </tr>
              )
            }
          })}
        </tbody>
      </Table>
    )
  }
}
