/** @jsxImportSource @emotion/react */
import { Redirect, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUser } from '../redux/users'

import { isMobile, isDesktop } from 'react-device-detect'

import { useForm } from 'react-hook-form'

import { useMode, useLocale } from '../utility/appUtilities'
import useTranslation from '../i18n/useTranslation'
import useTheme from '../styling/useTheme'

import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import { ReactComponent as Logo } from '../assets/logo.svg'

const styles = {
  container: {
    height: '100vh',
    display: 'grid',
    ...(isDesktop && { gridTemplateColumns: '1fr 2fr' }),
    ...(isMobile && { gridTemplateRows: '50% 50%' }),
  },
  hero: theme => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    padding: '10vw',
  }),
  logo: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    '& > svg': {
      height: '75%',
      fill: 'white',
    },
  },
  name: {
    fontWeight: '100',
    textTransform: 'uppercase',
    fontSize: '2rem',
    textAlign: 'center',
    lineHeight: '3rem',
    marginBottom: '1rem',
  },
  formContainerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '4px',
    padding: '1rem',
  },
  form: {
    maxWidth: '500px',
  },
  avatar: theme => ({
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  }),

  submit: theme => ({
    margin: theme.spacing(3, 0, 2),
  }),
}

export default function Login() {
  const loggedIn = useSelector(store => !!store.users.loggedIn?.access_token)
  const { mode } = useMode()
  const { direction } = useLocale()
  const theme = useTheme({ mode, direction })
  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const { state } = useLocation()
  const t = useTranslation()

  const onSubmit = ({ username, password }) => {
    dispatch(fetchUser({ username, password }))
  }

  if (loggedIn) {
    return <Redirect to={state?.from || '/'} />
  }

  return (
    <div css={styles.container}>
      <div css={styles.hero}>
        <div css={styles.logo}>
          <Logo />
        </div>
        <Typography variant="h3" css={styles.name}>
          {t('appName')}
        </Typography>
      </div>

      <div
        css={styles.formContainerContainer}
        style={{
          backgroundColor: theme.palette.background.backdrop,
        }}
      >
        <div css={styles.formContainer}>
          <Avatar css={styles.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {t('signIn')}
          </Typography>
          <form
            onSubmit={handleSubmit(onSubmit)}
            css={styles.form}
            noValidate
            autoComplete="off"
          >
            <TextField
              variant="standard"
              margin="normal"
              required
              fullWidth
              id="username"
              label={t('username')}
              name="username"
              autoComplete="username"
              autoFocus
              error={!!errors?.username}
              helperText={errors?.username && t('usernameRequired')}
              {...register('username', { required: true })}
            />
            <TextField
              variant="standard"
              margin="normal"
              required
              fullWidth
              name="password"
              label={t('password')}
              type="password"
              id="password"
              autoComplete="current-password"
              error={!!errors?.password}
              helperText={errors?.password && t('passwordRequired')}
              {...register('password', { required: true })}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              css={styles.submit}
            >
              {t('signIn')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
