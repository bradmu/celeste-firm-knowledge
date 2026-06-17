import type { SVGProps } from 'react';

/**
 * Hand-authored brand logo components for each Connector in the registry.
 *
 * Design goals:
 *   • Square 32×32 viewBox, baked-in rounded background tile (rx=6) so the
 *     component is self-contained and renders the same anywhere.
 *   • Iconic shape where the brand has one (Excel's X, Salesforce's cloud,
 *     Azure's A, Bloomberg's serif B, NetDocuments' page fold).
 *   • Brand-styled letterform for the wordmark-centric brands (DealCloud,
 *     iManage, Capital IQ, PitchBook, Tax Notes) using the actual brand
 *     colour and a font weight that matches their identity.
 *
 * Each component takes `className` for sizing (e.g. `size-10`). Consumers
 * never need to touch the SVG internals; swap in real SVG marks here if
 * the registry-level API ever needs more fidelity.
 */

type LogoProps = SVGProps<SVGSVGElement>;

const TILE_RADIUS = 6;

function Tile({ fill }: { fill: string }) {
  return <rect width="32" height="32" rx={TILE_RADIUS} fill={fill} />;
}

/* -------------------------------------------------------------------------- */
/* Connector logos                                                            */
/* -------------------------------------------------------------------------- */

export function DealCloudLogo(props: LogoProps) {
  return (
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
      <Tile fill="#1B3548" />
      {/* DC monogram, sans-serif heavy */}
      <text
        x="16"
        y="21"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="12"
        fontWeight="800"
        letterSpacing="-0.5"
        fill="#ffffff"
      >
        DC
      </text>
    </svg>
  );
}

export function SharePointLogo(props: LogoProps) {
  return (
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
      <Tile fill="#038387" />
      {/* Stylised "S" — three connected loops echoing the SharePoint mark */}
      <path
        d="M11.5 11
           c 0 -1.7 1.6 -2.5 4 -2.5
           c 2.4 0 4.2 0.9 4.6 2.3
           M20.5 13
           c 0 -1.6 -1.6 -2.6 -4.5 -2.6
           c -2.4 0 -4.2 0.9 -4.2 2.6
           c 0 4.5 9 1.5 9 6.3
           c 0 1.7 -1.7 2.6 -4.7 2.6
           c -2.7 0 -4.5 -1 -4.8 -2.4"
        stroke="#ffffff"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function NetDocumentsLogo(props: LogoProps) {
  return (
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
      <Tile fill="#0066B2" />
      {/* Folded page: outer page outline with a triangle fold at top-right */}
      <path
        d="M10 8 h 8 l 4 4 v 12 h -12 z"
        stroke="#ffffff"
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M18 8 v 4 h 4"
        stroke="#ffffff"
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Two text lines on the page */}
      <line x1="12.5" y1="17" x2="19.5" y2="17" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="12.5" y1="20" x2="19.5" y2="20" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function IManageLogo(props: LogoProps) {
  return (
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
      <Tile fill="#2D3748" />
      {/* "iM" wordmark — lowercase i, capital M, brand convention */}
      <text
        x="16"
        y="22"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="15"
        fontWeight="700"
        letterSpacing="-0.5"
        fill="#ffffff"
      >
        iM
      </text>
    </svg>
  );
}

export function SalesforceLogo(props: LogoProps) {
  return (
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
      <Tile fill="#00A1E0" />
      {/* Cloud silhouette — Salesforce's signature shape */}
      <path
        d="M9 19
           c 0 -2.5 2 -4.3 4.4 -4.3
           c 0.4 -2.3 2.4 -4 4.9 -4
           c 2.4 0 4.5 1.6 5 3.9
           c 0.3 -0.1 0.6 -0.1 1 -0.1
           c 2.1 0 3.7 1.6 3.7 3.7
           c 0 2.1 -1.6 3.8 -3.7 3.8
           h -11.6
           c -2 0 -3.7 -1.5 -3.7 -3
           z"
        fill="#ffffff"
      />
    </svg>
  );
}

export function ExcelLogo(props: LogoProps) {
  return (
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
      <Tile fill="#107C41" />
      {/* Bold X — Excel's iconic mark */}
      <path
        d="M10 9 L16 15 L10 21 L13 21 L17.5 16.5 L22 21 L25 21 L18.5 14 L24 9 L21 9 L17.5 12.5 L13 9 Z"
        fill="#ffffff"
      />
    </svg>
  );
}

export function AzureLogo(props: LogoProps) {
  return (
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
      <Tile fill="#0078D4" />
      {/* Stylised A — two angled wedges meeting at a peak, with notch */}
      <path
        d="M13 24 L7 24 L14 9 L18 9 L21.5 16 L18.5 16 L16 11 L11 21 L17 21 L18 24 L13 24 Z M19 24 L17 19.5 L20 19.5 L22.5 24 Z"
        fill="#ffffff"
      />
    </svg>
  );
}

export function CapitalIQLogo(props: LogoProps) {
  return (
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
      <Tile fill="#D6353F" />
      {/* "S&P" style serif text mark */}
      <text
        x="16"
        y="21"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontStyle="italic"
        fontSize="12"
        fontWeight="700"
        fill="#ffffff"
      >
        CIQ
      </text>
    </svg>
  );
}

export function PitchBookLogo(props: LogoProps) {
  return (
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
      <Tile fill="#0D2A47" />
      {/* Stylised open book — two pages flanking a spine */}
      <path
        d="M8 11 c 2 -0.8 5 -0.8 8 1 v 11 c -3 -1.8 -6 -1.8 -8 -1 z"
        fill="#ffffff"
        opacity="0.95"
      />
      <path
        d="M24 11 c -2 -0.8 -5 -0.8 -8 1 v 11 c 3 -1.8 6 -1.8 8 -1 z"
        fill="#ffffff"
        opacity="0.78"
      />
    </svg>
  );
}

export function BloombergLogo(props: LogoProps) {
  return (
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
      <Tile fill="#000000" />
      {/* Orange serif "B" — Bloomberg's signature look */}
      <text
        x="16"
        y="23"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="20"
        fontWeight="900"
        fill="#FE7E0F"
      >
        B
      </text>
    </svg>
  );
}

export function TaxNotesLogo(props: LogoProps) {
  return (
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
      <Tile fill="#374151" />
      {/* Serif TN with a small underline — periodical/journal feel */}
      <text
        x="16"
        y="20"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="12"
        fontWeight="700"
        fill="#ffffff"
      >
        TN
      </text>
      <line
        x1="11"
        y1="23"
        x2="21"
        y2="23"
        stroke="#ffffff"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.65"
      />
    </svg>
  );
}

export function RefinitivLogo(props: LogoProps) {
  return (
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
      <Tile fill="#FA5005" />
      {/* Stylised swoosh + R — evokes the Refinitiv brand mark */}
      <path
        d="M8 22 c 3 -10 10 -10 16 -4"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <text
        x="20"
        y="20"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="11"
        fontWeight="800"
        fill="#ffffff"
      >
        R
      </text>
    </svg>
  );
}
