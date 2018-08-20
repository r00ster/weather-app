import { Observable, timer } from 'rxjs';
import { mergeMap, finalize } from 'rxjs/operators';

export function timeConverter(unixTimestamp: number): string {
  const a = new Date(unixTimestamp * 1000);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const year = a.getFullYear();
  const month = months[a.getMonth()];
  const date = a.getDate();
  const hour = a.getHours();
  const min = a.getMinutes();
  const sec = a.getSeconds();
  return date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
}

export function convertToFahrenheit(degrees: number): number {
  return Math.floor(degrees * 1.8 + 32);
}

export function convertToCelsius(degrees: number): number {
  return Math.floor((degrees - 32) / 1.8);
}

export const retryPipeline = (
  { scalingDuration = 1000 }: { scalingDuration?: number } = {}) =>
  (attempts: Observable<any>) => {
    return attempts.pipe(
      mergeMap((error, i) => {
        const retryAttempt = i + 1;
        return timer(retryAttempt * scalingDuration);
      }),
      finalize(() => console.log('API works again!'))
    );
  };
