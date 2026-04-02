// в этом файле мы только получаем и отдаем данные, никаких бизнес логик, валидаций и тд не должно быть, только вызов функции и отдача данных

import { NextResponse } from 'next/server'
import { pool } from '../../../lib/db'

import { getTutorProfile } from '@/src/services/tutor.service';

import { GET_TUTOR_PROFILE_BY_TUTOR_ID } from '@/src/queries/tutor.sql';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tutorId = searchParams.get('tutorId');

  if (!tutorId) {
    return NextResponse.json({ error: 'Missing tutorId parameter' }, { status: 400 });
  }

  try {
    const profile = await getTutorProfile(Number(tutorId));
    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tutor profile' }, { status: 500 });
  }
}