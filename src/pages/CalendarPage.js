import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { supabase } from '../services/supabaseClient';
import CompetitionCard from '../components/cards/CompetitionCard';
import '../styles/CardsPage.css';
import '../styles/calendar.css';

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    // Загружаем все соревнования один раз
    supabase
      .from('competitions')
      .select('*')
      .then(({ data }) => setEvents(data || []));
  }, []);

  // Строка выбранной даты в формате YYYY-MM-DD по локали
  const selectedDateStr = selectedDate.toLocaleDateString('en-CA');

  // Фильтр событий на выбранную дату
  const filtered = events.filter(ev =>
    ev.date === selectedDateStr
  );

  return (
    <div className='page' style={{ padding: 20 }}>
      <h1>Календарь соревнований</h1>
      <Calendar
        className="my-calendar"               // общий класс
        value={selectedDate}
        onChange={setSelectedDate}
        tileClassName={({ date, view }) => {
          if (view !== 'month') return null;
          // для каждого тайла сравниваем локальную дату
          const dateStr = date.toLocaleDateString('en-CA');
          return events.some(ev => ev.date === dateStr) ? 'my-has-event' : 'my-tile';
        }}
      />
      <div style={{ marginTop: 20 }}>
        {filtered.length === 0
          ? <p>Событий на эту дату нет.</p>
          : filtered.map(ev => (
            <CompetitionCard key={ev.id} competition={ev} />
          ))
        }
      </div>
    </div>
  );
};

export default CalendarPage;
