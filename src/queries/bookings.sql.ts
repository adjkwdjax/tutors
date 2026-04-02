export const ADD_BOOKING = `
  INSERT INTO bookings (booking_id, student_id, tutor_id)
  SELECT s.slot_id, $2, s.tutor_id
    FROM slots s
    WHERE s.slot_id = $1
  RETURNING booking_id AS slot_id, student_id, tutor_id, status, price, comment_tutor, comment_student;
`;

export const GET_BOOKINGS_BY_TUTOR_IDS = `
  SELECT b.booking_id AS slot_id, b.student_id, b.status, b.price, b.comment_tutor, b.comment_student, b.cancellation_reason, t.tutor_id, t.public_name, t.bio, b.cancelled_by_role, b.cancelled_by_student_id, b.cancelled_by_tutor_id, b.cancelled_at
    FROM bookings b
    LEFT JOIN tutors t ON b.tutor_id = t.tutor_id
    WHERE b.tutor_id = ANY($1::int[])
`;

export const CANCEL_BOOKING = `
  UPDATE bookings
    SET status = 'cancelled'::booking_status,
        cancellation_reason = $3,
        cancelled_at = NOW(),
        cancelled_by_role = $4::user_role,
        cancelled_by_student_id = CASE
          WHEN $4::user_role = 'student'::user_role THEN $2::int
          ELSE NULL
        END,
        cancelled_by_tutor_id = CASE
          WHEN $4::user_role = 'tutor'::user_role THEN $2::int
          ELSE NULL
        END
    WHERE booking_id = $1
    RETURNING booking_id AS slot_id, student_id, tutor_id, status, price, comment_tutor, comment_student;
`;