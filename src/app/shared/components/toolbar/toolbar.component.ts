import { Component, Inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../security/auth.service';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [RouterLink],
  providers: [AuthService],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent implements OnInit {
  pageTitle: string | undefined;
  userName: String | null = '';

  constructor(private titleService: Title, private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.pageTitle = this.titleService.getTitle();
    this.getToken();
  }

  cleanLoggedUser() {
    sessionStorage.setItem('jwtToken', '');
    this.router.navigate(['/']);
  }

  getToken() {
    const token = sessionStorage.getItem('jwtToken');
    this.userName = this.authService.getUserNameFromToken();
  }

}
