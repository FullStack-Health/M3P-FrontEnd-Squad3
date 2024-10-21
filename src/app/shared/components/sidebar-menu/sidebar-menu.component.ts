import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar-menu',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './sidebar-menu.component.html',
  styleUrl: './sidebar-menu.component.scss'
})
export class SidebarMenuComponent {
  openClose: boolean = true;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.checkWindowSize();
  }

  cleanLoggedUser() {
    sessionStorage.setItem('jwtToken', '');
    this.router.navigate(['']);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkWindowSize();
  }

  private checkWindowSize(): void {
    if(window.innerWidth < 768) {
      this.openClose = false;
    } else {
      this.openClose = true;
    }
  }

  openCloseMenu() {
    this.openClose = !this.openClose
  }

}
