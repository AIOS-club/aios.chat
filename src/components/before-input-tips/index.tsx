import { FC, ReactElement } from 'react';
import { Icon } from '@douyinfe/semi-ui';
import SunTips from '@/assets/SunTips.svg';
import Lightning from '@/assets/lightning.svg';
import Warning from '@/assets/warning.svg';
import { BeforeInputTipsProps } from './BeforeInputTips';

const Examples = [
  'Explain quantum computing in simple terms',
  'Got any creative ideas for a 10 year old’s birthday?',
  'How do I make an HTTP request in Javascript?'
];

const BeforeInputTips: FC<BeforeInputTipsProps> = (props) => {
  const { setValue } = props;

  const renderTipsButtons = (): ReactElement => (
    <ul className="flex flex-col gap-3.5">
      {Examples.map((v: string) => (
        <button
          key={v}
          onClick={() => setValue(v)}
          className="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-900"
        >
          {`"${v}" →`}
        </button>
      ))}
    </ul>
  );

  return (
    <div className="flex flex-col items-center text-sm h-full dark:bg-gray-800">
      <div className="text-gray-800 w-full md:max-w-2xl lg:max-w-3xl md:h-full md:flex md:flex-col px-6 dark:text-gray-100">
        <h1 className="text-4xl font-semibold md:mt-[10vh] ml-auto mr-auto mb-8 sm:mb-16 hover:cursor-pointer mt-[12px]">
          Chat
        </h1>
        <div className="flex items-start text-center gap-3.5">
          <div className="flex flex-col gap-3.5 flex-1">
            <Icon svg={<SunTips />} />
            <h2 className="text-lg font-normal">Examples</h2>
            {renderTipsButtons()}
          </div>
          <div className="flex flex-col gap-3.5 flex-1">
            <Icon svg={<Lightning />} />
            <h2 className="text-lg font-normal">Capabilities</h2>
            <ul className="flex flex-col gap-3.5">
              <li className="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md">
                Remembers what user said earlier in the conversation
              </li>
              <li className="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md">
                Allows user to provide follow-up corrections
              </li>
              <li className="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md">
                Trained to decline inappropriate requests
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-3.5 flex-1">
            <Icon svg={<Warning />} />
            <h2 className="text-lg font-normal">Limitations</h2>
            <ul className="flex flex-col gap-3.5">
              <li className="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md">
                May occasionally generate incorrect information
              </li>
              <li className="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md">
                May occasionally produce harmful instructions or biased content
              </li>
              <li className="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md">
                Limited knowledge of world and events after 2021
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="w-full h-48 flex-shrink-0"></div>
    </div>
  );
};

export default BeforeInputTips;
