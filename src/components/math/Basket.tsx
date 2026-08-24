import React from 'react';
import Svg, { Ellipse, Line, Path } from 'react-native-svg';

type Props = {
  width?: number;
  height?: number;
  rim?: string;
  body?: string;
  weave?: string;
};

/** A simple woven wicker basket, drawn as flat vector shapes (no image asset needed). */
export default function Basket({ width = 128, height = 96, rim = '#C9935A', body = '#E8B472', weave = '#B87D3F' }: Props) {
  return (
    <Svg width={width} height={height} viewBox="0 0 128 96">
      <Path d="M14 34 L114 34 L98 90 L30 90 Z" fill={body} stroke={weave} strokeWidth={2} />
      <Line x1="20" y1="50" x2="108" y2="50" stroke={weave} strokeWidth={2} opacity={0.55} />
      <Line x1="17" y1="66" x2="111" y2="66" stroke={weave} strokeWidth={2} opacity={0.55} />
      <Line x1="34" y1="34" x2="24" y2="90" stroke={weave} strokeWidth={2} opacity={0.4} />
      <Line x1="50" y1="34" x2="44" y2="90" stroke={weave} strokeWidth={2} opacity={0.4} />
      <Line x1="64" y1="34" x2="64" y2="90" stroke={weave} strokeWidth={2} opacity={0.4} />
      <Line x1="78" y1="34" x2="84" y2="90" stroke={weave} strokeWidth={2} opacity={0.4} />
      <Line x1="94" y1="34" x2="104" y2="90" stroke={weave} strokeWidth={2} opacity={0.4} />
      <Ellipse cx="64" cy="34" rx="52" ry="9" fill={rim} stroke={weave} strokeWidth={2} />
    </Svg>
  );
}
