'use client'

import { usePathname, useRouter } from 'next/navigation'
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
}

export function SpecialsPagination({ currentPage, totalPages }: Props) {
  const pathname = usePathname()
  const router = useRouter()

  const goToPage = (page: number) => {
    const params = new URLSearchParams()
    if (page > 1) params.set('page', String(page))
    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname)
  }

  const pages = buildPageList(currentPage, totalPages)

  return (
    <div className="mt-10 flex justify-center">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
            />
          </PaginationItem>
          {pages.map((p, i) =>
            p === '...' ? (
              <PaginationItem key={`ellipsis-${i}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={p}>
                <PaginationLink isActive={p === currentPage} onClick={() => goToPage(p as number)}>
                  {p}
                </PaginationLink>
              </PaginationItem>
            ),
          )}
          <PaginationItem>
            <PaginationNext
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

function buildPageList(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: (number | '...')[] = [1]

  if (current > 3) pages.push('...')

  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
    pages.push(p)
  }

  if (current < total - 2) pages.push('...')

  pages.push(total)

  return pages
}
