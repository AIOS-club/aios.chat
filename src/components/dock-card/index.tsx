import { useRef, useState } from 'react';
import { animated, useIsomorphicLayoutEffect, useSpringValue } from '@react-spring/web';
import classNames from 'classnames';
import { useDock } from '@/components/dock/DockContext';
import useMousePosition from '@/hooks/useMousePosition';
import useWindowResize from '@/hooks/useWindowResize';
import { DockCardProps } from './DockCard';
import styles from './DockCard.module.less';

const INITIAL_HEIGHT = 48;

function DockCard({ children, onClick }: DockCardProps) {
  const [elCenterY, setElCenterY] = useState<number>(0);

  const cardRef = useRef<HTMLButtonElement>(null);

  const size = useSpringValue(INITIAL_HEIGHT, {
    config: {
      mass: 0.1,
      tension: 320,
    },
  });

  const x = useSpringValue(0, {
    config: {
      friction: 29,
      tension: 238,
    },
  });

  const dock = useDock();

  useMousePosition({
    onChange: ({ value }) => {
      const mouseY = value.y;
      if (dock.height > 0) {
        const transformedValue = INITIAL_HEIGHT + 32 * Math.cos((((mouseY - elCenterY) / dock.height) * Math.PI) / 2) ** 12;
        if (dock.hovered) {
          size.start(transformedValue).catch(() => {});
        }
      }
    },
  }, [elCenterY, dock]);

  useIsomorphicLayoutEffect(() => {
    if (!dock.hovered) {
      size.start(INITIAL_HEIGHT).catch(() => {});
    }
  }, [dock.hovered]);

  useWindowResize(() => {
    if (cardRef.current) {
      const { y } = cardRef.current.getBoundingClientRect();
      setElCenterY(y + INITIAL_HEIGHT / 2);
    }
  });

  return (
    <div className={styles.dockCardWrapper}>
      <animated.button
        ref={cardRef}
        onClick={onClick}
        className={classNames(styles.dockCard, 'dark:bg-slate-800')}
        style={{ width: size, height: size, x, }}
      >
        {children}
      </animated.button>
    </div>
  );
}

export default DockCard;
