import React, { useState } from 'react'
import { Container } from 'react-bootstrap'
import Title from './Title'
import AddPhonebook from '../containers/AddPhonebook'
import TablePhonebook from '../containers/TablePhonebook'

export default function App() {
    const [showAlertCon, setShowAlertCon] = useState(false)
    return (
        <Container className="mt-4">
            <Title />
            <AddPhonebook
                showAlertCon={showAlertCon}
                setShowAlertCon={setShowAlertCon}
            />
            <TablePhonebook
                showAlertCon={showAlertCon}
                setShowAlertCon={setShowAlertCon}
            />
        </Container>
    )
}