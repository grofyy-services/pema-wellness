import { getDefaultStore } from 'jotai'
import { exchangeRatesAtom } from '@/lib/atoms'

const currencySymbols: Record<string, string> = {
  IN: '₹',
  US: '$',
  AE: 'د.إ',
  SG: 'S$',
  GB: '£',
  EU: '€',
  RU: '₽',
}

export function convertINRUsingGlobalRates(amountInINR: number, currency: string) {
  if (currency === 'IN')
    return `₹ ${amountInINR.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`

  const store = getDefaultStore()
  const rates = store.get(exchangeRatesAtom)

  if (!rates || !rates[currency]) {
    return `₹ ${amountInINR.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
  }
  // Apply +5% fee on FX rate
  const rateWithFee = rates[currency] * 1.05

  // Convert and round to nearest 10
  const converted = amountInINR * rateWithFee
  const roundedConverted = Math.round(converted / 10) * 10

  const symbol = currencySymbols[currency] || ''
  return `${symbol} ${roundedConverted.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
}
