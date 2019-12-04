import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  
  canActivate() {
    // this._loginService.cargarStorage();
    // if (this._loginService.estaLogeado()) {
      return true;
    // } else {
    //   this._router.navigate(['/login']);
    //   return false;
    // }
  }

  
}
