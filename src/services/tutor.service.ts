import { pool } from '../lib/db'; // путь поправь под свой проект
import { GET_TUTOR_PROFILE_BY_TUTOR_ID } from '../queries/tutor.sql';

export async function getTutorProfile(tutorId: number) {
  const client = await pool.connect();
    try {
        const res = await client.query(GET_TUTOR_PROFILE_BY_TUTOR_ID, [tutorId]);
        console.log('Tutor profile data:', res.rows[0]);
        return res.rows[0];
    } catch (err) {
        console.error('Ошибка получения профиля пользователя:', err);
        throw err;
    } finally {
        client.release();
    }
}