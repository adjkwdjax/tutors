'use client';

import { Button, Modal, Fieldset, Textarea, Alert, CopyButton, Tooltip, ActionIcon } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { useAuth } from '../authProvider';
import { useEffect, useState } from 'react';
import { CopyIcon, CheckIcon } from '@phosphor-icons/react';
import Payment from './payment';

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
  status: string;
  boardLink?: string;
  callLink?: string;
};

export function StudentSlotModal({ opened, time, slotId, onClose, onBook, onDelete, isBookedBy, isSlot, status }: StudentSlotModalProps) {
  const [studentComment, setStudentComment] = useState('');
  const [tutorComment, setTutorComment] = useState('');
  const [boardLink, setBoardLink] = useState('');
  const [callLink, setCallLink] = useState('');
  const { user } = useAuth(); // Получаем studentId из контекста аутентификации
  const studentId = user?.role === 'student' ? user?.studentId : undefined;
  const [cancellationModalOpened, setCancellationModalOpened] = useState(false);

  useEffect(() => {
    if (!opened) {
      setStudentComment('');
      setTutorComment('');
      setBoardLink('');
      setCallLink('');
    }
  }, [opened]);

  const onSaveStudentComment = async (comment: string) => {
    if (slotId == null) {
      Notifications.show({
        title: 'Ошибка',
        message: 'Не найден id записи',
        color: 'red',
        autoClose: 4000,
        position: 'top-right',
      });
      return;
    }

    try {
      const response = await fetch('/api/bookings/update-comment', {
        method: 'POST',
        body: JSON.stringify({ bookingId: slotId, comment, role: 'student' }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        Notifications.show({
          title: 'Ошибка',
          message: data?.error || 'Не удалось сохранить комментарий',
          color: 'red',
          autoClose: 4000,
          position: 'top-right',
        });
        return;
      }

      Notifications.show({
        title: 'Комментарий',
        message: 'Комментарий успешно сохранен',
        color: 'green',
        autoClose: 3000,
        position: 'top-right',
      });
      setStudentComment('');
      onClose();
    } catch {
      Notifications.show({
        title: 'Ошибка сети',
        message: 'Проверьте подключение и попробуйте снова',
        color: 'red',
        autoClose: 4000,
        position: 'top-right',
      });
    }
  };

  useEffect(() => {
    if (!isBookedBy || slotId == null) {
      return;
    }

    fetch(`/api/bookings/booking-info?id=${slotId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Booking not found') {
          setStudentComment('');
          setTutorComment('');
          Notifications.show({
            title: 'Ошибка',
            message: 'Информация о записи не найдена',
            color: 'red',
            autoClose: 5000,
            position: 'top-right',
          });

          return;
        }
        setStudentComment(data.comment_student || '');
        setTutorComment(data.comment_tutor || '');
        setBoardLink(data.board_link || '');
        setCallLink(data.call_link || '');
      });
  }, [slotId, isBookedBy]);

  if (status === 'cancelled') {
    return (
      <Modal opened={opened} onClose={onClose} title='Отменённый слот'>
        <Alert variant="light" color="red" title="Оплачиваемая отмена">
          Вы отменили занятие менее чем за 1 час до начала. В это время репетитор уже зарезервировал слот для вас и, к сожалению, не успел предложить его другому ученику, поэтому занятие будет списано.
          <br />
          <br />
          Первая поздняя отмена проходит без списания - как предупреждение.
          <br />
          <br />
          Если репетитор отменит занятие менее чем за 1 час, вам будет начислен бесплатный урок.
          <br />
          <br />
          Понимаем, что планы могут меняться, поэтому рекомендуем отменять занятия заранее.
          <br />
          <br />
          <Payment />
        </Alert>
      </Modal>
    );
  }

  if (isBookedBy) {
    return (
      <Modal opened={opened} onClose={onClose} title='Моя запись'>
        <p className='mb-4 text-sm text-slate-800'>
          {time
            ? `Вы выбрали слот на ${time.toLocaleString()} по вашему локальному времени` // TODO: отформатировать дату и время более красиво
            : 'Слот не выбран'}
        </p>
        <Fieldset legend="Доп. информация">
          <Textarea value={studentComment} onChange={(e) => setStudentComment(e.target.value)} label="Комментарий репетитору" placeholder="Что нужно знать репетитору?" /> 
          <Textarea
            readOnly
            autosize
            value={tutorComment}
            label="Комментарий от репетитора"
            placeholder="Репетитор не оставил комментарий"
          />
          <Textarea
          rightSection={callLink && <CopyButton value={callLink} timeout={2000}>
              {({ copied, copy }) => (
                <Tooltip label={copied ? 'Скопировано' : 'Копировать'} withArrow position="right">
                  <ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy}>
                    {copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>
            }
            readOnly
            autosize
            value={callLink || ''}
            label="Ссылка на звонок"
            placeholder="Репетитор не предоставил ссылку на звонок"
            />
          <Textarea
          rightSection={boardLink && <CopyButton value={boardLink} timeout={2000}>
              {({ copied, copy }) => (
                <Tooltip label={copied ? 'Скопировано' : 'Копировать'} withArrow position="right">
                  <ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy}>
                    {copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>
            }
            readOnly
            autosize
            value={boardLink || ''}
            label="Ссылка на доску"
            placeholder="Репетитор не предоставил ссылку на доску"
          />

        </Fieldset>
        <div className='mt-2 gap-2 flex flex-row justify-end'>
          <Button onClick={() => { if (slotId != null) setCancellationModalOpened(true); }} variant='light' color='red'>
            Отменить запись
          </Button>
          <Button onClick={() => onSaveStudentComment(studentComment)} variant='light' color='blue'>
            Сохранить комментарий
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
          <Button onClick={() => { if (onBook && slotId != null && studentId != null) onBook(slotId, studentId, studentComment); }} variant='light' color='green'>
            Забронировать
          </Button> 
      </div>
    </Modal>
    <CancellationModal closeModals={onClose} opened={cancellationModalOpened} onClose={() => setCancellationModalOpened(false)} slotId={slotId} />
    </div>
  );
}
