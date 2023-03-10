import React from "react";
import { log } from "logger";
import { Tabs, TabPane, Image, Icon, Avatar } from '@douyinfe/semi-ui';
// import { IconFile, IconGlobe, IconHelpCircle } from '@douyinfe/semi-icons';
import { useServiceConfigModel } from "../../hooks/useWebConfigModel";
import ChannelList from "./components/channel-list";

export default function Channels() {

	const [ config, err, loading ] = useServiceConfigModel()

	const renderTabs = () => {
		return config?.length ? config?.map((item, index) => {
			return (
				<Tabs.TabPane
					tab={
						<Avatar size="large" src={item.icon} style={{ margin: 4 }} alt='service'>
						</Avatar>
					}
					key={item.service}
					itemKey={item.service}
				>
					<ChannelList service={item.service} />
				</Tabs.TabPane>
			)
		}) : <></>
	}

  return (
    <div>
      <Tabs tabPosition="left" type="button">
				{
					renderTabs()
				}
      </Tabs>
    </div>
  );
}
