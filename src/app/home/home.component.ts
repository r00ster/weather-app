import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Observable, timer } from 'rxjs';
import { timeConverter, convertToFahrenheit, convertToCelsius } from '../utils';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  selectedUnit$: string;
  capeTownWeatherCurrently$: number;
  capeTownDailyWeather$: Array<Object>;
  refreshTimer$: Observable<number>;
  apiFailInteval$: number;
  unitSymbol$: string;
  above25$: boolean;
  below15$: boolean;

  constructor(private data: DataService) {
    // refresh every 20 minutes
    this.capeTownWeatherCurrently$ = null;
    this.capeTownDailyWeather$ = [];
    this.refreshTimer$ = timer(0, 20 * 60 * 1000);
    this.selectedUnit$ = 'Celsius';
    this.apiFailInteval$ = 1000;
    this.unitSymbol$ = '℃';
  }

  ngOnInit() {
    this.refreshTimer$.subscribe(() => {
      this.getWeather();
    });
  }

  getWeather() {
    this.data.getCapeTownWeather().subscribe(data => {
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

  updateDegrees(tempUnit: string) {
    this.capeTownDailyWeather$ = this.capeTownDailyWeather$.map(day => {
      if (tempUnit === 'Fahrenheit') {
        day['temperatureMin'] = this.getFahrenheit(day['temperatureMin']);
        day['temperatureMax'] = this.getFahrenheit(day['temperatureMax']);
      } else {
        day['temperatureMin'] = this.getCelsius(day['temperatureMin']);
        day['temperatureMax'] = this.getCelsius(day['temperatureMax']);
      }
      return day;
    });
    if (tempUnit === 'Fahrenheit') {
      this.capeTownWeatherCurrently$ = this.getFahrenheit(this.capeTownWeatherCurrently$);
      this.unitSymbol$ = '℉';
      this.selectedUnit$ = 'Fahrenheit';
    } else {
      this.capeTownWeatherCurrently$ = this.getCelsius(this.capeTownWeatherCurrently$);
      this.unitSymbol$ = '℃';
      this.selectedUnit$ = 'Celsius';
    }
    this.above25$ = this.capeTownWeatherCurrently$ > 25;
    this.below15$ = this.capeTownWeatherCurrently$ < 15;
  }

  getFahrenheit (degrees: number) {
    return this.selectedUnit$ !== 'Fahrenheit' ? convertToFahrenheit(degrees) : degrees;
  }

  getCelsius (degrees: number) {
    return this.selectedUnit$ !== 'Celsius' ? convertToCelsius(degrees) : degrees;
  }
}
