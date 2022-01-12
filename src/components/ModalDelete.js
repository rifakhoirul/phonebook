import React, { Component } from 'react'
import { Button, Modal } from 'react-bootstrap'

export default class ModalDelete extends Component {
  constructor(props){
    super(props)
    this.state={
      
    }
  }
  render() {
    return (
      <Modal
        show={this.props.modalOpen}
        onHide={this.props.closeModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure want to delete this?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={this.props.closeModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={this.props.deletePhonebook}>Yes</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
