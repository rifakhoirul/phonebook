import React from 'react'
import { Button, Modal} from 'react-bootstrap'

export default function ModalDelete({modalOpen,closeModal,deletePhonebook}) {
    return (
        <Modal
        show={modalOpen}
        onHide={closeModal}
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
          <Button variant="outline-secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deletePhonebook}>Yes</Button>
        </Modal.Footer>
      </Modal>
    )
}
