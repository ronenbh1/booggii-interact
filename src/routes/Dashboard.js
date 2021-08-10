// // /** @jsxImportSource @emotion/react */

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';
import TextField from '@material-ui/core/TextField';

import Page from '../layout/Page'
import { useState, useRef, useEffect, useContext } from 'react'
import useTheme from '../styling/useTheme'

import { listEvents } from '../graphql/queries';
import { API } from 'aws-amplify';
import { CreateEvent as createEventMutation, DeleteEvent as deleteEventMutation } from '../graphql/mutations';

import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline'

import { useDrawer, useLocale, useMode, useUser } from '../utility/appUtilities'
import Direction from '../layout/Direction'

import useTranslation from '../i18n/useTranslation'

import VerySad from '@material-ui/icons/SentimentVeryDissatisfied'
import Sad from '@material-ui/icons/SentimentDissatisfied'
import Neutral from '@material-ui/icons/SentimentNeutral'
import Happy from '@material-ui/icons/SentimentSatisfiedAlt'
import VeryHappy from '@material-ui/icons/SentimentVerySatisfied'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'

import Walking from '@material-ui/icons/DirectionsWalk'
import Riding from '@material-ui/icons/BedroomBaby'
import Dining from '@material-ui/icons/Fastfood'
import Sleeping from '@material-ui/icons/Hotel'
import Driving from '@material-ui/icons/DirectionsCarFilled'
import WithFamily from '@material-ui/icons/FamilyRestroom'
import Media from '@material-ui/icons/Theaters'
import LayDown from '@material-ui/icons/AirlineSeatFlatAngled'
import ClosedSpace from '@material-ui/icons/DisabledByDefault'
import Effort from '@material-ui/icons/FitnessCenter'
import Crowded from '@material-ui/icons/Groups'
import lightGreen from '@material-ui/core/colors/lightGreen'
import red from '@material-ui/core/colors/red'

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
    backgroundColor: `${lightGreen[500]} !important`,
    color: 'white',
    borderColor: 'transparent',
    width: '6vw',
    height: '6vw',
    // border: '5px solid white',
    '& > .MuiFab-label': {
      // display: 'flex',
      justifyContent: 'start',
      alignItems: 'start',
      '& > svg': {
        fontSize: '2.5rem',
        // transform: `rotate(${majorEvent ? 45 : 0}deg)`,
        transition: 'transform 0.25s',
      },
    },
  }),
  moderateEvent: theme => ({
    borderRadius: '50%',
    backgroundColor: `${lightGreen[500]} !important`,
    color: 'white',
    borderColor: 'transparent',
    width: '10vw',
    height: '10vw',
    border: '5px solid white',
    '& > .MuiFab-label': {
      // display: 'flex',
      justifyContent: 'start',
      alignItems: 'start',
      '& > svg': {
        fontSize: '2.5rem',
        // transform: `rotate(${moderateEvent ? 45 : 0}deg)`,
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

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: 752,
    justifyContent: 'space-between',
  },
  demo: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    textAlignLast: 'start',
    backgroundColor: theme.palette.background.paper,
    // justifyContent: 'space-evenly',
    gap: '5rem'
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
}));

const initialFormState = { name: '', description: '' }

const sentiments = {
  'verySad':<VerySad /> ,
  'sad': <Sad /> ,
  'neutral': <Neutral />,
  'happy': <Happy />,
  'veryHappy': <VeryHappy />,
}

const activities = {
  'walking': <Walking />,
  'layDown': <LayDown />,
  'dining': <Dining css={styles.iconButton}/>,
  'riding': <Riding />,
  'driving': <Driving />,
  'closedSpace': <ClosedSpace />,
  'withFamily': <WithFamily />,
  'sleeping': <Sleeping />,
  'media': <Media />,
  'effort': <Effort />,
  'crowded': <Crowded />,
}

const eventIcons = {
  "moderateEvent": <AddIcon css={styles.moderateEvent} />,
  "majorEvent": <AddIcon css={styles.majorEvent} />
}

const all_icons = Object.assign({}, sentiments, activities, eventIcons)


function generate(events, element) {
  return events.map(event => 
    React.cloneElement(event, {
      key: event.id,
      title: event.name,
      icon: all_icons[event.name]
    }),
  );
}

const Dashboard = () => {

// export default function InteractiveList() {
  const classes = useStyles();
  const [dense, setDense] = useState(false);
  const [secondary, setSecondary] = useState(false);
  const theme = useTheme()
  const { mode, light } = useMode()
  const { direction } = useLocale()
  const t = useTranslation()

  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    const apiData = await API.graphql({ query: listEvents });
    setEvents(apiData.data.listEvents.items);
  }

  return (
    <Page name="dashboard" className={classes.root}>
      <Direction locale={direction}>
        <ThemeProvider theme={theme}>
        <CssBaseline />
          <div className={classes.root} dir={direction} >
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Fab color="primary" aria-label="add" className={classes.demo}>
                  <AddIcon />
                </Fab>
                <div className={classes.demo}>
                  <List dense={dense}>
                    {events.map(event => (
                      <ListItem key={event.id}>
                        <ListItemAvatar>
                          {all_icons[event.name]}
                        </ListItemAvatar>
                        <ListItemText
                          primary={t(event.name)}
                        />
                        <TextField
                          label="Start"
                          type="datetime-local"
                          defaultValue={event.startLocalTime.slice(0, -6)}
                          className={classes.textField}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                        <TextField
                          label="End"
                          type="datetime-local"
                          defaultValue={event.endLocalTime == null ? null : event.endLocalTime.slice(0, -6)}
                          className={classes.textField}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                        <IconButton edge="end" aria-label="delete">
                          <DeleteIcon />
                        </IconButton>
                      </ListItem>
                    ))}
                  </List>
                </div>
              </Grid>
            </Grid>
          </div>
        </ThemeProvider>
      </Direction>
    </Page>
  );
}

export default Dashboard
