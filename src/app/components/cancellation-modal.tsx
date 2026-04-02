'use client';

import { Button, Modal, Textarea, Alert  } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { useAuth } from '../authProvider';
import { useState } from 'react';

type CancellationModalProps = {
    opened: boolean;
    onClose: () => void;
    slotId?: number;
    cancellationReason?: string;
    closeModals: () => void;
};

const onCancelletion = (slotId: number, cancellationReason: string, studentId: number, role: string, closeModals: () => void, onClose: () => void) => {
  fetch('/api/bookings/cancel-booking', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ bookingId: slotId, studentId, cancellationReason, role: role }),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Booking cancelled:', data);
      onClose();
      closeModals();
        Notifications.show({ title: 'Отмена', message: 'Запись успешно отменена', color: 'green', autoClose: 4000, position: 'top-right' });
    })
    .catch(error => {
      console.error('Error cancelling booking:', error);
      // Здесь можно обработать ошибку, например, показать уведомление пользователю
    });

};

export function CancellationModal({ opened, onClose, slotId, closeModals }: CancellationModalProps) {
    const { user } = useAuth();
    const [cancellationReason, setCancellationReason] = useState('');

    return (
        <Modal opened={opened} onClose={onClose} title='Отмена записи'>
            <div className='flex flex-col gap-2'>
            <p className='text-sm text-slate-800'>
                Вы уверены, что хотите отменить эту запись?
            </p>
            <Textarea value={cancellationReason} onChange={(e) => setCancellationReason(e.target.value)} label="Причина отмены" placeholder="Введите причину отмены"></Textarea>
            <Alert variant="light" color="red" title="Оплачиваемая отмена">
                Так как репетитор уже не успеет найти другого ученика на это время, при отмене менее чем за 12 часов до занятия, с вас будет удержана плата за занятие. <p></p>Исключение составляют только форс-мажорные обстоятельства.
            </Alert>

            <div className='gap-2 flex flex-row justify-end'>
                <Button onClick={onClose} variant='light' color='yellow'>
                    Закрыть
                </Button>
                {slotId != null && (
                    <Button onClick={() => { if (onCancelletion) onCancelletion(slotId, cancellationReason, user?.id, user?.role, closeModals, onClose); }} variant='light' color='red'>
                        Подтвердить отмену
                    </Button>
                )}
            </div>
            </div>
        </Modal>
    ); 
}
