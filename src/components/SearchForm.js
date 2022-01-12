import React from 'react'
import { Row, Col, Form, Card } from 'react-bootstrap'

export default function SearchForm({searchPhonebooks,inputSearchName,inputSearchPhone}) {
    return (
        <Card className="mt-3">
        <Card.Header className="" as="h5">Search Form</Card.Header>
        <Card.Body>
          <Form className="mt-2">
            <Form.Group as={Row} className="mb-3" controlId="formPlaintext">
              <Form.Label column sm="1" className="">
                Name
              </Form.Label>
              <Col sm="6">
                <Form.Control type="text" placeholder="Name" onKeyUp={() => { searchPhonebooks() }} ref={inputSearchName} />
              </Col>
              <Form.Label column sm="1" className="">
                Phone
              </Form.Label>
              <Col sm="4">
                <Form.Control type="tel" placeholder="Phone" onKeyUp={() => { searchPhonebooks() }} ref={inputSearchPhone} />
              </Col>
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
    )
}
