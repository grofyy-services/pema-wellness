// atoms.ts
import { atom } from 'jotai'

export type CurrencyCode = 'IN' | 'US' | 'AE' | 'SG' | 'GB' | 'EU' | 'RU'

// Base atom with safe SSR default
const baseCurrencyAtom = atom<CurrencyCode>('IN')

// Derived atom for normal use
export const selectedCurrencyAtom = atom(
  (get) => get(baseCurrencyAtom),
  (get, set, newValue: CurrencyCode) => {
    set(baseCurrencyAtom, newValue)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('selectedCurrency', newValue)
    }
  }
)

// Hydration atom — optional helper
export const hydrateCurrencyAtom = atom(null, (_get, set) => {
  if (typeof window !== 'undefined') {
    const saved = sessionStorage.getItem('selectedCurrency') as CurrencyCode | null
    if (saved && ['IN', 'US', 'AE', 'SG', 'GB', 'EU', 'RU'].includes(saved)) {
      set(baseCurrencyAtom, saved)
    }
  }
})

export const exchangeRatesAtom = atom<Record<string, number> | null>(null)
export const ratesLastFetchedAtom = atom<number | null>(null)
