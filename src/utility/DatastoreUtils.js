import { DataStore, SortDirection } from '@aws-amplify/datastore';
import { Event } from '../models';
import moment from 'moment';

// DataStore.clear();

const getLastActivityByName = async (name) => {
    const lastActivity = await DataStore.query(Event, c =>
      c.name("eq", name), 
      {
        sort: s => s.startLocalTime(SortDirection.DESCENDING),
        limit: 1
      }
    );
    return lastActivity;
  }

export const updateEndLocalTime = async (name) => {
    const lastActivity = await getLastActivityByName(name);
    await DataStore.save(
        Event.copyOf(lastActivity[0], updated => {
        updated.endLocalTime = moment().format();
    }));
    DataStore.delete(lastActivity[0]);
}

export const createNewReport = async (clicked, userName) => {
    await DataStore.save(
        new Event({
        "name": clicked,
        "startLocalTime": moment().format(),
        "userName": userName
        })
    );
}
