import React, { Component } from 'react'
import { Alert, Row, Col, Button, Collapse, Form, Card } from 'react-bootstrap'

export default class AddPhonebook extends Component {
    render() {
        return (
            <>
            <Button
                onClick={() => this.props.setOpen(!this.props.open)}
                variant="outline-primary"
            >
                <i className="bi bi-plus-circle"></i> Add
            </Button>
            <Collapse className="" in={this.props.open}>
                <Card className="mt-2">
                    <Card.Header className="" as="h5">Adding Form</Card.Header>
                    <Card.Body>
                        <Form className="mt-2" onSubmit={this.props.handleSubmitAdd}>
                            <Form.Group as={Row} className="mb-3" controlId="formPlaintext">
                                <Form.Label column sm="1" className="">
                                    Name
                                </Form.Label>
                                <Col sm="6">
                                    <Form.Control type="text" placeholder="Name" onChange={this.props.handleAddName} value={this.props.addName} required />
                                </Col>
                                <Form.Label column sm="1" className="">
                                    Phone
                                </Form.Label>
                                <Col sm="4">
                                    <Form.Control type="tel" placeholder="Phone" onChange={this.props.handleAddPhone} value={this.props.addPhone} required />
                                </Col>
                            </Form.Group>
                            <Button variant="success" type="submit" className="me-2"><i className="bi bi-save"></i> Save</Button>
                            <Button variant="secondary" onClick={() => this.props.setOpen(!this.props.open)}><i className="bi bi-x-circle"></i> Cancel</Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Collapse>

            {this.props.showAlert && (
                <Alert className="mt-2" variant="success" onClose={() => this.props.setShowAlert(false)} dismissible>
                    Add data success.
                </Alert>
            )}
            {this.props.showAlertCon && (
                <Alert className="mt-2" variant="danger" onClose={() => this.props.setShowAlertCon(false)} dismissible>
                    Warning! No connection. You must resend data when adding phonebook. Also search, sort, and actions feature won't work.
                </Alert>
            )}
        </>
        )
    }
}

