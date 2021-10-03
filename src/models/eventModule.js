export class EventModule {
    id;
    name;
    startLocalTime;
    endLocalTime;
    userName;

    constructor(id, name, startLocalTime, endLocalTime, userName){
        this.id=id;
        this.name=name;
        this.startLocalTime=startLocalTime;
        this.endLocalTime=endLocalTime;
        this.userName= userName
    }
 }