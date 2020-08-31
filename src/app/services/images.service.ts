import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  url: string = environment.urlImage;

  constructor(private http: HttpClient) { }

  viewImage(data) {
    return this.url + `/ShowImg.php?file=${data}&Token=__-Talenti`;
  }
}
