'use client';

import { Button, Modal, Fieldset, NativeSelect, MultiSelect, Textarea, FileInput } from '@mantine/core';
import { useAuth } from '../authProvider';


type TutorSlotModalProps = {
  opened: boolean;
  time?: Date;
  slotId?: number;
  onSaved: () => Promise<void>;
  onClose: () => void;
  isSlot: boolean;
};

const onSaveSlot = async ({
  onClose,
  onSaved,
  tutorId,
  time,
  }: {
    onClose: () => void;
    onSaved: () => Promise<void>;
    tutorId: number;
    time: Date;
  }) => {
    fetch('/api/calendar', {
      method: 'POST',
      body: JSON.stringify({ tutorId, time }),
      headers: {
        'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then(async (data) => {
      console.log('Slot saved:', data);
      await onSaved();
      onClose();
    })
    .catch((error) => {
      console.error('Error saving slot:', error);
    });
};

export function TutorSlotModal({ opened, time, slotId, isSlot, onSaved, onClose }: TutorSlotModalProps) {
  const { user } = useAuth();

  if (isSlot) {
    return (
      <Modal opened={opened} onClose={onClose} title='Редактировать слот' transitionProps={{ duration: 0 }}>
        <p className='mb-3 text-sm text-slate-700'>role: tutor</p>
        <p className='mb-4 text-sm text-slate-800'>
          {time
            ? `Вы выбрали слот на ${time.toDateString()}. Для создания слота свяжитесь с вашим студентом.`
            : 'Слот не выбран'}
        </p>
        {slotId != null && <p className='mb-4 text-sm text-slate-800'>ID слота: {slotId}</p>}
      <div className='mt-5 gap-2 flex justify-end'>
        <Button onClick={onClose} variant='light' color='red'>
          Закрыть
        </Button>
        <Button
          onClick={() => {}}
          variant='light'
          color='green'
        >
          Сохранить
        </Button>
      </div>
      </Modal>
    );
  }

  return (
    <Modal opened={opened} onClose={onClose} title='Создать слот' transitionProps={{ duration: 0 }}>
      <Fieldset>
        <legend>Информация о слоте</legend>
        <p className='mb-2 text-sm text-slate-600'>
          {time ? `Дата и время: ${time}` : 'Дата и время не выбраны'}
        </p>
        <NativeSelect
          label='Предмет'
          data={
            [
              { value: '', label: 'Не выбрано' },
              ...(user?.subjects?.map((subject: any) => ({
                value: subject.subjectId.toString(),
                label: subject.name,
              })) || []),
            ]
          }
        />
        <MultiSelect
          label='Ученики'
          onChange={(values) => console.log(values)}
          searchable
          data={
            user?.studentIds?.map((id: number) => ({
              value: id.toString(),
              label: user.students?.find((s: any) => s.id === id)?.name || `Ученик ${id}`,
            })) || []
          }
        />
        <Textarea label='Комментарий' placeholder='Дополнительная информация для ученика' autosize minRows={2} maxRows={6} />
        <FileInput label='Прикрепить файлы' placeholder='Выберите файлы для прикрепления к слоту' multiple />

      </Fieldset>
      <div className='mt-5 gap-2 flex justify-end'>
        <Button onClick={onClose} variant='light' color='red'>
          Закрыть
        </Button>
        <Button
          onClick={() => {
            if (!time || !user?.tutorId) {
              return;
            }

            onSaveSlot({ onClose, onSaved, tutorId: user.tutorId, time });
          }}
          variant='light'
          color='green'
        >
          Сохранить
        </Button>
      </div>
    </Modal>
  );
}
