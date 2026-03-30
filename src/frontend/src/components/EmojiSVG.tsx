import React from "react";

export interface EmojiConfig {
  color: string;
  eyeStyle: string;
  mouthStyle: string;
  accessory: string;
  expression: string;
  baseShape: string;
  name?: string;
}

const BASE_COLORS: Record<string, string> = {
  yellow: "#FFD93D",
  orange: "#FF922B",
  pink: "#F783AC",
  blue: "#74C0FC",
  green: "#69DB7C",
  purple: "#B197FC",
  red: "#FF6B6B",
  brown: "#A8825A",
};

function getColor(color: string): string {
  return BASE_COLORS[color] ?? color;
}

function getDarkerColor(color: string): string {
  const hex = getColor(color);
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  return `rgb(${Math.max(0, r - 40)},${Math.max(0, g - 40)},${Math.max(0, b - 40)})`;
}

function Eyes({
  eyeStyle,
  expression,
}: { eyeStyle: string; expression: string }) {
  const lx = 68;
  const rx = 132;
  const ey = 90;
  const angry = expression === "surprised";
  const sleepyExp = expression === "sleepy";
  const effectiveStyle = sleepyExp ? "sleepy" : eyeStyle;

  const renderEye = (cx: number, flip = false) => {
    switch (effectiveStyle) {
      case "dots":
        return <circle cx={cx} cy={ey} r={7} fill="#1a1a2e" />;
      case "wide":
        return (
          <>
            <ellipse cx={cx} cy={ey} rx={9} ry={11} fill="white" />
            <circle cx={cx} cy={ey + 1} r={6} fill="#1a1a2e" />
            <circle cx={cx + 2} cy={ey - 2} r={2} fill="white" />
          </>
        );
      case "sleepy":
        return (
          <path
            d={`M${cx - 9},${ey} Q${cx},${ey - 10} ${cx + 9},${ey}`}
            stroke="#1a1a2e"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        );
      case "wink":
        if (flip) {
          return (
            <path
              d={`M${cx - 9},${ey - 4} Q${cx},${ey + 6} ${cx + 9},${ey - 4}`}
              stroke="#1a1a2e"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
          );
        }
        return <circle cx={cx} cy={ey} r={7} fill="#1a1a2e" />;
      case "stars":
        return (
          <text
            x={cx}
            y={ey + 5}
            textAnchor="middle"
            fontSize="16"
            fill="#FFD700"
          >
            ★
          </text>
        );
      default:
        return <circle cx={cx} cy={ey} r={7} fill="#1a1a2e" />;
    }
  };

  return (
    <g>
      {angry && (
        <>
          <path
            d={`M${lx - 10},${ey - 16} L${lx + 10},${ey - 10}`}
            stroke="#1a1a2e"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d={`M${rx - 10},${ey - 10} L${rx + 10},${ey - 16}`}
            stroke="#1a1a2e"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </>
      )}
      {renderEye(lx)}
      {renderEye(rx, true)}
    </g>
  );
}

function Mouth({
  mouthStyle,
  expression,
}: { mouthStyle: string; expression: string }) {
  const cy = 125;
  const effectiveStyle =
    expression === "happy"
      ? "smile"
      : expression === "sad"
        ? "sad"
        : expression === "surprised"
          ? "surprised"
          : expression === "cool"
            ? "smirk"
            : expression === "sleepy"
              ? "smile"
              : mouthStyle;

  switch (effectiveStyle) {
    case "smile":
      return (
        <path
          d={`M80,${cy} Q100,${cy + 20} 120,${cy}`}
          stroke="#1a1a2e"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
        />
      );
    case "big grin":
      return (
        <>
          <path
            d={`M72,${cy - 4} Q100,${cy + 28} 128,${cy - 4}`}
            stroke="#1a1a2e"
            strokeWidth="3.5"
            fill="#1a1a2e"
            strokeLinecap="round"
          />
          <path
            d={`M72,${cy - 4} Q100,${cy + 28} 128,${cy - 4}`}
            fill="white"
            stroke="none"
          />
          <path
            d={`M72,${cy - 4} Q100,${cy + 28} 128,${cy - 4}`}
            stroke="#1a1a2e"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
          />
        </>
      );
    case "sad":
      return (
        <path
          d={`M80,${cy + 16} Q100,${cy} 120,${cy + 16}`}
          stroke="#1a1a2e"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
        />
      );
    case "surprised":
      return <ellipse cx={100} cy={cy + 8} rx={12} ry={16} fill="#1a1a2e" />;
    case "smirk":
      return (
        <path
          d={`M82,${cy + 8} Q96,${cy + 20} 118,${cy}`}
          stroke="#1a1a2e"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
        />
      );
    default:
      return (
        <path
          d={`M80,${cy} Q100,${cy + 20} 120,${cy}`}
          stroke="#1a1a2e"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
        />
      );
  }
}

function Accessory({ type }: { type: string }) {
  switch (type) {
    case "glasses":
      return (
        <g>
          <circle
            cx={68}
            cy={90}
            r={16}
            stroke="#555"
            strokeWidth="2.5"
            fill="none"
          />
          <circle
            cx={132}
            cy={90}
            r={16}
            stroke="#555"
            strokeWidth="2.5"
            fill="none"
          />
          <line
            x1={84}
            y1={90}
            x2={116}
            y2={90}
            stroke="#555"
            strokeWidth="2.5"
          />
          <line x1={38} y1={87} x2={52} y2={90} stroke="#555" strokeWidth="2" />
          <line
            x1={148}
            y1={90}
            x2={162}
            y2={87}
            stroke="#555"
            strokeWidth="2"
          />
        </g>
      );
    case "sunglasses":
      return (
        <g>
          <rect
            x={52}
            y={76}
            width={32}
            height={24}
            rx={8}
            fill="#1a1a2e"
            opacity={0.85}
          />
          <rect
            x={116}
            y={76}
            width={32}
            height={24}
            rx={8}
            fill="#1a1a2e"
            opacity={0.85}
          />
          <line
            x1={84}
            y1={88}
            x2={116}
            y2={88}
            stroke="#1a1a2e"
            strokeWidth="3"
          />
          <line
            x1={38}
            y1={84}
            x2={52}
            y2={88}
            stroke="#1a1a2e"
            strokeWidth="2.5"
          />
          <line
            x1={148}
            y1={88}
            x2={162}
            y2={84}
            stroke="#1a1a2e"
            strokeWidth="2.5"
          />
        </g>
      );
    case "hat":
      return (
        <g>
          <rect x={62} y={22} width={76} height={38} rx={6} fill="#2d2d44" />
          <rect x={46} y={56} width={108} height={12} rx={6} fill="#2d2d44" />
          <rect
            x={62}
            y={22}
            width={76}
            height={38}
            rx={6}
            fill="none"
            stroke="#444"
            strokeWidth="1.5"
          />
        </g>
      );
    case "halo":
      return (
        <ellipse
          cx={100}
          cy={26}
          rx={38}
          ry={10}
          fill="none"
          stroke="#FFD700"
          strokeWidth="4"
          opacity={0.9}
        />
      );
    case "bowtie":
      return (
        <g transform="translate(100,155)">
          <polygon points="-22,-10 0,0 -22,10" fill="#FF5AA5" />
          <polygon points="22,-10 0,0 22,10" fill="#FF5AA5" />
          <circle cx={0} cy={0} r={5} fill="#e0439a" />
        </g>
      );
    default:
      return null;
  }
}

function Cheeks() {
  return (
    <g opacity={0.35}>
      <ellipse cx={56} cy={115} rx={14} ry={9} fill="#FF8FAB" />
      <ellipse cx={144} cy={115} rx={14} ry={9} fill="#FF8FAB" />
    </g>
  );
}

interface Props {
  config: EmojiConfig;
  size?: number;
  id?: string;
}

export function EmojiSVG({ config, size = 200, id }: Props) {
  const faceColor = getColor(config.color);
  const shadowColor = getDarkerColor(config.color);

  return (
    <svg
      id={id}
      width={size}
      height={size}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={`Cartoon emoji with ${config.eyeStyle} eyes and ${config.mouthStyle} mouth`}
      role="img"
    >
      <title>Cartoon emoji</title>
      <ellipse cx={100} cy={192} rx={52} ry={7} fill="rgba(0,0,0,0.1)" />
      <circle cx={100} cy={100} r={80} fill={faceColor} />
      <ellipse
        cx={72}
        cy={62}
        rx={22}
        ry={14}
        fill="white"
        opacity={0.25}
        transform="rotate(-20,72,62)"
      />
      <circle
        cx={100}
        cy={110}
        r={78}
        fill="none"
        stroke={shadowColor}
        strokeWidth="6"
        opacity={0.15}
      />
      <Cheeks />
      <Eyes eyeStyle={config.eyeStyle} expression={config.expression} />
      <Mouth mouthStyle={config.mouthStyle} expression={config.expression} />
      <Accessory type={config.accessory} />
    </svg>
  );
}

export { BASE_COLORS };
