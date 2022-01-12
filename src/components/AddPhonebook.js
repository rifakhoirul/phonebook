import React from 'react'
import { Alert, Row, Col, Button, Collapse, Form, Card } from 'react-bootstrap'

export default function AddPhonebook({ open, setOpen, handleSubmitAdd, handleAddName, addName, handleAddPhone, addPhone, showAlert, setShowAlert, showAlertCon, setShowAlertCon }) {
    return (
        <>
            <Button
                onClick={() => setOpen(!open)}
                variant="outline-primary"
            >
                <i className="bi bi-plus-circle"></i> Add
            </Button>
            <Collapse className="" in={open}>
                <Card className="mt-2">
                    <Card.Header className="" as="h5">Adding Form</Card.Header>
                    <Card.Body>
                        <Form className="mt-2" onSubmit={handleSubmitAdd}>
                            <Form.Group as={Row} className="mb-3" controlId="formPlaintext">
                                <Form.Label column sm="1" className="">
                                    Name
                                </Form.Label>
                                <Col sm="6">
                                    <Form.Control type="text" placeholder="Name" onChange={handleAddName} value={addName} required />
                                </Col>
                                <Form.Label column sm="1" className="">
                                    Phone
                                </Form.Label>
                                <Col sm="4">
                                    <Form.Control type="tel" placeholder="Phone" onChange={handleAddPhone} value={addPhone} required />
                                </Col>
                            </Form.Group>
                            <Button variant="success" type="submit" className="me-2"><i className="bi bi-save"></i> Save</Button>
                            <Button variant="secondary" onClick={() => setOpen(!open)}><i className="bi bi-x-circle"></i> Cancel</Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Collapse>

            {showAlert && (
                <Alert className="mt-2" variant="success" onClose={() => setShowAlert(false)} dismissible>
                    Add data success.
                </Alert>
            )}
            {showAlertCon && (
                <Alert className="mt-2" variant="danger" onClose={() => setShowAlertCon(false)} dismissible>
                    Warning! No connection. You must resend when adding phonebook. Also search, sort, and actions feature won't work.
                </Alert>
            )}
        </>
    )
}
