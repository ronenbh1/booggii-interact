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

import useTranslation from '../../i18n/useTranslation'
import '../Popup/Popup.css'

const initialFormState = { name: '', description: '' }




const DashboardPopup = (props) => {
  const { direction } = useLocale();
  const t = useTranslation();

  return (props.trigger)?(
    <Direction locale={direction}>
    <div className="popup">
      <div className="popup_inner">
        <div>
          {props.children}
      
        </div>
        <div className="buttons_container">
       <Button className="buttons" variant="contained" onClick={()=>{props.onClose();}}> {t('close')}</Button>
       <Button className="buttons" variant="contained" onClick={()=>{console.log("onpopupSave:", props); props.onSave(props.trigger);}}> {t('confirm')}</Button>
          </div>
      </div>
    </div>
    </Direction>
  ): "";
}

export default DashboardPopup
