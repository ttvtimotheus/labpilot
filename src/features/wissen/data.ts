import type { Bereich, KnowledgeTopic } from '@/src/types/domain';

export const knowledgeTopics: KnowledgeTopic[] = [
  {
    id: 'gram-interpretation',
    bereich: 'mibi',
    title: 'Gram-Befund einordnen',
    summary: 'Form, Lagerung und Faerbeverhalten gemeinsam dokumentieren.',
    tags: ['Gram', 'Mikroskopie'],
    body: [
      'Bewerte zuerst die Praeparatqualitaet: Dicke, Fixierung und Hintergrundfaerbung beeinflussen den Befund.',
      'Dokumentiere Faerbeverhalten, Morphologie und Lagerung getrennt. Beispiele: grampositive Kokken in Haufen, gramnegative Staebchen vereinzelt.',
      'Bei Mischflora oder schwacher Entfaerbung ist eine Wiederholung sinnvoll, bevor ein Befund weitergegeben wird.',
    ],
  },
  {
    id: 'diff-bb-routine',
    bereich: 'haema',
    title: 'Differentialblutbild Routine',
    summary: 'Zaehle systematisch und stoppe bei Zielzellzahl mit Plausibilitaetscheck.',
    tags: ['Diff-BB', 'Mikroskopie'],
    body: [
      'Waehle einen gut ausgestrichenen Bereich mit einzeln liegenden Erythrozyten.',
      'Zaehle in Maeanderform, damit Zellen nicht doppelt erfasst werden.',
      'Pruefe auffaellige Zellen separat und dokumentiere Artefakte oder Gerinnselhinweise.',
    ],
  },
  {
    id: 'lipemia-interference',
    bereich: 'chemie',
    title: 'Lipemie als Interferenz',
    summary: 'Truebung kann photometrische Messungen beeinflussen und braucht eine klare Laborstrategie.',
    tags: ['Interferenz', 'Serum'],
    proOnly: true,
    body: [
      'Lipemie entsteht haeufig durch Chylomikronen oder VLDL und kann Absorption, Volumenverdraengung und Pipettierung beeinflussen.',
      'Je nach Parameter sind Ultrazentrifugation, Serumblank oder Neuanforderung moegliche Vorgehensweisen.',
      'Kennzeichne betroffene Ergebnisse mit Laborhinweis, statt Werte ungeprueft zu interpretieren.',
    ],
  },
  {
    id: 'he-quality',
    bereich: 'histo',
    title: 'HE-Qualitaetscheck',
    summary: 'Kernzeichnung, Zytoplasmakontrast und Schnittqualitaet getrennt beurteilen.',
    tags: ['HE', 'Qualitaet'],
    body: [
      'Haematoxylin sollte Kerne klar blau-violett darstellen, ohne flaechige Ueberfaerbung.',
      'Eosin gibt Zytoplasma und Matrix differenzierten rosa bis roten Kontrast.',
      'Falten, Ausrisse und Paraffinreste sind technische Artefakte und gehoeren in die Prozesskontrolle.',
    ],
  },
];

export const wissenBereiche: Bereich[] = ['mibi', 'haema', 'chemie', 'histo'];

export function topicsForBereich(bereich: Bereich) {
  return knowledgeTopics.filter((topic) => topic.bereich === bereich);
}

export function getTopic(id: string) {
  return knowledgeTopics.find((topic) => topic.id === id);
}
