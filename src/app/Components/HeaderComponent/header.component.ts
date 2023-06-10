import { Component} from '@angular/core';
import { CurrencyapidataService } from '../../currencyapidata.service';

type MyRequest = {
    base: string;
    date: string;
    motd: {
      msg: string;
      url: string;
    };
    rates: {
      [key: string]: number;
    };
    success: boolean;
  };

@Component({
  selector: 'app-header',
  template: `
  <header class="header">
    <h1 class="header-message">Конвертер Валют</h1>
    <h2>1 USD = {{ rates['USD'] }}UA</h2>
    <h2>1 EUR = {{ rates['EUR'] }}UA</h2>
  </header>
  `,
//   styleUrls: ['./header.component.css']
})
export class HeaderComponent {
    constructor(private currency: CurrencyapidataService) {}

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
