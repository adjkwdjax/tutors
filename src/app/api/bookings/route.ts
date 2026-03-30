// в этом файле мы только получаем и отдаем данные, никаких бизнес логик, валидаций и тд не должно быть, только вызов функции и отдача данных

import { NextResponse } from 'next/server'
import { pool } from '../../../lib/db'

import { getSlotsByTutorIds } from '../../../services/slots.service';

import { GET_SLOTS_BY_TUTOR_IDS } from '@/src/queries/slots.sql';

export async function GET() {
  const res = await pool.query(GET_SLOTS_BY_TUTOR_IDS, []); // заменить 1 на реальный tutorId
  return NextResponse.json(res.rows)
}