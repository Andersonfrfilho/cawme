import Svg, {
  Rect,
  Circle,
  Path,
  Defs,
  LinearGradient,
  Stop,
  Text as SvgText,
} from "react-native-svg";

export type BankInfo = { name: string; shortName: string; color: string };

// Brand identity colors — necessarily external hex values
export const BANKS: BankInfo[] = [
  { name: "Nubank", shortName: "Nu", color: "#8A05BE" },
  { name: "Itaú Unibanco", shortName: "Itaú", color: "#F98800" },
  { name: "Bradesco", shortName: "Brad.", color: "#CC092F" },
  { name: "Banco do Brasil", shortName: "BB", color: "#DDBB00" },
  { name: "Santander", shortName: "Sant.", color: "#EC0000" },
  { name: "Caixa Econômica Federal", shortName: "Caixa", color: "#0065A3" },
  { name: "Inter", shortName: "Inter", color: "#FF7A00" },
  { name: "C6 Bank", shortName: "C6", color: "#2A2A2A" },
  { name: "PicPay", shortName: "Pic", color: "#21C25E" },
  { name: "Mercado Pago", shortName: "MP", color: "#009EE3" },
  { name: "Pagbank", shortName: "Pag", color: "#00CC44" },
  { name: "Sicredi", shortName: "Sicr.", color: "#8DC63F" },
  { name: "Sicoob", shortName: "Sic.", color: "#006EB7" },
  { name: "BTG Pactual", shortName: "BTG", color: "#2C2C2C" },
  { name: "Neon", shortName: "Neon", color: "#00BFAE" },
  { name: "Original", shortName: "Orig.", color: "#00C041" },
  { name: "Safra", shortName: "Safra", color: "#1E3A5F" },
  { name: "Banrisul", shortName: "Banr.", color: "#003DA5" },
  { name: "XP Investimentos", shortName: "XP", color: "#1E1E1E" },
  { name: "Agibank", shortName: "Agi", color: "#E31E32" },
];

export function getBankByName(name: string): BankInfo | null {
  const normalized = name.toLowerCase().trim();
  return BANKS.find((bank) => bank.name.toLowerCase() === normalized) ?? null;
}

export function getMatchingBanks(query: string): BankInfo[] {
  if (!query || query.trim().length < 2) return [];
  const normalized = query.toLowerCase().trim();
  return BANKS.filter((bank) => bank.name.toLowerCase().includes(normalized)).slice(0, 5);
}

type LogoProps = { size: number };

// ─── Shared helpers ──────────────────────────────────────────────────────────

function BgRect({ color, radius = 12 }: { color: string; radius?: number }) {
  return <Rect width={60} height={60} rx={radius} fill={color} />;
}

function Label({
  text,
  y = 38,
  fontSize = 22,
  fill = "white",
}: {
  text: string;
  y?: number;
  fontSize?: number;
  fill?: string;
}) {
  return (
    <SvgText x={30} y={y} textAnchor="middle" fontSize={fontSize} fontWeight="bold" fill={fill}>
      {text}
    </SvgText>
  );
}

// ─── Bank logo components ────────────────────────────────────────────────────

function NubankLogo({ size }: LogoProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 60 60">
      <BgRect color="#8A05BE" />
      <Circle cx={55} cy={5} r={28} fill="none" stroke="white" strokeWidth={1.5} opacity={0.2} />
      <Label text="nu" y={40} fontSize={26} />
    </Svg>
  );
}

function ItauLogo({ size }: LogoProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 60 60">
      <Defs>
        <LinearGradient id="itauGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#FFAA00" />
          <Stop offset="1" stopColor="#E07800" />
        </LinearGradient>
      </Defs>
      <BgRect color="url(#itauGrad)" />
      <Label text="itaú" y={38} fontSize={18} />
    </Svg>
  );
}

function BradescsoLogo({ size }: LogoProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 60 60">
      <BgRect color="#CC092F" />
      <Circle cx={30} cy={30} r={20} fill="none" stroke="white" strokeWidth={3} opacity={0.15} />
      <Label text="B" y={42} fontSize={34} />
    </Svg>
  );
}

function BancoDoBrasilLogo({ size }: LogoProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 60 60">
      <BgRect color="#DDBB00" />
      <Circle cx={22} cy={30} r={14} fill="#005CA9" opacity={0.85} />
      <Circle cx={38} cy={30} r={14} fill="#005CA9" opacity={0.85} />
      <Circle cx={30} cy={30} r={10} fill="#003F7A" opacity={0.7} />
      <Label text="BB" y={36} fontSize={16} />
    </Svg>
  );
}

function SantanderLogo({ size }: LogoProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 60 60">
      <BgRect color="#EC0000" />
      {/* simplified triple-flame */}
      <Path
        d="M18 48 C14 38 18 26 24 20 C22 28 26 32 24 40 C26 32 30 24 28 14 C32 22 32 32 30 40 C32 30 36 24 36 16 C40 24 42 36 38 48 Z"
        fill="white"
        opacity={0.9}
      />
    </Svg>
  );
}

function CaixaLogo({ size }: LogoProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 60 60">
      <Defs>
        <LinearGradient id="caixaGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#0075BB" />
          <Stop offset="1" stopColor="#004E8A" />
        </LinearGradient>
      </Defs>
      <BgRect color="url(#caixaGrad)" />
      <Label text="CEF" y={36} fontSize={18} />
    </Svg>
  );
}

function InterLogo({ size }: LogoProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 60 60">
      <BgRect color="#FF7A00" />
      <Label text="inter" y={38} fontSize={16} />
    </Svg>
  );
}

function C6Logo({ size }: LogoProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 60 60">
      <BgRect color="#1C1C1C" />
      <Path d="M10 20 H50 M10 30 H50 M10 40 H50" stroke="#333" strokeWidth={1} />
      <Label text="C6" y={39} fontSize={24} fill="#D0D0D0" />
    </Svg>
  );
}

function PicPayLogo({ size }: LogoProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 60 60">
      <BgRect color="#21C25E" />
      <Label text="PP" y={40} fontSize={24} />
    </Svg>
  );
}

function MercadoPagoLogo({ size }: LogoProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 60 60">
      <Defs>
        <LinearGradient id="mpGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#00B1EA" />
          <Stop offset="1" stopColor="#0070B0" />
        </LinearGradient>
      </Defs>
      <BgRect color="url(#mpGrad)" />
      <Label text="MP" y={39} fontSize={24} />
    </Svg>
  );
}

function PagbankLogo({ size }: LogoProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 60 60">
      <BgRect color="#00B33A" />
      <Label text="PAG" y={37} fontSize={20} />
    </Svg>
  );
}

function SicrediLogo({ size }: LogoProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 60 60">
      <BgRect color="#7DB73A" />
      <Label text="Sicr." y={37} fontSize={18} />
    </Svg>
  );
}

function SicoobLogo({ size }: LogoProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 60 60">
      <BgRect color="#006EB7" />
      <Label text="Sic." y={37} fontSize={20} />
    </Svg>
  );
}

function BtgLogo({ size }: LogoProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 60 60">
      <Defs>
        <LinearGradient id="btgGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#1E2A4A" />
          <Stop offset="1" stopColor="#0D1628" />
        </LinearGradient>
      </Defs>
      <BgRect color="url(#btgGrad)" />
      <Label text="BTG" y={37} fontSize={19} fill="#C8A96E" />
    </Svg>
  );
}

function NeonLogo({ size }: LogoProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 60 60">
      <BgRect color="#0D1117" />
      <Label text="neon" y={38} fontSize={18} fill="#00BFAE" />
    </Svg>
  );
}

function OriginalLogo({ size }: LogoProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 60 60">
      <BgRect color="#00C041" />
      <Label text="Orig." y={37} fontSize={18} />
    </Svg>
  );
}

function SafraLogo({ size }: LogoProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 60 60">
      <BgRect color="#1E3A5F" />
      <Label text="Safra" y={37} fontSize={17} />
    </Svg>
  );
}

function BanrisulLogo({ size }: LogoProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 60 60">
      <BgRect color="#003DA5" />
      <Label text="Banr." y={37} fontSize={17} />
    </Svg>
  );
}

function XpLogo({ size }: LogoProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 60 60">
      <BgRect color="#1A1A1A" />
      <Label text="XP" y={40} fontSize={28} fill="#E8E8E8" />
    </Svg>
  );
}

function AgibankLogo({ size }: LogoProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 60 60">
      <BgRect color="#E31E32" />
      <Label text="agi" y={39} fontSize={22} />
    </Svg>
  );
}

function FallbackLogo({ bank, size }: { bank: BankInfo; size: number }) {
  const text = bank.shortName.replace(".", "");
  return (
    <Svg width={size} height={size} viewBox="0 0 60 60">
      <BgRect color={bank.color} />
      <Label text={text} y={38} fontSize={text.length > 3 ? 16 : 22} />
    </Svg>
  );
}

// ─── Public component ────────────────────────────────────────────────────────

export function BankLogo({ bank, size }: { bank: BankInfo; size: number }) {
  switch (bank.name) {
    case "Nubank": return <NubankLogo size={size} />;
    case "Itaú Unibanco": return <ItauLogo size={size} />;
    case "Bradesco": return <BradescsoLogo size={size} />;
    case "Banco do Brasil": return <BancoDoBrasilLogo size={size} />;
    case "Santander": return <SantanderLogo size={size} />;
    case "Caixa Econômica Federal": return <CaixaLogo size={size} />;
    case "Inter": return <InterLogo size={size} />;
    case "C6 Bank": return <C6Logo size={size} />;
    case "PicPay": return <PicPayLogo size={size} />;
    case "Mercado Pago": return <MercadoPagoLogo size={size} />;
    case "Pagbank": return <PagbankLogo size={size} />;
    case "Sicredi": return <SicrediLogo size={size} />;
    case "Sicoob": return <SicoobLogo size={size} />;
    case "BTG Pactual": return <BtgLogo size={size} />;
    case "Neon": return <NeonLogo size={size} />;
    case "Original": return <OriginalLogo size={size} />;
    case "Safra": return <SafraLogo size={size} />;
    case "Banrisul": return <BanrisulLogo size={size} />;
    case "XP Investimentos": return <XpLogo size={size} />;
    case "Agibank": return <AgibankLogo size={size} />;
    default: return <FallbackLogo bank={bank} size={size} />;
  }
}
