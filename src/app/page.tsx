'use client';

import CalendarView from './components/calendar';
import TutorsListPanelView from './components/tutors-list-panel'
import { AuthModal } from './components/auth-modal';
import { useAuth } from './authProvider';

import './globals.css';

export default function Home() {

  const { user } = useAuth();

  return (
    <div className='flex min-h-screen flex-col overflow-hidden p-4'>
      <AuthModal />
      <CalendarView />
      <TutorsListPanelView />
    </div>
  );
}
