"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ReactPaginate from "react-paginate";

const Pagination = ({ lastPage, handlePageClick, currentPage }) => {
  const safePageCount = Number(lastPage) || 0;
  const safeCurrentPage = Math.max(1, Number(currentPage) || 1);
  const safeForcePage =
    safePageCount > 0
      ? Math.min(safeCurrentPage - 1, safePageCount - 1)
      : 0;

  return (
    <div className="flex items-center justify-end mt-8">
      <ReactPaginate
        forcePage={safeForcePage}
        breakLabel="..."
        nextLabel={<ChevronRight size={20} className="rtl:rotate-180" />}
        previousLabel={<ChevronLeft size={20} className="rtl:rotate-180" />}
        onPageChange={handlePageClick}
        pageRangeDisplayed={2}
        marginPagesDisplayed={1}
        pageCount={safePageCount}
        /* Container */
        containerClassName="flex items-center gap-2"
        /* Individual Page Numbers */
        pageClassName="h-8 sm:h-10 w-8 sm:w-10 flex items-center justify-center rounded-[8px] bg-white border border-grayish/16 text-grayish/60 font-medium transition-all hover:border-grayish hover:text-grayish cursor-pointer text-base"
        pageLinkClassName="w-full h-full flex items-center justify-center"
        /* Active Page */
        activeClassName="!bg-grayish !border-grayish !text-white"
        /* Previous Button - Same as Next Button */
        previousClassName="h-8 sm:h-10 w-8 sm:w-10 flex items-center justify-center rounded-[8px] border border-primary bg-primary text-grayish cursor-pointer hover:border-primary transition-all"
        previousLinkClassName="w-full h-full flex items-center justify-center"
        /* Next Button */
        nextClassName="h-8 sm:h-10 w-8 sm:w-10 flex items-center justify-center rounded-[8px] border border-primary bg-primary text-grayish cursor-pointer hover:border-primary transition-all"
        nextLinkClassName="w-full h-full flex items-center justify-center"
        /* Break Label (...) */
        breakClassName="text-gray-400"
        /* Disabled State for Both Prev and Next */
        disabledClassName="!opacity-30 !cursor-not-allowed hover:!border-primary"
      />
    </div>
  );
};

export default Pagination;
