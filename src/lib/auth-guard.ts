import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { checkAccessCode } from '../services/auth.service';
import type { AuthUser } from '../services/auth.service';

export type ActorRole = 'student' | 'tutor';

type ResolveActorSuccess = {
    ok: true;
    actorId: number;
    user: AuthUser;
};

type ResolveActorFailure = {
    ok: false;
    response: NextResponse;
};

export async function resolveActorIdFromAccessCode(role: ActorRole): Promise<ResolveActorSuccess | ResolveActorFailure> {
    const cookieStore = await cookies();
    const code = cookieStore.get('access_code')?.value;

    if (!code) {
        return {
            ok: false,
            response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
        };
    }

    const user = await checkAccessCode(code);

    if (!user || user.role !== role) {
        return {
            ok: false,
            response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
        };
    }

    const actorId = role === 'tutor' ? user.tutorId : user.studentId;
    if (!actorId) {
        return {
            ok: false,
            response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
        };
    }

    return {
        ok: true,
        actorId,
        user,
    };
}


