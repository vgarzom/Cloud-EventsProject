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
  private user: any;
  private events : any = [];

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
    return this._open
  }

  set open(value: boolean) {
    this._open = value;
    if (!value) {
      // Put your cleanup code here
      console.log("Cleaning up");
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

}
