'use client';

import { useEffect } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { PinInput, Modal, Loader, Portal } from '@mantine/core';
import { useAuth } from '../authProvider';

export function AuthModal() {
  const { user, loading } = useAuth();
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    if (!loading && !user) {
      open();
      return;
    }

    close();
  }, [loading, user, open, close]);

  if (loading) {
  return (
    <Portal>
      <div className='fixed inset-0 z-1000 flex items-center justify-center bg-black/80'>
        <Loader color='yellow'/>
      </div>
    </Portal>
  );
}

  return (
    <>
      {!user && (
        <Modal
          opened={opened}
          onClose={close}
          withCloseButton={false}
          title="Authentication"
          closeOnClickOutside={false}
          closeOnEscape={false}
          className='bg-black rounded-xl'
        >
          <div>
            <PinInput
              type={/^[a-zA-Z0-9-]+$/}
              length={9}
              onComplete={async (value) => {
                const res = await fetch('/api/auth', {
                  method: 'POST',
                  body: JSON.stringify({ code: value }),
                });

                if (res.ok) {
                  close();
                  window.location.reload();
                } else {
                  alert('Invalid code');
                }
              }}
            />
          </div>
        </Modal>
      )}
    </>
  );
}
