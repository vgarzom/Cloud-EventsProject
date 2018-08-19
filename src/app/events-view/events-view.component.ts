import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ClrLoadingState } from '@clr/angular';
import { HostListener } from "@angular/core";
import { Md5 } from 'ts-md5/dist/md5';

@Component({
  selector: 'app-events-view',
  templateUrl: './events-view.component.html',
  styleUrls: ['./events-view.component.css']
})
export class EventsViewComponent implements OnInit {
  public messages: any = [];

  public hashemail;


  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenWidth = window.innerWidth;
  }

  private screenWidth = 0
  private _open = false;
  private _isShowingEventCreation = false;
  private user: any;
  private events: any = [];
  private newEvent: any = { durationType: "m", category: "conference", type: "p", event_date: new Date().toISOString().slice(0, 16) }
  private _selectedEvent: any = null;
  private currentEditingEvent: any = null;
  private isEditingSelectedEvent = false;
  private isDeletingEvent = false;
  private canCreateEvent = false;
  private canUpdateEvent = false;
  editBtnState: ClrLoadingState = ClrLoadingState.DEFAULT;
  deleteBtnState: ClrLoadingState = ClrLoadingState.DEFAULT;
  createBtnState: ClrLoadingState = ClrLoadingState.DEFAULT;

  constructor(private router: Router, private http: HttpClient) {
    this.onResize();
  }

  ngOnInit() {
    this.user = localStorage.getItem("ontime_user")
    if (this.user === null) {
      this.router.navigateByUrl('/');
    } else {
      this.user = JSON.parse(this.user);
      var md5 = new Md5();
      this.hashemail = md5.appendStr(this.user.email).end();
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

  get selectedEvent() {
    return this._selectedEvent;
  }

  set selectedEvent(value: any) {
    this._selectedEvent = value;

    console.log(this._selectedEvent.event_date);

    this.currentEditingEvent = {
      _id: this._selectedEvent._id,
      name: this._selectedEvent.name,
      description: this._selectedEvent.description,
      event_date: new Date(this._selectedEvent.event_date).toISOString().slice(0, 16),
      duration: this._selectedEvent.duration,
      durationType: "m",
      category: this._selectedEvent.category,
      place: this._selectedEvent.place,
      type: this._selectedEvent.type
    }

    if (this.currentEditingEvent.duration > 60) {
      this.currentEditingEvent.duration = this._selectedEvent.duration / 60;
      this.currentEditingEvent.durationType = "h"
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
      this.newEvent = { durationType: "m", category: "conference", type: "p", event_date: new Date().toISOString().slice(0, 16) }
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
    this.createBtnState = ClrLoadingState.LOADING;
    if (this.newEvent.durationType === "h") {
      this.newEvent.duration = this.newEvent.duration * 60;
      this.newEvent.durationType = "m";
    }
    this.newEvent.user_id = this.user._id;
    this.newEvent.event_date = this.newEvent.event_date + ":00.000Z";
    console.log(this.newEvent.event_date)
    this.http.post('api/event', this.newEvent).subscribe(data => {
      if (data["code"] != 200) {
        this.createBtnState = ClrLoadingState.ERROR;
        alert(data["message"])
        this.messages.push({ type: "danger", text: data["message"] });

      } else {
        this.messages.push({ type: "success", text: "El evento \"" + this.newEvent.name + "\" fue creado exitosamente" });
        this.createBtnState = ClrLoadingState.SUCCESS;
        this.events.unshift(data["event"])
        this.canCreateEvent = false;
        this.isShowingEventCreation = false;
      }
    })
  }

  public validateEvent(event: any) {
    if (event.name !== undefined && event.name !== null && event.name !== "" &&
      event.description !== undefined && event.description !== null && event.description !== "" &&
      event.event_date !== undefined && event.event_date !== null && event.event_date !== "" &&
      event.duration !== undefined && event.duration !== null && event.duration !== "" &&
      event.place !== undefined && event.place !== null && event.place !== "") {

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
      durationType: this.selectedEvent.durationType,
      category: this.selectedEvent.category,
      place: this.selectedEvent.place,
      type: this.selectedEvent.type
    }
  }

  public onEditEvent() {
    this.editBtnState = ClrLoadingState.LOADING;

    if (this.currentEditingEvent.durationType === "h") {
      this.currentEditingEvent.duration = this.currentEditingEvent.duration * 60;
      this.currentEditingEvent.durationType = "m";
    }
    this.currentEditingEvent.user_id = this.user._id;
    this.currentEditingEvent.event_date = this.currentEditingEvent.event_date + ":00.000Z";

    this.http.put('api/event/' + this.currentEditingEvent._id, this.currentEditingEvent).subscribe(data => {

      if (data["code"] != 200) {
        alert(data["message"])
        this.messages.push({ type: "danger", text: data["message"] });
        this.editBtnState = ClrLoadingState.ERROR;
      } else {

        this.messages.push({ type: "success", text: "El evento \"" + this.selectedEvent.name + "\" fue actualizado exitosamente" });
        this.editBtnState = ClrLoadingState.SUCCESS;
        this.selectedEvent.name = this.currentEditingEvent.name;
        this.selectedEvent.description = this.currentEditingEvent.description;
        this.selectedEvent.event_date = this.currentEditingEvent.event_date;
        this.selectedEvent.duration = this.currentEditingEvent.duration;

        this.selectedEvent.category = this.currentEditingEvent.category,
          this.selectedEvent.place = this.currentEditingEvent.place,
          this.selectedEvent.type = this.currentEditingEvent.type
        this.isEditingSelectedEvent = false;
      }


      this.currentEditingEvent.event_date = this.currentEditingEvent.event_date.slice(0, 16);
    })
  }

  public onDeleteEvent() {
    this.http.delete('api/event/' + this.selectedEvent._id, this.selectedEvent).subscribe(data => {
      if (data["code"] != 200) {
        alert(data["message"]);
        this.messages.push({ type: "danger", text: data["message"] });
        this.deleteBtnState = ClrLoadingState.ERROR;
      } else {
        this.messages.push({ type: "success", text: "El evento \"" + this.selectedEvent.name + "\" fue eliminado exitosamente" });
        this.deleteBtnState = ClrLoadingState.SUCCESS;
        this.events.splice(this.events.indexOf(this._selectedEvent), 1);
        this.isDeletingEvent = false;
        this._selectedEvent = null;
      }
    })
  }

  public deSelectEvent() {
    this._selectedEvent = null;
  }

  get mustShowTable() {
    if (this.screenWidth < 1200 && this.selectedEvent != null) {
      return false;
    } else {
      return true;
    }
  }
}
