import { createContext, useContext } from 'react';
import { SpringValue } from '@react-spring/web';

interface DockApi {
  hovered: boolean
  height: number
  zoomLevel?: SpringValue
  setIsZooming: (isZooming: boolean) => void
}

export const DockContext = createContext<DockApi>({ height: 0, hovered: false, setIsZooming: () => {} });

export const useDock = () => useContext(DockContext);
