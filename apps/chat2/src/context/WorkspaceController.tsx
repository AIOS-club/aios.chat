import  React, { useCallback, useContext, useState } from 'react';

const noop = () => Promise.resolve();

export type Workspace = 'Chat' | 'Admin-Channel-Edit' | 'Admin-Channel-Create__team' | 'Admin-Channel-Create__messaging';

type WorkspaceContext = {
  activeWorkspace: Workspace;
  closeAdminPanel: () => void;
  displayWorkspace: (w: Workspace) => void;
  pinnedMessageListOpen: boolean;
  togglePinnedMessageListOpen: () => void;
  closePinnedMessageListOpen: () => void;
}

const WorkspaceControllerContext = React.createContext<WorkspaceContext>({
  activeWorkspace: 'Chat',
  closeAdminPanel: noop,
  displayWorkspace: noop,
  pinnedMessageListOpen: false,
  togglePinnedMessageListOpen: noop,
  closePinnedMessageListOpen: noop,
});


export const WorkspaceController = ({ children }: { children: React.ReactNode }) => {
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace>('Chat');
  const [pinnedMessageListOpen, setPinnedMessageListOpen] = useState(false);

  const displayWorkspace: WorkspaceContext['displayWorkspace'] = useCallback((workspace) => {
    setActiveWorkspace(workspace);
    setPinnedMessageListOpen(false);
  }, [setActiveWorkspace]);

  const closeAdminPanel = useCallback(() => {
    displayWorkspace('Chat');
  }, [displayWorkspace]);

  const togglePinnedMessageListOpen = useCallback(() => setPinnedMessageListOpen((prev) => !prev), []);
  const closePinnedMessageListOpen = useCallback(() => setPinnedMessageListOpen(false), []);

  return (
    <WorkspaceControllerContext.Provider value={{
      activeWorkspace,
      closeAdminPanel,
      displayWorkspace,
      pinnedMessageListOpen,
      closePinnedMessageListOpen,
      togglePinnedMessageListOpen,
    }}>
      {children}
    </WorkspaceControllerContext.Provider>
  );
};

export const useWorkspaceController = () => useContext(WorkspaceControllerContext);