import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userName: string | null = null;

  constructor(
    private fireauth: AngularFireAuth,
    private router: Router,
    private afs: AngularFirestore,
  ) {}

  isAuthenticated(): boolean {
    return localStorage.getItem('token') === 'true' && this.fireauth.currentUser !== null;
  }

  async setUserRole(uid: string, role: string, name: string): Promise<void> {
    // Use set with merge: true to add or update the role and name fields for the user
    await this.afs.collection('users').doc(uid).set({ role, name }, { merge: true });
  }

  async getUserRole(uid: string): Promise<string | null> {
    try {
      const docSnapshot = await this.afs.collection('users').doc(uid).get().toPromise();

      if (docSnapshot && docSnapshot.exists) {
        const data = docSnapshot.data() as { role?: string };
        return data?.role || null;
      } else {
        console.error(`User with UID ${uid} not found in 'users' collection.`);
        return null;
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      return null;
    }
  }

  async getCurrentUserId(): Promise<string | null> {
    const user = await this.fireauth.currentUser;
    return user ? user.uid : null;
  }

  getUserName(): string | null {
    return this.userName;
  }

  private async getUserNameFromResponse(res: any): Promise<string | null> {
    const uid = res.user?.uid;

    if (uid) {
      const userDoc = await this.afs.collection('users').doc(uid).get().toPromise();

      if (userDoc && userDoc.exists) {
        const data = userDoc.data() as { name?: string }; // Assuming 'nom' is the field for the user's name
        return data?.name || null;
      } else {
        console.error(`User with UID ${uid} not found in 'users' collection.`);
        return null;
      }
    } else {
      console.error('User UID not available in the response.');
      return null;
    }
  }


  private userNameSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  userName$: Observable<string | null> = this.userNameSubject.asObservable();


  async login(email: string, password: string): Promise<void> {
    try {
      const res = await this.fireauth.signInWithEmailAndPassword(email, password);
      localStorage.setItem('token', 'true');
      const uid = res.user?.uid;

      if (uid) {
        // Assuming you have a method to get the user's name from the login response
        const name = await this.getUserNameFromResponse(res);

        if (name) {
          await this.setUserRole(uid, 'admin', name);
          this.userNameSubject.next(name); // Set the user's name in the AuthService
        }
      }

      this.router.navigate(['/dashboard']);
    } catch (err) {
      alert('Invalid Email or Password');
      this.router.navigate(['/login']);
    }
  }

  getUserNameObservable(): Observable<string | null> {
    return this.userNameSubject.asObservable();
  }

  logout(): void {
    this.fireauth.signOut().then(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      this.router.navigate(['/login']);
    }).catch((err) => {
      alert(err.message);
    });
  }

  async forgotPassword(email: string): Promise<void> {
    await this.fireauth.sendPasswordResetEmail(email);
    this.router.navigate(['/verify_mail']);
  }

  async sendEmailVerification(user: any): Promise<void> {
    await user.sendEmailVerification();
    this.router.navigate(['/verify_mail']);
  }




  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    try {
      const user = await this.fireauth.currentUser;
  
      if (user) {
        // Re-authenticate the user with their current password before changing it
        const credential = await this.fireauth.signInWithEmailAndPassword(user.email || '', oldPassword);
  
        // Change the password
        await user.updatePassword(newPassword);
  
        // Display a success message or handle it accordingly
        console.log('Password changed successfully');
      } else {
        console.error('User not authenticated.');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      throw error; // Rethrow the error for further handling if needed
    }
  }
}
