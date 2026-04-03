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
  const [tutorComment, setTutorComment] = useState('');
  const { user } = useAuth(); // Получаем studentId из контекста аутентификации
  const studentId = user?.role === 'student' ? user?.studentId : undefined;
  const [cancellationModalOpened, setCancellationModalOpened] = useState(false);

  if (isBookedBy) {
    fetch(`/api/bookings/booking-info?id=${slotId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }) 

      .then((response) => response.json())
      .then((data) => {
        setStudentComment(data.comment_student || '');
        setTutorComment(data.comment_tutor || '');
      });

    return (
      <Modal opened={opened} onClose={onClose} title='Моя запись'>
        <p className='mb-4 text-sm text-slate-800'>
          {time
            ? `Вы выбрали слот на ${time.toLocaleString()} по вашему локальному времени` // TODO: отформатировать дату и время более красиво
            : 'Слот не выбран'}
        </p>
        <Fieldset legend="Доп. информация">
          <Textarea value={studentComment} onChange={(e) => setStudentComment(e.target.value)} label="Комментарий репетитору" placeholder="Что нужно знать репетитору?" /> {// TODO сделать чтобы комментарий можно было оставить и редактировать}
          <Textarea
            readOnly
            autosize
            value={tutorComment}
            label="Комментарий от репетитора"
            placeholder="Репетитор не оставил комментарий"
          />
        </Fieldset>
        <div className='mt-2 gap-2 flex flex-row justify-end'>
          <Button onClick={onClose} variant='light' color='yellow'>
            Закрыть
          </Button>
          <Button onClick={() => { if (slotId != null) setCancellationModalOpened(true); }} variant='light' color='red'>
            Отменить запись
          </Button>
        </div>
        <CancellationModal closeModals={onClose} opened={cancellationModalOpened} onClose={() => setCancellationModalOpened(false)} slotId={slotId} />
      </Modal>
    );
  }

  return (
    <div>
    <Modal opened={opened} onClose={onClose} title={isBookedBy ? 'Моя запись' : 'Забронировать слот'}>
      <p className='mb-4 text-sm text-slate-800'>
        {time
          ? `Вы выбрали слот на ${time.toLocaleString()} по вашему локальному времени` // TODO: отформатировать дату и время более красиво
          : 'Слот не выбран'}
      </p>
          <Fieldset legend="Информация для репетитора (необязательно)">
            <Textarea value={studentComment} onChange={(e) => setStudentComment(e.target.value)} label="Комментарий" placeholder="Что нужно знать репетитору?" />
          </Fieldset>
      <div className='mt-2 gap-2 flex flex-row justify-end'>
        <Button onClick={onClose} variant='light' color='yellow'>
          Закрыть
        </Button>
          <Button onClick={() => { if (onBook && slotId != null && studentId != null) onBook(slotId, studentId, studentComment); }} variant='light' color='green'>
            Забронировать
          </Button> 
      </div>
    </Modal>
    <CancellationModal closeModals={onClose} opened={cancellationModalOpened} onClose={() => setCancellationModalOpened(false)} slotId={slotId} />
    </div>
  );
}
