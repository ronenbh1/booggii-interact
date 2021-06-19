/** @jsxImportSource @emotion/react */
import { useState, useRef, useEffect } from 'react'
import useTheme from '../styling/useTheme'

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
import Music from '@material-ui/icons/HeadsetOutlined'
// import Flight from '@material-ui/icons/FlightOutlined'
import Hiking from '@material-ui/icons/FollowTheSignsOutlined'
import Dining from '@material-ui/icons/DinnerDiningOutlined'
import InBed from '@material-ui/icons/KingBedOutlined'
import Driving from '@material-ui/icons/DirectionsCarFilledOutlined'
import WithFamily from '@material-ui/icons/GroupsOutlined'
// import Yoga from '@material-ui/icons/SelfImprovementOutlined'
// import Sports from '@material-ui/icons/SportsHandballOutlined'
// import lightBlue from '@material-ui/core/colors/lightBlue'
import lightGreen from '@material-ui/core/colors/lightGreen'
import red from '@material-ui/core/colors/red'

import { API } from 'aws-amplify';
import { createEvent as createEventMutation, deleteEvent as deleteEventMutation } from '../graphql/mutations';


const Section = ({ title, children, center = false }) => {
  const t = useTranslation()

  const styles = {
    root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
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
      justifyContent: center ? 'center' : 'space-evenly',
      gap: center ? '0.5rem' : 'unset',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
  }

  return (
    <div css={styles.root}>
      <div css={styles.title}>{t(title)}</div>
      <div css={styles.content}>{children}</div>
    </div>
  )
}

const initialFormState = { name: '', description: '' }

const Activity = () => {
  const t = useTranslation()
  const [event, setEvent] = useState(false)
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  const sentiments = [
    { name: 'verySad', icon: <VerySad /> },
    { name: 'sad', icon: <Sad /> },
    { name: 'neutral', icon: <Neutral /> },
    { name: 'happy', icon: <Happy /> },
    { name: 'veryHappy', icon: <VeryHappy /> },
  ]
  const [sentiment, setSentiment] = useState()
  const updateSentiment = clicked => () => {
    if (clicked === sentiment) {
      setSentiment(null)
    } else {
      createEvent({clicked, description: new Date()})
      setSentiment(clicked)
    }
  }
  const toggleEvent = () => {
    setEvent(eventState => !eventState)
  }

  const activities = [
    { name: 'walking', icon: <Walking /> },
    { name: 'sitting', icon: <Sitting /> },
    { name: 'dining', icon: <Dining /> },
    { name: 'inBed', icon: <InBed /> },
    { name: 'listening', icon: <Music /> },
    { name: 'driving', icon: <Driving /> },
    { name: 'hiking', icon: <Hiking /> },
    { name: 'withFamily', icon: <WithFamily /> },
  ]

  const updateActivity = clicked => () => {
    createEvent({clicked, description: new Date()})
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
        left: '0rem',
      },
      finish: {
        right: '0rem',
      },
    },
    input: {
      padding: '0.3rem',
      border: '1px solid rgba(0, 0, 0, 0.2)',
      borderRadius: '10px',
      start: {
        background: lightGreen[200],
      },
      finish: {
        background: red[200],
      },
    },
    firstAddIcon: {
      transform: 'translate(-0.8rem, -0.8rem) !important',
    },
    secondAddIcon: {
      transform: 'translate(0.8rem, 0.8rem) !important',
    },
  }

  async function createEvent() {
    if (!formData.name || !formData.description) return;
    await API.graphql({ query: createEventMutation, variables: { input: formData } });
    setEvents([ ...events, formData ]);
    // setFormData(initialFormState);
  }

  return (
    <Page name="activity">
      <div css={styles.root}>
        <Section title="sentiment">
          {sentiments.map(({ name, icon }) => (
            <Sentiment
              key={name}
              {...{ name, icon, sentiment, updateSentiment }}
            />
          ))}
        </Section>

        <Section title="event" center>
          <Fab css={styles.fab} onClick={toggleEvent}>
            <AddIcon />
          </Fab>
          <Fab css={styles.fab} onClick={toggleEvent}>
            <AddIcon css={styles.firstAddIcon} />
            <AddIcon css={styles.secondAddIcon} />
          </Fab>
          <div css={{ ...styles.picker, ...styles.picker.start }}>
            <input
              type="time"
              css={{ ...styles.input, ...styles.input.start }}
              id="appt"
              name="appt"
              value="06:38"
              onChange={() => {}}
            ></input>
          </div>
          <div css={{ ...styles.picker, ...styles.picker.finish }}>
            <input
              type="time"
              css={{ ...styles.input, ...styles.input.finish }}
              id="appt"
              name="appt"
              value="06:55"
              onChange={() => {}}
            ></input>
          </div>
        </Section>

        <Section title="activity" style={{gap: '2rem'}}>
          {activities.map(({ name, icon }) => (
            <ActivityButton
              key={name}
              {...{ name, icon, updateActivity }}
            />
          ))}
        </Section>
      </div>
    </Page>
  )
}

export default Activity

const Sentiment = ({ name, icon, sentiment, updateSentiment }) => {
  const theme = useTheme()
  const Icon = icon

  const styles = {
    iconButton: {
      '& svg': {
        fontSize: '15vw',
      },
      '& .MuiIconButton-label': {
        display: 'flex',
        flexDirection: 'column',
      },
    },
    selectedSentiment: {
      '& svg': {
        fill: theme.palette.primary.main,
      },
    },
  }
  return (
    <IconButton
      css={{
        ...styles.iconButton,
      }}
      onClick={updateSentiment(name)}
    >
      <div css={name === sentiment ? styles.selectedSentiment : {}}>{icon}</div>
    </IconButton>
  )
}

const ActivityButton = ({ name, icon, updateActivity }) => {
  const theme = useTheme()
  const Icon = icon
  const t = useTranslation()

  const styles = {
    iconButton: {
      '& svg': {
        fontSize: '15vw',
      },
      '& .MuiIconButton-label': {
        display: 'flex',
        flexDirection: 'column',
      },
    },
    selectedActivity: {
      '& svg': {
        fill: theme.palette.primary.main,
      },
    },
  }
  return (
    <IconButton
      css={{
        ...styles.iconButton,
      }}
      onClick={updateActivity(name)}
    >
      <div css={styles.caption}>{t(name)}</div>
      <div>{icon}</div>
    </IconButton>
  )
}
