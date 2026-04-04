import { NextResponse } from 'next/server';

import { resolveActorIdFromAccessCode } from '@/src/lib/auth-guard';
import { updateBookingComment } from '@/src/services/booking.service';

type Role = 'student' | 'tutor';

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { bookingId, comment, role } = body as {
			bookingId?: number;
			comment?: string;
			role?: Role;
		};

		if (!bookingId || !role) {
			return NextResponse.json({ error: 'Missing bookingId or role' }, { status: 400 });
		}

		if (role !== 'student' && role !== 'tutor') {
			return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
		}

		if (role === 'tutor' && !comment?.trim()) {
			return NextResponse.json({ error: 'Tutor comment is required' }, { status: 400 });
		}

		const authResult = await resolveActorIdFromAccessCode(role);
		if (!authResult.ok) {
			return authResult.response;
		}

		const updatedBooking = await updateBookingComment(
			bookingId,
			comment ?? '',
			authResult.actorId,
			authResult.user.role,
		);

		return NextResponse.json(updatedBooking, { status: 200 });
	} catch (error) {
		console.error('POST /api/bookings/update-student-comment failed:', error);
		return NextResponse.json({ error: 'Failed to update booking comment' }, { status: 500 });
	}
}
