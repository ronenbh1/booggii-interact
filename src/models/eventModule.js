export class EventModule {
    id;
    name;
    startLocalTime;
    endLocalTime;
    userName;

    constructor(id,name,startLocalTime,userName){
        this.startLocalTime=startLocalTime;
        this.id=id;
        this.name=name;
        this.userName= userName
    }
 }