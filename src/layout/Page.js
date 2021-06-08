/** @jsxImportSource @emotion/react */
import { useDispatch } from 'react-redux'
import { toggleDrawer } from '../redux/app'
import { useDrawer, useLocale } from '../utility/appUtilities'

import { isMobile } from 'react-device-detect'

import useTranslation from '../i18n/useTranslation'

import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import { ReactComponent as Logo } from '../assets/logo.svg'
import MenuIcon from '@material-ui/icons/MenuOutlined'
import Typography from '@material-ui/core/Typography'

const styles = {
  paper: {
    height: '100vh',
    position: 'relative',
  },
}

const Toolbar = ({ name }) => {
  const dispatch = useDispatch()
  const open = useDrawer()
  const { ltr, rtl } = useLocale()
  const t = useTranslation()

  const handleClick = () => {
    dispatch(toggleDrawer())
  }

  const styles = {
    toolbar: theme => ({
      width: '100%',
      height: isMobile
        ? theme.mixins.toolbar.mobileHeight
        : theme.mixins.toolbar.desktopHeight,
      padding: '0 1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#00b0ff',
    }),
    menu: {
      transform: `rotate(${(open && ltr) || (!open && rtl) ? 0 : 90}deg)`,
      transition: 'transform 0.5s',
      color: 'white',
      width: '5rem',
    },
    name: {
      color: 'white',
    },
    logo: theme => ({
      width: '5rem',
      height: '2.7rem',
      fill: 'white',
    }),
  }

  return (
    <div css={styles.toolbar}>
      <IconButton onClick={handleClick} css={styles.menu}>
        <MenuIcon />
      </IconButton>
      <Typography variant="h5" css={styles.name}>
        {t(name)}
      </Typography>
      <Logo css={styles.logo} />
    </div>
  )
}

const Page = ({ name, children, ...rest }) => (
  <Paper elevation={4} css={styles.paper} {...rest}>
    <Toolbar {...{ name }} />
    {children}
  </Paper>
)

export default Page
