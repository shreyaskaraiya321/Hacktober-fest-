import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { motionTokens } from './activity-heatmap-utils/motion-tokens';
import styles from './activity-heatmap-utils/activity-heatmap.module.css';

export interface ActivityDay {
  date: string;
  count: number;
  level?: 0 | 1 | 2 | 3 | 4;
}

export interface ActivityHeatmapProps {
  data?: ActivityDay[];
  startDate?: string | Date;
  endDate?: string | Date;
  className?: string;
  onDayClick?: (day: ActivityDay) => void;
  showLegend?: boolean;
  totalCount?: number;
}

// Helper to calculate contribution intensity level (0 to 4)
const calculateLevel = (count: number): 0 | 1 | 2 | 3 | 4 => {
  if (count <= 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
};

// Generates 52 weeks (364 days) of sample contribution data if none is passed
const generateDefaultDays = (): ActivityDay[] => {
  const days: ActivityDay[] = [];
  const now = new Date();
  const totalDays = 52 * 7;

  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    // Pseudo-random realistic contribution clusters
    const randomSeed = Math.sin(i * 0.3) * 10 + Math.cos(i * 0.1) * 5;
    const isActive = Math.random() > 0.45;
    const count = isActive ? Math.max(0, Math.floor(Math.abs(randomSeed) % 12)) : 0;
    
    days.push({
      date: dateStr,
      count,
      level: calculateLevel(count),
    });
  }

  return days;
};

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({
  data,
  className = '',
  onDayClick,
  showLegend = true,
  totalCount,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredDay, setHoveredDay] = useState<ActivityDay | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  const days = useMemo(() => {
    if (data && data.length > 0) {
      return data.map((d) => ({
        ...d,
        level: d.level !== undefined ? d.level : calculateLevel(d.count),
      }));
    }
    return generateDefaultDays();
  }, [data]);

  const computedTotal = useMemo(() => {
    if (totalCount !== undefined) return totalCount;
    return days.reduce((acc, curr) => acc + curr.count, 0);
  }, [days, totalCount]);

  const handleMouseEnter = (day: ActivityDay, e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const cellRect = e.currentTarget.getBoundingClientRect();

    setTooltipPos({
      x: cellRect.left - containerRect.left + cellRect.width / 2,
      y: cellRect.top - containerRect.top,
    });
    setHoveredDay(day);
  };

  const handleMouseLeave = () => {
    setHoveredDay(null);
    setTooltipPos(null);
  };

  return (
    <div
      ref={containerRef}
      className={`${styles.root} relative select-none font-sans ${className}`}
    >
      {/* Grid of 7 rows (days of week) auto-flowing horizontally */}
      <div className={styles.grid}>
        {days.map((day) => {
          const level = day.level ?? calculateLevel(day.count);
          const levelClass = styles[`level${level}`] || styles.level0;

          return (
            <motion.div
              key={day.date}
              className={`${styles.cell} ${levelClass}`}
              whileHover={{ scale: 1.3 }}
              transition={motionTokens.spring.snappy}
              onMouseEnter={(e) => handleMouseEnter(day, e)}
              onMouseLeave={handleMouseLeave}
              onClick={() => onDayClick?.(day)}
            />
          );
        })}
      </div>

      {/* Floating High-Contrast Black Tooltip */}
      <AnimatePresence>
        {hoveredDay && tooltipPos && (
          <motion.div
            className={styles.tooltip}
            style={{
              left: tooltipPos.x,
              top: tooltipPos.y,
              transform: 'translate(-50%, -125%)',
            }}
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 2, scale: 0.95 }}
            transition={{
              duration: motionTokens.duration.fast,
              ease: motionTokens.ease.standard,
            }}
          >
            <div className="font-semibold text-white">
              {hoveredDay.count} {hoveredDay.count === 1 ? 'contribution' : 'contributions'}
            </div>
            <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
              {new Date(hoveredDay.date).toLocaleDateString(undefined, {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend & Stats Footer */}
      {showLegend && (
        <div className="flex items-center justify-between text-xs text-zinc-500 font-mono mt-3 pt-2 border-t border-zinc-200/80">
          <div>
            <span className="font-semibold text-zinc-800">{computedTotal.toLocaleString()}</span> contributions in the last year
          </div>

          <div className="flex items-center gap-1.5 text-[11px]">
            <span>Less</span>
            <div className="flex items-center gap-1">
              <span className={`${styles.cell} ${styles.level0} cursor-default`} />
              <span className={`${styles.cell} ${styles.level1} cursor-default`} />
              <span className={`${styles.cell} ${styles.level2} cursor-default`} />
              <span className={`${styles.cell} ${styles.level3} cursor-default`} />
              <span className={`${styles.cell} ${styles.level4} cursor-default`} />
            </div>
            <span>More</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityHeatmap;
