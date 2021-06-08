import { useState } from 'react'
import useNotifications from './useNotifications'

import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/core/Alert'

const Snack = () => {
  const [open, setOpen] = useState(false)
  const { message, severity } = useNotifications(setOpen)

  const styles = {
    snackbar: {
      width: '100%',
      justifyContent: 'center',
    },
    alert: {
      minWidth: '50vw',
      direction: 'ltr',
    },
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
  }

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      open={open}
      onClose={handleClose}
      autoHideDuration={5000}
      style={styles.snackbar}
    >
      <Alert
        severity={severity}
        variant="filled"
        onClose={handleClose}
        style={styles.alert}
      >
        {message}
      </Alert>
    </Snackbar>
  )
}

export default Snack
