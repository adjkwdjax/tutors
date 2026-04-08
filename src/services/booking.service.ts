import { pool } from '../lib/db'; // путь поправь под свой проект
import { ADD_BOOKING, GET_BOOKINGS_BY_TUTOR_IDS, CANCEL_BOOKING, GET_BOOKING_BY_ID, UPDATE_BOOKING_COMMENT, GET_PREVIOUS_BOOKINGS_BY_STUDENT_ID } from '../queries/bookings.sql';

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

export async function getBookingById(bookingId: number) {
    const client = await pool.connect();
    try {
        const res = await client.query(GET_BOOKING_BY_ID, [bookingId]);
        console.log('Booking by ID:', res.rows[0]);
        return res.rows[0];
    } catch (err) {
        console.error('Ошибка получения бронирования по ID:', err);
        throw err;
    } finally {
        client.release();
    }
}

export async function updateBookingComment(bookingId: number, comment: string, actorId: number, role: string) {
    const client = await pool.connect();
    try {
        if (role === 'tutor' && !comment.trim()) {
            throw new Error('Tutor comment is required');
        }

        const res = await client.query(UPDATE_BOOKING_COMMENT, [comment, bookingId, role, actorId]);

        if (res.rowCount === 0) {
            throw new Error('Booking not found or access denied');
        }

        console.log('Booking comment updated:', res.rows[0]);
        return res.rows[0];
    } catch (err) {
        console.error('Ошибка обновления комментария бронирования:', err);
        throw err;
    } finally {
        client.release();
    }
}

export async function getPreviousBookingsByStudentId(studentId: number) {
    const client = await pool.connect();
    try {        const res = await client.query(GET_PREVIOUS_BOOKINGS_BY_STUDENT_ID, [studentId]);
        console.log('Previous bookings by student ID:', res.rows);
        return res.rows;
    }
    catch (err) {
        console.error('Ошибка получения предыдущих бронирований по ID студента:', err);
        throw err;
    } finally {        client.release();
    }
}