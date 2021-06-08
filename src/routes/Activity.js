/** @jsxImportSource @emotion/react */
import { useState, useRef, useEffect } from 'react'

import Page from '../layout/Page'

import useTranslation from '../i18n/useTranslation'

import IconButton from '@material-ui/core/IconButton'
import VerySad from '@material-ui/icons/SentimentVeryDissatisfied'
import Sad from '@material-ui/icons/SentimentDissatisfied'
import Neutral from '@material-ui/icons/SentimentNeutral'
import Happy from '@material-ui/icons/SentimentSatisfiedAlt'
import VeryHappy from '@material-ui/icons/SentimentVerySatisfied'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'

import Walking from '@material-ui/icons/DirectionsWalkOutlined'
import Sitting from '@material-ui/icons/WeekendOutlined'
import Elevator from '@material-ui/icons/ElevatorOutlined'
import Music from '@material-ui/icons/HeadsetOutlined'
import Flight from '@material-ui/icons/FlightOutlined'
import Hiking from '@material-ui/icons/FollowTheSignsOutlined'
import Dining from '@material-ui/icons/DinnerDiningOutlined'
import InBed from '@material-ui/icons/KingBedOutlined'
import Driving from '@material-ui/icons/DirectionsCarFilledOutlined'
import WithFamily from '@material-ui/icons/GroupsOutlined'
import Yoga from '@material-ui/icons/SelfImprovementOutlined'
import Sports from '@material-ui/icons/SportsHandballOutlined'
import lightBlue from '@material-ui/core/colors/lightBlue'
import lightGreen from '@material-ui/core/colors/lightGreen'
import red from '@material-ui/core/colors/red'
import { SportsRugbySharp } from '@material-ui/icons'

const Section = ({ title, children }) => {
  const t = useTranslation()

  const styles = {
    root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      // backgroundColor: lightBlue[50],
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
    title: {
      width: '100%',
      textAlign: 'center',
      fontSize: '1.2rem',
      letterSpacing: '0.3rem',
    },
    content: {
      flexGrow: '1',
      display: 'flex',
      justifyContent: 'space-evenly',
      alignItems: 'center',
    },
  }

  return (
    <div css={styles.root}>
      <div css={styles.title}>{t(title)}</div>
      <div css={styles.content}>{children}</div>
    </div>
  )
}

const Activity = () => {
  const t = useTranslation()
  const [event, setEvent] = useState(false)

  const toggleEvent = () => {
    setEvent(eventState => !eventState)
  }

  const styles = {
    root: theme => ({
      height: '100%',
      display: 'grid',
      gap: '1rem',
    }),
    iconButton: {
      '& svg': {
        fontSize: '15vw',
      },
      '& .MuiIconButton-label': {
        display: 'flex',
        flexDirection: 'column',
      },
    },
    fab: theme => ({
      borderRadius: '50%',
      backgroundColor: event
        ? `${red[500]} !important`
        : `${lightGreen[500]} !important`,
      color: 'white',
      borderColor: 'transparent',
      width: '20vw',
      height: '20vw',
      border: '5px solid white',
      '& > .MuiFab-label': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        '& > svg': {
          fontSize: '2.5rem',
          transform: `rotate(${event ? 45 : 0}deg)`,
          transition: 'transform 0.25s',
        },
      },
    }),
    caption: {
      fontSize: '1rem',
    },
    picker: {
      fontSize: '1rem',
      position: 'absolute',
      start: {
        left: '1rem',
      },
      finish: {
        right: '1rem',
      },
    },
    input: {
      padding: '0.3rem',
      border: '1px solid rgba(0, 0, 0, 0.2)',
      borderRadius: '10px',
      start: {
        background: lightGreen[100],
      },
      finish: {
        background: red[100],
      },
    },
  }

  return (
    <Page name="activity">
      <div css={styles.root}>
        <Section title="sentiment">
          <IconButton css={styles.iconButton}>
            <VerySad />
          </IconButton>
          <IconButton css={styles.iconButton}>
            <Sad />
          </IconButton>
          <IconButton css={styles.iconButton}>
            <Neutral />
          </IconButton>
          <IconButton css={styles.iconButton}>
            <Happy />
          </IconButton>
          <IconButton css={styles.iconButton}>
            <VeryHappy />
          </IconButton>
        </Section>

        <Section title="event">
          <Fab css={styles.fab} onClick={toggleEvent}>
            <AddIcon />
          </Fab>
          <div css={{ ...styles.picker, ...styles.picker.start }}>
            <input
              type="time"
              css={{ ...styles.input, ...styles.input.start }}
              id="appt"
              name="appt"
              value="06:38"
            ></input>
          </div>
          <div css={{ ...styles.picker, ...styles.picker.finish }}>
            <input
              type="time"
              css={{ ...styles.input, ...styles.input.finish }}
              id="appt"
              name="appt"
              value="06:55"
            ></input>
          </div>
        </Section>

        <Section title="activity">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-evenly',
              gap: '2rem',
            }}
          >
            <IconButton css={styles.iconButton}>
              <Walking />
              <div css={styles.caption}>{t('walking')}</div>
            </IconButton>
            <IconButton css={styles.iconButton}>
              <Sitting />
              <div css={styles.caption}>{t('sitting')}</div>
            </IconButton>
            <IconButton css={styles.iconButton}>
              <Dining />
              <div css={styles.caption}>{t('dining')}</div>
            </IconButton>
            <IconButton css={styles.iconButton}>
              <InBed />
              <div css={styles.caption}>{t('inBed')}</div>
            </IconButton>
            <IconButton css={styles.iconButton}>
              <Music />
              <div css={styles.caption}>{t('listening')}</div>
            </IconButton>
            <IconButton css={styles.iconButton}>
              <Driving />
              <div css={styles.caption}>{t('driving')}</div>
            </IconButton>
            <IconButton css={styles.iconButton}>
              <Hiking />
              <div css={styles.caption}>{t('hiking')}</div>
            </IconButton>
            <IconButton css={styles.iconButton}>
              <WithFamily />
              <div css={styles.caption}>{t('withFamily')}</div>
            </IconButton>
          </div>
        </Section>
      </div>
    </Page>
  )
}

export default Activity
