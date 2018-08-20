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
  return degrees * 1.8 + 32;
}

export function convertToCelsius(degrees: number): number {
  return (degrees - 32) / 1.8;
}

