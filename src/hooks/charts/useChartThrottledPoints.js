import { debounce } from 'lodash';
import { useEffect, useMemo, useRef, useState } from 'react';
import { palette } from '@cardstack/theme';
import { monotoneCubicInterpolation } from '@rainbow-me/animated-charts';
import { useChartData, useChartDataLabels } from '@rainbow-me/hooks';

const traverseData = (prev, data) => {
  if (!data || data.length === 0) {
    return prev;
  }
  const filtered = data.filter(({ y }) => y);
  if (
    filtered[0].y === prev?.nativePoints[0]?.y &&
    filtered[0].x === prev?.nativePoints[0]?.x
  ) {
    return prev;
  }
  const points = monotoneCubicInterpolation({
    data: filtered,
    includeExtremes: true,
    range: 100,
  });
  return {
    nativePoints: filtered,
    points,
  };
};

export default function useChartThrottledPoints({ asset }) {
  const color = palette.tealDark;

  const [isFetchingInitially, setIsFetchingInitially] = useState(true);

  const { chart, chartType, fetchingCharts, ...chartData } = useChartData(
    asset
  );

  const [throttledPoints, setThrottledPoints] = useState(() =>
    traverseData({ nativePoints: [], points: [] }, chart)
  );

  useEffect(() => {
    setThrottledPoints(prev => traverseData(prev, chart));
  }, [chart]);

  const initialChartDataLabels = useChartDataLabels({
    asset,
    chartType,
    color,
    points: throttledPoints?.points ?? [],
  });

  useEffect(() => {
    if (!fetchingCharts) {
      setIsFetchingInitially(false);
    }
  }, [fetchingCharts]);

  // Only show the chart if we have chart data, or if chart data is still loading
  const showChart = useMemo(
    () =>
      throttledPoints?.points.length > 5 ||
      throttledPoints?.points.length > 5 ||
      (fetchingCharts && !isFetchingInitially),
    [fetchingCharts, isFetchingInitially, throttledPoints]
  );

  const [throttledData, setThrottledData] = useState({
    nativePoints: throttledPoints.nativePoints,
    points: throttledPoints.points,
    smoothingStrategy: 'bezier',
  });

  const debouncedSetThrottledData = useRef(debounce(setThrottledData, 30))
    .current;

  useEffect(() => {
    if (throttledPoints.points && !fetchingCharts) {
      debouncedSetThrottledData({
        nativePoints: throttledPoints.nativePoints,
        points: throttledPoints.points,
        smoothingStrategy: 'bezier',
      });
    }
  }, [throttledPoints, fetchingCharts, debouncedSetThrottledData]);

  return {
    chart,
    chartData,
    chartType,
    color,
    fetchingCharts,
    initialChartDataLabels,
    showChart,
    throttledData,
  };
}
