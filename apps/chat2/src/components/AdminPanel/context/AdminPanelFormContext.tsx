import {
  ChangeEventHandler,
  createContext,
  MouseEventHandler,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Workspace } from '../../../context/WorkspaceController';
import { useChatContext } from 'stream-chat-react';
import { StreamChatType } from '../../../types';
import { useTeamContext } from '../../../hooks/useTeamContext';

type UpsertChannelParams = { name: string, members: string[], team?: string };

type ChannelType = 'team' | 'messaging';

type UpsertAction = 'create' | 'update';

export type FormValues = {
  name: string;
  members: string[];
  team?: string;
};

export type FormErrors = {
  name: string | null;
  members: string | null;
  team?: string;
};

type AdminPanelFormContext = FormValues & {
  handleInputChange: ChangeEventHandler<HTMLInputElement>;
  handleMemberSelect: ChangeEventHandler<HTMLInputElement>;
  handleSubmit: MouseEventHandler<HTMLButtonElement>;
  createChannelType?: ChannelType;
  errors: FormErrors;
};


const Context = createContext<AdminPanelFormContext>({
  handleInputChange: () => null,
  handleMemberSelect: () => null,
  handleSubmit: () => null,
  members: [],
  name: '',
  errors: { name: null, members: null },
});


type AdminPanelFormProps = {
  workspace: Workspace;
  onSubmit: () => void;
  defaultValues: FormValues;
}

const getChannelTypeFromWorkspaceName = (workspace: Workspace): ChannelType | undefined => (
  workspace.match(/.*__(team|messaging)/)?.[1] as ChannelType | undefined
);

const getUpsertAction = (workspace: Workspace): UpsertAction | undefined => {
  if (workspace.match('Channel-Create')) return 'create';
  if (workspace.match('Channel-Edit')) return 'update';
};

export const AdminPanelForm = ({ children, defaultValues, workspace, onSubmit }: PropsWithChildren<AdminPanelFormProps>) => {
  const { client, channel, setActiveChannel } = useChatContext<StreamChatType>();
  const [name, setChannelName] = useState<string>(defaultValues.name);
  const [members, setMembers] = useState<string[]>(defaultValues.members);
  const [errors, setErrors] = useState<FormErrors>({ name: null, members: null });

  const createChannelType = getChannelTypeFromWorkspaceName(workspace);
  const action = getUpsertAction(workspace);

  const createChannel = useCallback(async ({ name, members, team }: UpsertChannelParams) => {
    if (!createChannelType || members.length === 0) return;

    const newChannel = await client.channel(createChannelType, name, {
      name,
      members,
      demo: 'team',
      team
    });

    await newChannel.watch();

    setActiveChannel(newChannel);
  }, [createChannelType, setActiveChannel, client]);

  const updateChannel = useCallback(async ({ name, members }: UpsertChannelParams) => {
    if (name !== (channel?.data?.name || channel?.data?.id)) {
      await channel?.update(
        { name },
        { text: `Channel name changed to ${name}` },
      );
    }

    if (members?.length) {
      await channel?.addMembers(members);
    }
  }, [channel]);

  const validateForm = useCallback(({action, createChannelType, values}:{values: FormValues, createChannelType?: ChannelType, action?: UpsertAction}): FormErrors | null => {
    let errors:FormErrors = { name: null, members: null };

    if (action === 'create') {
      errors = {
        name: !values.name && createChannelType === 'team' ? 'Channel name is required' : null,
        members: values.members.length < 2  ? 'At least one additional member is required' : null,
      };
    }

    if (action === 'update' && values.name === defaultValues.name && values.members.length === 0) {
      errors = {
        name: 'Name not changed (change name or add members)',
        members: 'No new members added (change name or add members)',
      };
    }

    return Object.values(errors).some(v => !!v) ?  errors : null;
  }, [defaultValues.name]);

  const { team } = useTeamContext();

  const handleSubmit: MouseEventHandler<HTMLButtonElement> = useCallback(async (event) => {
    event.preventDefault();
    const errors = validateForm({values: {name, members}, action, createChannelType});

    if (errors) {
      setErrors(errors);
      return;
    }

    try {
      if (action === 'create') await createChannel({ name, members, team });
      if (action === 'update') await updateChannel({ name, members });
      onSubmit();
    } catch (err) {
      console.error(err);
    }
  }, [action, createChannelType, name, members, createChannel, updateChannel, onSubmit, validateForm, team]);

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
    event.preventDefault();
    setChannelName(event.target.value);
  }, []);

  const handleMemberSelect: ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
    setMembers((prevMembers) => {
      const { value } = event.target;
      if (event.target.checked) {
        return prevMembers.length ? [...prevMembers, value] : [value];
      }
      return prevMembers?.filter((prevUser) => prevUser !== value);
    });
  }, []);

  useEffect(() => {
    setChannelName(defaultValues.name);
    setMembers(defaultValues.members)
  }, [defaultValues, createChannelType]);

  return (
    <Context.Provider value={{
      createChannelType,
      errors,
      name,
      members,
      handleInputChange,
      handleMemberSelect,
      handleSubmit,
    }}>
      {children}
    </Context.Provider>
  );
};

export const useAdminPanelFormState = () => useContext(Context);