import { Component } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  ngOnInit(): void {
    


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
