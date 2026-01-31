'use client'

import { PemaInstance, ADMIN_TOKEN_KEY } from '@/api/api'
import { useRouter } from 'next/navigation'
import { Suspense, useCallback, useEffect, useState } from 'react'
import { X, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react'

interface BookingRow {
  id: number
  confirmation_number: string | null
  status: string
  program_title: string | null
  room_name: string
  check_in_date: string
  check_out_date: string
  total_amount: number
  paid_amount: number
  created_at: string
  guest_first_name: string | null
  guest_last_name: string | null
  guest_email: string | null
  guest_phone: string | null
}

interface PaymentRow {
  id: number
  booking_id: number | null
  amount: number
  payment_type: string
  status: string
  gateway: string
  reference_number: string | null
  created_at: string
  completed_at: string | null
}

interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
}

interface BookingDetail {
  id: number
  confirmation_number: string | null
  status: string
  program?: { id: number; title: string; program_type: string }
  room: { id: number; name: string; category: string; code: string | null }
  check_in_date: string
  check_out_date: string
  nights: number
  occupancy_details: Record<string, unknown>
  total_amount: number
  deposit_amount: number
  paid_amount: number
  balance_amount: number
  full_payment_required: boolean
  created_at: string
  medical_form_submitted_at: string | null
  doctor_reviewed_at: string | null
  special_requests: string | null
  guest_notes: string | null
  guest_email: string | null
  guest_phone: string | null
  guest_first_name?: string
  guest_last_name?: string
  other_guests?: string[]
  guest_country?: string | null
  number_of_rooms?: number
  caregiver_required?: boolean
}

interface PaymentDetail {
  id: number
  booking_id: number | null
  amount: number
  currency: string
  payment_type: string
  status: string
  gateway: string
  payment_intent_id: string | null
  payment_order_id: string | null
  order_id: string | null
  payment_method: string | null
  gateway_fee: number
  net_amount: number
  reference_number: string | null
  failure_reason: string | null
  created_at: string
  completed_at: string | null
  refunded_amount: number
  refundable_amount: number
  raw_response?: Record<string, unknown> | null
}

const formatDate = (s: string) => (s ? new Date(s).toLocaleString() : '–')
const guestName = (b: BookingRow) =>
  [b.guest_first_name, b.guest_last_name].filter(Boolean).join(' ') || '–'

function formatOccupancy(occupancy: Record<string, unknown> | null | undefined): string {
  if (!occupancy || typeof occupancy !== 'object') return '–'
  const parts: string[] = []
  if (typeof occupancy.adults_total === 'number') parts.push(`${occupancy.adults_total} adult(s)`)
  if (typeof occupancy.children_total_under_4 === 'number' && occupancy.children_total_under_4 > 0) parts.push(`${occupancy.children_total_under_4} child(under 4)`)
  if (typeof occupancy.children_total_5to12 === 'number' && occupancy.children_total_5to12 > 0) parts.push(`${occupancy.children_total_5to12} child(5–12)`)
  if (typeof occupancy.teens_13to18 === 'number' && occupancy.teens_13to18 > 0) parts.push(`${occupancy.teens_13to18} teen(13–18)`)
  if (typeof occupancy.number_of_rooms === 'number') parts.push(`${occupancy.number_of_rooms} room(s)`)
  return parts.length ? parts.join(', ') : Object.entries(occupancy).map(([k, v]) => `${k}: ${v}`).join(', ')
}

function TableLoader() {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center border border-[#3233331A] bg-softSand/20" role="status" aria-label="Loading">
      <Loader2 className="h-8 w-8 animate-spin text-pemaBlue" aria-hidden />
    </div>
  )
}

const Field = ({
  label,
  value,
  className = '',
}: {
  label: string
  value?: React.ReactNode
  className?: string
}) => (
  <>
    <dt className="text-slateGray/80">{label}</dt>
    <dd className={`text-slateGray break-words ${className}`}>
      {value ?? '–'}
    </dd>
  </>
)

const thStyle = 'px-3 py-2 md:px-4 md:py-3 text-left border border-[#3233331A] bg-softSand text-pemaBlue font-ivyOra text-sm md:text-base'
const tdStyle = 'px-3 py-2 md:px-4 md:py-3 border border-[#3233331A] text-slateGray font-crimson text-sm md:text-base'
const PAGE_SIZE = 10
const clickableRowClass =
  'cursor-pointer transition-all duration-150 hover:bg-softSand/60 hover:border-l-4 hover:border-l-pemaBlue border-l-4 border-l-transparent'
const rowClickStyle = tdStyle + ' cursor-pointer'

/** Turn API errors into a clear message; never show raw "Request failed with status code 401". */
function getApiErrorMessage(
  err: unknown,
  fallback: string
): string {
  const e = err as {
    response?: { status?: number; data?: { detail?: string | string[] }; statusText?: string }
    message?: string
  }
  const status = e?.response?.status
  const detail = e?.response?.data?.detail
  let msg: string | undefined
  if (typeof detail === 'string' && detail) msg = detail
  else if (Array.isArray(detail) && detail.length > 0 && typeof detail[0] === 'string') msg = detail[0]
  if (msg) return msg
  if (status === 401) return 'You are not an authorised admin user. Please sign in with admin credentials.'
  if (status === 403) return 'You do not have permission to perform this action.'
  if (status && status >= 400 && status < 500) return 'Request could not be completed. Please try again.'
  if (status && status >= 500) return 'Server error. Please try again later.'
  const raw = e?.message
  if (raw && !raw.startsWith('Request failed with status code')) return raw
  return fallback
}

function Page() {
  const router = useRouter()
  const [authChecked, setAuthChecked] = useState(false)
  const [bookings, setBookings] = useState<BookingRow[]>([])
  const [payments, setPayments] = useState<PaymentRow[]>([])
  const [loadingBookings, setLoadingBookings] = useState(true)
  const [loadingPayments, setLoadingPayments] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const token = sessionStorage.getItem(ADMIN_TOKEN_KEY)
    if (!token) {
      router.replace('/admin/login')
      return
    }
    setAuthChecked(true)
  }, [router])

  const [bookingPage, setBookingPage] = useState(1)
  const [paymentPage, setPaymentPage] = useState(1)
  const [hasMoreBookings, setHasMoreBookings] = useState(false)
  const [hasMorePayments, setHasMorePayments] = useState(false)

  const [modalType, setModalType] = useState<'booking' | 'payment' | null>(null)
  const [modalId, setModalId] = useState<number | null>(null)
  const [bookingDetail, setBookingDetail] = useState<BookingDetail | null>(null)
  const [paymentDetail, setPaymentDetail] = useState<PaymentDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  const fetchBookingDetail = useCallback(async (id: number) => {
    setDetailLoading(true)
    setBookingDetail(null)
    setPaymentDetail(null)
    try {
      const res = await PemaInstance.get<BookingDetail>(`/admin/bookings/${id}`)
      setBookingDetail(res.data)
    } catch (e: unknown) {
      const err = e as { response?: { status?: number } }
      if (err?.response?.status === 401) {
        router.replace('/admin/login')
        return
      }
      setError(getApiErrorMessage(e, 'Failed to load booking'))
    } finally {
      setDetailLoading(false)
    }
  }, [router])

  const fetchPaymentDetail = useCallback(async (id: number) => {
    setDetailLoading(true)
    setBookingDetail(null)
    setPaymentDetail(null)
    try {
      const res = await PemaInstance.get<PaymentDetail>(`/admin/payments/${id}`)
      setPaymentDetail(res.data)
    } catch (e: unknown) {
      const err = e as { response?: { status?: number } }
      if (err?.response?.status === 401) {
        router.replace('/admin/login')
        return
      }
      setError(getApiErrorMessage(e, 'Failed to load payment'))
    } finally {
      setDetailLoading(false)
    }
  }, [router])



  useEffect(() => {
    if (modalType === 'booking' && modalId != null) fetchBookingDetail(modalId)
    if (modalType === 'payment' && modalId != null) fetchPaymentDetail(modalId)
  }, [modalType, modalId, fetchBookingDetail, fetchPaymentDetail])

  const openBookingModal = (id: number) => {
    setModalType('booking')
    setModalId(id)
  }
  const openPaymentModal = (id: number) => {
    setModalType('payment')
    setModalId(id)
  }
  const closeModal = () => {
    setModalType(null)
    setModalId(null)
    setBookingDetail(null)
    setPaymentDetail(null)
  }

  useEffect(() => {
    if (!authChecked) return
    setLoadingBookings(true)
    PemaInstance.get<PaginatedResponse<BookingRow>>('/admin/bookings', {
      params: { page: bookingPage, limit: PAGE_SIZE },
    })
      .then((res) => {
        setBookings(res.data.items)
        const total = res.data.total
        setHasMoreBookings(bookingPage * PAGE_SIZE < total)
      })
      .catch((e) => {
        if (e?.response?.status === 401) {
          router.replace('/admin/login')
          return
        }
        setError(getApiErrorMessage(e, 'Failed to load bookings'))
      })
      .finally(() => setLoadingBookings(false))
  }, [authChecked, bookingPage, router])

  useEffect(() => {
    if (!authChecked) return
    setLoadingPayments(true)
    PemaInstance.get<PaginatedResponse<PaymentRow>>('/admin/payments', {
      params: { page: paymentPage, limit: PAGE_SIZE },
    })
      .then((res) => {
        setPayments(res.data.items)
        const total = res.data.total
        setHasMorePayments(paymentPage * PAGE_SIZE < total)
      })
      .catch((e) => {
        if (e?.response?.status === 401) {
          router.replace('/admin/login')
          return
        }
        setError(getApiErrorMessage(e, 'Failed to load payments'))
      })
      .finally(() => setLoadingPayments(false))
  }, [authChecked, paymentPage, router])

  if (!authChecked) {
    return (
      <div className="flex min-h-[280px] flex-1 items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-pemaBlue" aria-hidden />
      </div>
    )
  }

  return (
    <div className="flex-1 relative bg-white">
      <div className="w-full text-pemaBlue">
        <div className="max-w-[1360px] m-auto py-6 px-4">
          <div className="px-0 text-[28px] md:text-[40px] text-slateGray font-ivyOra py-2 leading-none">
            Bookings &amp; Payments
          </div>
          {error && (
            <p className="text-red-600 font-crimson text-base md:text-lg mt-4 mb-4">{error}</p>
          )}

          <section className="mt-8 md:mt-12">
            <div className="text-[22px] md:text-[28px] text-pemaBlue font-ivyOra mb-4">
              Bookings
            </div>
            {loadingBookings ? (
              <TableLoader />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-[#3233331A]">
                  <thead>
                    <tr>
                      <th className={thStyle}>Guest</th>
                      <th className={thStyle}>Email</th>
                      <th className={thStyle}>Phone</th>
                      <th className={thStyle}>Status</th>
                      <th className={thStyle}>Confirmation</th>
                      <th className={thStyle}>Room</th>
                      <th className={thStyle}>Check-in</th>
                      <th className={thStyle}>Check-out</th>
                      <th className={thStyle}>Total (₹)</th>
                      <th className={thStyle}>Paid (₹)</th>
                      <th className={thStyle + ' w-16 text-center'} aria-label="View details">
                        View
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr
                        key={b.id}
                        onClick={() => openBookingModal(b.id)}
                        className={clickableRowClass}
                      >
                        <td className={rowClickStyle}>{guestName(b)}</td>
                        <td className={rowClickStyle}>{b.guest_email ?? '–'}</td>
                        <td className={rowClickStyle}>{b.guest_phone ?? '–'}</td>
                        <td className={rowClickStyle}>{b.status}</td>
                        <td className={rowClickStyle}>{b.confirmation_number ?? '–'}</td>
                        <td className={rowClickStyle}>{b.room_name}</td>
                        <td className={rowClickStyle}>{formatDate(b.check_in_date)}</td>
                        <td className={rowClickStyle}>{formatDate(b.check_out_date)}</td>
                        <td className={rowClickStyle}>{b.total_amount}</td>
                        <td className={rowClickStyle}>{b.paid_amount}</td>
                        <td className={rowClickStyle + ' text-center text-pemaBlue'}>
                          <ChevronRight className="inline-block h-5 w-5" aria-hidden />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {!loadingBookings && bookings.length > 0 && (
              <div className="mt-3 flex items-center justify-between border-t border-[#3233331A] pt-3 font-crimson text-sm text-slateGray">
                <button
                  type="button"
                  onClick={() => setBookingPage((p) => Math.max(1, p - 1))}
                  disabled={bookingPage <= 1}
                  className="flex items-center gap-1 rounded border border-[#3233331A] bg-white px-3 py-1.5 transition hover:bg-softSand disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" /> Prev
                </button>
                <span>Page {bookingPage}</span>
                <button
                  type="button"
                  onClick={() => setBookingPage((p) => p + 1)}
                  disabled={!hasMoreBookings}
                  className="flex items-center gap-1 rounded border border-[#3233331A] bg-white px-3 py-1.5 transition hover:bg-softSand disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </section>

          <section className="mt-12 md:mt-20">
            <div className="text-[22px] md:text-[28px] text-pemaBlue font-ivyOra mb-4">
              Payments
            </div>
            {loadingPayments ? (
              <TableLoader />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-[#3233331A]">
                  <thead>
                    <tr>
                      <th className={thStyle}>Booking ID</th>
                      <th className={thStyle}>Amount (₹)</th>
                      <th className={thStyle}>Type</th>
                      <th className={thStyle}>Status</th>
                      <th className={thStyle}>Gateway</th>
                      <th className={thStyle}>Reference</th>
                      <th className={thStyle}>Created</th>
                      <th className={thStyle + ' w-16 text-center'} aria-label="View details">
                        View
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p) => (
                      <tr
                        key={p.id}
                        onClick={() => openPaymentModal(p.id)}
                        className={clickableRowClass}
                      >
                        <td className={rowClickStyle}>{p.booking_id ?? '–'}</td>
                        <td className={rowClickStyle}>{p.amount}</td>
                        <td className={rowClickStyle}>{p.payment_type}</td>
                        <td className={rowClickStyle}>{p.status}</td>
                        <td className={rowClickStyle}>{p.gateway}</td>
                        <td className={rowClickStyle}>{p.reference_number ?? '–'}</td>
                        <td className={rowClickStyle}>{formatDate(p.created_at)}</td>
                        <td className={rowClickStyle + ' text-center text-pemaBlue'}>
                          <ChevronRight className="inline-block h-5 w-5" aria-hidden />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {!loadingPayments && payments.length > 0 && (
              <div className="mt-3 flex items-center justify-between border-t border-[#3233331A] pt-3 font-crimson text-sm text-slateGray">
                <button
                  type="button"
                  onClick={() => setPaymentPage((p) => Math.max(1, p - 1))}
                  disabled={paymentPage <= 1}
                  className="flex items-center gap-1 rounded border border-[#3233331A] bg-white px-3 py-1.5 transition hover:bg-softSand disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" /> Prev
                </button>
                <span>Page {paymentPage}</span>
                <button
                  type="button"
                  onClick={() => setPaymentPage((p) => p + 1)}
                  disabled={!hasMorePayments}
                  className="flex items-center gap-1 rounded border border-[#3233331A] bg-white px-3 py-1.5 transition hover:bg-softSand disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </section>
        </div>
      </div>

      {(modalType === 'booking' || modalType === 'payment') && (
  <div
    className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 pt-24 pb-6 px-4 overflow-y-auto mt-20"
    onClick={closeModal}
  >
    <div
      className="bg-white max-h-[65vh] w-full max-w-xl overflow-hidden flex flex-col rounded-xl border border-[#3233331A] shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#3233331A] bg-softSand/50 px-4 py-2.5">
        <span className="font-ivyOra text-base text-pemaBlue">
          {modalType === 'booking' ? 'Booking details' : 'Payment details'}
        </span>
        <button
          onClick={closeModal}
          className="rounded p-1.5 hover:bg-white/80 text-slateGray"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Body */}
      <div className="min-h-[200px] overflow-y-auto p-3 font-crimson text-sm">
        {detailLoading ? (
          <div className="flex min-h-[160px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-pemaBlue" />
          </div>
        ) : modalType === 'booking' && bookingDetail ? (
          <div className="space-y-3">

            {/* Guest */}
            <section className="rounded-md bg-white p-2.5">
              <h3 className="font-ivyOra text-pemaBlue text-sm mb-1.5">Guest</h3>
              <dl className="grid grid-cols-[120px_1fr] gap-x-3 gap-y-1 text-xs">
                <Field
                  label="Name"
                  value={`${bookingDetail.guest_first_name ?? ''} ${bookingDetail.guest_last_name ?? ''}`.trim() || undefined}
                />
                <Field label="Email" value={bookingDetail.guest_email} />
                <Field label="Phone" value={bookingDetail.guest_phone} />
                <Field label="Country" value={bookingDetail.guest_country} />
                <Field
                  label="Other guests"
                  value={bookingDetail.other_guests?.length ? bookingDetail.other_guests.join(', ') : undefined}
                />
              </dl>
            </section>

            {/* Booking */}
            <section className="rounded-md bg-white p-2.5">
              <h3 className="font-ivyOra text-pemaBlue text-sm mb-1.5">Booking</h3>
              <dl className="grid grid-cols-[140px_1fr] gap-x-3 gap-y-1 text-xs">
                <Field label="Confirmation" value={bookingDetail.confirmation_number} />
                <Field label="Status" value={bookingDetail.status} />
                <Field label="Room" value={bookingDetail.room?.name} />
                <Field label="Program" value={bookingDetail.program?.title} />
                <Field label="Check-in" value={formatDate(bookingDetail.check_in_date)} />
                <Field label="Check-out" value={formatDate(bookingDetail.check_out_date)} />
                <Field label="Nights" value={bookingDetail.nights} />
                <Field label="Rooms" value={bookingDetail.number_of_rooms ?? 1} />
                <Field
                  label="Occupancy"
                  value={
                    bookingDetail.occupancy_details &&
                    Object.keys(bookingDetail.occupancy_details).length > 0
                      ? formatOccupancy(bookingDetail.occupancy_details as Record<string, unknown>)
                      : undefined
                  }
                />
              </dl>
            </section>

            {/* Financial */}
            <section className="rounded-md bg-white p-2.5">
              <h3 className="font-ivyOra text-pemaBlue text-sm mb-1.5">Financial</h3>
              <dl className="grid grid-cols-[140px_1fr] gap-x-3 gap-y-1 text-xs">
                <Field label="Total (₹)" value={bookingDetail.total_amount} />
                <Field label="Deposit (₹)" value={bookingDetail.deposit_amount} />
                <Field label="Paid (₹)" value={bookingDetail.paid_amount} />
                <Field label="Balance (₹)" value={bookingDetail.balance_amount} />
                <Field
                  label="Full payment"
                  value={bookingDetail.full_payment_required ? 'Yes' : 'No'}
                />
              </dl>
            </section>

            {/* Notes */}
            {(bookingDetail.special_requests || bookingDetail.guest_notes) && (
              <section className="rounded-md bg-white p-2.5">
                <h3 className="font-ivyOra text-pemaBlue text-sm mb-1.5">Notes</h3>
                <p className="text-xs">{bookingDetail.special_requests ?? bookingDetail.guest_notes}</p>
              </section>
            )}

            {/* Dates */}
            <section className="rounded-md bg-white p-2.5">
              <h3 className="font-ivyOra text-pemaBlue text-sm mb-1.5">Dates</h3>
              <dl className="grid grid-cols-[160px_1fr] gap-x-3 gap-y-1 text-xs">
                <Field label="Created" value={formatDate(bookingDetail.created_at)} />
                <Field
                  label="Medical form submitted"
                  value={bookingDetail.medical_form_submitted_at ? formatDate(bookingDetail.medical_form_submitted_at) : undefined}
                />
                <Field
                  label="Doctor reviewed"
                  value={bookingDetail.doctor_reviewed_at ? formatDate(bookingDetail.doctor_reviewed_at) : undefined}
                />
              </dl>
            </section>
          </div>
        ) : modalType === 'payment' && paymentDetail ? (
          <div className="space-y-3">

            {/* Payment */}
            <section className="rounded-md bg-white p-2.5">
              <h3 className="font-ivyOra text-pemaBlue text-sm mb-1.5">Payment</h3>
              <dl className="grid grid-cols-[140px_1fr] gap-x-3 gap-y-1 text-xs">
                <Field label="Booking ID" value={paymentDetail.booking_id} />
                <Field label="Reference" value={paymentDetail.reference_number} />
                <Field label="Status" value={paymentDetail.status} />
                <Field label="Gateway" value={paymentDetail.gateway} />
                <Field label="Type" value={paymentDetail.payment_type} />
                <Field label="Method" value={paymentDetail.payment_method} />
              </dl>
            </section>

            {/* Amounts */}
            <section className="rounded-md bg-white p-2.5">
              <h3 className="font-ivyOra text-pemaBlue text-sm mb-1.5">Amounts</h3>
              <dl className="grid grid-cols-[140px_1fr] gap-x-3 gap-y-1 text-xs">
                <Field label="Amount (₹)" value={paymentDetail.amount} />
                <Field label="Currency" value={paymentDetail.currency} />
                <Field label="Gateway fee (₹)" value={paymentDetail.gateway_fee} />
                <Field label="Net amount (₹)" value={paymentDetail.net_amount} />
                <Field label="Refunded (₹)" value={paymentDetail.refunded_amount} />
                <Field label="Refundable (₹)" value={paymentDetail.refundable_amount} />
              </dl>
            </section>

            {/* Dates */}
            <section className="rounded-md bg-white p-2.5">
              <h3 className="font-ivyOra text-pemaBlue text-sm mb-1.5">Dates</h3>
              <dl className="grid grid-cols-[140px_1fr] gap-x-3 gap-y-1 text-xs">
                <Field label="Created" value={formatDate(paymentDetail.created_at)} />
                <Field label="Completed" value={formatDate(paymentDetail.completed_at ?? '')} />
              </dl>
            </section>
          </div>
        ) : null}
      </div>
    </div>
  </div>
)}
    </div>
  )
}

export default function Admin() {
  return (
    <Suspense fallback={<div className="max-w-[1360px] m-auto py-6 px-4 text-slateGray font-crimson">Loading…</div>}>
      <Page />
    </Suspense>
  )
}
