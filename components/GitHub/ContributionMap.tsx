'use client';

import { useEffect, useState } from 'react';
import { ContributionData } from '@/lib/github/contributions';
import styles from './ContributionMap.module.css';

export default function ContributionMap() {
  const [data, setData] = useState<ContributionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/github/contributions')
      .then((res) => res.json())
      .then((responseData) => {
        if (responseData.error) {
          setError(responseData.error);
        } else {
          setData(responseData);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load contributions:', err);
        setError('Failed to load contribution data');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className={styles.loading}>LOADING CONTRIBUTION MAP...</div>;
  }

  if (error) {
    return <div className={styles.error}>ERROR: {error}</div>;
  }

  if (!data || data.weeks.length === 0) {
    return <div className={styles.noData}>No contribution data available</div>;
  }

  // Get month labels for the top
  const getMonthLabel = (weekIndex: number) => {
    if (weekIndex >= data.weeks.length) return '';
    const firstDay = data.weeks[weekIndex].days[0];
    if (!firstDay) return '';

    const date = new Date(firstDay.date);
    const day = date.getDate();

    // Show month label if it's the first week or first few days of the month
    if (day <= 7) {
      return date.toLocaleDateString('en-US', { month: 'short' });
    }
    return '';
  };

  // Day labels
  const dayLabels = ['Mon', 'Wed', 'Fri'];
  const dayIndices = [0, 2, 4]; // Monday, Wednesday, Friday

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.totalContributions}>
          {data.totalContributions.toLocaleString()} contributions in the last year
        </span>
      </div>

      <div className={styles.graph}>
        {/* Month labels */}
        <div className={styles.months}>
          <div className={styles.monthsOffset}></div>
          {data.weeks.map((_, index) => (
            <div key={index} className={styles.monthLabel}>
              {getMonthLabel(index)}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className={styles.grid}>
          {/* Day labels on the left */}
          <div className={styles.dayLabels}>
            {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => (
              <div key={dayIndex} className={styles.dayLabel}>
                {dayIndices.includes(dayIndex) ? dayLabels[dayIndices.indexOf(dayIndex)] : ''}
              </div>
            ))}
          </div>

          {/* Contribution squares */}
          <div className={styles.weeks}>
            {data.weeks.map((week, weekIndex) => (
              <div key={weekIndex} className={styles.week}>
                {week.days.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={`${styles.day} ${styles[`level${day.level}`]}`}
                    title={`${day.count} contributions on ${new Date(day.date).toLocaleDateString()}`}
                    data-count={day.count}
                    data-date={day.date}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        <span className={styles.legendLabel}>Less</span>
        <div className={`${styles.legendSquare} ${styles.level0}`} />
        <div className={`${styles.legendSquare} ${styles.level1}`} />
        <div className={`${styles.legendSquare} ${styles.level2}`} />
        <div className={`${styles.legendSquare} ${styles.level3}`} />
        <div className={`${styles.legendSquare} ${styles.level4}`} />
        <span className={styles.legendLabel}>More</span>
      </div>
    </div>
  );
}
