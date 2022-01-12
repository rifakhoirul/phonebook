import React from 'react'
import { Pagination } from 'react-bootstrap'

export default function PaginationButton({paginate,currentPage,pageNumbers}) {
    return (
        <Pagination className="mb-5">
        <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
        {pageNumbers.map(number => (
          <Pagination.Item key={number} active={number === currentPage} onClick={() => paginate(number)}>
            {number}
          </Pagination.Item>
        ))}
        <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === pageNumbers.length} />
      </Pagination>
    )
}
