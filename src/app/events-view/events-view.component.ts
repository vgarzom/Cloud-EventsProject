import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ClrLoadingState } from '@clr/angular';

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
  private _selectedEvent : any = null;
  private currentEditingEvent : any = null;
  private isEditingSelectedEvent = false;
  private isDeletingEvent = false;
  private canCreateEvent = false;
  private canUpdateEvent = false;
  editBtnState: ClrLoadingState = ClrLoadingState.DEFAULT;
  deleteBtnState: ClrLoadingState = ClrLoadingState.DEFAULT;

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

  get selectedEvent(){
    return this._selectedEvent;
  }

  set selectedEvent(value : any){
    this._selectedEvent = value;
    this._selectedEvent.durationType = "m"

    this._selectedEvent.event_date = new Date(this._selectedEvent.event_date);
    console.log(this._selectedEvent.event_date);
    
    if (this._selectedEvent.duration > 60){
      this._selectedEvent.durationType = "h"
      this._selectedEvent.duration = this._selectedEvent.duration / 60;
    }

    this.currentEditingEvent = {
      _id: this.selectedEvent._id,
      name: this.selectedEvent.name,
      description: this.selectedEvent.description,
      event_date: this.selectedEvent.event_date,
      duration: this.selectedEvent.duration,
      durationType: this.selectedEvent.durationType
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

    console.log(typeof(this.newEvent.event_date))
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

  public validateEvent(event:any) {
    if (event.name !== undefined && event.name !== null && event.name !== "" &&
      event.description !== undefined && event.description !== null && event.description !== "" &&
      event.event_date !== undefined && event.event_date !== null && event.event_date !== "" &&
      event.duration !== undefined && event.duration !== null && event.duration !== "") {

      return true;
    } else {
      return false;
    }
  }

  public cancelEdition() {
    this.isEditingSelectedEvent = false;
    this.currentEditingEvent = {
      _id: this.selectedEvent._id,
      name: this.selectedEvent.name,
      description: this.selectedEvent.description,
      event_date: this.selectedEvent.event_date,
      duration: this.selectedEvent.duration,
      durationType: this.selectedEvent.durationType
    }
  }

  public onEditEvent(){
    this.editBtnState = ClrLoadingState.LOADING;

    if (this.currentEditingEvent.durationType === "h") {
      this.currentEditingEvent.duration = this.currentEditingEvent.duration * 60;
      this.currentEditingEvent.durationType = "m";
    }
    this.currentEditingEvent.user_id = this.user._id;

    this.http.put('api/event/'+this.currentEditingEvent._id, this.currentEditingEvent).subscribe(data => {
      if (data["code"] != 200){
        alert(data["message"])
        this.editBtnState = ClrLoadingState.ERROR;
      }else {
        this.editBtnState = ClrLoadingState.SUCCESS;
        this.selectedEvent.name = this.currentEditingEvent.name;
        this.selectedEvent.description = this.currentEditingEvent.description;
        this.selectedEvent.event_date = this.currentEditingEvent.event_date;
        this.selectedEvent.duration = this.currentEditingEvent.duration;
      }
    })
  }

  public onDeleteEvent(){
    this.http.delete('api/event/'+this.selectedEvent._id, this.selectedEvent).subscribe(data => {
      if (data["code"] != 200){
        alert(data["message"]);
        this.deleteBtnState = ClrLoadingState.ERROR;
      }else {
        this.deleteBtnState = ClrLoadingState.SUCCESS;
        this.events.splice(this.events.indexOf(this._selectedEvent), 1);
        this.isDeletingEvent = false;
        this._selectedEvent = null;
      }
    })
  }
}
