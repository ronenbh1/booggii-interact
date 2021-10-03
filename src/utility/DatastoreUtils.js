import { DataStore, SortDirection } from '@aws-amplify/datastore';
import { Event, EventModule } from '../models';
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

const getActivityById = async (id, userName) =>{
  const Activity = await DataStore.query(Event, c =>
    c.id("eq", id).userName("eq", userName));
  return Activity;
}

export const updateEndLocalTime = async (name, userName) => {
    const lastActivity = await getLastActivityByName(name, userName);
    await DataStore.save(
        Event.copyOf(lastActivity[0], updated => {
        updated.endLocalTime = moment().format();
    }));
}

export const updateActivity = async (name, userName) => {
  const lastActivity = await getLastActivityByName(name, userName);
  await DataStore.save(
      Event.copyOf(lastActivity[0], updated => {
      updated.endLocalTime = moment().format();
  }));
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

export const updateReport = async (updatedActivity) =>{
  const activity = await getActivityById(updatedActivity.id, updatedActivity.userName);
  console.log("updateReport", activity[0]);
  await DataStore.save(
    Event.copyOf(activity[0], updated => {
    updated.name = updatedActivity.name;
    updated.startLocalTime = updatedActivity.startLocalTime;
    updated.endLocalTime = updatedActivity.endLocalTime;
}));
}

export const createReportRetro = async (updatedActivity) =>{
  await DataStore.save(
    new Event({
    "name": updatedActivity.name,
    "startLocalTime": updatedActivity.startLocalTime,
    "endLocalTime": updatedActivity.endLocalTime,
    "userName": updatedActivity.userName
    })
);
}
