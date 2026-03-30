import CalendarView from './components/calendar';
import ListPanelView from './components/list-panel'
import { AuthModal } from './components/auth-modal';

import './globals.css';

export default function Home() {

  return (
    <div className='flex min-h-screen flex-col overflow-hidden p-4'>
      <AuthModal />
      <CalendarView />
      <ListPanelView />
    </div>
  );
}
