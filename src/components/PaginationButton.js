import React, { Component } from 'react'
import { Pagination } from 'react-bootstrap'

export default class PaginationButton extends Component {
  constructor(props){
    super(props)
    this.state={
      
    }
  }
  render() {
    return (
      <Pagination className="mb-5">
        <Pagination.Prev onClick={() => this.props.paginate(this.props.currentPage - 1)} disabled={this.props.currentPage === 1} />
        {this.props.pageNumbers.map(number => (
          <Pagination.Item key={number} active={number === this.props.currentPage} onClick={() => this.props.paginate(number)}>
            {number}
          </Pagination.Item>
        ))}
        <Pagination.Next onClick={() => this.props.paginate(this.props.currentPage + 1)} disabled={this.props.currentPage === this.props.pageNumbers.length} />
      </Pagination>
    )
  }
}
