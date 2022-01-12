import React, { Component } from 'react'
import { Alert, Row, Col, Button, Collapse, Form, Card } from 'react-bootstrap'
import { connect } from 'react-redux'
import { addPhonebook } from '../actions/phonebook'

class AddPhonebook extends Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false,
            addName: '',
            addPhone: '',
            showAlert: false,
        }
        this.handleAddName = this.handleAddName.bind(this)
        this.handleAddPhone = this.handleAddPhone.bind(this)
        this.handleSubmitAdd = this.handleSubmitAdd.bind(this)
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
        this.props.add(this.state.addName, this.state.addPhone).then(() => {
            if (!this.props.live)
                this.props.setShowAlertCon(true)
            else {
                this.props.setShowAlertCon(false)
                this.setState({ showAlert: true })
            }
        })
        this.setState({
            addName: '',
            addPhone: '',
        })
    }
    render() {
        return (
            <>
                <Button
                    onClick={() => this.setState({ open: !this.state.open })}
                    variant="outline-primary"
                >
                    <i className="bi bi-plus-circle"></i> Add
                </Button>
                <Collapse className="" in={this.state.open}>
                    <Card className="mt-2">
                        <Card.Header className="" as="h5">Adding Form</Card.Header>
                        <Card.Body>
                            <Form className="mt-2" onSubmit={this.handleSubmitAdd}>
                                <Form.Group as={Row} className="mb-3" controlId="formPlaintext">
                                    <Form.Label column sm="1" className="">
                                        Name
                                    </Form.Label>
                                    <Col sm="6">
                                        <Form.Control type="text" placeholder="Name" onChange={this.handleAddName} value={this.state.addName} required />
                                    </Col>
                                    <Form.Label column sm="1" className="">
                                        Phone
                                    </Form.Label>
                                    <Col sm="4">
                                        <Form.Control type="tel" placeholder="Phone" onChange={this.handleAddPhone} value={this.state.addPhone} required />
                                    </Col>
                                </Form.Group>
                                <Button variant="success" type="submit" className="me-2"><i className="bi bi-save"></i> Save</Button>
                                <Button variant="secondary" onClick={() => this.setState({ open: !this.state.open })}><i className="bi bi-x-circle"></i> Cancel</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Collapse>

                {this.state.showAlert && (
                    <Alert className="mt-2" variant="success" onClose={() => this.setState({ showAlert: false })} dismissible>
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

const mapStateToProps = (state) => ({
    live: state.phonebook.live,
})
const mapDispatchToProps = (dispatch, ownProps) => ({
    add: (name, phone) => dispatch(addPhonebook(name, phone))
})

export default connect(mapStateToProps, mapDispatchToProps)(AddPhonebook)
