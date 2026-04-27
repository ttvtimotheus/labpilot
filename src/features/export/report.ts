import type { DifferentialCountSnapshot, KolonieCountSnapshot, ProtokollRun } from '@/src/types/domain';
import { formatDuration } from '@/src/lib/utils/time';

type ReportRow = [label: string, value: string | number];

interface ReportSection {
  title: string;
  rows?: ReportRow[];
  table?: {
    headers: string[];
    rows: (string | number)[][];
  };
}

interface ReportDocumentInput {
  title: string;
  subtitle: string;
  generatedAt?: string;
  sections: ReportSection[];
}

const numberFormatter = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 2 });
const integerFormatter = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 });

export function escapeHtml(value: string | number) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function formatReportDate(value: string) {
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function renderRows(rows: ReportRow[]) {
  return `<dl>${rows
    .map(([label, value]) => `<div class="meta-row"><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`)
    .join('')}</dl>`;
}

function renderTable(table: NonNullable<ReportSection['table']>) {
  return `<table><thead><tr>${table.headers.map((header) => `<th>${escapeHtml(header)}</th>`).join('')}</tr></thead><tbody>${table.rows
    .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`)
    .join('')}</tbody></table>`;
}

function buildReportDocument({ title, subtitle, generatedAt = new Date().toISOString(), sections }: ReportDocumentInput) {
  const renderedSections = sections
    .map((section) => {
      const body = [section.rows ? renderRows(section.rows) : '', section.table ? renderTable(section.table) : ''].join('');
      return `<section><h2>${escapeHtml(section.title)}</h2>${body}</section>`;
    })
    .join('');

  return `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <style>
    :root { color: #0A0A0B; background: #FFFFFF; }
    * { box-sizing: border-box; }
    body { margin: 0; padding: 40px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; line-height: 1.45; }
    header { border-bottom: 2px solid #E6E6E8; padding-bottom: 20px; margin-bottom: 28px; }
    .kicker { color: #1E5FBF; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; margin: 0 0 8px; }
    h1 { font-size: 30px; line-height: 1.15; margin: 0 0 8px; }
    .subtitle { color: #59595F; margin: 0; font-size: 15px; }
    .generated { color: #59595F; font-size: 12px; margin-top: 14px; }
    section { break-inside: avoid; margin: 0 0 28px; }
    h2 { font-size: 18px; margin: 0 0 12px; }
    dl { margin: 0; border: 1px solid #E6E6E8; border-radius: 12px; overflow: hidden; }
    .meta-row { display: grid; grid-template-columns: 42% 58%; border-top: 1px solid #E6E6E8; }
    .meta-row:first-child { border-top: 0; }
    dt, dd { margin: 0; padding: 10px 12px; }
    dt { color: #59595F; background: #F7F7F8; font-weight: 600; }
    dd { font-variant-numeric: tabular-nums; }
    table { width: 100%; border-collapse: collapse; border: 1px solid #E6E6E8; border-radius: 12px; overflow: hidden; }
    th, td { padding: 10px 12px; border-bottom: 1px solid #E6E6E8; text-align: left; vertical-align: top; }
    th { background: #F7F7F8; color: #59595F; font-size: 12px; text-transform: uppercase; letter-spacing: 0.04em; }
    tr:last-child td { border-bottom: 0; }
    footer { color: #59595F; border-top: 1px solid #E6E6E8; padding-top: 16px; font-size: 12px; }
  </style>
</head>
<body>
  <header>
    <p class="kicker">LabPilot Bericht</p>
    <h1>${escapeHtml(title)}</h1>
    <p class="subtitle">${escapeHtml(subtitle)}</p>
    <p class="generated">Erstellt am ${escapeHtml(formatReportDate(generatedAt))}</p>
  </header>
  ${renderedSections}
  <footer>LabPilot ist kein Medizinprodukt. Berichte dienen der lokalen Dokumentation und Ausbildung.</footer>
</body>
</html>`;
}

export function buildProtokollRunReport(run: ProtokollRun) {
  const protokoll = run.protokollSnapshot;
  return buildReportDocument({
    title: protokoll.name,
    subtitle: protokoll.description,
    generatedAt: run.completedAt,
    sections: [
      {
        title: 'Durchlauf',
        rows: [
          ['Quelle', protokoll.source],
          ['Gestartet', formatReportDate(run.startedAt)],
          ['Abgeschlossen', formatReportDate(run.completedAt)],
          ['Notizen', run.notes ?? 'Keine Notizen'],
        ],
      },
      {
        title: 'Schritte',
        table: {
          headers: ['#', 'Schritt', 'Sollzeit', 'Anweisung'],
          rows: protokoll.steps.map((step) => [step.order, step.name, step.durationSeconds ? formatDuration(step.durationSeconds) : '-', step.instructions]),
        },
      },
    ],
  });
}

export function buildKolonieCountReport(count: KolonieCountSnapshot) {
  return buildReportDocument({
    title: count.name ?? 'Kolonienzaehlung',
    subtitle: 'Lokale Kolonienzaehlung mit CFU/ml-Berechnung.',
    generatedAt: count.createdAt,
    sections: [
      {
        title: 'Ergebnis',
        rows: [
          ['Gesamtzahl Kolonien', integerFormatter.format(count.totalColonies)],
          ['CFU/ml', integerFormatter.format(count.totalCfu)],
          ['Verduennungsfaktor', integerFormatter.format(count.dilutionFactor)],
          ['Ausplattiertes Volumen', `${numberFormatter.format(count.platedVolumeMl)} ml`],
        ],
      },
      {
        title: 'Kategorien',
        table: {
          headers: ['Kategorie', 'Anzahl'],
          rows: count.categories.map((category) => [category.label, category.count]),
        },
      },
    ],
  });
}

export function buildDifferentialCountReport(count: DifferentialCountSnapshot) {
  return buildReportDocument({
    title: count.name ?? 'Differentialzaehlung',
    subtitle: 'Lokale Differentialblutbild-Zaehlung mit Prozentanteilen.',
    generatedAt: count.createdAt,
    sections: [
      {
        title: 'Ergebnis',
        rows: [
          ['Gesamtzahl', `${integerFormatter.format(count.totalCells)} / ${integerFormatter.format(count.target)} Zellen`],
          ['Fortschritt', `${integerFormatter.format((count.totalCells / count.target) * 100)} %`],
        ],
      },
      {
        title: 'Zellarten',
        table: {
          headers: ['Zellart', 'Anzahl', 'Anteil'],
          rows: count.cells.map((cell) => [
            cell.label,
            cell.count,
            count.totalCells ? `${numberFormatter.format((cell.count / count.totalCells) * 100)} %` : '0 %',
          ]),
        },
      },
    ],
  });
}