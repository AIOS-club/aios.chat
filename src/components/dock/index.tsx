import React, {
  useMemo, useState, useRef, useCallback, useEffect 
} from 'react';
import { animated, useSpringValue } from '@react-spring/web';
import { clamp } from '@react-spring/shared';
import classNames from 'classnames';
import useWindowResize from '@/hooks/useWindowResize';
import { DockContext } from './DockContext';
import styles from './Dock.module.less';

interface DockProps {
  children: React.ReactNode
  display: boolean;
}

function Dock({ children, display }: DockProps) {
  const [hovered, setHovered] = useState(false);
  const [height, setHeight] = useState(0);

  const isZooming = useRef(false);
  const dockRef = useRef<HTMLDivElement>(null);

  const setIsZooming = useCallback((value: boolean) => {
    isZooming.current = value;
    setHovered(!value);
  }, []);

  const zoomLevel = useSpringValue(1, {
    onChange: () => {
      if (dockRef.current) setHeight(dockRef.current.clientHeight);
    },
  });

  const left = useSpringValue(12, { config: { mass: 0.1, tension: 320, } });

  useEffect(() => {
    left.start(display ? 12 : -100).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [display]);

  useWindowResize(() => {
    if (dockRef.current) setHeight(dockRef.current.clientHeight);
  });

  const dockContextValue = useMemo(() => ({
    height,
    zoomLevel,
    hovered,
    setIsZooming
  }), [hovered, setIsZooming, height, zoomLevel]);

  return (
    <DockContext.Provider value={dockContextValue}>
      <animated.div
        ref={dockRef}
        className={classNames(styles.dock, 'dark:bg-slate-900')}
        onMouseOver={() => {
          if (!isZooming.current) {
            setHovered(true);
          }
        }}
        onMouseOut={() => {
          setHovered(false);
        }}
        style={{
          y: '-50%',
          left,
          scale: zoomLevel.to({ range: [-100, 1, 50], output: [2, 1, 0.5], }).to((value) => clamp(0.5, 2, value)),
        }}
      >
        {children}
      </animated.div>
    </DockContext.Provider>
  );
}

export default Dock;
