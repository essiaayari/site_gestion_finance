import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent {
email:string='';


  constructor(private auth:AuthService){}



  forgotpassword(){
    this.auth.forgotPassword(this.email);
    this.email='';
  }
}
