import React, { memo, useMemo, useState } from "react"
import { useChannelsModel } from "../../../hooks/useChannelsModel"
import { Collapse, Tabs, TabPane, Tree } from '@douyinfe/semi-ui';
import { TreeNodeData } from "@douyinfe/semi-ui/lib/es/tree";

interface ChannelListProps {
  service: string
}

const ChannelList: React.FC<ChannelListProps> = (props) => {
  
  const [ data ] = useChannelsModel()

  const result: TreeNodeData[] = []
  data?.forEach((item) => {
    if (item.service === props.service) {
      const i = result.findIndex((i) => i.key === item.type)
      if (i > -1) {
        result[i].children?.push({
          label: item.title,
          value: item.id,
          key: item.id,
        })
      } else {
        result.push({
          label: item.type,
          value: item.type,
          key: item.type,
          children: [
            {
              label: item.title,
              value: item.id,
              key: item.id,
            }
          ]
        })
      }
    }
  })

  const [value, setValue] = useState(result[0]?.children?.[0]?.value)
  
  const onChange = (value?: string) => {
    value?.startsWith('cn') && setValue(value)
  }

  return  <div className="flex">
    <Tree
      treeData={result}
      defaultExpandAll
      onChange={value => onChange(value as string | undefined)}
      style={{
        width: 260,
        height: 420,
        border: '1px solid var(--semi-color-border)'
    }}
    />
    <div>
      {value}
    </div>
  </div>
}

export default memo(ChannelList)