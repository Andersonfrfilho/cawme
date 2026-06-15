import Svg, {
  Circle,
  Rect,
  Path,
  Defs,
  LinearGradient,
  Stop,
  Text as SvgText,
} from "react-native-svg";

import type { CardBrand } from "@/modules/account/services/account.service";

type LogoProps = { size: number };

function VisaLogo({ size }: LogoProps) {
  return (
    <Svg width={size * 1.6} height={size} viewBox="0 0 160 100">
      <Rect width="160" height="100" rx="8" fill="#1A1F71" />
      <SvgText
        x="80"
        y="72"
        textAnchor="middle"
        fontSize="52"
        fontWeight="bold"
        fontStyle="italic"
        fill="white"
        letterSpacing="2"
      >
        VISA
      </SvgText>
    </Svg>
  );
}

function MastercardLogo({ size }: LogoProps) {
  // Two circles r=40, centers at (57,50) and (93,50).
  // Lens intersection at x=75, y≈14.3 and y≈85.7.
  return (
    <Svg width={size * 1.5} height={size} viewBox="0 0 150 100">
      <Circle cx="57" cy="50" r="40" fill="#EB001B" />
      <Circle cx="93" cy="50" r="40" fill="#F79E1B" />
      {/* Lens overlap — blended orange */}
      <Path
        d="M75 14.3 A40 40 0 0 1 75 85.7 A40 40 0 0 1 75 14.3 Z"
        fill="#FF5F00"
        opacity="0.85"
      />
    </Svg>
  );
}

function EloLogo({ size }: LogoProps) {
  return (
    <Svg width={size * 1.6} height={size} viewBox="0 0 160 100">
      <Rect width="160" height="100" rx="8" fill="#FFE040" />
      <SvgText
        x="80"
        y="68"
        textAnchor="middle"
        fontSize="48"
        fontWeight="bold"
        fill="#1A1A1A"
        letterSpacing="2"
      >
        elo
      </SvgText>
    </Svg>
  );
}

function HipercardLogo({ size }: LogoProps) {
  return (
    <Svg width={size * 1.6} height={size} viewBox="0 0 160 100">
      <Defs>
        <LinearGradient id="hiperGrad" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#C2141C" />
          <Stop offset="1" stopColor="#9C0F15" />
        </LinearGradient>
      </Defs>
      <Rect width="160" height="100" rx="8" fill="url(#hiperGrad)" />
      <Rect x="0" y="0" width="160" height="14" rx="8" fill="#D9181F" />
      <SvgText
        x="80"
        y="70"
        textAnchor="middle"
        fontSize="38"
        fontWeight="bold"
        fill="white"
        letterSpacing="1"
      >
        hiper
      </SvgText>
    </Svg>
  );
}

function AmexLogo({ size }: LogoProps) {
  return (
    <Svg width={size * 1.6} height={size} viewBox="0 0 160 100">
      <Defs>
        <LinearGradient id="amexGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#3090CE" />
          <Stop offset="1" stopColor="#1A6FA8" />
        </LinearGradient>
      </Defs>
      <Rect width="160" height="100" rx="8" fill="url(#amexGrad)" />
      <SvgText
        x="80"
        y="57"
        textAnchor="middle"
        fontSize="36"
        fontWeight="bold"
        fill="white"
        letterSpacing="3"
      >
        AMEX
      </SvgText>
      <SvgText
        x="80"
        y="78"
        textAnchor="middle"
        fontSize="13"
        fill="white"
        opacity="0.7"
        letterSpacing="1"
      >
        AMERICAN EXPRESS
      </SvgText>
    </Svg>
  );
}

export function CardBrandLogo({ brand, size }: { brand: CardBrand; size: number }) {
  switch (brand) {
    case "visa":
      return <VisaLogo size={size} />;
    case "mastercard":
      return <MastercardLogo size={size} />;
    case "elo":
      return <EloLogo size={size} />;
    case "hipercard":
      return <HipercardLogo size={size} />;
    case "amex":
      return <AmexLogo size={size} />;
  }
}
