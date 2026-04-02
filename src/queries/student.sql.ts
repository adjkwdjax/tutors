export const GET_TUTOR_PROFILE_BY_TUTOR_ID = `
  SELECT tutor_id, public_name, bio, rating
    FROM tutors
    WHERE tutor_id = $1;
`;