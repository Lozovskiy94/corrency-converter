import { Component } from '@angular/core';
import { CurrencyapidataService } from '../../currencyapidata.service';
import { MyRequest } from '../../interfaces/my.request';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  constructor(private currency: CurrencyapidataService) { }

  rates: { [key: string]: number } = {};
  request: MyRequest = {
    base: '',
    date: '',
    motd: { msg: '', url: '' },
    rates: {},
    success: false
  };

  getRateTo(curr1: string, curr2: string) {
    this.currency.getCurrencyData(curr1).subscribe((data) => {
      this.request = data as MyRequest;
      this.rates[curr1] = parseFloat(this.request.rates[curr2].toFixed(2));
    });
  }

  ngOnInit() {
    this.getRateTo('USD', 'UAH');
    this.getRateTo('EUR', 'UAH');
  }
}
