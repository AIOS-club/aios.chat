import  React, { useEffect } from 'react';
import { Chat } from 'stream-chat-react';

import { useChecklist } from './ChecklistTasks';
import { client, i18nInstance } from './common/client';
import { ChannelContainer } from './components/ChannelContainer/ChannelContainer';
import { Sidebar } from './components/Sidebar/Sidebar';

import { WorkspaceController } from './context/WorkspaceController';
import { TeamContextProvider } from './hooks/useTeamContext';

const urlParams = new URLSearchParams(window.location.search);

const targetOrigin = urlParams.get('target_origin') || "https://getstream.io" || process.env.REACT_APP_TARGET_ORIGIN;
const theme = urlParams.get('theme') || 'light';

const App = () => {
  useChecklist({ chatClient: client, targetOrigin: targetOrigin! });

  useEffect(() => {
    const handleColorChange = (color: string) => {
      const root = document.documentElement;
      if (color.length && color.length === 7) {
        root.style.setProperty('--primary-color', `${color}E6`);
        root.style.setProperty('--primary-color-alpha', `${color}1A`);
      }
    };

    window.addEventListener('message', (event) => handleColorChange(event.data));
    return () => {
      client.disconnectUser();
      window.removeEventListener('message', (event) => handleColorChange(event.data));
    };
  }, []);

  return (
    <>
      <div className='app__wrapper str-chat'>
        <Chat {...{ client, i18nInstance }} theme={`team ${theme}`}>
          <WorkspaceController>
            <TeamContextProvider>
              <Sidebar />
              <ChannelContainer />
            </TeamContextProvider>
          </WorkspaceController>
        </Chat>
      </div>
    </>
  );
};

export default App;
