export function timeConverter(unixTimestamp: number): string {
  const a = new Date(unixTimestamp * 1000);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const year = a.getFullYear();
  const month = months[a.getMonth()];
  const date = a.getDate();
  const day = days[a.getDay()];
  const hour = a.getHours();
  const min = a.getMinutes();
  const sec = a.getSeconds();
  return date + ' ' + month + ' ' + year + ' ' + day + ' ' + hour + ':' + min + ':' + sec;
}

export function convertToFahrenheit(degrees: number): number {
  return degrees * 1.8 + 32;
}

export function convertToCelsius(degrees: number): number {
  return (degrees - 32) / 1.8;
}

