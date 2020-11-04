import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  url: any;
  nombre: string;

  constructor(private router: Router, private loginService: LoginService) { }

  ngOnInit() {
    this.url = this.router.url;
    this.nombre = localStorage.getItem('nombre');

  }

}
