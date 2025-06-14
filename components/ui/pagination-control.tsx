"use client";

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationData {
  totalItems: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}

interface PaginationControlsProps {
  pagination: PaginationData;
  onPaginationChange: (newPage: number, newSize: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  pagination,
  onPaginationChange,
}) => {
  const { totalItems, currentPage, totalPages, itemsPerPage } = pagination;

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPaginationChange(currentPage - 1, itemsPerPage);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPaginationChange(currentPage + 1, itemsPerPage);
    }
  };

  const handleSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number(event.target.value);
    onPaginationChange(1, newSize);
  };

  const pageSizes = [5, 10, 20];

  return (
    <div className="flex items-center space-x-4 p-2 bg-white rounded-md shadow-sm border border-gray-200 text-sm font-inter">
      <div className="flex items-center space-x-1">
        <label htmlFor="itemsPerPage" className="text-gray-600">
          Items per page:
        </label>
        <select
          id="itemsPerPage"
          value={itemsPerPage}
          onChange={handleSizeChange}
          className="form-select border border-gray-300 rounded-md py-1 px-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
          aria-label="Select items per page"
        >
          {pageSizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <span className="text-gray-700 whitespace-nowrap">
        Page {currentPage} of {totalPages} ({totalItems} items)
      </span>

      <div className="flex items-center space-x-1">
        <button
          onClick={handlePrevious}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-md text-gray-600 bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 transition-colors duration-200 ease-in-out"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={handleNext}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded-md text-gray-600 bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 transition-colors duration-200 ease-in-out"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default PaginationControls;
