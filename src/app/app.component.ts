import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CurrencyapidataService } from './currencyapidata.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('input1') input1!: ElementRef;
  @ViewChild('input2') input2!: ElementRef;
  @ViewChild('c1') c1!: ElementRef;
  @ViewChild('c2') c2!: ElementRef;

  title = 'curcalc';
  currjson: any = []
  firstInput: number = 0
  secondInput: number = 0
  currency1 = 'USD'
  currency2 = 'USD'
  request: any
  rates: { [key: string]: number } = {}
  result: string = ''

  changeFirstSelect(selectorValue: string) {
    this.currency1 = selectorValue
  }

  changeSecondSelect(selectorValue: string) {
    this.currency2 = selectorValue
  }

  onInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement instanceof HTMLInputElement) {
      const sanitizedValue = inputElement.value.replace(/[^0-9.]|(\.(?=.*\.))/g, '');
      inputElement.value = sanitizedValue;
      event.preventDefault();
      this.convert(this.currency1, this.currency2)
    }
  }

  focusOrBlurChange(elem:any, oldVal: string, newVal: string ) {
    if (elem.nativeElement.value === oldVal) {
      elem.nativeElement.value = newVal
    } else { return }
  }

  onFirstInputFocus() {
    this.focusOrBlurChange(this.input1, '0', '')
  }

  onFirstBlur() {
    this.focusOrBlurChange(this.input1, '', '0')
  }

  onSecondBlur() {
    this.focusOrBlurChange(this.input2, '', '0')
  }

  onSecondInputFocus() {
    this.focusOrBlurChange(this.input2, '0', '')
  }

  onFirstChangeOption(option: string) {
    this.convert(option, this.currency2)
  }

  onSecondChangeOption(option: string) {
    this.convert(this.currency1, option)
  }

  constructor(private currency: CurrencyapidataService) { }

  convert(currency1: string, currency2: string) {
    if (document.activeElement === this.input1.nativeElement || document.activeElement === this.c2.nativeElement) {
      this.currency.getCurrencyData(currency1).subscribe(data => {
        this.currjson = data
        switch (currency2) {
          case 'USD':
            this.result = String((this.currjson.rates.USD * this.firstInput).toFixed(2))
            this.secondInput = +this.result
            break
          case 'UAH':
            this.result = String((this.currjson.rates.UAH * this.firstInput).toFixed(2))
            this.secondInput = +this.result
            break
          case 'EUR':
            this.result = String((this.currjson.rates.EUR * this.firstInput).toFixed(2))
            this.secondInput = +this.result
            break
        }
      })
    }
    if (document.activeElement === this.input2.nativeElement || document.activeElement === this.c1.nativeElement) {
      this.currency.getCurrencyData(currency2).subscribe(data => {
        this.currjson = data
        switch (currency1) {
          case 'USD':
            this.result = String((this.currjson.rates.USD * this.secondInput).toFixed(2))
            this.firstInput = +this.result
            break
          case 'UAH':
            this.result = String((this.currjson.rates.UAH * this.secondInput).toFixed(2))
            this.firstInput = +this.result
            break
          case 'EUR':
            this.result = String((this.currjson.rates.EUR * this.secondInput).toFixed(2))
            this.firstInput = +this.result
            break
        }
      })
    }
  }

  getRateTo(curr1: string, curr2: string) {
      this.currency.getCurrencyData(curr1).subscribe(data => {
      this.request = data
      this.rates[curr1] = this.request.rates[curr2].toFixed(2);
    })
  }

  ngOnInit() {
    this.getRateTo('USD', 'UAH')
    this.getRateTo('EUR', 'UAH')
  }
}

