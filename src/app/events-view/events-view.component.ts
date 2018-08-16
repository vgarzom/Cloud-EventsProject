import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-events-view',
  templateUrl: './events-view.component.html',
  styleUrls: ['./events-view.component.css']
})
export class EventsViewComponent implements OnInit {
  private _open = false;
  private _isShowingEventCreation = false;
  private user: any;
  private events: any = [];
  private newEvent: any = { durationType: "m" }
  private canCreateEvent = false

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.user = localStorage.getItem("ontime_user")
    if (this.user === null) {
      this.router.navigateByUrl('/');
    } else {
      this.user = JSON.parse(this.user)
      this.getAllEvents();
    }
  }

  get open() {
    return this._open;
  }

  set open(value: boolean) {
    this._open = value;
    if (!value) {
      // Put your cleanup code here
      console.log("Cleaning up");
    }
  }

  get isShowingEventCreation() {
    return this._isShowingEventCreation;
  }

  set isShowingEventCreation(value: boolean) {
    this._isShowingEventCreation = value;
    if (!value) {
      // Put your cleanup code here
      console.log("Cleaning up");
      this.newEvent = { durationType: "m" }
    }
  }

  onLogOut() {
    this._open = false;
    localStorage.removeItem("ontime_user")
    this.router.navigateByUrl('/login');
  }

  private getAllEvents() {
    this.http.get('/api/event/byuser/' + this.user["_id"], this.user).subscribe(data => {
      if (data["code"] != 200) {
      } else {
        this.events = data["events"]
      }
    })
  }

  public onCreateEvent() {
    if (this.newEvent.durationType === "h") {
      this.newEvent.duration = this.newEvent.duration * 60;
      this.newEvent.durationType = "m";
    }
    this.newEvent.user_id = this.user._id;

    console.log(JSON.stringify(this.newEvent))
    this.http.post('api/event', this.newEvent).subscribe(data => {
      if (data["code"] != 200){
        alert(data["message"])
      }else {
        this.events.push(data["event"])
        this.canCreateEvent = false;
        this.isShowingEventCreation = false;
      }
    })
  }

  public validateEventCreation() {
    if (this.newEvent.name !== undefined && this.newEvent.name !== null && this.newEvent.name !== "" &&
      this.newEvent.description !== undefined && this.newEvent.description !== null && this.newEvent.description !== "" &&
      this.newEvent.event_date !== undefined && this.newEvent.event_date !== null && this.newEvent.event_date !== "" &&
      this.newEvent.duration !== undefined && this.newEvent.duration !== null && this.newEvent.duration !== "") {

      this.canCreateEvent = true;
    } else {
      this.canCreateEvent = false;
    }
  }
}
