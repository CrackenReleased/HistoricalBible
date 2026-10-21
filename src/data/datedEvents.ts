/** Passage-specific chronology. Absence means no reviewed event date is established. */
import { type WorldHorizonItem, HISTORICAL_WORLD_ITEMS } from './historicalWorldItems.ts';
import { type HistoricalRelationship, HISTORICAL_RELATIONSHIPS } from './historicalRelationships.ts';

export interface DatedEvent {
  ref: string;
  dateLabel: string;
  event: string;
  meanwhile: string;
  sourceTitle: string;
  sourceUrl: string;
  method: string;
  limit: string;
  siteId: string;
  worldItem?: WorldHorizonItem;
  relationship?: HistoricalRelationship;
}

const datedEvents: readonly DatedEvent[] = [
  {
    ref: 'Acts.18.12',
    dateLabel: 'Gallio’s office: approximately AD 51–52',
    event: 'Acts names Gallio as proconsul of Achaia during Paul’s Corinth ministry.',
    meanwhile: 'A letter of Claudius to Delphi independently names Gallio in that provincial office.',
    sourceTitle: 'FD III 4:286 · Packard Humanities Institute',
    sourceUrl: 'https://epigraphy.packhum.org/text/240470',
    method: 'The shared officeholder and province provide a historical synchrony. The date of Paul’s hearing is inferred from Acts and the imperial chronology.',
    limit: 'The inscription does not name Paul or date a day or month for Acts 18:12.',
    siteId: 'gallio-inscription'
  },
  {
    ref: '2Kgs.18.13',
    dateLabel: 'Sennacherib’s Judah campaign: 701 BC',
    event: '2 Kings 18:13 reports Sennacherib’s attack on the fortified cities of Judah.',
    meanwhile: 'Sennacherib’s imperial campaign record names Hezekiah of Judah and tribute received in 701 BC.',
    sourceTitle: 'Taylor Prism, 1855,1028.1 · British Museum',
    sourceUrl: 'https://www.britishmuseum.org/collection/image/426311001',
    method: 'Two independently transmitted accounts name the same rulers and campaign setting.',
    limit: 'The prism does not establish the outcome of every encounter or the precise day of this verse.',
    siteId: 'taylor-prism',
    worldItem: HISTORICAL_WORLD_ITEMS.find(item => item.id === 'eastern-zhou-spring-autumn'),
    relationship: HISTORICAL_RELATIONSHIPS.find(r => r.id === 'judah-assyria-701bc')
  }
];

export const REVIEWED_DATED_EVENTS = datedEvents;

export function getDatedEvent(bookOsis: string, chapter: number, verse: number): DatedEvent | undefined {
  const ref = `${bookOsis}.${chapter}.${verse}`.toLowerCase();
  return datedEvents.find(item => item.ref.toLowerCase() === ref);
}
