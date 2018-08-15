import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-events-view',
  templateUrl: './events-view.component.html',
  styleUrls: ['./events-view.component.css']
})
export class EventsViewComponent implements OnInit {
  private _open = false;

  constructor(private router: Router) { }

  ngOnInit() {
    if (localStorage.getItem("ontime_user") === null){
      this.router.navigateByUrl('/');
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

}
