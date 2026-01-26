import React from 'react'

export type Crumb = {
  label: string
  href?: string
  onClick?: (e: React.MouseEvent) => void
  ariaLabel?: string
}

interface BreadcrumbsProps {
  items: Crumb[]
  separator?: React.ReactNode
  className?: string
}

export default function Breadcrumbs({ items, separator, className = '' }: BreadcrumbsProps) {
  const sep = separator ?? (
    <svg
      className='w-4 h-4 text-slate-400'
      viewBox='0 0 20 20'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden
    >
      <path
        d='M7 5l5 5-5 5'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )

  return (
    <nav className={`text-sm ${className} md:p-0`} aria-label='Breadcrumb'>
      <ol className='flex items-center text-base md:text-xl'>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1
          return (
            <li key={idx} className='flex items-center'>
              {!isLast ? (
                <>
                  {item.href ? (
                    <a
                      href={item.href}
                      onClick={item.onClick}
                      aria-label={item.ariaLabel ?? item.label}
                      className='text-slateGray hover:underline whitespace-nowrap truncate'
                    >
                      {item.label}
                    </a>
                  ) : (
                    <button
                      type='button'
                      onClick={item.onClick}
                      aria-label={item.ariaLabel ?? item.label}
                      className='text-slateGray hover:underline whitespace-nowrap truncate text-left'
                    >
                      {item.label}
                    </button>
                  )}
                  <span className='flex items-center px-1' aria-hidden>
                    /
                  </span>
                </>
              ) : (
                <span
                  className='text-slateGray font-medium whitespace-nowrap truncate'
                  aria-current='page'
                >
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
