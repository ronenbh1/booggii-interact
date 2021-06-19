/* eslint-disable react/style-prop-object */
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'

import { Helmet, HelmetProvider } from 'react-helmet-async'
import { IntlProvider } from 'react-intl'
import he from './i18n/he.json'
import en from './i18n/en.json'
import { useMode, useLocale } from './utility/appUtilities'

// import ProtectedRoute from './auth/ProtectedRoute'
import Login from './auth/Login'
import Home from './routes/Home'

import Snackbar from './communication/Snackbar'
import SimulateError from './utility/SimulateError'
import ErrorBoundary from './utility/ErrorBoundary'

import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import useTheme from './styling/useTheme'

import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'

function App() {
  const { mode } = useMode()
  const { locale, direction } = useLocale()
  const theme = useTheme({ mode, direction })
  const messages = { he, en }

  window.theme = theme

  return (
    <HelmetProvider>
      <Helmet>
        <html lang={locale} />
        <body dir={direction} style="overflow: hidden" />
      </Helmet>
      <IntlProvider
        messages={messages[locale]}
        locale={locale}
        defaultLocale="he"
        onError={e => console.error('IntlProvider Error:', e)}
      >
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ErrorBoundary>
            <Router>
              <Switch>
                <Route exact path="/">
                  <Redirect to="/home/activity" />
                </Route>
                <Route path="/home">
                  <Home />
                </Route>
                <Route path="/login">
                  <Login />
                </Route>
                <Route path="/simulateerror">
                  <SimulateError />
                </Route>
              </Switch>
              <Snackbar />
            </Router>
          </ErrorBoundary>
        </ThemeProvider>
      </IntlProvider>
      <AmplifySignOut />
    </HelmetProvider>
  )
}

export default withAuthenticator(App);
