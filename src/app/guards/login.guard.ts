import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private _loginService: LoginService, private _router: Router){}
  
  canActivate() {
    console.log('paso por guard')
    let logged = this._loginService.cargarStorage();
    if (logged) {
      return true
    } else {
      this._router.navigate(['/login']);
      return false;
    }
  }

  
}
