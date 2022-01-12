import React, { useState, useCallback, useEffect } from 'react'
import { Alert, Row, Col, Button, Collapse, Form, Card } from 'react-bootstrap'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import { addPhonebook } from '../actions/phonebook'

export default function AddPhonebook({ showAlertCon, setShowAlertCon }) {
    const { live } = useSelector((state) => ({
        live: state.phonebook.live
    }), shallowEqual)
    const dispatch = useDispatch()

    const [open, setOpen] = useState(false)
    const [addName, setAddName] = useState('')
    const [addPhone, setAddPhone] = useState('')
    const [showAlert, setShowAlert] = useState(false)

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
        dispatch(addPhonebook(addName, addPhone)).then(() => {
            setShowAlert(true)
        })
        setAddName('')
        setAddPhone('')
    }

    useEffect(() => {
        if (!live)
            setShowAlertCon(true)
        else {
            setShowAlertCon(false)
        }
    }, [live])

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
                    Warning! No connection. You must resend data when adding phonebook. Also search, sort, and actions feature won't work.
                </Alert>
            )}
        </>
    )
}
