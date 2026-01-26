import { AxiosError } from 'axios'
import { enqueueSnackbar } from 'notistack'

export const showAxiosError = (error: unknown, fallbackMessage = 'Something went wrong') => {
  if (error instanceof AxiosError) {
    const detail =
      typeof error.response?.data?.detail === 'string'
        ? error.response?.data?.detail
        : fallbackMessage
    enqueueSnackbar(detail, { variant: 'error' })
  } else {
    enqueueSnackbar(`${error}` || fallbackMessage, { variant: 'error' })
  }
}
