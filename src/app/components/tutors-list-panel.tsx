'use client';

import { useEffect, useMemo, useState } from 'react';
import { Avatar, Grid, Checkbox } from '@mantine/core';
import { useAuth } from '../authProvider';

type TutorProfile = {
  tutor_id: number;
  public_name: string;
  bio?: string;
};

export default function TutorsListPanelView() {
  const { user } = useAuth();
  const [tutors, setTutors] = useState<TutorProfile[]>([]);
  const [isLoadingTutors, setIsLoadingTutors] = useState(false);

  const tutorIdsKey = useMemo(() => {
    if (!Array.isArray(user?.tutorIds)) {
      return '';
    }

    return [...user.tutorIds].sort((a: number, b: number) => a - b).join(',');
  }, [user?.tutorIds]);

  useEffect(() => {
    if (user?.role !== 'student' || !Array.isArray(user?.tutorIds) || user.tutorIds.length === 0) {
      setTutors([]);
      return;
    }

    let isCancelled = false;
    setIsLoadingTutors(true);

    Promise.all(
      user.tutorIds.map((tutorId: number) =>
        fetch(`/api/tutor?tutorId=${tutorId}`).then((res) => {
          if (!res.ok) {
            throw new Error(`Failed to fetch tutor ${tutorId}`);
          }
          return res.json();
        }),
      ),
    )
      .then((profiles) => {
        if (!isCancelled) {
          setTutors(profiles.filter(Boolean));
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setTutors([]);
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoadingTutors(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [user?.role, tutorIdsKey]);

  if (user?.role === 'student') {
    return (<div className="mt-4 w-[50vw] h-auto rounded-lg border bg-white p-4">
      {user.tutorIds && user.tutorIds.length > 0 ? (
        isLoadingTutors ? (
          <p className="text-center text-muted-foreground">Loading tutors...</p>
        ) : (
          <Grid grow justify="center"> 
            {tutors.map((tutor) => (
              <Grid.Col onClick={() => console.log('Васюган')} key={tutor.tutor_id} span={4} className="cursor-pointer flex flex-col items-center">
                <Avatar key={tutor.tutor_id} src={null} alt={tutor.public_name} radius="xl" size={'xl'} className="mb-2">
                  {tutor.public_name.substring(0, 3).toUpperCase()}
                </Avatar>
                <h3 className="font-semibold">{tutor.public_name}</h3>

              </Grid.Col>
            ))}
          </Grid>
        )
      ) : (
        <p className="text-center text-muted-foreground">К вам пока что не прикреплен ни один репетитор, ожидайте.</p>
      )}

    </div>
  );
  }

  return null;
}
