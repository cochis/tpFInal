import { AfterViewInit, Component, Input } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';




import { Calendar } from '@fullcalendar/core';

import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements AfterViewInit {
  @Input() events: any
  @Input() edit: boolean = true
  dateSelected = false
  calendarOptions: CalendarOptions = {
    locale: esLocale,
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'dayGridMonth,listWeek'
    },
    /*    dateClick: (arg) => this.handleDateClick(arg), */
    initialView: 'dayGridMonth',
    editable: this.edit,
    weekends: true,

    selectable: true,
    dateClick: function (info) {



      this.dateSelected = true

    }

  };
  loading = false

  eventsPromise: Promise<EventInput[]>;
  ngAfterViewInit() {


    setTimeout(() => {
      this.calendarOptions.events = this.events
      this.loading = false
    }, 1500);
  }
  handleDateClick(arg) {


  }
  desSelect() {
    this.dateSelected = false

  }
}
