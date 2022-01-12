import React, { Component } from 'react'
import { Container } from 'react-bootstrap'
import Title from './Title'
import AddPhonebook from '../containers/AddPhonebook'
import TablePhonebook from '../containers/TablePhonebook'

export default class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showAlertCon: false
        }
        this.setShowAlertCon = this.setShowAlertCon.bind(this)
    }

    setShowAlertCon(s) {
        this.setState({
            showAlertCon: s
        })
    }

    render() {
        return (
            <Container className="mt-4">
                <Title />
                <AddPhonebook
                    showAlertCon={this.state.showAlertCon}
                    setShowAlertCon={this.setShowAlertCon}
                />
                <TablePhonebook
                    showAlertCon={this.state.showAlertCon}
                    setShowAlertCon={this.setShowAlertCon}
                />
            </Container>
        )
    }
}