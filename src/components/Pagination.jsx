import "../styles/Pagination.css";

function Pagination({
  currentPage,
  totalItems,
  onNextPage,
  onPreviousPage,
  hasPreviousPage,
  hasNextPage,
}) {
  return (
    <div className="pagination">
      <button
        onClick={onPreviousPage}
        disabled={!hasPreviousPage}
        className={`pagination-button ${!hasPreviousPage ? "disabled" : ""}`}
      >
        前へ
      </button>
      <span className="page-info">
        {`${currentPage}ページ (全${Math.ceil(totalItems / 10)}ページ)`}
      </span>
      <button
        onClick={onNextPage}
        disabled={!hasNextPage}
        className={`pagination-button ${!hasNextPage ? "disabled" : ""}`}
      >
        次へ
      </button>
    </div>
  );
}

export default Pagination;
