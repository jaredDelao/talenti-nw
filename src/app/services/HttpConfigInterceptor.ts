import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from "@angular/common/http";
import { Observable } from "rxjs";

export class HttpConfigInterceptor implements HttpInterceptor {
    
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // console.log(req.body.map);
    

    const cloneReq = req.clone({
      setHeaders: {
        Authorization: 'eydcxx323cdfsgreg'
      }
    });
    return next.handle(cloneReq);

  }
}
