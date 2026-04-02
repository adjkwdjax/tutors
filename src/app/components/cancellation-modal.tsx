'use client';

import { Button, Modal } from '@mantine/core';
import { useAuth } from '../authProvider';

type CancellationModalProps = {
    opened: boolean;
    onClose: () => void;
    onCancellation?: (slotId: number) => void;
    slotId?: number;
    cancelletionReason?: string;
    
};

export function CancellationModal({ opened, onClose, onCancellation, slotId }: CancellationModalProps) {
    const { user } = useAuth();

    return (
        <Modal opened={opened} onClose={onClose} title='Student modal'>
            <p className='mb-3 text-sm text-slate-700'>role: student</p>
            <p className='mb-4 text-sm text-slate-800'>
                Вы уверены, что хотите отменить эту запись?
            </p>
            <div className='gap-2 flex flex-row justify-end'>
                <Button onClick={onClose} variant='light' color='yellow'>
                    Закрыть
                </Button>
                {slotId != null && (
                    <Button onClick={() => { if (onCancellation) onCancellation(slotId); }} variant='light' color='red'>
                        Подтвердить отмену
                    </Button>
                )}
            </div>
        </Modal>
    ); 
}
