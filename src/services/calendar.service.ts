import { pool } from '../lib/db'; // путь поправь под свой проект
import { GET_SLOTS_BY_TUTOR_IDS, ADD_SLOT } from '../queries/slots.sql';

export type Tutor = {
    tutorId: number;
    publicName: string;
    bio: string;
};

export type Slot = {
    slotId: number;
    tutor: Tutor;
    time: string; // ISO строка
    isBookedBy: number | null; // studentId, который забронировал слот, или null если слот свободен
    status: string | null;
};

export async function getSlotsByTutorIds(tutorIds: number[]): Promise<Slot[]> {
    const result = await pool.query(GET_SLOTS_BY_TUTOR_IDS, [tutorIds]);
    return result.rows.map(row => ({
        slotId: row.slot_id,
        tutor: {
            tutorId: row.tutor_id,
            publicName: row.public_name,
            bio: row.bio,
        },
        time: row.time,
        isBookedBy: row.is_booked_by, // может быть null, если слот не забронирован
        status: row.status ?? null,
    }));
}

export async function createSlot(tutorId: number, time: string): Promise<Slot> {
    const result = await pool.query(
        ADD_SLOT,
        [tutorId, time]
    );
    return {
        slotId: result.rows[0].slot_id,
        tutor: {
            tutorId: result.rows[0].tutor_id,
            publicName: result.rows[0].public_name,
            bio: result.rows[0].bio,
        },
        time: result.rows[0].time,
        isBookedBy: result.rows[0].is_booked_by,
        status: result.rows[0].status ?? null,
    };
}