import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Globals} from "../global/globals";
import {AuthService} from "./auth.service";
import {ProductDto} from "../dtos/productDto";
import {Observable} from "rxjs";
import {BetDto} from "../dtos/betDto";

@Injectable({
  providedIn: 'root'
})
export class BetService {

  private baseUri: string = this.globals.backendUri + '/bet';

  constructor(private http: HttpClient, private globals: Globals, private authService: AuthService) {
  }

  createBet(bet: BetDto): Observable<BetDto> {
    const headers = new HttpHeaders({
      'Authorization': this.authService.getToken()
    });

    return this.http.post<BetDto>(this.baseUri, bet, {headers});
  }
}