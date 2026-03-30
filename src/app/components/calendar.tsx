'use client';

import { memo, useEffect, useMemo, useState } from 'react';
import { ScrollArea, Loader } from '@mantine/core';
import { useAuth } from '../authProvider';
import { StudentSlotModal } from '@/src/app/components/student-slot-modal';
import { TutorSlotModal } from '@/src/app/components/tutor-slot-modal';

type CalendarSlot = {
  slotId?: number;
  time: Date; 
};

const CalendarView = memo(function CalendarView() {
  const MSK_TIME_ZONE = 'Europe/Moscow';
  const MSK_OFFSET_HOURS = 3;
  const days = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
  const times = Array.from({ length: 16 }, (_, i) => i + 8);
  const [weekOffset, setWeekOffset] = useState(0);

  const { user, loading } = useAuth();

  const [slots, setSlots] = useState<CalendarSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(true);
  const role = user?.role === 'student' || user?.role === 'tutor' ? user.role : undefined;
  const [selectedSlot, setSelectedSlot] = useState<{ time: Date; isSlot: boolean; slotId?: number } | null>(null);
  const [studentModalOpened, setStudentModalOpened] = useState(false);
  const [tutorModalOpened, setTutorModalOpened] = useState(false);

  const closeModals = () => {
    setStudentModalOpened(false);
    setTutorModalOpened(false);
    setSelectedSlot(null);
  };

  const loadSlots = async () => {
    if (loading || !user) {
      if (!loading) {
        setSlotsLoading(false);
      }
      return;
    }

    setSlotsLoading(true);
    fetch('/api/calendar?tutorIds=' + (user.role === 'student' ? (user.tutorIds?.join(',') || '') : user.tutorId), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setSlots(Array.isArray(data) ? data : data?.slots ?? []);
      })
      .catch((error) => {
        console.error('Error fetching calendar slots:', error);
      })
      .finally(() => {
        setSlotsLoading(false);
      });
  };

  useEffect(() => {
    loadSlots();
  }, [loading, user]);

  const slotTimeToIdMap = useMemo(() => {
    const map = new Map<number, number>();

    slots.forEach((slot) => {
      if (!slot?.time || slot.slotId == null) {
        return;
      }

      const parsed = new Date(slot.time).getTime();
      if (Number.isNaN(parsed)) {
        return;
      }

      map.set(parsed, slot.slotId);
    });

    return map;
  }, [slots]);

  const getMskDateParts = (date: Date) => {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: MSK_TIME_ZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).formatToParts(date);

    const getPart = (type: Intl.DateTimeFormatPartTypes) =>
      parts.find((part) => part.type === type)?.value ?? '00';

    return {
      year: Number(getPart('year')),
      month: Number(getPart('month')),
      day: Number(getPart('day')),
      hour: Number(getPart('hour')),
      minute: Number(getPart('minute')),
      second: Number(getPart('second')),
    };
  };

  const createUtcDateFromMsk = (
    year: number,
    month: number,
    day: number,
    hour = 0,
    minute = 0,
    second = 0,
  ) => new Date(Date.UTC(year, month - 1, day, hour - MSK_OFFSET_HOURS, minute, second));

  const now = new Date();
  const mskWeekday = new Intl.DateTimeFormat('en-US', {
    timeZone: MSK_TIME_ZONE,
    weekday: 'short',
  }).format(now);
  const weekDayMap: Record<string, number> = {
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
    Sun: 7,
  };

  const mskTodayParts = getMskDateParts(now);
  const mskTodayMidnight = createUtcDateFromMsk(mskTodayParts.year, mskTodayParts.month, mskTodayParts.day);

  const weekdayNumber = weekDayMap[mskWeekday] ?? 1;
  const diffToMonday = 1 - weekdayNumber;
  const monday = new Date(mskTodayMidnight);
  monday.setUTCDate(mskTodayMidnight.getUTCDate() + diffToMonday + weekOffset * 7);

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday);
    date.setUTCDate(monday.getUTCDate() + i);
    return date;
  });

  const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
    timeZone: MSK_TIME_ZONE,
    day: 'numeric',
    month: 'short',
  });

  const weekRangeFormatter = new Intl.DateTimeFormat('ru-RU', {
    timeZone: MSK_TIME_ZONE,
    day: 'numeric',
    month: 'short',
  });

  const cellDateTimeFormatter = new Intl.DateTimeFormat('ru-RU', {
    timeZone: MSK_TIME_ZONE,
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  const toMskIsoDateTime = (date: Date) => {
    const { year, month, day, hour, minute, second } = getMskDateParts(date);
    const pad2 = (value: number) => String(value).padStart(2, '0');

    return `${year}-${pad2(month)}-${pad2(day)}T${pad2(hour)}:${pad2(minute)}:${pad2(second)}+03:00`;
  };

  const toMskTime = (hour: number) => `${String(hour).padStart(2, '0')}:00`;
  const currentWeekRangeLabel = `${weekRangeFormatter.format(weekDates[0])} - ${weekRangeFormatter.format(weekDates[6])}`;

  return (
    <>
      <div className='w-fit mx-auto mb-3 flex items-center justify-center gap-4 rounded-xl border border-slate-300 bg-amber-100 px-4 py-2'>
        <button
          type='button'
          onClick={() => setWeekOffset((prev) => prev - 1)}
          className='rounded-md  border-slate-400 border bg-amber-200 px-3 py-1 text-lg leading-none transition hover:bg-slate-100 cursor-pointer'
          aria-label='Предыдущая неделя'
        >
          {'<'}
        </button>

        <span className='min-w-44 text-center text-sm font-semibold text-slate-800'>
          {currentWeekRangeLabel}
        </span>

        <button
          type='button'
          onClick={() => setWeekOffset((prev) => prev + 1)}
          className='rounded-md  border-slate-400 border bg-amber-200 px-3 py-1 text-lg leading-none transition hover:bg-slate-100 cursor-pointer'
          aria-label='Следующая неделя'
        >
          {'>'}
        </button>
      </div>

      <ScrollArea className='rounded-xl' h='60vh' bg='white' scrollbarSize={10} type='always'>
        {slotsLoading ? (
          <div className='flex inset-0 h-full w-full min-h-80 items-center justify-center'>
            <Loader color='yellow' />
          </div>
        ) : (
          <div>
            <table className='select-none w-full rounded-xl border text-sm'>
              <thead>
                <tr>
                  <th className='sticky top-0 left-0 z-30 min-w-20 border border-slate-300 bg-amber-100 p-2 text-left'></th>
                  {days.map((day, index) => (
                    <th
                      key={day}
                      className='sticky top-0 z-20 min-w-24 border border-slate-300 bg-amber-200 p-2 text-center'
                    >
                      <div className='flex flex-col leading-tight'>
                        <span>{day}</span>
                        <span className='select-none text-xs font-normal text-slate-600'>
                          {dateFormatter.format(weekDates[index]).replace('.', '')}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {times.map((hour) => (
                  <tr key={hour}>
                    <td className={'sticky left-0 z-10 border border-slate-300 bg-amber-200 p-2 font-medium'}>
                      <time dateTime={`${toMskTime(hour)}:00+03:00`}>{toMskTime(hour)} МСК</time>
                    </td>
                    {days.map((day, index) => {
                      const slotDate = new Date(weekDates[index]);
                      slotDate.setUTCDate(slotDate.getUTCDate() + 1);
                      slotDate.setUTCHours(hour - MSK_OFFSET_HOURS, 0, 0, 0);
                      const slotTimestamp = slotDate.getTime();
                      const slotId = slotTimeToIdMap.get(slotTimestamp);
                      const isSlot = slotId !== undefined;

                      const mskDateTime = toMskIsoDateTime(slotDate);
                      const displayDateTime = cellDateTimeFormatter.format(slotDate);

                      return (
                        <td
                          onClick={() => {
                            if (!role) {
                              return;
                            }

                            if (role === 'student' && !isSlot) {
                              return;
                            }

                            setSelectedSlot({ time: slotDate, isSlot, slotId });

                            if (role === 'student') {
                              setStudentModalOpened(true);
                              setTutorModalOpened(false);
                            } else {
                              setTutorModalOpened(true);
                              setStudentModalOpened(false);
                            }
                          }}
                          key={`${day}-${hour}`}
                          className={`h-14 border cursor-pointer border-slate-300 p-2 align-middle text-center ${
                            (() => {
                                if (isSlot && user?.role === 'student') {
                                  return 'bg-amber-200 border-2 border-dotted text-black';
                              } else if (!isSlot && user?.role === 'student') {
                                  return 'bg-grey-200 text-gray-500';
                              } else if (isSlot && user?.role === 'tutor') {
                                  return 'bg-amber-200 border-2 border-dotted text-black';
                              } else {
                                  return 'bg-white text-gray-600';
                              }
                            })()
                          }`}
                        >
                          <time dateTime={mskDateTime}>{displayDateTime}</time>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ScrollArea>

      <StudentSlotModal
        opened={studentModalOpened}
        time={selectedSlot?.time}
        isSlot={selectedSlot?.isSlot ?? false}
        slotId={selectedSlot?.slotId}
        onClose={closeModals}
      />
      <TutorSlotModal
        opened={tutorModalOpened}
        time={selectedSlot?.time}
        isSlot={selectedSlot?.isSlot ?? false}
        slotId={selectedSlot?.slotId}
        onSaved={loadSlots}
        onClose={closeModals}
      />
    </>
  );
});

export default CalendarView;
