/** @jsxImportSource @emotion/react */
import Page from '../layout/Page'
import { useState, useRef, useEffect, useContext } from 'react'

import { listEvents } from '../graphql/queries';
import { API } from 'aws-amplify';
import { CreateEvent as createEventMutation, DeleteEvent as deleteEventMutation } from '../graphql/mutations';

const styles = {
  root: theme => ({}),
}

const initialFormState = { name: '', description: '' }

const Dashboard = () => {

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
    <Page name="dashboard" css={styles.root}>
      <input
        onChange={e => setFormData({ ...formData, 'name': e.target.value})}
        placeholder="Event name"
        value={formData.name}
      />
      <input
        onChange={e => setFormData({ ...formData, 'description': e.target.value})}
        placeholder="Event description"
        value={formData.description}
      />
      <button>Create Event</button>
      <div style={{marginBottom: 30}}>
        {
          events.map(event => (
            <div key={event.id || event.name}>
              <h2>{event.name}</h2>
              <p>{event.description}</p>
              <button>Delete event</button>
            </div>
          ))
        }
      </div>
    </Page>
  )
}

export default Dashboard
