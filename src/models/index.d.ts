import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





type EventMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Event {
  readonly id: string;
  readonly name: string;
  readonly startLocalTime: string;
  readonly endLocalTime?: string;
  readonly userName: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Event, EventMetaData>);
  static copyOf(source: Event, mutator: (draft: MutableModel<Event, EventMetaData>) => MutableModel<Event, EventMetaData> | void): Event;
}