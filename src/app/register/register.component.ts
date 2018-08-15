import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  public messages: any = [];
  show: boolean = true;

  user = {
    name: "",
    password: "",
    email: ""
  }
  constructor(private http: HttpClient, private router: Router) {

  }

  ngOnInit() {
    if (localStorage.getItem("ontime_user") !== null){
      this.router.navigateByUrl('/events');
    }
  }

  onRegister() {
    console.log("Trying to register")
    this.http.post('/api/register', this.user).subscribe(data => {
      if (data["code"] != 200){
        this.messages = []
        this.messages.push({type:"danger", text: data["message"]});  
      }else {
        this.messages = []
        this.messages.push({type:"success", text: "Has sido registrado existosamente"})
        this.user = {
          name: "",
          password: "",
          email: ""
        }
      }
    })
  }

}
