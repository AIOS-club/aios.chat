
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { OwnUserResponse } from 'stream-chat';
import { connectUserPromise } from '../common/client';

type teamStateObj = {
  user: OwnUserResponse|null
  team: string|undefined
  setTeam: (team: string|undefined) => void
};
export const TeamContext = React.createContext<teamStateObj>({} as teamStateObj);

export const TeamContextProvider = ({children}: {children: React.ReactNode}) => {

  const [user, setUser] = useState<OwnUserResponse|null>(null)
  const [team, setTeam] = useState<string|undefined>()

  useEffect(() => {
    // client.on('health.check', (event) => {
    //   console.log("event", event)
    // })
    connectUserPromise.then((res) => {
      console.log('res', res)
      setUser(res?.me as unknown as OwnUserResponse)
      if (res?.me) {
        setTeam(res?.me?.teams?.[0])
      }
    });
  }, [])

  useEffect(() => {
    console.log('team change', team)
  }, [team])

  return (
    <TeamContext.Provider value={{
      user,
      team,
      setTeam,
    }}>
      {children}
    </TeamContext.Provider>
  )
};

export const useTeamContext = () => useContext(TeamContext);
