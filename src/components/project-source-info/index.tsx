import React from 'react';
import { Image, Typography } from '@douyinfe/semi-ui';
import aiAvator from '@/assets/img/aiAvator.jpg';

const { Text } = Typography;

const ProjectSourceInfo: React.FC = () => {
  return (
    <div className="flex flex-col items-center h-full dark:bg-gray-800 pt-32">
      <Image preview={false} height="200" width="200" style={{ boxShadow: '0 5px 10px rgba(0,0,0,.12)' }} src={aiAvator} />
      <Typography className="text-gray-600 font-medium my-8 dark:text-gray-300 text-xl">
        本网站由<Text className="mx-1 text-xl" link={{ href: 'https://github.com/AIOS-club', target: '_blank' }}>AIOS</Text>社区提供API和网页服务
      </Typography>
    </div>
  );
};

export default ProjectSourceInfo;
