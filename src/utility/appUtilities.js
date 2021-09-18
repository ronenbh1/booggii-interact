import { useSelector } from 'react-redux'
import { Auth } from 'aws-amplify';
import { useState, useRef, useEffect, useContext } from 'react'

export const useMode = () => {
  const mode = useSelector(store => store.app.mode)
  const otherMode = mode === 'light' ? 'dark' : 'light'
  const light = mode === 'light'
  return { mode, otherMode, light }
}

export const useLocale = () => {
  const locale = useSelector(store => store.app.locale)
  const direction = locale === 'he' ? 'rtl' : 'ltr'
  const rtl = direction === 'rtl'
  const ltr = direction === 'ltr'
  const placement = rtl ? 'left' : 'right'
  const antiPlacement = rtl ? 'right' : 'left'
  const capitalPlacement = capitalize(placement)
  const capitalAntiPlacement = capitalize(antiPlacement)
  return {
    locale,
    direction,
    rtl,
    ltr,
    placement,
    antiPlacement,
    capitalPlacement,
    capitalAntiPlacement,
  }
}

export const useDrawer = () => useSelector(store => store.app.drawerOpen)

const dateOptions = {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
}

// const dateTimeOptions = {
//   ...dateOptions,
//   hour: 'numeric',
//   minute: 'numeric',
//   hour12: true,
// }

export const useLocaleDate = date => {
  const locale = useSelector(store => store.app.locale)
  const dateFormat = new Date(date)

  return dateFormat.toLocaleDateString(locale, dateOptions)
}

export const useUser = () => {
  const [userName, setUserName] = useState("");
  let username = useSelector(store => store.users.loggedIn?.username)
  if (username == null){
    Auth.currentAuthenticatedUser()
    .then(user => {
      setUserName(user.username)
    })
  }
  username = userName
  return userName
}

export const capitalize = s => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export const humanize = s => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase().replace(/_/g, ' ')
}
