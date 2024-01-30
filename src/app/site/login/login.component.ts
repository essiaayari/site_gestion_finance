import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  frm!:FormGroup
  constructor(private router:Router,private authservice:AuthService, private fb:FormBuilder){}
      email:string='';
      password:string='';
 
      ngOnInit(): void {    
  
    }
    login(){
      if(this.email==''){
        alert('Please enter your Email');
        return;
      }
      if(this.password==''){
        alert('Please enter your password');
        return;
      }
      this.authservice.login(this.email,this.password);
      this.email='';
      this.password='';
    }
    
}
