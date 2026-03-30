'use client';

import { Button, Modal } from '@mantine/core';

type StudentSlotModalProps = {
  opened: boolean;
  time?: Date;
  slotId?: number;
  onClose: () => void;
  isSlot: boolean;
};

export function StudentSlotModal({ opened, time, slotId, onClose, isSlot }: StudentSlotModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title='Student modal'>
      <p className='mb-3 text-sm text-slate-700'>role: student</p>
      <p className='mb-4 text-sm text-slate-800'>
        {time
          ? `Вы выбрали слот на ${time.toDateString()}. Для бронирования свяжитесь с вашим репетитором.`
          : 'Слот не выбран'}
      </p>
      {slotId != null && <p className='mb-4 text-sm text-slate-800'>ID слота: {slotId}</p>}
      <Button onClick={onClose} variant='light' color='yellow'>
        Закрыть
      </Button>
    </Modal>
  );
}
