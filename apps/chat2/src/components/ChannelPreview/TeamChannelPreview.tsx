export const TeamChannelPreview = ({name}: {name: string}) => (
  <div className='channel-preview__item'>
    <p>{`# ${name}`}</p>
  </div>
);