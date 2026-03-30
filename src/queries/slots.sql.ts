export const ADD_SLOT = `
  INSERT INTO slots (tutor_id, time)
    VALUES ($1, $2)
    RETURNING slot_id, tutor_id, time;
`;

export const DELETE_SLOT = `
  DELETE FROM slots
    WHERE slot_id = $1
    RETURNING slot_id;
`;

export const ADD_BOOKING = `
  INSERT INTO bookings (slot_id, student_id, price)
    VALUES ($1, $2, $3)
    RETURNING booking_id, slot_id, student_id, status, price, comment_tutor, comment_student;
`;

export const GET_SLOTS_BY_TUTOR_IDS = `
  SELECT slot_id, tutor_id, time
    FROM slots
    WHERE tutor_id = ANY($1::int[])
    ORDER BY time;
`;

export const GET_BOOKINGS_BY_TUTOR_IDS = `
  SELECT booking_id, slot_id, student_id, status, price, comment_tutor, comment_student, cancellation_reason, tutor_id, cancelled_by_role, cancelled_by_student_id, cancelled_by_tutor_id, cancelled_at
    FROM bookings
    WHERE tutor_id = ANY($1::int[])
`;
