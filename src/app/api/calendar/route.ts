// в этом файле мы только получаем и отдаем данные, никаких бизнес логик, валидаций и тд не должно быть, только вызов функции и отдача данных

import { NextResponse } from 'next/server'
import { pool } from '../../../lib/db'

import { getSlotsByTutorIds, createSlot } from '../../../services/calendar.service';

type CalendarRequestBody = {
  tutorId?: number;
  time?: string;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tutorIds = searchParams.get('tutorIds') ? searchParams.get('tutorIds')!.split(',').map(Number) : [];
  const res = await getSlotsByTutorIds(tutorIds);
  return NextResponse.json(res)
}

export async function POST(request: Request) { // createSlot в body приходит tutorId и time
  const body: CalendarRequestBody = await request.json();
  const { tutorId, time } = body;
  if (!tutorId || !time) {
    return NextResponse.json({ error: 'Missing tutorId or time' }, { status: 400 });
  }
  const newSlot = await createSlot(tutorId, time);
  return NextResponse.json(newSlot, { status: 201 });
}