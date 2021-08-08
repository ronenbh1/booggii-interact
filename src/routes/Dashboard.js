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


const initialFormState = { name: '', description: '' }


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: 752,
  },
  demo: {
    textAlignLast: 'start',
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
}));

function generate(events, element) {
  return events.map(event => 
    React.cloneElement(element, {
      title: event.name,
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
                <Typography variant="h6" className={classes.title}>
                  Avatar with text and icon
                </Typography>
                <div className={classes.demo}>
                  <List dense={dense}>
                    {events.map(event => (
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar>
                            <FolderIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={t(event.name)}
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
