import { pool } from '../lib/db'; // путь поправь под свой проект
import { CHECK_ACCESS_CODE_QUERY_AND_RETURN_ROLE } from '../queries/auth.sql'; // имя экспорта поправь под свой файл

export type AuthUser = {
    publicName: string;
    role: 'student' | 'tutor';
    'studentId'?: number;
    'tutorId'?: number;
    tutorIds?: number[];
    studentIds?: number[];
    subjects?: { subjectId: number; name: string }[];
};

export async function checkAccessCode(accessCode: string): Promise<AuthUser | null> {;
    const result = await pool.query(CHECK_ACCESS_CODE_QUERY_AND_RETURN_ROLE, [accessCode]);
    if (result.rows.length === 0) return null;
    return result.rows[0].user_data;
}