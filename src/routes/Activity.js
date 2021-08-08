/** @jsxImportSource @emotion/react */
import { useState, useRef, useEffect, useContext } from 'react'
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

import Walking from '@material-ui/icons/DirectionsWalk'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faHorse as Riding } from '@fortawesome/free-solid-svg-icons'
import Riding from '@material-ui/icons/BedroomBaby'
import Dining from '@material-ui/icons/Fastfood'
import Sleeping from '@material-ui/icons/Hotel'
import Driving from '@material-ui/icons/DirectionsCarFilled'
import WithFamily from '@material-ui/icons/FamilyRestroom'
import Media from '@material-ui/icons/Theaters'
import LayDown from '@material-ui/icons/AirlineSeatFlatAngled'
// import ClosedSpace from '@material-ui/icons/ExitToApp'
import ClosedSpace from '@material-ui/icons/DisabledByDefault'
import Effort from '@material-ui/icons/FitnessCenter'
import Crowded from '@material-ui/icons/Groups'
// import lightBlue from '@material-ui/core/colors/lightBlue'
import lightGreen from '@material-ui/core/colors/lightGreen'
import red from '@material-ui/core/colors/red'
// import TextField from '@material-ui/pickers';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
// import { API } from 'aws-amplify';
// import { createEvent as createEventMutation, deleteEvent as deleteEventMutation } from '../graphql/mutations';

import { DataStore } from '@aws-amplify/datastore';
import { Event } from '../models';
import { Auth } from 'aws-amplify';

import moment from 'moment';

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
      gap: title === 'event' ? '1rem' : title === 'activity' ? '2rem' : 'unset',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
  }

  return (
    <div css={styles.root}>
      <div css={styles.title}>{t(title)}</div>
      <div css={styles.content} >{children}</div>
    </div>
  )
}

const useStyles = makeStyles((theme) => ({
  eventStartTime: {
    // display: 'flex',
    justifyContent: 'right',
    position: 'absolute',
    right: '0rem',
    inputProps: {
      style: {
        padding: '0',
      },
      textAlign: 'center'
    }
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    left: '0rem',
    inputProps: {
      style: {
        padding: '0.1',
      },
      textAlign: 'center'
    }
  },
  eventEndTime: {
    // display: 'flex',
    justifyContent: 'left',
    position: 'absolute',
    left: '0rem',
    inputProps: {
      style: {
        padding: '0.1',
      },
      textAlign: 'center'
    }
  },
  eventTimes: {
    display: 'flex',
    justifyContent: 'left',
    position: 'absolute',
    left: '0rem',
  },
  }));

const initialFormState = { name: '', description: '' }

const Activity = () => {
  console.log("start")
  const t = useTranslation()
  const [majorEvent, setMajorEvent] = useState(false)
  const [majorEvents, setMajorEvents] = useState([]);
  const [moderateEvent, setModerateEvent] = useState(false)
  const [moderateEvents, setModerateEvents] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [userName, setUserName] = useState("");
  
  Auth.currentAuthenticatedUser()
  .then(user => {
    setUserName(user.getUsername());
    })


  const sentiments = [
    { name: 'verySad', icon: <VerySad /> },
    { name: 'sad', icon: <Sad /> },
    { name: 'neutral', icon: <Neutral /> },
    { name: 'happy', icon: <Happy /> },
    { name: 'veryHappy', icon: <VeryHappy /> },
  ]
  const [activity, setActivity] = useState()
  const [sentiment, setSentiment] = useState()
  const updateSentiment = clicked => async () => {
    if (clicked === sentiment) {
      setSentiment(null)
    } else {
      console.log(clicked)
      await DataStore.save(
        new Event({
          "name": clicked,
          "localTime": moment().format(),
          "userName": userName
        })
      );  
      setSentiment(clicked)
    }
  }
  const toggleMajorEvent = async () => {
    setMajorEvent(eventState => !eventState)
    console.log('toggleMajorEvent')
    if (majorEvent){
      await DataStore.save(
        new Event({
        "name": "MajorEvent_end",
        "localTime": moment().format(),
        "userName": userName
        })
      );
    } else {
      await DataStore.save(
        new Event({
        "name": "MajorEvent_start",
        "localTime": moment().format(),
        "userName": userName
        })
      );
    }
  }
  const toggleModerateEvent = async () => {
    setModerateEvent(eventState => !eventState)
    console.log("toggleModerateEvent")
    if (moderateEvent){
      await DataStore.save(
        new Event({
          "name": "ModerateEvent_end",
          "localTime": moment().format(),
          "userName": userName
        })
      );
    } else {
      await DataStore.save(
        new Event({
          "name": "ModerateEvent_start",
          "localTime": moment().format(),
          "userName": userName
        })
      );
    }
  }

  const activities = [
    { name: 'walking', icon: <Walking /> },
    { name: 'layDown', icon: <LayDown /> },
    { name: 'dining', icon: <Dining /> },
    { name: 'riding', icon: <Riding /> },
    { name: 'driving', icon: <Driving /> },
    { name: 'closedSpace', icon: <ClosedSpace /> },
    { name: 'withFamily', icon: <WithFamily /> },
    { name: 'sleeping', icon: <Sleeping /> },
    { name: 'media', icon: <Media /> },
    { name: 'effort', icon: <Effort /> },
    { name: 'crowded', icon: <Crowded /> },
  ]

  const updateActivity = clicked => async () => {
    if (clicked === activity) {
      console.log(clicked)
      await DataStore.save(
        new Event({
          "name": clicked + "_end",
          "localTime": moment().format(),
          "userName": userName
        })
      );  
      setActivity(null)
    } else if (activity != null) {
      await DataStore.save(
        new Event({
          "name": activity + "_end",
          "localTime": moment().format(),
          "userName": userName
        })
      );  
      await DataStore.save(
        new Event({
          "name": clicked + "_start",
          "localTime": moment().format(),
          "userName": userName
        })
      );  
      setActivity(clicked)
    } else {
      console.log(clicked)
      await DataStore.save(
        new Event({
          "name": clicked + "_start",
          "localTime": moment().format(),
          "userName": userName
        })
      );
      setActivity(clicked)
    }
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
        // display: 'flex',
        flexDirection: 'column',
      },
    },
    majorEvent: theme => ({
      borderRadius: '50%',
      backgroundColor: majorEvent
        ? `${red[500]} !important`
        : `${lightGreen[500]} !important`,
      color: 'white',
      borderColor: 'transparent',
      width: '20vw',
      height: '20vw',
      border: '5px solid white',
      '& > .MuiFab-label': {
        // display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        '& > svg': {
          fontSize: '2.5rem',
          transform: `rotate(${majorEvent ? 45 : 0}deg)`,
          transition: 'transform 0.25s',
        },
      },
    }),
    moderateEvent: theme => ({
      borderRadius: '50%',
      backgroundColor: moderateEvent
        ? `${red[500]} !important`
        : `${lightGreen[500]} !important`,
      color: 'white',
      borderColor: 'transparent',
      width: '15vw',
      height: '15vw',
      border: '5px solid white',
      '& > .MuiFab-label': {
        // display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        '& > svg': {
          fontSize: '2.5rem',
          transform: `rotate(${moderateEvent ? 45 : 0}deg)`,
          transition: 'transform 0.25s',
        },
      },
    }),

    picker: {
      display: 'flex',
      flexWrap: 'wrap',
      fontSize: '1rem',
      position: 'absolute',
      start: {
        right: '0rem',
      },
      finish: {
        left: '0rem',
      },
    },
    input: {
      display: 'flex',
      flexWrap: 'wrap',
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
    activitySection: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-evenly',
      gap: '2rem',
    }
  }

  // async function createEvent() {
  //   console.log(formData)
  //   if (!formData.name || !formData.description) return;
  //   await API.graphql({ query: createEventMutation, variables: { input: formData } });
  //   setEvents([ ...events, formData ]);
  //   setFormData(initialFormState);
  // }

  const classes = useStyles();

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

        <Section title="event" center="true">
          <Fab css={styles.moderateEvent} onClick={toggleModerateEvent}>
            <AddIcon />
          </Fab>
          <Fab css={styles.majorEvent} onClick={toggleMajorEvent}>
            <AddIcon />
          </Fab>
        </Section>

        <Section title="activity">
          {activities.map(({ name, icon }) => (
            <ActivityButton
              key={name}
              {...{ name, icon, activity, updateActivity }}
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

const ActivityButton = ({ name, icon, activity, updateActivity }) => {
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
    caption: {
      fontSize: '1rem',
    },
  }
  return (
    <IconButton
      css={{
        ...styles.iconButton,
      }}
      onClick={updateActivity(name)}
    >
      <div css={name === activity ? styles.selectedActivity : {}}>{icon}</div>
      <div css={styles.caption}>{t(name)}</div>
    </IconButton>
  )
}
