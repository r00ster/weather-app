import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timer } from 'rxjs';
import { retryWhen, mergeMap, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  corsAnywhereUrl: string;
  capeTownWeatherData: string;

  constructor(private http: HttpClient) {
    // solve CORS issues in dev (non https) mode
    this.corsAnywhereUrl = 'https://cors-anywhere.herokuapp.com/';
    this.capeTownWeatherData = 'https://pi.darksky.net/forecast/bdbdf1842d3fbddd6e9dc57493177247/-33.9249,18.4241?units=si';
  }

  getCapeTownWeather() {
    return this.http.get(this.corsAnywhereUrl +
      this.capeTownWeatherData).pipe(
        retryWhen(retryPipeline())
      );
  }
}

export const retryPipeline = ({
  scalingDuration = 1000,
}: {
  scalingDuration?: number,
} = {}) => (attempts: Observable<any>) => {
  return attempts.pipe(
    mergeMap((error, i) => {
      const retryAttempt = i + 1;
      return timer(retryAttempt * scalingDuration);
    }),
    finalize(() => console.log('API works again!'))
  );
};
