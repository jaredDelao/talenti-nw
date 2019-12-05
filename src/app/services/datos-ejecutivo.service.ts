import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class DatosEjecutivoService {
  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get("https://reqres.in/api/users?page=1").pipe(
      map(({ data }: any) => {
        return data;
      })
    );
  }
}
