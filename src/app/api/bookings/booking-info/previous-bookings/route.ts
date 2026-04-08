import { NextResponse } from 'next/server';
import { bookingInfoService } from '../../../../services/';

export async function GET() {
	try {
		const previousBookings = await bookingInfoService.getAllPreviousBookings();

		return NextResponse.json(previousBookings, { status: 200 });
	} catch {
		return NextResponse.json(
			{ message: 'Не удалось получить предыдущие бронирования' },
			{ status: 500 },
		);
	}
}
