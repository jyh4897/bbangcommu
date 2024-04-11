import React from "react";
import '../Styles/PaginatedItems.css';

const PaginatedItems = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
const totalPages = Math.ceil(totalItems / itemsPerPage);                                                // 보여줄 페이지 번호의 갯수 설정
const maxPageNumbers = 5;                                                                               // 한 번에 보여줄 페이지 갯수
const halfMaxPageNumbers = Math.floor(maxPageNumbers / 2);                                              // 현재 페이지를 중심으로 양쪽에 보여줄 페이지 갯수

  let startPage = Math.max(currentPage - halfMaxPageNumbers, 1);                                        // 현재 페이지 주변의 페이지 번호
  let endPage = Math.min(startPage + maxPageNumbers - 1, totalPages);

  if (endPage - startPage + 1 < maxPageNumbers) {                                                       // 시작 페이지를 조정하여 보여줄 페이지 번호의 갯수 유지
    startPage = Math.max(endPage - maxPageNumbers + 1, 1);
  }

  const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);  // 페이지 번호 동적 생성

  return (
    <div className="commu-pagination">
      <div className="commu-pagination__button-box">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        {'<'}
      </button>
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={currentPage === number ? 'selected' : ''}
        >
          {number}
        </button>
      ))}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        {'>'}
      </button>
      </div>
    </div>
  );
};

export default PaginatedItems;