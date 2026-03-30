export const CHECK_ACCESS_CODE_QUERY_AND_RETURN_ROLE = `
    SELECT jsonb_build_object(
    'publicName', s.public_name,
    'role', 'student',
    'studentId', s.student_id,
    'tutorIds', COALESCE(
        array_agg(DISTINCT ts.tutor_id) FILTER (WHERE ts.tutor_id IS NOT NULL),
        '{}'::int[]
    )
    ) AS user_data
    FROM students s
    LEFT JOIN tutor_students ts ON ts.student_id = s.student_id
    WHERE s.access_code = $1
    GROUP BY s.public_name, s.student_id

    UNION ALL

    SELECT jsonb_build_object(
    'publicName', t.public_name,
    'role', 'tutor',
    'tutorId', t.tutor_id,
    'studentIds', COALESCE(
                (
                    SELECT array_agg(DISTINCT ts.student_id)
                        FROM tutor_students ts
                        WHERE ts.tutor_id = t.tutor_id
                            AND ts.student_id IS NOT NULL
                ),
        '{}'::int[]
        ),
        'students', COALESCE(
                (
                    SELECT jsonb_agg(
                        jsonb_build_object(
                            'id', s.student_id,
                            'name', s.public_name
                        )
                        ORDER BY s.public_name
                    )
                        FROM tutor_students ts
                        JOIN students s ON s.student_id = ts.student_id
                        WHERE ts.tutor_id = t.tutor_id
                            AND ts.student_id IS NOT NULL
                ),
                '[]'::jsonb
        ),
        'subjects', COALESCE(
                (
                    SELECT jsonb_agg(
                        jsonb_build_object(
                            'subjectId', s.subject_id,
                            'name', s.name
                        )
                        ORDER BY s.subject_id
                    )
                            FROM tutor_subjects tsub
                            JOIN subjects s ON s.subject_id = tsub.subject_id
                            WHERE tsub.tutor_id = t.tutor_id
                ),
                '[]'::jsonb
    )
    ) AS user_data
    FROM tutors t
    WHERE t.access_code = $1
        GROUP BY t.public_name, t.tutor_id;
`;