'use client';

import { Button, Modal } from '@mantine/core';
import { useAuth } from '../authProvider';
import { useState } from 'react';

import { CancellationModal } from './cancellation-modal';

type StudentSlotModalProps = {
  opened: boolean;
  time?: Date;
  slotId?: number;
  onClose: () => void;
  onDelete?: (slotId: number) => void;
  onBook?: (slotId: number, studentId: number) => void;
  isBookedBy: boolean;
  isSlot: boolean;
};

export function StudentSlotModal({ opened, time, slotId, onClose, onBook, onDelete, isBookedBy, isSlot }: StudentSlotModalProps) {
  const { user } = useAuth(); // Получаем studentId из контекста аутентификации
  const studentId = user?.role === 'student' ? user?.studentId : undefined;
  const [cancellationModalOpened, setCancellationModalOpened] = useState(false);

  return (
    <div>
    <Modal opened={opened} onClose={onClose} title='Student modal'>
      <p className='mb-3 text-sm text-slate-700'>role: student</p>
      <p className='mb-4 text-sm text-slate-800'>
        {time
          ? `Вы выбрали слот на ${time.toDateString()}. Для бронирования свяжитесь с вашим репетитором.`
          : 'Слот не выбран'}
      </p>
      {slotId != null && <p className='mb-4 text-sm text-slate-800'>ID слота: {slotId}</p>}
      <div className='gap-2 flex flex-row justify-end'>
        <Button onClick={onClose} variant='light' color='yellow'>
          Закрыть
        </Button>
        {isBookedBy && (
          <Button onClick={() => { if (slotId != null) setCancellationModalOpened(true); }} variant='light' color='red'>
            Отменить запись
          </Button>
        )}
        {isSlot && !isBookedBy && (
          <Button onClick={() => { if (onBook && slotId != null && studentId != null) onBook(slotId, studentId); }} variant='light' color='green'>
            Забронировать
          </Button>
        )}
      </div>
    </Modal>
    <CancellationModal opened={cancellationModalOpened} onClose={() => setCancellationModalOpened(false)} onCancellation={(slotId) => {
      if (onDelete) {
        onDelete(slotId);
      }
      setCancellationModalOpened(false);
    }} slotId={slotId} />
    </div>
  );
}
