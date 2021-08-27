/** @jsxImportSource @emotion/react */
import { useState, memo } from 'react'
import {
  Switch,
  Route,
  Link,
  useRouteMatch,
  useLocation,
} from 'react-router-dom'

import { toggleDrawer, toggleLocale, toggleMode } from '../redux/app'
import { useDrawer, useLocale, useMode, useUser } from '../utility/appUtilities'
import { logout } from '../redux/users'
import { useDispatch } from 'react-redux'

import { isMobile } from 'react-device-detect'

import useTranslation from '../i18n/useTranslation'
import containsHeb from '../utility/containsHeb'

import useTheme from '../styling/useTheme'

import SwitchRightOutlinedIcon from '@material-ui/icons/SwitchRightOutlined'
import DarkModeOutlinedIcon from '@material-ui/icons/DarkModeOutlined'
import LightModeOutlinedIcon from '@material-ui/icons/LightModeOutlined'
import DashboardOutlinedIcon from '@material-ui/icons/DashboardOutlined'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import Logout from '@material-ui/icons/PowerSettingsNewOutlined'
import Button from '@material-ui/core/Button'
import ActivityLogIcon from '@material-ui/icons/PendingActionsOutlined'

import Dashboard from './Dashboard'
import Activity from './Activity'

import packageJson from '../../package.json'

const Home = () => {
  const { url } = useRouteMatch()
  const { pathname } = useLocation()

  const { mode, light } = useMode()
  const { direction } = useLocale()
  const theme = useTheme({ mode, direction })
  const open = useDrawer()

  let { username } = useUser()

  const t = useTranslation()
  const dispatch = useDispatch()

  const [dir, setDir] = useState(direction)
  const rtl = dir === 'rtl'
  const ltr = dir === 'ltr'

  const menuItem = {
    padding: 1,
    icon: 1.5,
    active: light ? 'rgba(0, 0, 0, 0.8)' : '#e0e0e0',
    inactive: '#757575',
  }

  // ToDo: change width calculation to be static, or at least memoize it
  const drawerWidth = {}
  const routeWidth = {}
  drawerWidth.open = '8rem'
  routeWidth.open = `calc(100vw - ${drawerWidth.open})`
  drawerWidth.close = isMobile
    ? '0rem'
    : `calc(2*${menuItem.padding}rem + ${menuItem.icon}rem)`
  routeWidth.close = `calc(100vw - ${drawerWidth.close})`

  const greyShade = '600'

  const styles = {
    root: {
      display: 'flex',
      height: '100vh',
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
    drawer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      width: open ? drawerWidth.open : drawerWidth.close,
      transition: 'width 0.5s',
      backgroundColor: light
        ? theme.palette.background.backdrop
        : theme.palette.background.prominent,
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      '& button:last-child': {
        marginTop: 'auto',
      },
    },
    link: {
      textDecoration: 'none',
    },
    chevronItem: theme => ({
      display: 'flex',
      height: isMobile
        ? theme.mixins.toolbar.mobileHeight
        : theme.mixins.toolbar.desktopHeight,
      justifyContent: open ? 'flex-end' : 'center',
      borderRadius: '0',
      padding: '0',
      marginLeft: rtl ? 'inherit' : open ? '0' : '-0.5rem',
      marginRight: ltr ? 'inherit' : open ? '0' : '-0.5rem',
      '& svg': {
        fontSize: '2rem !important',
        // ToDo: add 'willChange'
        transform: `rotate(${(open && ltr) || (!open && rtl) ? 0 : 180}deg)`,
        transition: 'transform 0.5s',
        color: theme.palette.grey[greyShade],
      },
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        color: 'white',
        '& svg': {
          color: 'white',
        },
      },
    }),
    iconWrapper: {
      display: 'flex',
      padding: `${menuItem.padding}rem`,
      '& svg': {
        fontSize: `${menuItem.icon}rem`,
      },
      '& svg[data-testid="SwitchRightOutlinedIcon"]': {
        transform: `rotate(${dir === 'rtl' ? 180 : 0}deg)`,
        transition: 'transform 0.5s',
      },
    },
    drawerItem: theme => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      borderRadius: '0',
      padding: '0',
      color: theme.palette.grey[greyShade],
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        color: 'white !important',
        '& svg': {
          color: 'white !important',
        },
      },
    }),
    title: {
      margin: '0 2px',
      fontSize: direction === 'rtl' ? '1.2rem' : 'inherit',
    },
    user: {
      position: 'absolute',
      top: '-5rem',
      right: '1rem',
      writingMode: 'vertical-lr',
      transform: 'rotate(180deg)',
    },
    route: {
      width: open ? routeWidth.open : routeWidth.close,
      transition: 'width 0.5s',
      zIndex: '0',
      '& > div': {
        height: '100%',
      },
    },
  }

  const routes = [
    {
      path: 'report',
      component: <Activity />,
      icon: <ActivityLogIcon />,
      title: t('report'),
      color:
        pathname === '/home/report' ? menuItem.active : menuItem.inactive,
    },
    {
      path: 'dashboard',
      component: <Dashboard />,
      icon: <DashboardOutlinedIcon />,
      title: t('dashboard'),
      color:
        pathname === '/home/dashboard' ? menuItem.active : menuItem.inactive,
    },
  ]
  const toggles = [
    {
      key: 'lang',
      icon: <SwitchRightOutlinedIcon />,
      onClick: () => {
        setDir(dir => (dir === 'ltr' ? 'rtl' : 'ltr'))
        setTimeout(() => dispatch(toggleLocale()), 500)
      },
      title: t('lang'),
    },
    {
      key: 'mode',
      icon: light ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />,
      onClick: () => dispatch(toggleMode()),
      title: t('mode'),
    },
    {
      key: 'version',
      title: 'V' + packageJson.version,
    },
    {
      key: 'logout',
      icon: <Logout />,
      onClick: () => dispatch(logout()),
      title: t('logout'),
      user: username,
    },
  ]

  return (
    <div css={styles.root}>
      <div css={styles.drawer}>
        <Button
          fullWidth
          css={styles.chevronItem}
          onClick={() => dispatch(toggleDrawer())}
        >
          <div css={styles.iconWrapper}>
            <ChevronLeftIcon />
          </div>
        </Button>
        {routes.map(({ path, title, icon, color }) => (
          <Link to={`${url}/${path}`} css={styles.link} key={path}>
            <Button fullWidth css={styles.drawerItem} title={title}>
              <div css={styles.iconWrapper} style={{ color }}>
                {icon}
              </div>
              <div
                css={styles.title}
                style={{
                  fontSize: containsHeb(title) ? '1rem' : '0.75rem',
                }}
              >
                {title}
              </div>
            </Button>
          </Link>
        ))}

        {toggles.map(({ key, title, icon, user, onClick }) => (
          <Button
            fullWidth
            css={styles.drawerItem}
            {...{ key, onClick, title }}
          >
            <div css={styles.iconWrapper}>{icon}</div>
            <div
              css={styles.title}
              style={{ fontSize: containsHeb(title) ? '1rem' : '0.7rem' }}
            >
              {title}
              {user && <div css={styles.user}>{user}</div>}
            </div>
          </Button>
        ))}
      </div>

      <div css={styles.route}>
        <Switch>
          {routes.map(({ path, component }) => (
            <Route path={`${url}/${path}`} key={path}>
              {component}
            </Route>
          ))}
        </Switch>
      </div>
    </div>
  )
}

export default memo(Home)
