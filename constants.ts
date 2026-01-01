
import { UnderstandingLevel, KnowledgePage, Roadmap } from './types';

export const INITIAL_BOOK_PAGES: KnowledgePage[] = [
  {
    id: '1',
    title: 'Cellular Respiration',
    content: 'The process by which cells break down glucose to produce ATP energy. It involves glycolysis in the cytoplasm and the Krebs cycle in the mitochondria.',
    lastUpdated: '2023-10-15',
    retention: 100, // Added missing property
    understanding: UnderstandingLevel.WELL_UNDERSTOOD,
    prerequisites: [],
    feedback: {
      gaps: [],
      suggestions: ['Consider adding more detail on the electron transport chain.'],
      reasoningScore: 85,
      clarityFeedback: 'Excellent conceptual grasp.'
    }
  },
  {
    id: '2',
    title: 'The Nitrogen Cycle',
    content: 'Nitrogen moves through the environment. It starts with fixation where bacteria turn nitrogen gas into ammonia. Then plants take it up.',
    lastUpdated: '2023-11-02',
    retention: 75, // Added missing property
    understanding: UnderstandingLevel.PARTIAL,
    prerequisites: [],
    feedback: {
      gaps: ['Missed the denitrification phase.', 'Role of lightning in fixation not mentioned.'],
      suggestions: ['Review the role of atmospheric nitrogen vs soil-based nitrogen.'],
      reasoningScore: 60,
      clarityFeedback: 'Good start, but missing the cycle closure.'
    }
  },
  {
    id: '3',
    title: 'Carbon Sink Dynamics',
    content: 'Forests and oceans act as carbon sinks because they absorb more CO2 than they release. This is crucial for global temperature regulation.',
    lastUpdated: '2023-11-20',
    retention: 40, // Added missing property
    understanding: UnderstandingLevel.NEEDS_REVIEW,
    prerequisites: ['2'],
    feedback: {
      gaps: ['Incomplete explanation of ocean acidification.', 'Missed seasonal variations in carbon uptake.'],
      suggestions: ['Check the connection between the nitrogen cycle and carbon sink efficiency.'],
      reasoningScore: 35,
      clarityFeedback: 'High level only; needs deeper technical explanation.'
    }
  }
];

export const INITIAL_ROADMAPS: Roadmap[] = [
  {
    id: 'r1',
    name: 'Ecology Fundamentals',
    colorTheme: 'stone',
    description: 'Core concepts of how organisms interact with their environment.',
    pageIds: ['1', '2', '3']
  },
  {
    id: 'r2',
    name: 'Climate Systems',
    colorTheme: 'blue',
    description: 'Advanced study of Earth Atmosphere and Ocean interaction.',
    pageIds: ['3']
  }
];

export const DEMO_USER = {
  name: 'Alex Rivera',
  bookTitle: 'Explorations in Environmental Science',
  description: 'A personal journey through ecology and earth systems.'
};
