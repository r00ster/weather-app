import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  corsAnywhereUrl: string;
  capeTownWeatherData: string;

  constructor(private http: HttpClient) {
    // TODO: To prevent API key abuse, you should set up a proxy server to make calls to our API behind the scenes.
    // Using CORS-anywhere for now to prevent CORS issues
    this.corsAnywhereUrl = 'https://cors-anywhere.herokuapp.com/';
    this.capeTownWeatherData = 'https://pi.darksky.net/forecast/bdbdf1842d3fbddd6e9dc57493177247/-33.9249,18.4241?units=si';
  }

  getCapeTownWeather() {
    return this.http.get(
      this.corsAnywhereUrl + this.capeTownWeatherData,
      {
        params: {
          'timezone': 'Africa/Johannesburg'
        }
      }
    );
  }
}

