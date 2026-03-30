export const GET_SUBJECTS_BY_TUTOR_IDS = `
  SELECT s.subject_id, s.name, ts.tutor_id
    FROM tutor_subjects ts
    JOIN subjects s ON s.subject_id = ts.subject_id
    WHERE ts.tutor_id = ANY($1::int[]);
`;