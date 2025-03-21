import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-date-picker',
  imports: [CommonModule],
  templateUrl: './date-picker.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR, // Making the component implement ControlValueAccessor
      useExisting: forwardRef(() => DatePickerComponent), // Forwarding the reference to this component
      multi: true, // This allows multiple providers for the same token
    },
  ],
})
export class DatePickerComponent implements ControlValueAccessor, OnInit {
  @Input() customClass!: any; // Input property for passing custom classes to the component

  selectedDate: Date | null = null; // Holds the selected date
  isOpen: boolean = false; // Flag to track whether the calendar is open or not
  currentMonthIndex: number = new Date().getMonth(); // Tracks the current month index (0-based)
  currentYear: number = new Date().getFullYear(); // Tracks the current year
  daysInMonth: (Date | null)[] = []; // Array to hold the days of the current month

  // Georgian month names
  georgianMonths: string[] = [
    'იანვარი',
    'თებერვალი',
    'მარტი',
    'აპრილი',
    'მაისი',
    'ივნისი',
    'ივლისი',
    'აგვისტო',
    'სექტემბერი',
    'ოქტომბერი',
    'ნოემბერი',
    'დეკემბერი',
  ];

  // Georgian day names
  georgianDays: string[] = ['ორშ', 'სამ', 'ოთხ', 'ხუთ', 'პარ', 'შაბ', 'კვ'];

  // These functions are used by ControlValueAccessor to update the form control value
  private onChange: (value: Date | null) => void = () => {};
  private onTouched: () => void = () => {};

  // Called when the component is initialized
  ngOnInit(): void {
    this.updateCalendar(); // Initialize the calendar when the component loads
  }

  // Function to update the form control value with the selected date
  writeValue(value: Date | null): void {
    this.selectedDate = value;
  }

  // Registers the onChange function to propagate changes in the value
  registerOnChange(fn: (value: Date | null) => void): void {
    this.onChange = fn;
  }

  // Registers the onTouched function to mark the form control as touched
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Sets the selected date and emits changes to the form control
  setDate(date: Date): void {
    this.selectedDate = date;
    this.onChange(date); // Notify the form control of the change
    this.onTouched(); // Mark the form control as touched
    this.isOpen = false; // Close the calendar after selecting a date
  }

  // Toggles the visibility of the calendar
  toggleCalendar(): void {
    this.isOpen = !this.isOpen;
  }

  // Moves to the previous month and updates the calendar
  prevMonth(): void {
    if (this.currentMonthIndex === 0) {
      this.currentMonthIndex = 11;
      this.currentYear--; // Move to the previous year
    } else {
      this.currentMonthIndex--; // Decrease the current month index
    }

    this.updateCalendar(); // Update the calendar after the month change
  }

  // Moves to the next month and updates the calendar
  nextMonth(): void {
    if (this.currentMonthIndex === 11) {
      this.currentMonthIndex = 0;
      this.currentYear++; // Move to the next year
    } else {
      this.currentMonthIndex++; // Increase the current month index
    }

    this.updateCalendar(); // Update the calendar after the month change
  }

  // Updates the calendar to reflect the days of the current month
  updateCalendar(): void {
    this.daysInMonth = []; // Clear the existing days

    // Get the first day of the current month
    const firstDay = new Date(
      this.currentYear,
      this.currentMonthIndex,
      1
    ).getDay();

    // Get the last day of the current month
    const lastDay = new Date(
      this.currentYear,
      this.currentMonthIndex + 1,
      0
    ).getDate();

    // Calculate the start offset (how many empty spaces are before the first day)
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;

    // Push null values for the empty days before the first day of the month
    for (let i = 0; i < startOffset; i++) {
      this.daysInMonth.push(null);
    }

    // Push actual dates of the current month
    for (let i = 1; i <= lastDay; i++) {
      this.daysInMonth.push(
        new Date(this.currentYear, this.currentMonthIndex, i)
      );
    }
  }
}
