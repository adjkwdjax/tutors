export const ADD_SLOT = `
  WITH inserted AS (
    INSERT INTO slots (tutor_id, time)
      VALUES ($1, $2)
      RETURNING slot_id, tutor_id, time
  )
  SELECT i.slot_id, t.tutor_id, t.public_name, t.bio, i.time, b.student_id AS is_booked_by, b.status
    FROM inserted i
    LEFT JOIN tutors t ON i.tutor_id = t.tutor_id
    LEFT JOIN LATERAL (
      SELECT bk.student_id, bk.status
        FROM bookings bk
        WHERE bk.booking_id = i.slot_id
        ORDER BY bk.created_at DESC
        LIMIT 1
    ) b ON true;
`;

export const DELETE_SLOT = `
  DELETE FROM slots
    WHERE slot_id = $1
    RETURNING slot_id;
`;

export const GET_SLOTS_BY_TUTOR_IDS = ` 
  SELECT s.slot_id, t.tutor_id, t.public_name, t.bio, s.time, b.student_id AS is_booked_by, b.status
    FROM slots s
    LEFT JOIN tutors t ON s.tutor_id = t.tutor_id
    LEFT JOIN LATERAL (
      SELECT bk.student_id, bk.status
        FROM bookings bk
        WHERE bk.booking_id = s.slot_id
        ORDER BY bk.created_at DESC
        LIMIT 1
    ) b ON true
    WHERE s.tutor_id = ANY($1::int[])
    ORDER BY s.time;
`;