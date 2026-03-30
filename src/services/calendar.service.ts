import { pool } from '../lib/db'; // путь поправь под свой проект
import { GET_SLOTS_BY_TUTOR_IDS, ADD_SLOT } from '../queries/slots.sql';

export type Slot = {
    slotId: number;
    tutorId: number;
    time: string; // ISO строка
};

export async function getSlotsByTutorIds(tutorIds: number[]): Promise<Slot[]> {
    const result = await pool.query(GET_SLOTS_BY_TUTOR_IDS, [tutorIds]);
    return result.rows.map(row => ({
        slotId: row.slot_id,
        tutorId: row.tutor_id,
        time: row.time,
    }));
}

export async function createSlot(tutorId: number, time: string): Promise<Slot> {
    const result = await pool.query(
        ADD_SLOT,
        [tutorId, time]
    );
    return {
        slotId: result.rows[0].slot_id,
        tutorId: result.rows[0].tutor_id,
        time: result.rows[0].time,
    };
}