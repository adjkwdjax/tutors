import { NextResponse } from 'next/server';
import { checkAccessCode } from '../../../services/auth.service';

import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const body = await request.json();
  const code = body?.code;

  if (!code) {
    return NextResponse.json({ error: 'Code is required' }, { status: 400 });
  }

  const res = await checkAccessCode(code);

  if (!res) {
    return NextResponse.json({ error: 'Invalid code' }, { status: 401 });
  }

  const response = NextResponse.json(res);

  response.cookies.set('access_code', code, {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
  });

  return response;
}

export async function GET() {
  const cookieStore = await cookies();
  const code = cookieStore.get('access_code')?.value;

  if (!code) {
    return NextResponse.json({ user: null });
  }

  const res = await checkAccessCode(code);

  const normalizedUser = (res as unknown) === 'null' ? null : res;

  return NextResponse.json({ user: normalizedUser });
}