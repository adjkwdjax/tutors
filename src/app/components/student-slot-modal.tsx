'use client';

import { Button, Modal, Fieldset, Textarea, FileInput } from '@mantine/core';
import { useAuth } from '../authProvider';
import { useState } from 'react';

import { CancellationModal } from './cancellation-modal';

type StudentSlotModalProps = {
  opened: boolean;
  time?: Date;
  slotId?: number;
  onClose: () => void;
  onDelete?: (slotId: number) => void;
  onBook?: (slotId: number, studentId: number, comment: string) => void;
  isBookedBy: boolean;
  isSlot: boolean;
};

export function StudentSlotModal({ opened, time, slotId, onClose, onBook, onDelete, isBookedBy, isSlot }: StudentSlotModalProps) {
  const [studentComment, setStudentComment] = useState('');
  const { user } = useAuth(); // Получаем studentId из контекста аутентификации
  const studentId = user?.role === 'student' ? user?.studentId : undefined;
  const [cancellationModalOpened, setCancellationModalOpened] = useState(false);

  return (
    <div>
    <Modal opened={opened} onClose={onClose} title={isBookedBy ? 'Моя запись' : 'Забронировать слот'}>
      <p className='mb-4 text-sm text-slate-800'>
        {time
          ? `Вы выбрали слот на ${time.toLocaleString()} по вашему локальному времени` // TODO: отформатировать дату и время более красиво
          : 'Слот не выбран'}
      </p>
      {!isBookedBy ? (
        <>
          <Fieldset legend="Информация для репетитора (необязательно)">
            <Textarea value={studentComment} onChange={(e) => setStudentComment(e.target.value)} label="Комментарий" placeholder="Что нужно знать репетитору?" />
          </Fieldset>
        </>
      ) : null}
      <div className='mt-2 gap-2 flex flex-row justify-end'>
        <Button onClick={onClose} variant='light' color='yellow'>
          Закрыть
        </Button>
        {isBookedBy && (
          <Button onClick={() => { if (slotId != null) setCancellationModalOpened(true); }} variant='light' color='red'>
            Отменить запись
          </Button>
        )}
        {isSlot && !isBookedBy && (
          <Button onClick={() => { if (onBook && slotId != null && studentId != null) onBook(slotId, studentId, studentComment); }} variant='light' color='green'>
            Забронировать
          </Button> 
        )}
      </div>
    </Modal>
    <CancellationModal closeModals={onClose} opened={cancellationModalOpened} onClose={() => setCancellationModalOpened(false)} slotId={slotId} />
    </div>
  );
}
