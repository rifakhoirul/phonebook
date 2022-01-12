import React, { Component } from 'react'
import { Button, Form, Table, Spinner } from 'react-bootstrap'
import ModalDelete from '../components/ModalDelete'
import PaginationButton from '../components/PaginationButton'
import SearchForm from '../components/SearchForm'
import { loadPhonebook, removePhonebook, resendPhonebook, cancelResend, editPhonebook, searchPhonebook } from '../actions/phonebook'
import { connect } from 'react-redux'

class TablePhonebook extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentPage: 1,
      postsPerPage: 3,
      editId: '',
      editName: '',
      editPhone: '',
      deleteId: '',
      modalOpen: false,
      sortBy: '',
      loading: false,
    }
    this.inputSearchName = React.createRef();
    this.inputSearchPhone = React.createRef();

    this.handleEditName = this.handleEditName.bind(this)
    this.handleEditPhone = this.handleEditPhone.bind(this)
    this.handleEdit = this.handleEdit.bind(this)
    this.handleSubmitEdit = this.handleSubmitEdit.bind(this)
    this.submitEdit = this.submitEdit.bind(this)
    this.searchPhonebooks = this.searchPhonebooks.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleSort = this.handleSort.bind(this)
    this.handleResend = this.handleResend.bind(this)
    this.deletePhonebook = this.deletePhonebook.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }
  componentDidMount() {
    this.setState({ loading: true })
    this.props.load().then(() => {
      this.setState({ loading: false })
      if (!this.props.live)
        this.props.setShowAlertCon(true)
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
    this.props.edit(this.state.editId, this.state.editName, this.state.editPhone).then(() => {
      if (this.props.live) {
        this.props.setShowAlertCon(false)
      } else {
        this.props.setShowAlertCon(true)
      }
    })
    this.setState({
      editId: '',
    })
  }
  handleResend(id, name, phone) {
    // if (this.props.live) {
    this.props.resend(id, name, phone).then(() => {
      if (this.props.live) {
        this.props.setShowAlertCon(false)
      } else {
        this.props.setShowAlertCon(true)
      }
    })
    // } else {
    //   this.props.setShowAlertCon(true)
    // }

  }
  searchPhonebooks(sort) {
    this.setState({
      loading: true
    })
    if (!/^[0-9]*$/.test(this.inputSearchPhone.current.value)) {
      this.inputSearchPhone.current.value = null
    }
    this.props.search(this.inputSearchName.current.value, this.inputSearchPhone.current.value, sort).then(() => {
      if (this.props.live) {
        this.props.setShowAlertCon(false)
      } else {
        this.props.setShowAlertCon(true)
      }
      this.setState({
        loading: false,
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
    this.props.remove(this.state.deleteId).then(() => {
      if (this.props.live) {
        this.props.setShowAlertCon(false)
      } else {
        this.props.setShowAlertCon(true)
      }
    })
    this.setState({
      deleteId: '',
      modalOpen: false,
    })
  }
  handleSort(sort) {
    this.setState({
      sortBy: sort
    })
    this.searchPhonebooks(sort)
  }

  render() {
    const indexOfLastPost = this.state.currentPage * this.state.postsPerPage
    const indexOfFirstPost = indexOfLastPost - this.state.postsPerPage
    const currentPosts = this.props.phonebooks.slice(indexOfFirstPost, indexOfLastPost)
    if (currentPosts.length <= 0 && this.state.currentPage > 1) {
      this.setState({
        currentPage: this.state.currentPage - 1
      })
    }
    const paginate = (pageNumber) => {
      this.setState({
        currentPage: pageNumber
      })
    }
    const pageNumbers = []
    for (let i = 1; i <= Math.ceil(this.props.phonebooks.length / this.state.postsPerPage); i++) {
      pageNumbers.push(i)
    }
    return (
      <>
        <SearchForm
          searchPhonebooks={this.searchPhonebooks}
          inputSearchName={this.inputSearchName}
          inputSearchPhone={this.inputSearchPhone}
        />
        <Table className="mt-4" striped bordered hover>
          <thead>
            <tr>
              <th># <i onClick={() => { this.state.sortBy === 'id-asc' ? this.handleSort() : this.handleSort('id-asc') }} className={`fas fa-long-arrow-alt-up ${this.state.sortBy === 'id-asc' ? 'text-primary' : ''}`}></i><i onClick={() => { this.state.sortBy === 'id-desc' ? this.handleSort() : this.handleSort('id-desc') }} className={`fas fa-long-arrow-alt-down ${this.state.sortBy === 'id-desc' ? 'text-primary' : ''}`}></i></th>
              <th>Name <i onClick={() => { this.state.sortBy === 'name-asc' ? this.handleSort() : this.handleSort('name-asc') }} className={`fas fa-long-arrow-alt-up ${this.state.sortBy === 'name-asc' ? 'text-primary' : ''}`}></i><i onClick={() => { this.state.sortBy === 'name-desc' ? this.handleSort() : this.handleSort('name-desc') }} className={`fas fa-long-arrow-alt-down ${this.state.sortBy === 'name-desc' ? 'text-primary' : ''}`}></i></th>
              <th>Phone <i onClick={() => { this.state.sortBy === 'phone-asc' ? this.handleSort() : this.handleSort('phone-asc') }} className={`fas fa-long-arrow-alt-up ${this.state.sortBy === 'phone-asc' ? 'text-primary' : ''}`}></i><i onClick={() => { this.state.sortBy === 'phone-desc' ? this.handleSort() : this.handleSort('phone-desc') }} className={`fas fa-long-arrow-alt-down ${this.state.sortBy === 'phone-desc' ? 'text-primary' : ''}`}></i></th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.state.loading && (<tr><td colSpan="4" className="text-center"><Spinner animation="border" /></td></tr>)}
            {currentPosts.map((item, index) => {
              if (this.state.editId === item._id) {
                return (
                  <tr key={item._id}>
                    <td className="align-middle">{index + 1 + ((this.state.currentPage - 1) * this.state.postsPerPage)}</td>
                    <td className="align-middle"><Form onSubmit={this.handleSubmitEdit}><Form.Control size="sm" type="text" value={this.state.editName} onChange={this.handleEditName} /></Form></td>
                    <td className="align-middle"><Form onSubmit={this.handleSubmitEdit}><Form.Control size="sm" type="text" value={this.state.editPhone} onChange={this.handleEditPhone} /></Form></td>
                    <td className="align-middle"><Button onClick={this.submitEdit} variant="primary" type="submit" className="me-1" size="sm"><i className="bi bi-pencil"></i> Save</Button><Button variant="secondary" size="sm" onClick={() => { this.setState({ editId: '' }) }}><i className="bi bi-x-circle"></i> Cancel</Button></td>
                  </tr>
                )
              } else if (item.sent === false) {
                return (
                  <tr key={item._id}>
                    <td className="align-middle text-danger">{index + 1 + ((this.state.currentPage - 1) * this.state.postsPerPage)}</td>
                    <td className="align-middle text-danger">{item.name}</td>
                    <td className="align-middle text-danger">{item.phone}</td>
                    <td className="align-middle"><Button onClick={() => { this.handleResend(item._id, item.name, item.phone) }} variant="warning" className="me-1" size="sm"><i className="bi bi-arrow-clockwise"></i> Retry</Button><Button variant="secondary" size="sm" onClick={() => this.props.cancelResend(item._id)}><i className="bi bi-x-circle"></i> Cancel</Button></td>
                  </tr>
                )
              } else {
                return (
                  <tr key={item._id}>
                    <td className="align-middle">{index + 1 + ((this.state.currentPage - 1) * this.state.postsPerPage)}</td>
                    <td className="align-middle">{item.name}</td>
                    <td className="align-middle">{item.phone}</td>
                    <td className="align-middle"><Button onClick={() => { this.handleEdit(item._id, item.name, item.phone) }} variant="success" className="me-1" size="sm"><i className="bi bi-pencil"></i> Edit</Button><Button variant="danger" size="sm" onClick={() => this.handleDelete(item._id)}><i className="bi bi-trash"></i> Delete</Button></td>
                  </tr>
                )
              }
            })}
          </tbody>
        </Table>
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
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  phonebooks: state.phonebook.phonebooks,
  live: state.phonebook.live
})
const mapDispatchToProps = (dispatch, ownProps) => ({
  load: () => dispatch(loadPhonebook()),
  remove: (id) => dispatch(removePhonebook(id)),
  resend: (id, name, phone) => dispatch(resendPhonebook(id, name, phone)),
  cancelResend: (id) => dispatch(cancelResend(id)),
  edit: (id, name, phone) => dispatch(editPhonebook(id, name, phone)),
  search: (name, phone, sort) => dispatch(searchPhonebook(name, phone, sort))
})

export default connect(mapStateToProps, mapDispatchToProps)(TablePhonebook)
