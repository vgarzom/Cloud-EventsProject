import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public messages: any = [];
  show: boolean = true;

  user = {
    password: "",
    email: ""
  }
  constructor(private http: HttpClient, private router: Router) {

  }

  ngOnInit() {
  }

  onLogin() {
    console.log("Trying to login")
    if (this.user.email === "" || this.user.password === "") {
      this.messages = []
      this.messages.push({ type: "warning", text: "No dejes campos en blanco" });
      return
    }
    this.http.post('/api/login', this.user).subscribe(data => {
      if (data["code"] != 200) {
        this.messages = []
        this.messages.push({ type: "danger", text: data["message"] });
      } else {
        this.messages = []
        this.messages.push({ type: "success", text: "Has iniciado sesión correctamente" })
        this.user = {
          password: "",
          email: ""
        }
        console.log(JSON.stringify(data["user"]))
      }
    })
  }

  goToRegister() {
    this.router.navigateByUrl('/register');
  }

}
