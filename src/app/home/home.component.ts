import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Observable, timer } from 'rxjs';
import { retryWhen } from 'rxjs/operators';
import { mergeMap, finalize } from 'rxjs/operators';

import {
  timeConverter,
  convertToFahrenheit,
  convertToCelsius
} from '../utils';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  selectedUnit$: string;
  capeTownWeatherCurrently$: number;
  capeTownDailyWeather$: Array<Object>;
  unitSymbol$: string;
  above25$: boolean;
  below15$: boolean;
  apiFailing$: boolean;
  apiFailInterval: number;
  refreshTimer: Observable<number>;

  constructor(private data: DataService) {
    // refresh every 20 minutes
    this.capeTownWeatherCurrently$ = null;
    this.capeTownDailyWeather$ = [];
    this.refreshTimer = timer(0, 20 * 60 * 1000);
    this.selectedUnit$ = 'Celsius';
    this.apiFailInterval = 1000;
    this.unitSymbol$ = '℃';
    this.apiFailing$ = false;
  }

  ngOnInit() {
    this.refreshTimer.subscribe(() => {
      this.getWeather();
    });
  }

  speedUpRetry(): void {
    this.apiFailInterval = this.apiFailInterval / 2;
  }

  getWeather(): void {
    this.data.getCapeTownWeather()
      .pipe(retryWhen(this.retryPipeline()))
      .subscribe(data => {
        this.capeTownWeatherCurrently$ = data['currently'].temperature.toFixed();
        this.above25$ = this.capeTownWeatherCurrently$ > 25;
        this.below15$ = this.capeTownWeatherCurrently$ < 15;
        this.capeTownDailyWeather$ = data['daily'].data.map(day => {
          day.time = timeConverter(day.time);
          day['temperatureMin'] = Math.floor(day['temperatureMin']);
          day['temperatureMax'] = Math.floor(day['temperatureMax']);
          return day;
        });
    });
  }

  updateDegrees(tempUnit: string): void {
    this.capeTownDailyWeather$ = this.capeTownDailyWeather$.map(day => {
      day['temperatureMin'] = tempUnit === 'Fahrenheit' ?
        this.getFahrenheit(day['temperatureMin']) :
        this.getCelsius(day['temperatureMin']);
      day['temperatureMax'] = tempUnit === 'Fahrenheit' ?
        this.getFahrenheit(day['temperatureMax']) :
        this.getCelsius(day['temperatureMax']);
      return day;
    });
    this.capeTownWeatherCurrently$ = tempUnit === 'Fahrenheit' ?
      this.getFahrenheit(this.capeTownWeatherCurrently$) :
      this.getCelsius(this.capeTownWeatherCurrently$);
    this.unitSymbol$ = tempUnit === 'Fahrenheit' ? '℉' : '℃';
    this.selectedUnit$ = tempUnit;
    this.above25$ = this.capeTownWeatherCurrently$ > 25;
    this.below15$ = this.capeTownWeatherCurrently$ < 15;
  }

  getFahrenheit(degrees: number): number {
    return this.selectedUnit$ !== 'Fahrenheit' ? convertToFahrenheit(degrees) : degrees;
  }

  getCelsius(degrees: number): number {
    return this.selectedUnit$ !== 'Celsius' ? convertToCelsius(degrees) : degrees;
  }

  retryPipeline = () =>
    (attempts: Observable<any>) => {
      this.apiFailing$ = true;
      return attempts.pipe(
        mergeMap((error, i) => {
          const retryAttempt = i + 1;
          return timer(retryAttempt * this.apiFailInterval);
        }),
        finalize(() => console.log('API works again!'))
      );
    }
}
