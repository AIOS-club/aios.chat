import React from 'react';
import { Image, Typography } from '@douyinfe/semi-ui';
import AIOSLOGO from '@/assets/img/AIOS-LOGO.png';

const { Text } = Typography;

const ProjectSourceInfo: React.FC = function ProjectSourceInfo() {
  return (
    <div className="flex flex-col items-center justify-center h-full dark:bg-gray-800 pb-32">
      <Image preview={false} height="200" width="200" src={AIOSLOGO} />
      <Typography className="text-gray-600 font-medium my-8 dark:text-gray-300 text-xl">
        本网站由
        <Text className="mx-1 text-xl" link={{ href: 'https://github.com/AIOS-club', target: '_blank' }}>AIOS</Text>
        社区提供API和网页服务
      </Typography>
    </div>
  );
};
export default ProjectSourceInfo;
