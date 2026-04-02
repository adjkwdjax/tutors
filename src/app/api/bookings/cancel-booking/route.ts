// в этом файле мы только получаем и отдаем данные, никаких бизнес логик, валидаций и тд не должно быть, только вызов функции и отдача данных

import { NextResponse } from 'next/server'

import { getBookingsByTutorIds, addBooking, cancelBooking } from '@/src/services/booking.service';
import { resolveActorIdFromAccessCode } from '@/src/lib/auth-guard';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { bookingId, cancellationReason, role } = body;
    if (!bookingId || !cancellationReason || !role) {
      return NextResponse.json({ error: 'Missing info' }, { status: 400 });
    }
    const authResult = await resolveActorIdFromAccessCode(role);
    if (authResult.ok) {
      const cancelledBooking = await cancelBooking(bookingId, cancellationReason, authResult.actorId, authResult.user.role);
      return NextResponse.json(cancelledBooking, { status: 200 });
    }

    return authResult.response;
  } catch (error) {
    console.error('POST /api/bookings failed:', error);
    return NextResponse.json({ error: 'Failed to cancel booking' }, { status: 500 });
  }
}