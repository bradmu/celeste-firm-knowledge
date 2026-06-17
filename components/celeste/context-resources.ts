import type { ComponentType, SVGProps } from 'react';

import {
  AzureLogo,
  BloombergLogo,
  CapitalIQLogo,
  DealCloudLogo,
  ExcelLogo,
  IManageLogo,
  NetDocumentsLogo,
  PitchBookLogo,
  RefinitivLogo,
  SalesforceLogo,
  SharePointLogo,
  TaxNotesLogo,
} from './brand-logos';

/**
 * Sample registry of resources Celeste's analysis could surface to the user
 * as the prompt is typed. The selections are illustrative — the real product
 * would pull from the user's tenant.
 *
 * Each resource carries:
 *   • `hints` — lower-cased substrings checked against the prompt to decide
 *     whether to suggest it.
 *   • `logo` (Connectors only) — a React component that renders the brand
 *     mark. Defined in brand-logos.tsx so the dropdown and the composer
 *     puck stack share the same canonical SVG.
 *   • `description` — short blurb shown under the label. Surfaced on
 *     Connectors and Knowledge Hubs; Spaces are label-only.
 *   • `authorized` — Connector-specific. If `false`, the row renders an
 *     "Authenticate" button in place of the toggle switch.
 *   • `recent` — surfaces the item in the "Recently used" section.
 *
 * Knowledge Hubs and Spaces deliberately do *not* carry logos — the
 * dropdown skips the logo column for those kinds entirely.
 */

export type ResourceKind = 'connectors' | 'spaces' | 'hubs';

/**
 * The shared selection shape — one Set of resource IDs per kind. Lives here
 * (next to the data model) rather than in the suggestion component so the
 * resource picker, composer, and any future consumers can all import it
 * without crossing into UI-layer files.
 */
export type Selection = Record<ResourceKind, Set<string>>;

/** Logo components accept any SVG props, including `className` for sizing. */
export type LogoComponent = ComponentType<SVGProps<SVGSVGElement>>;

export type Resource = {
  id: string;
  label: string;
  hints: string[];
  /** Surface this item in the "Recently used" section of the resource picker. */
  recent?: boolean;
  /** Short blurb shown under the label (Connectors + Knowledge Hubs). */
  description?: string;
  /** Brand logo component — currently only set on Connectors. */
  logo?: LogoComponent;
  /**
   * Connectors only. `false` means the user must click "Authenticate" before
   * the row's toggle switch becomes available. Defaults to `true`.
   */
  authorized?: boolean;
};

export const CONNECTORS: Resource[] = [
  {
    id: 'dealcloud',
    label: 'DealCloud',
    logo: DealCloudLogo,
    description: 'Deal pipeline, origination, and CRM for PE/VC sponsors.',
    recent: true,
    hints: [
      'deal',
      'm&a',
      'acquisition',
      'merger',
      'target',
      'pipeline',
      'origination',
      'sponsor',
      'fund',
      'lp',
      'gp',
      'add-on',
      'addon',
    ],
  },
  {
    id: 'sharepoint',
    label: 'SharePoint',
    logo: SharePointLogo,
    description: 'Microsoft document libraries and team sites.',
    hints: ['document', 'doc', 'file', 'folder', 'sharepoint', 'memo', 'deck'],
  },
  {
    id: 'netdocuments',
    label: 'NetDocuments',
    logo: NetDocumentsLogo,
    description: 'Cloud document management for legal matters.',
    hints: ['document', 'matter', 'filing', 'engagement', 'client'],
  },
  {
    id: 'imanage',
    label: 'iManage',
    logo: IManageLogo,
    description: 'Document and email management for law firms.',
    hints: ['matter', 'imanage', 'case', 'litigation', 'client', 'engagement'],
  },
  {
    id: 'salesforce',
    label: 'Salesforce',
    logo: SalesforceLogo,
    description: 'CRM contacts, accounts, and opportunities.',
    hints: ['contact', 'crm', 'prospect', 'lead', 'pipeline'],
  },
  {
    id: 'excel',
    label: 'Excel',
    logo: ExcelLogo,
    description: 'Spreadsheets, financial models, and workbooks.',
    recent: true,
    hints: ['excel', 'spreadsheet', 'model', 'workbook', 'comps', 'ebitda', 'revenue', 'financials'],
  },
  {
    id: 'azure',
    label: 'Azure',
    logo: AzureLogo,
    description: 'Cloud infrastructure and storage.',
    hints: ['azure', 'cloud', 'tenant', 'infrastructure'],
  },
  {
    id: 'capital-iq',
    label: 'Capital IQ',
    logo: CapitalIQLogo,
    description: 'Public-company financials, comps, and screening.',
    hints: ['capital', 'cap iq', 'comps', 'financials', 'public company', 'capiq'],
  },
  {
    id: 'pitchbook',
    label: 'PitchBook',
    logo: PitchBookLogo,
    description: 'Private market data on deals, companies, and investors.',
    hints: ['pitchbook', 'private market', 'pe', 'vc', 'sponsor', 'deal'],
  },
  {
    id: 'bloomberg',
    label: 'Bloomberg Terminal',
    logo: BloombergLogo,
    description: 'Real-time market data, news, and analytics.',
    hints: ['bloomberg', 'market data', 'public', 'news', 'price', 'terminal'],
  },
  {
    id: 'tax-notes',
    label: 'Tax Notes',
    logo: TaxNotesLogo,
    description: 'Tax news, analysis, and regulatory commentary.',
    authorized: false,
    hints: ['tax', 'tax notes', 'irs', 'regulation'],
  },
  {
    id: 'refinitiv',
    label: 'Refinitiv',
    logo: RefinitivLogo,
    description: 'Market data, news, and risk intelligence.',
    authorized: false,
    hints: ['refinitiv', 'eikon', 'market data', 'public', 'news'],
  },
];

export const SPACES: Resource[] = [
  {
    id: 'project-atlas',
    label: 'Project Atlas',
    recent: true,
    hints: ['atlas', 'deal', 'm&a', 'target', 'acquisition', 'add-on', 'addon'],
  },
  {
    id: 'apollo-merger',
    label: 'Apollo merger',
    hints: ['apollo', 'merger', 'integration', 'deal'],
  },
  {
    id: 'silver-lake',
    label: 'Silver Lake add-ons',
    recent: true,
    hints: ['silver', 'silver lake', 'add-on', 'addon', 'acquisition', 'pe'],
  },
  {
    id: 'smith-vs-jones',
    label: 'Smith vs. Jones',
    hints: ['smith', 'jones', 'litigation', 'matter', 'case'],
  },
  {
    id: 'q4-fundraise',
    label: 'Q4 fundraise',
    hints: ['fundraise', 'lp', 'gp', 'q4', 'capital', 'raise'],
  },
  {
    id: 'capital-raise-2025',
    label: 'Capital raise 2025',
    hints: ['capital', 'raise', 'fundraise', '2025', 'lp'],
  },
  {
    id: 'taxco-restructuring',
    label: 'TaxCo restructuring',
    hints: ['tax', 'taxco', 'restructuring', 'reorg', 'matter'],
  },
  {
    id: 'mercury-ipo',
    label: 'Mercury IPO',
    hints: ['mercury', 'ipo', 'public offering', 'listing'],
  },
  {
    id: 'pearl-bay-acquisition',
    label: 'Pearl Bay acquisition',
    hints: ['pearl bay', 'acquisition', 'target', 'deal'],
  },
  {
    id: 'atlas-distribution',
    label: 'Atlas distribution',
    hints: ['atlas', 'distribution', 'logistics'],
  },
];

export const HUBS: Resource[] = [
  {
    id: 'ma-playbook',
    label: 'M&A playbook',
    description: 'Internal guidance on running M&A transactions.',
    recent: true,
    hints: ['m&a', 'deal', 'acquisition', 'merger', 'playbook', 'add-on', 'addon', 'integration'],
  },
  {
    id: 'tax-research',
    label: 'Tax research vault',
    description: 'Curated tax memos and IRS opinions.',
    hints: ['tax', 'irc', 'deduction', 'liability', 'transfer pricing'],
  },
  {
    id: 'precedents',
    label: 'Precedent library',
    description: 'Redacted firm precedents across practice areas.',
    recent: true,
    hints: ['precedent', 'prior', 'past', 'history', 'similar', 'comparable', 'comps'],
  },
  {
    id: 'compliance',
    label: 'Compliance handbook',
    description: 'Policies for KYC, AML, and audit readiness.',
    hints: ['compliance', 'regulation', 'rule', 'audit', 'sox', 'kyc', 'aml'],
  },
  {
    id: 'sector-reports',
    label: 'Sector research',
    description: 'Industry trend reports and sustainability briefs.',
    hints: ['sector', 'industry', 'market', 'sustainability', 'esg', 'trend'],
  },
  {
    id: 'capital-markets-handbook',
    label: 'Capital markets handbook',
    description: 'Issuer guides for IPOs, debt, and equity offerings.',
    hints: ['capital', 'markets', 'ipo', 'debt', 'equity', 'underwriting'],
  },
  {
    id: 'cross-border-ma',
    label: 'Cross-border M&A',
    description: 'International deal structuring and CFIUS reviews.',
    hints: ['cross-border', 'international', 'm&a', 'cfius', 'foreign'],
  },
  {
    id: 'tax-memos',
    label: 'Tax memos library',
    description: 'Past tax opinions indexed by issue.',
    hints: ['tax', 'memo', 'opinion', 'irc'],
  },
  {
    id: 'antitrust-filings',
    label: 'Antitrust filings',
    description: 'HSR submissions and merger-control history.',
    hints: ['antitrust', 'hsr', 'doj', 'ftc', 'merger control'],
  },
  {
    id: 'real-estate-playbook',
    label: 'Real estate playbook',
    description: 'CRE deal, leasing, and portfolio templates.',
    hints: ['real estate', 'reit', 'property', 'cre'],
  },
];

/**
 * Find resources whose hints overlap with the prompt. Falls back to a stable
 * "first-N" so the suggestion module still feels useful for off-topic prompts.
 */
function matchFor(prompt: string, items: Resource[], fallbackCount: number): Resource[] {
  const lower = prompt.toLowerCase();
  const hits = items.filter((item) =>
    item.hints.some((hint) => lower.includes(hint.toLowerCase()))
  );
  if (hits.length > 0) return hits.slice(0, 4);
  return items.slice(0, fallbackCount);
}

export type SuggestResult = {
  connectors: Resource[];
  spaces: Resource[];
  hubs: Resource[];
};

export function suggestFor(prompt: string): SuggestResult {
  return {
    connectors: matchFor(prompt, CONNECTORS, 2),
    spaces: matchFor(prompt, SPACES, 1),
    hubs: matchFor(prompt, HUBS, 1),
  };
}

export function getResourceById(kind: ResourceKind, id: string): Resource | undefined {
  return getResourcesByKind(kind).find((r) => r.id === id);
}

export function getResourcesByKind(kind: ResourceKind): Resource[] {
  switch (kind) {
    case 'connectors':
      return CONNECTORS;
    case 'spaces':
      return SPACES;
    case 'hubs':
      return HUBS;
  }
}

/**
 * Case-insensitive substring match against `label` and `hints` — used by the
 * resource picker's search bar. Empty/whitespace query returns the list
 * unchanged.
 */
export function filterByQuery(items: Resource[], query: string): Resource[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter(
    (item) =>
      item.label.toLowerCase().includes(q) ||
      item.hints.some((h) => h.toLowerCase().includes(q))
  );
}

/**
 * IDs of connectors that ship "pre-authorized" — i.e. anything not flagged
 * `authorized: false` in the registry. ChatLauncher seeds its auth state
 * from this list.
 */
export function defaultAuthorizedConnectorIds(): string[] {
  return CONNECTORS.filter((c) => c.authorized !== false).map((c) => c.id);
}
