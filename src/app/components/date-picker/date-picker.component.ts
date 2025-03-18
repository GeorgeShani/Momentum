import { CommonModule } from '@angular/common';
import { Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-date-picker',
  imports: [CommonModule],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true,
    },
  ],
})
export class DatePickerComponent implements ControlValueAccessor, OnInit {
  selectedDate: Date | null = null;
  isOpen: boolean = false;
  currentMonthIndex: number = new Date().getMonth();
  currentYear: number = new Date().getFullYear();
  daysInMonth: (Date | null)[] = [];

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

  georgianDays: string[] = ['ორშ', 'სამ', 'ოთხ', 'ხუთ', 'პარ', 'შაბ', 'კვ'];

  private onChange: (value: Date | null) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit(): void {
    this.updateCalendar();
  }

  writeValue(value: Date | null): void {
    this.selectedDate = value;
  }

  registerOnChange(fn: (value: Date | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDate(date: Date): void {
    this.selectedDate = date;
    this.onChange(date);
    this.onTouched();
    this.isOpen = false;
  }

  toggleCalendar(): void {
    this.isOpen = !this.isOpen;
  }

  prevMonth(): void {
    if (this.currentMonthIndex === 0) {
      this.currentMonthIndex = 11;
      this.currentYear--;
    } else {
      this.currentMonthIndex--;
    }

    this.updateCalendar();
  }

  nextMonth(): void {
    if (this.currentMonthIndex === 11) {
      this.currentMonthIndex = 0;
      this.currentYear++;
    } else {
      this.currentMonthIndex++;
    }

    this.updateCalendar();
  }

  updateCalendar(): void {
    this.daysInMonth = [];

    const firstDay = new Date(
      this.currentYear,
      this.currentMonthIndex,
      1
    ).getDay();

    const lastDay = new Date(
      this.currentYear,
      this.currentMonthIndex + 1,
      0
    ).getDate();

    const startOffset = firstDay === 0 ? 6 : firstDay - 1;

    for (let i = 0; i < startOffset; i++) {
      this.daysInMonth.push(null);
    }

    for (let i = 1; i <= lastDay; i++) {
      this.daysInMonth.push(
        new Date(this.currentYear, this.currentMonthIndex, i)
      );
    }
  }
}
