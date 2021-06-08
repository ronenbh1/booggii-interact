/* eslint-disable no-undef */
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import useTranslation from '../i18n/useTranslation'
import statusToText from '../utility/statusToText'

const useNotifications = setOpen => {
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState('info')
  const t = useTranslation()

  // ToDo: That should be the standard
  // If expression is truthy then there is an error and the value can be fed into statusToText.
  // contentError should be amended accordingly:
  // currently, if there's hard failure (e.g., n/w fault) with no status then no message is shown.
  const userError = useSelector(
    store => store.users?.error && (store.users.error.status || 999)
  )

  useEffect(() => {
    if (userError) {
      setOpen(true)
      setMessage(t(statusToText(userError)))
      setSeverity('error')
    }
  }, [setOpen, userError, t])

  return { message, severity }
}

export default useNotifications
