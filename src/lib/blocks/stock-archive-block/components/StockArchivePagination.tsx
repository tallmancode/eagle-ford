'use client'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

type Props = {
  currentPage: number
  totalPages: number
  showPagination: boolean
  onPageChange: (page: number) => void
  className?: string
}

export function StockArchivePagination({
  currentPage,
  totalPages,
  showPagination,
  onPageChange,
  className,
}: Props) {
  if (!showPagination || totalPages <= 1) return null

  const pages = buildPageList(currentPage, totalPages)

  return (
    <Pagination className={className}>
      <PaginationContent className="flex-nowrap justify-center">
        <PaginationItem>
          <PaginationPrevious
            onClick={() => {
              if (currentPage > 1) onPageChange(currentPage - 1)
            }}
            className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>

        {pages.map((p, i) =>
          p === '...' ? (
            <PaginationItem key={`ellipsis-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink isActive={p === currentPage} onClick={() => onPageChange(p)}>
                {p}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            onClick={() => {
              if (currentPage < totalPages) onPageChange(currentPage + 1)
            }}
            className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

/** First, last, current ±1, with ellipses — keeps Previous/pages/Next on one row at ~412px. */
function buildPageList(current: number, total: number): (number | '...')[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: (number | '...')[] = [1]

  if (current > 3) pages.push('...')

  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
    pages.push(p)
  }

  if (current < total - 2) pages.push('...')

  pages.push(total)

  return pages
}
