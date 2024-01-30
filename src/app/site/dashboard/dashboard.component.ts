import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
constructor(private auth:AuthService){}

logout(){
  this.auth.logout();
}

isDropdownOpen = false;

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  userName: string | null = null;

  ngOnInit(): void {
    this.auth.getUserNameObservable().subscribe((name: string | null) => {
      this.userName = name;
      console.log('User Name Updated:', this.userName);
    });

    let arrows = document.querySelectorAll(".arrow");
    arrows.forEach(arrow => {
      arrow.addEventListener("click", (e) => {
        let arrowParent = (e.target as HTMLElement)?.parentElement?.parentElement;
        if (arrowParent) {
          arrowParent.classList.toggle("showMenu");
        }
      });
    });
  
    let sidebarBtn = document.querySelector(".bx-menu");
    let sidebar = document.querySelector(".sidebar");
  
    if (sidebarBtn) {
      sidebarBtn.addEventListener("click", () => {
        if (sidebar) {
          sidebar.classList.toggle("close");
        }
      });
    }
  }


}
