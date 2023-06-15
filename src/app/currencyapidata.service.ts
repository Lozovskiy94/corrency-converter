import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class CurrencyapidataService {

  constructor(private http: HttpClient) { }

  getCurrencyData(country: string) {

    let url = `https://api.exchangerate.host/latest?base=${country}`
    return this.http.get(url)
  }
}
