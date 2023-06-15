import { Component, ViewChild, ElementRef, forwardRef } from '@angular/core';
import { CurrencyapidataService } from '../../currencyapidata.service';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl } from '@angular/forms';
import { MyRequest } from '../../interfaces/my.request';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CurrencyComponent),
      multi: true
    }
  ]
})
export class CurrencyComponent implements ControlValueAccessor {
  @ViewChild('input1', { static: true }) input1!: ElementRef<HTMLInputElement>;
  @ViewChild('input2', { static: true }) input2!: ElementRef<HTMLInputElement>;
  @ViewChild('c1') c1!: ElementRef;
  @ViewChild('c2') c2!: ElementRef;

  firstInputControl: FormControl = new FormControl();
  secondInputControl: FormControl = new FormControl();
  request: MyRequest = {
    base: '',
    date: '',
    motd: { msg: '', url: '' },
    rates: {},
    success: false
  };
  currency1 = 'USD';
  currency2 = 'USD';
  curArr: string[] = ['USD', 'UAH', 'EUR', 'RUB'];
  private onChange: any = () => { };
  private onTouched: any = () => { };
  private conversionTimeout: any;
  private activeInput: FormControl;

  constructor(private currency: CurrencyapidataService) {
    this.activeInput = this.firstInputControl;
    this.firstInputControl.setValue('0');
    this.secondInputControl.setValue('0');
  }

  ngOnInit() {
    this.firstInputControl.valueChanges.subscribe(value => {
      this.onChange(value);
      this.convert(this.currency1, this.currency2);
    });

    this.secondInputControl.valueChanges.subscribe(value => {
      this.onChange(value);
      this.convert(this.currency1, this.currency2);
    });

    this.focusOrBlurChange(this.input1.nativeElement, '0', '');
    this.focusOrBlurChange(this.input2.nativeElement, '0', '');
  }

  writeValue(value: number): void {
    this.firstInputControl.setValue(value);
    this.secondInputControl.setValue(value);
    this.convert(this.currency1, this.currency2);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  changeSelect(selectorValue: string, isCurrency1: boolean) {
    if (isCurrency1) {
      this.currency1 = selectorValue;
      if (this.currency1 === this.currency2) {
        this.firstInputControl.setValue(this.secondInputControl.value);
      }
      this.activeInput = this.firstInputControl;
    } else {
      this.currency2 = selectorValue;
      this.activeInput = this.secondInputControl;
    }

    this.convert(this.currency1, this.currency2);
  }

  onInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (!(inputElement instanceof HTMLInputElement)) {
      return;
    }

    const sanitizedValue = inputElement.value.replace(/[^0-9.]|(\.(?=.*\.))/g, '');
    inputElement.value = sanitizedValue;
    event.preventDefault();

    this.activeInput.setValue(sanitizedValue, { emitEvent: false });
    this.convert(this.currency1, this.currency2);
  }

  focusOrBlurChange(inputElement: HTMLInputElement, oldValue: string, newValue: string) {
    inputElement.addEventListener('focus', () => {
      if (inputElement.value === oldValue) {
        inputElement.value = newValue;
      }
    });

    inputElement.addEventListener('blur', () => {
      if (inputElement.value === '') {
        inputElement.value = oldValue;
      }
    });
  }

  onChangeOption(option: string, isCurrency1: boolean) {
    if (isCurrency1) {
      this.convert(option, this.currency2);
    } else {
      this.convert(this.currency1, option);
    }
  }

  convert(currency1: string, currency2: string) {
    const activeInput = this.getActiveInput();
    const activeCurrency = this.getActiveCurrency(activeInput, currency1, currency2);
    const inactiveCurrency = this.getInactiveCurrency(activeCurrency, currency1, currency2);
    const activeInputValue = activeInput.value;

    if (!activeCurrency || !inactiveCurrency || !activeInputValue) {
      return;
    }

    this.currency.getCurrencyData(activeCurrency).subscribe((data) => {
      console.log(data)
      const request = data as MyRequest;
      const targetInput = this.getTargetInput(request, inactiveCurrency, activeInputValue);

      if (activeCurrency === currency1) {
        this.secondInputControl.setValue(Number(targetInput.toFixed(2)), { emitEvent: false });
      } else {
        this.firstInputControl.setValue(Number(targetInput.toFixed(2)), { emitEvent: false });
      }
    });
  }

  getActiveInput(): FormControl {
    const activeElement = document.activeElement;
    const activeInput1 = activeElement === this.input1.nativeElement || activeElement === this.c2.nativeElement;
    return activeInput1 ? this.firstInputControl : this.secondInputControl;
  }

  getActiveCurrency(activeInput: FormControl, currency1: string, currency2: string): string {
    return activeInput === this.firstInputControl ? currency1 : currency2;
  }

  getInactiveCurrency(activeCurrency: string, currency1: string, currency2: string): string {
    return activeCurrency === currency1 ? currency2 : currency1;
  }

  getTargetInput(request: MyRequest, inactiveCurrency: string, activeInput: number): number {
    if (request.rates && inactiveCurrency in request.rates) {
      return request.rates[inactiveCurrency] * activeInput;
    } else {
      return activeInput;
    }
  }
}