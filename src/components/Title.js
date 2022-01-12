import React from 'react'
import { Alert, Row } from 'react-bootstrap'

export default function Title() {
    return (
        <Row className="text-center">
            <Alert variant="warning" className="h2"><i className="bi bi-journal"></i> Phonebook App</Alert>
        </Row>
    )
}
