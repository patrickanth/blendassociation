import { useState, useMemo, useCallback } from 'react';

interface UsePaginationProps {
  totalItems: number;
  itemsPerPage: number;
  initialPage?: number;
}

export const usePagination = ({
  totalItems,
  itemsPerPage,
  initialPage = 1,
}: UsePaginationProps) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = useMemo(() => {
    return Math.ceil(totalItems / itemsPerPage);
  }, [totalItems, itemsPerPage]);

  const startIndex = useMemo(() => {
    return (currentPage - 1) * itemsPerPage;
  }, [currentPage, itemsPerPage]);

  const endIndex = useMemo(() => {
    return Math.min(startIndex + itemsPerPage, totalItems);
  }, [startIndex, itemsPerPage, totalItems]);

  const canGoToPrevious = useMemo(() => {
    return currentPage > 1;
  }, [currentPage]);

  const canGoToNext = useMemo(() => {
    return currentPage < totalPages;
  }, [currentPage, totalPages]);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  const goToPrevious = useCallback(() => {
    if (canGoToPrevious) {
      setCurrentPage(prev => prev - 1);
    }
  }, [canGoToPrevious]);

  const goToNext = useCallback(() => {
    if (canGoToNext) {
      setCurrentPage(prev => prev + 1);
    }
  }, [canGoToNext]);

  const goToFirst = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const goToLast = useCallback(() => {
    setCurrentPage(totalPages);
  }, [totalPages]);

  const reset = useCallback(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);

  const getPageItems = useCallback(<T>(items: T[]): T[] => {
    return items.slice(startIndex, endIndex);
  }, [startIndex, endIndex]);

  const getPageNumbers = useCallback((): number[] => {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Mostra tutte le pagine se sono poche
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Mostra un range di pagine centrato sulla pagina corrente
      const halfRange = Math.floor(maxPagesToShow / 2);
      let startPage = Math.max(1, currentPage - halfRange);
      let endPage = Math.min(totalPages, currentPage + halfRange);

      // Aggiusta i limiti se necessario
      if (endPage - startPage + 1 < maxPagesToShow) {
        if (startPage === 1) {
          endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
        } else {
          startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  }, [currentPage, totalPages]);

  return {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    startIndex,
    endIndex,
    canGoToPrevious,
    canGoToNext,
    goToPage,
    goToPrevious,
    goToNext,
    goToFirst,
    goToLast,
    reset,
    getPageItems,
    getPageNumbers,
  };
};