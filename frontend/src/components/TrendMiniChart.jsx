const toneMap = {
  positive: "#3ecf8e",
  negative: "#f56565",
  neutral: "#8b91a8"
};

export default function TrendMiniChart({ values, tone = "neutral" }) {
  if (!values?.length) {
    return null;
  }

  const width = 60;
  const height = 20;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const mappedPoints = values
    .map((value, index) => {
      const x = values.length === 1 ? width / 2 : (index / (values.length - 1)) * width;
      const normalized =
        max === min ? 0.5 : (value - min) / (max - min);
      const y = height - normalized * (height - 4) - 2;
      return [x, y];
    })
    .filter(Boolean);
  const points = mappedPoints.map(([x, y]) => `${x},${y}`).join(" ");
  const areaPoints = [`0,${height}`, ...mappedPoints.map(([x, y]) => `${x},${y}`), `${width},${height}`].join(" ");
  const stroke = toneMap[tone] || toneMap.neutral;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <defs>
        <linearGradient id={`trend-${tone}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.42" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon fill={`url(#trend-${tone})`} points={areaPoints} />
      <polyline
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}
