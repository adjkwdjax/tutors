// в этом файле мы только получаем и отдаем данные, никаких бизнес логик, валидаций и тд не должно быть, только вызов функции и отдача данных

import { NextResponse } from 'next/server'
import { pool } from '../../../lib/db'

import { getBookingsByTutorIds, addBooking } from '@/src/services/booking.service';

export async function GET(request: Request) {
  return NextResponse.json({ message: 'GET method for bookings' });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slotId, studentId } = body;
    if (!slotId || !studentId) {
      return NextResponse.json({ error: 'Missing slotId or studentId' }, { status: 400 });
    }

    const newBooking = await addBooking(slotId, studentId);
    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    console.error('POST /api/bookings failed:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}