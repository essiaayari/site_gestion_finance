import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-changer-mp',
  templateUrl: './changer-mp.component.html',
  styleUrl: './changer-mp.component.css'
})
export class ChangerMpComponent {
  changePasswordForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, {
      validator: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const newPasswordControl = formGroup.get('newPassword');
    const confirmPasswordControl = formGroup.get('confirmPassword');
  
    if (newPasswordControl && confirmPasswordControl) {
      const newPassword = newPasswordControl.value;
      const confirmPassword = confirmPasswordControl.value;
  
      if (newPassword === confirmPassword) {
        return null; // Passwords match
      } else {
        return { mismatch: true }; // Passwords do not match
      }
    } else {
      return null; // If controls are not found, consider them as matching to avoid validation errors
    }
  }

  
  async onSubmit() {
    const oldPasswordControl = this.changePasswordForm.get('oldPassword');
    if (oldPasswordControl) {
      const oldPassword = oldPasswordControl.value;
      if (this.changePasswordForm.valid) {
        const newPassword = this.changePasswordForm.get('newPassword')?.value;
  
        try {
          // Call the AuthService to change the password
          await this.authService.changePassword(oldPassword, newPassword || ''); // Using default value ''
  
          // Handle success (e.g., show a success message, navigate to another page)
          console.log('Password changed successfully');
        } catch (error) {
          // Handle error (e.g., display an error message)
          console.error('Error changing password', error);
        }
      }
    } else {
      console.error('oldPassword control is null.');
    }
  }

}
