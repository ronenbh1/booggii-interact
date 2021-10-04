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
import CreateIcon from '@material-ui/icons/Create';
import TextField from '@material-ui/core/TextField';

import Page from '../layout/Page'
import { useState, useRef, useEffect, useContext } from 'react'
import useTheme from '../styling/useTheme'

import { listEvents } from '../graphql/queries';
import { API, ModelInit } from 'aws-amplify';
import { CreateEvent as createEventMutation, DeleteEvent as deleteEventMutation } from '../graphql/mutations';

import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline'

import { useDrawer, useLocale, useMode, useUser } from '../utility/appUtilities'
import Direction from '../layout/Direction'

import useTranslation from '../i18n/useTranslation'

import DashboardPopup from '../components/Popup/Popup';
import ActivityDropDown from '../components/ActivityDropDown/ActivityDropDown';
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import { sentiments, activities } from '../utility/ReportTypes'

import lightGreen from '@material-ui/core/colors/lightGreen'
import red from '@material-ui/core/colors/red'
import '../routes/DashbordStyle.css'
import moment from 'moment';
import amber from '@material-ui/core/colors/amber'
import { Auth } from 'aws-amplify';
import {updateReport,createReportRetro} from '../utility/DatastoreUtils';
import { DataStore, SortDirection } from '@aws-amplify/datastore';
import { Event } from '../models';
import {EventModule} from '../models/eventModule';
import { Refresh } from '@material-ui/icons';

const translate = {
  startTime: "startTime",
  endTime: "startTime",
  chooseActivityOrSentiment: 'chooseActivityOrSentiment'
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
	  backgroundColor: `${red[500]} !important`,
    color: 'white',
    borderColor: 'transparent',				 
    border: '5px solid red',
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
  interventionNedded: theme => ({
    borderRadius: '50%',
    backgroundColor: `${amber[500]} !important`,
    color: 'white',
    borderColor: 'transparent',
    border: '5px solid gold',
    '& > .MuiFab-label': {
      // display: 'flex',
      justifyContent: 'start',
      alignItems: 'start',
      '& > svg': {
        fontSize: '2.5rem',
        // transform: `rotate(${interventionNedded ? 45 : 0}deg)`,
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

const initialFormState = { name: '', description: '' }

const eventIcons = {
  "interventionNedded": <AddIcon css={styles.interventionNedded} />,
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
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,

    justifyContent: 'space-between',
  },
  demo: {
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
  event_element_block: {
    'padding-right': '2vw',
    'width': '98vw',
    'border-bottom': '1px solid gray',
    'padding-bottom': '1vh'
  },
  event_Popup_element_block: {
    'padding-right': '2vw',
    'width': '98vw',
    'padding-bottom': '1vh'
  },
  icon_name_container: {
    'display': 'inline-block',
    'width': 'fit-content'
  },
  icon_name_container_popup: {
    'width': '76vw',
    'display': 'flex',
    'position': 'fixed',
    'background-color': 'white',
    'z-index': '2'
  },
  icon_name_dropDown: {
    'display': 'inline-block',
    'width': '10vw'
  },
  activity_icon: {
    'display': 'inline-block',
    'margin-top': '4vh',
    'vertical-align': 'middle',
    'width': '10vw'
  },
  activity_name: {
    'display': 'inline-block',
    'margin-top': '4vh',
    'vertical-align': 'middle',
    'width': '13vw'
  },
  activity_name_dorpDown: {
    'display': 'inline-block',
    'margin-top': '-1.5vh',
    'vertical-align': 'middle'
  },
  text_field_container: {
    'display': 'inline-block',
    'margin-right': '1vw',
    'margin-left': '1vw',
    'width':'31vw'
  },
  textField: {
    width: "31vw"
  },
  textField_popup: {
    width: "79vw"
  },
  icons_container: {
    'display': 'inline-flex',
    'vertical-align': 'sub',
    'align-items': 'center',
    'justifyContent': 'space-evenly',
    'columnGap': '5vw'
  },
  popup: {
    'position': 'fixed',
    'top': '0',
    'left': '0',
    'width': '100%',
    'height': '100vh',
    'background-color': 'rgba(0,0,0,0.2)',
    'display': 'flex',
    'justify-content': 'center',
    'align-items': 'center',
    'z-index': '1'
  },
  popup_inner: {
    'position': 'relative',
    'padding': '23px',
    'width': '100%',
    'max-width': '91vw',
    'background-color': '#fff',

  },
  text_field_container_popup: {
    'border': '1px'
  },
  'acticity_dropDown': {
    'float': 'right',
    'width': '50%',
    'height': '5vh',
    'border': '1px solid gray',
  },
  'acticity_dropDown_inner': {
    'width': "76vw",
    'margin-top': '1vh'
  },
  'acticity_dropDown:hover': {
    'backgroundColor': 'rgba(0,0,0,0.2)'
  },
  'acticity_dropDown:nth-child(odd)': {
    'margin-left': '2vw',
    'width': '50%',
    'margin-top': '1vh',
    'border': '1px solid gray'
  },
  'dropDown_closed': {
    'Visibility': 'hidden'
  }
}));
const Dashboard = () => {


  // export default function InteractiveList() {
  const classes = useStyles();
  const [dense, setDense] = useState(false);
  const [secondary, setSecondary] = useState(false);

  const [aa, setaa] = useState(false);
  const [bb, setbb] = useState(false);
  const [popup, setpopup] = useState(false);
  const [dropDown, setdropDown] = useState(false);
  const theme = useTheme()
  const { mode, light } = useMode()
  const { direction } = useLocale()
  const t = useTranslation()

  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  const [userName, setUserName] = useState("");
  const [updateEvents, setUpdateEvents] = useState(false);


  async function fetchEvents() {
    let username = await Auth.currentAuthenticatedUser()
    .then(user => {
        return user.getUsername();
      })
  
    setUserName(username)
    console.log("userName", userName);
    const reports = await DataStore.query(Event, (c) =>
      c.userName("eq", username), 
      {
        sort: s => s.startLocalTime(SortDirection.DESCENDING),
      }
    );
    console.log("reports", reports);
    setEvents(reports);
  }

  useEffect(() => {
    fetchEvents();
  }, [userName, updateEvents]);

  async function onSave(event) {
    setdropDown(false);
    if(popup.id){
      updateReport(popup);
      console.log("onUpdate:", popup);
    }
    else{
      createReportRetro(popup);
      console.log("onCreation:", popup);
    }
    setpopup(false);
    await new Promise(r => setTimeout(r,1000));
    setUpdateEvents(!updateEvents);
    console.log("setUpdateEvents:", updateEvents);
  }

  function onClose() {
    setdropDown(false);
    setpopup(false);
    console.log("onClose:", popup);
  }


  function onDelete(event) {
    console.log("onDelete:", event);
    DataStore.delete(event);
    setUpdateEvents(!updateEvents);
  }

  return (
    <Page name="dashboard" className={classes.root}>
      <Direction locale={direction}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className={classes.root} dir={direction} >
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Fab color="primary" variant="extended" size="medium" aria-label="add" onClick={() => {let newEvent = new EventModule(); newEvent.userName = userName; setpopup(newEvent);}}>
                  <AddIcon />
                  {t('addReport')}
                </Fab>
                <div className={classes.demo}>

                  {events.map(event => (
                    <div key={event.id} className={classes.event_element_block}>
                      <div className={classes.icon_name_container}>
                        <div className={classes.activity_icon}>
                          {event.name ? all_icons[event.name] : ""}
                        </div>
                        {/* <div className={classes.activity_name}>
                          {event.name ? t(event.name) : ""}
                        </div> */}
                      </div>
                      <div className={classes.text_field_container}>
                        <div className="date_display">
                        <div> {t('startTime')}</div>
                          {event.startLocalTime ? moment(event.startLocalTime).format('DD/MM/YY hh:mm') : '--/--/-- --:--'}
                        </div>

                      </div>
                      <div className={classes.text_field_container}>
                        <div className="date_display">
                          <div> {t('endTime')}</div>
                          {event.endLocalTime ? moment(event.endLocalTime).format('DD/MM/YY hh:mm') : '--/--/-- --:--'}
                        </div>
                      </div>
                      <div className={classes.icons_container}>
                        <div onClick={() => { console.log(popup); setpopup(new EventModule(event.id,event.name, event.startLocalTime, event.endLocalTime, event.userName) ) }}>
                          <IconButton edge="end" aria-label="create">
                            <CreateIcon />
                          </IconButton>
                        </div>
                        <div onClick={() => { onDelete(event); }}>
                          <IconButton edge="end" aria-label="delete">
                            <DeleteIcon />
                          </IconButton>
                        </div>
                      </div>
                    </div>

                  ))}
                  <DashboardPopup trigger={popup} onClose={onClose} onSave={(popup) => { console.log("onSave:", popup); onSave(popup);}}>
                    <div name={popup.userName} className={classes.event_Popup_element_block}>
                      <div>{t('chooseActivityOrSentiment')}</div>

                      <div className={classes.icon_name_container_popup}>

                        <div onClick={(event) => { setdropDown(popup); event.stopPropagation() }}>
                          <div className={classes['acticity_dropDown']}>
                            <div className={classes.acticity_dropDown_inner}>
                              <div className={classes.icon_name_dropDown}>
                                {popup.name ? all_icons[popup.name] : all_icons["veryHappy"]}

                              </div>
                              <div className={classes.activity_name_dorpDown}>
                                {popup.name ? t(popup.name) : t("veryHappy")}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {dropDown ?
                        <ActivityDropDown trigger={dropDown} setDropDown={setdropDown} />
                        : ""}
                      <div className="dropDown_date_area_container">
                        <div>
                          <div>
                            {t('startTime')}
                          </div>
                          <TextField
                            label="Start"
                            type="datetime-local"
                            defaultValue={popup.startLocalTime ? moment(popup.startLocalTime).format("YYYY-MM-DDThh:mm") : ""}
                            className={classes.textField_popup}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            onChange={(event) => { console.log("onChange:", popup); popup.startLocalTime = moment(event.target.value).format();}}
                          />
                        </div>
                        <div>
                          <div>
                            {t('endTime')}
                          </div>
                          <TextField
                            label="End"
                            type="datetime-local"
                            defaultValue={popup.endLocalTime ? moment(popup.endLocalTime).format("YYYY-MM-DDThh:mm") : ""}
                            className={classes.textField_popup}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            onChange={(event) => { console.log("onChange:", popup); popup.endLocalTime = moment(event.target.value).format();}}
                          />
                        </div>
                      </div>
                    </div>
                  </DashboardPopup>
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
