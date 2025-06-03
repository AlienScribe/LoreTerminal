import { indexLore } from '../src/loreIndex.js';

describe('indexLore', () => {
  it('chunks content and extracts tags', () => {
    const canonSections = [
      { title: 'History', content: 'History about the mystical world of lore where heroes arise.' },
      { title: 'Creation', content: 'Lore begins with the world creation. Many events shape the future. This is just an example to test chunking function.' }
    ];

    const proposedContents = [
      {
        title: 'Add characters',
        prNumber: 42,
        date: '2024-01-01',
        sections: [
          { title: 'New Heroes', content: 'Several brave characters join the lore in this update.', metadata: {} }
        ]
      }
    ];

    const index = indexLore(canonSections, proposedContents);

    expect(index['canon-0'].chunks).toEqual([canonSections[0].content]);
    expect(index['canon-1'].chunks).toEqual([canonSections[1].content]);
    expect(index['proposed-42-0'].chunks).toEqual([proposedContents[0].sections[0].content]);

    expect(index['canon-0'].tags).toEqual(expect.arrayContaining(['history', 'mystical', 'world', 'lore']));
    expect(index['canon-1'].tags).toEqual(expect.arrayContaining(['lore', 'begins', 'world', 'creation']));
    expect(index['proposed-42-0'].tags).toEqual(expect.arrayContaining(['characters', 'lore', 'brave']));
  });
});
