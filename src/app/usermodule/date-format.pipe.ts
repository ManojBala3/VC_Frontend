import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    // Parse the input string into date components
    const [day, month, year] = value.split(/[/ :]/).map(Number);

    // Create a new date object using the parsed values (treating it as local time)
    const date = new Date(year, month - 1, day);

    // Convert to IST (Indian Standard Time, UTC+5:30)
    const utcOffsetInMinutes = date.getTimezoneOffset(); // Get local timezone offset
    const ISTOffsetInMinutes = 330; // IST is UTC+5:30
    const ISTDate = new Date(date.getTime() + (ISTOffsetInMinutes - utcOffsetInMinutes) * 60 * 1000);

    // Format the date as 'DD/MM/YYYY'
    const formattedDate = ISTDate.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    // Return the final formatted date
    return `${formattedDate}`;
  }
}
