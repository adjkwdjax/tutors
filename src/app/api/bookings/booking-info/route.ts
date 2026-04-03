import { NextRequest, NextResponse } from 'next/server';
import { getBookingById } from '../../../../services/booking.service';

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const idParam = searchParams.get('id');

	if (!idParam) {
		return NextResponse.json({ message: 'Booking id is required' }, { status: 400 });
	}

	const bookingId = Number(idParam);

	if (!Number.isInteger(bookingId) || bookingId <= 0) {
		return NextResponse.json({ message: 'Booking id must be a positive integer' }, { status: 400 });
	}

	try {
		const booking = await getBookingById(bookingId);

		if (!booking) {
			return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
		}

		return NextResponse.json(booking, { status: 200 });
	} catch {
		return NextResponse.json({ message: 'Failed to get booking info' }, { status: 500 });
	}
}
