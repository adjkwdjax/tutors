import { pool } from '../lib/db'; // путь поправь под свой проект
import { ADD_BOOKING, GET_BOOKINGS_BY_TUTOR_IDS, CANCEL_BOOKING } from '../queries/bookings.sql';

export async function addBooking(slotId: number, studentId: number, comment: string) {
  const client = await pool.connect();
    try {
        const res = await client.query(ADD_BOOKING, [slotId, studentId, comment]);
        console.log('Booking added:', res.rows[0]);
        return res.rows[0];
    } catch (err) {
        console.error('Ошибка создания бронирования:', err);
        throw err;
    } finally {
        client.release();
    }
}

export async function getBookingsByTutorIds(tutorIds: number[]) {
  const client = await pool.connect();
    try {
        const res = await client.query(GET_BOOKINGS_BY_TUTOR_IDS, [tutorIds]);
        console.log('Bookings by tutor IDs:', res.rows);
        return res.rows;
    } catch (err) {
        console.error('Ошибка получения бронирований по ID преподавателей:', err);
        throw err;
    } finally {
        client.release();
    }
}

export async function cancelBooking(bookingId: number, cancellationReason: string, actorId: number, role: string) {
    const client = await pool.connect();
    try {
        const res = await client.query(CANCEL_BOOKING, [bookingId, actorId, cancellationReason, role]);
        console.log('Booking cancelled:', res.rows[0]);
        return res.rows[0];
    } catch (err) {
        console.error('Ошибка отмены бронирования:', err);
        throw err;
    } finally {
        client.release();
    }
}