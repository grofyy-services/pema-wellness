import axios from 'axios'
import { getDefaultStore } from 'jotai'
import { exchangeRatesAtom, ratesLastFetchedAtom } from './atoms'

export async function fetchExchangeRatesOnce() {
  const store = getDefaultStore()
  const lastFetched = store.get(ratesLastFetchedAtom)
  const now = Date.now()

  // If already fetched within 6 hours, skip
  if (lastFetched && now - lastFetched < 6 * 60 * 60 * 1000) return

  try {
    const response = await axios.get(
      'https://v6.exchangerate-api.com/v6/8ae263381d7ea07da23263f1/latest/INR'
    )
    const rates = response.data.conversion_rates
    const modifiedRates = Object.fromEntries(
      Object.entries(rates).map(([key, value]) => [key.slice(0, 2), value])
    ) as Record<string, number>

    store.set(exchangeRatesAtom, modifiedRates)
  } catch (err) {
    console.error('❌ Failed to fetch exchange rates', err)
  }
}
