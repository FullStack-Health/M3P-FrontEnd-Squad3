import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ShareMenuStatusService } from '../../services/share-menu-status.service';

@Component({
  selector: 'app-sidebar-menu',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './sidebar-menu.component.html',
  styleUrl: './sidebar-menu.component.scss'
})
export class SidebarMenuComponent {
  menuTrueFalse: boolean = true;

  constructor(private router: Router, private shareMenuStatusService: ShareMenuStatusService) { }

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
      this.menuTrueFalse = false;
      this.shareMenuStatusService.setMenuTrueFalse(this.menuTrueFalse);
    } else {
      this.menuTrueFalse = true;
      this.shareMenuStatusService.setMenuTrueFalse(this.menuTrueFalse);
    }
  }

  openCloseMenu() {
    this.menuTrueFalse = !this.menuTrueFalse
    this.shareMenuStatusService.setMenuTrueFalse(this.menuTrueFalse);
  }
}
