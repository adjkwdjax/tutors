// в этом файле мы только получаем и отдаем данные, никаких бизнес логик, валидаций и тд не должно быть, только вызов функции и отдача данных

import { NextResponse } from 'next/server'
import { pool } from '../../../lib/db'

export async function GET() {
  const res = await pool.query('UPDATE students SET public_name = $1 RETURNING *', ['Иван Петров'])
  return NextResponse.json(res.rows)
}