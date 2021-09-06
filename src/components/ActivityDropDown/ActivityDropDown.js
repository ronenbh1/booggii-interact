// // /** @jsxImportSource @emotion/react */

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useState } from 'react'
import useTheme from '../../styling/useTheme'
import Button from '@material-ui/core/Button';

import { listEvents } from '../../graphql/queries';
import { API } from 'aws-amplify';
import { CreateEvent as createEventMutation, DeleteEvent as deleteEventMutation } from '../../graphql/mutations';

import { useDrawer, useLocale, useMode, useUser } from '../../utility/appUtilities'
import Direction from '../../layout/Direction'
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
import useTranslation from '../../i18n/useTranslation'
import lightGreen from '@material-ui/core/colors/lightGreen'
import '../ActivityDropDown/ActivityDropDown.css'


const initialFormState = { name: '', description: '' }

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
    })
}

const sentiments = {
    'verySad': <VerySad />,
    'sad': <Sad />,
    'neutral': <Neutral />,
    'happy': <Happy />,
    'veryHappy': <VeryHappy />,
  }
  
  const activities = {
    'walking': <Walking />,
    'layDown': <LayDown />,
    'dining': <Dining css={styles.iconButton} />,
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
  
  

const ActivityDropDown = (props) => {
    const { direction } = useLocale();
    const t = useTranslation();

    return (props.trigger) ? (
        <Direction locale={direction}>
            <div className="icon_name_container_popup">
                <div>
                    {
                        Object.getOwnPropertyNames(all_icons).map(element => (

                            <div className="acticity_dropDown" onClick={() => { props.trigger.name = element; props.setDropDown(false); }} >
                                <div className="acticity_dropDown_inner">
                                    <div className="icon_name_dropDown">
                                        {all_icons[element]}
                                    </div>
                                    <div className="activity_name_dorpDown">
                                        {t(element)}
                                    </div>
                                </div>
                            </div>


                        ))}
                </div>


            </div>
        </Direction>
    ) : "";
}

export default ActivityDropDown
