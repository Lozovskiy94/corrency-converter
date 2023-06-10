import { Component, ViewChild, ElementRef } from '@angular/core';
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
  selector: 'app-currency',
  template: `
  <div class="main-content">
  <div class="first-cur">
    <input #input1 type="text" [(ngModel)]="firstInput" (focus)="onFirstInputFocus()" (blur)="onFirstBlur()" (input)="onInputChange($event)">
    <span class="bar"></span>
    <select class="select" #c1 (change)="onFirstChangeOption(c1.value)" (mouseleave)='changeFirstSelect(c1.value)'>
      <option *ngFor="let cur of curArr" [value]="cur">{{cur}}</option>
    </select>
  </div>
  <img class="arrows" src="https://cdn-icons-png.flaticon.com/512/60/60671.png" alt="arrows">
  <div class="second-cur">
    <input #input2 type="text" [(ngModel)]="secondInput" (focus)="onSecondInputFocus()" (blur)="onSecondBlur()" (input)="onInputChange($event)">
    <span class="bar"></span>
    <select class="select" #c2 (change)="onSecondChangeOption(c2.value)" (mouseleave)="changeSecondSelect(c2.value)">
    <option *ngFor="let cur of curArr" [value]="cur">{{cur}}</option>
    </select>
  </div>
</div>
  `
//   styleUrls: ['./currency.component.css']
})
export class CurrencyComponent {
    @ViewChild('input1') input1!: ElementRef;
    @ViewChild('input2') input2!: ElementRef;
    @ViewChild('c1') c1!: ElementRef;
    @ViewChild('c2') c2!: ElementRef;
  
    request: MyRequest = {
      base: '',
      date: '',
      motd: { msg: '', url: '' },
      rates: {},
      success: false
    };
  
    firstInput = 0;
    secondInput = 0;
    currency1 = 'USD';
    currency2 = 'USD';
    curArr: string[] = ['USD','UAH', 'EUR','RUB']
  
    changeFirstSelect(selectorValue: string) {
      this.currency1 = selectorValue;
    }
  
    changeSecondSelect(selectorValue: string) {
      this.currency2 = selectorValue;
    }
  
    onInputChange(event: Event) {
      const inputElement = event.target as HTMLInputElement;
      if (inputElement instanceof HTMLInputElement) {
        const sanitizedValue = inputElement.value.replace(/[^0-9.]|(\.(?=.*\.))/g, '');
        inputElement.value = sanitizedValue;
        event.preventDefault();
        this.convert(this.currency1, this.currency2);
      }
    }
  
    focusOrBlurChange(elem: ElementRef, oldVal: string, newVal: string) {
      if (elem.nativeElement.value === oldVal) {
        elem.nativeElement.value = newVal;
      } else {
        return;
      }
    }
  
    onFirstInputFocus() {
      this.focusOrBlurChange(this.input1, '0', '');
    }
  
    onFirstBlur() {
      this.focusOrBlurChange(this.input1, '', '0');
    }
  
    onSecondBlur() {
      this.focusOrBlurChange(this.input2, '', '0');
    }
  
    onSecondInputFocus() {
      this.focusOrBlurChange(this.input2, '0', '');
    }
  
    onFirstChangeOption(option: string) {
      this.convert(option, this.currency2);
    }
  
    onSecondChangeOption(option: string) {
      this.convert(this.currency1, option);
    }
  
    constructor(private currency: CurrencyapidataService) {}
  
    convert(currency1: string, currency2: string) {
      const activeElement = document.activeElement;
      const activeInput1 = activeElement === this.input1.nativeElement || activeElement === this.c2.nativeElement;
      const activeInput2 = activeElement === this.input2.nativeElement || activeElement === this.c1.nativeElement;
    
      if (activeInput1 || activeInput2) {
        const activeCurrency = activeInput1 ? currency1 : currency2;
        const inactiveCurrency = activeInput1 ? currency2 : currency1;
        const activeInput = activeInput1 ? this.firstInput : this.secondInput;
        let targetInput: number;
    
        this.currency.getCurrencyData(activeCurrency).subscribe((data) => {
          this.request = data as MyRequest;
  
          if (inactiveCurrency) {
            targetInput = this.request.rates[inactiveCurrency] * activeInput;
          } else {
            targetInput = activeInput;
          }
    
          if (activeInput1) {
            this.secondInput = Number(targetInput.toFixed(2));
          } else {
            this.firstInput = Number(targetInput.toFixed(2));
          }
        });
      }
    }
}
