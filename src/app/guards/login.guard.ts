import { Injectable, AfterContentInit, OnInit } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private router: Router){
  }
  
  canActivate() {

    let token = localStorage.getItem('token');
    if (token && token.length > 0) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }

  
}
