import { DataStore, SortDirection } from '@aws-amplify/datastore';
import { Event } from '../models';
import moment from 'moment';

// DataStore.clear();

export const getAllReports = async (userName) => {
  console.log("getAllReports" + userName)
  const reports = await DataStore.query(Event, (c) =>
    c.userName("eq", "ronenbh1@gmail.com"), 
    {
      sort: s => s.startLocalTime(SortDirection.DESCENDING),
    }
  );
  return reports;
}

const getLastActivityByName = async (name, userName) => {
    const lastActivity = await DataStore.query(Event, c =>
      c.name("eq", name).userName("eq", userName), 
      {
        sort: s => s.startLocalTime(SortDirection.DESCENDING),
        limit: 1
      }
    );
    return lastActivity;
  }

export const updateEndLocalTime = async (name, userName) => {
    const lastActivity = await getLastActivityByName(name, userName);
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
