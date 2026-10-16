/** Editorial reading routes, separate from the canonical KJV and historical dataset.
 * Museum links were checked 2026-10-15. These summaries describe the scope of
 * the selected record; they do not certify every claim in the wider collection.
 */
export interface Discovery {
  title: string;
  question: string;
  verse: string;
  lead: string;
  record?: { title: string; text: string; label: string; url?: string; source?: string };
  distinction: string;
}

export const discoveries: Record<string, Discovery> = {
  'jesus-christ': {
    title: 'A name in the Gospel. A name carved in stone.',
    question: 'How does the world of Jesus connect to Roman history?',
    verse: 'Luke.3.1',
    lead: 'Luke places the Gospel in the reign of Tiberius and names Pontius Pilate in Judea. Step outside the biblical text: a surviving inscription bears Pilate’s name too.',
    record: { title: 'The Pilate Stone', label: 'Surviving inscription · Roman Judea', text: 'A Latin dedicatory inscription from Caesarea names Pontius Pilate. Here is a Roman official encountered in the Gospel, also named in a material record from the ancient world.', url: 'https://www.imj.org.il/en/exhibitions/cradle-christianity', source: 'See the Israel Museum’s exhibition record' },
    distinction: 'The inscription independently attests Pilate. It does not narrate Jesus’ trial or establish the resurrection; those are distinct questions to pursue in the Gospel and other sources.'
  },
  daniel: {
    title: 'A Babylonian name beyond the banquet.',
    question: 'Who was Belshazzar—and where does Babylon name him?',
    verse: 'Dan.5.1',
    lead: 'Daniel opens the feast with a ruler’s name: Belshazzar. Babylonian inscriptions let you investigate that name outside the biblical account.',
    record: { title: 'A cylinder of Nabonidus', label: 'Babylonian inscription · Names Belshazzar', text: 'The British Museum catalogues a clay cylinder inscribed for Nabonidus and identifies Belshazzar among the people named in it. Follow the museum record, then return to Daniel’s account of the feast.', url: 'https://www.britishmuseum.org/collection/object/W_K-1689', source: 'Read the British Museum catalogue' },
    distinction: 'An inscription naming Belshazzar establishes his historical attestation. His title, his relationship to Nabonidus, and the chronology of Daniel require further study. The writing on the wall is the biblical account, not the cylinder’s claim.'
  },
  hezekiah: {
    title: 'Jerusalem, seen from both sides of the siege.',
    question: 'How did Assyria describe its campaign against Hezekiah?',
    verse: '2Kgs.18.13',
    lead: 'Kings tells of Sennacherib invading Judah. The Assyrian king left his own account. Put the two records beside each other and ask what each chooses to tell.',
    record: { title: 'The Taylor Prism', label: 'Assyrian royal record · Campaign of 701 BC', text: 'This clay prism records Sennacherib’s campaigns and tribute from Hezekiah, king of Judah, in 701 BC. A king named in Scripture also appears in the invading empire’s royal record.', url: 'https://www.britishmuseum.org/collection/image/426311001', source: 'Examine the British Museum record' },
    distinction: 'The prism is Assyrian royal rhetoric; Kings is the biblical account. Their overlap anchors the people and campaign. The prism does not independently establish the angelic deliverance described in 2 Kings 19.'
  },
  moses: {
    title: 'An Exodus. A Pharaoh. An open historical question.',
    question: 'Which Pharaoh ruled during the Exodus—and how are dates proposed?',
    verse: 'Exod.1.11',
    lead: 'Exodus names the store cities, but does not give this Pharaoh’s personal name. How do readers move from the biblical clues to proposed Egyptian chronologies?',
    record: { title: 'The question of the Exodus date', label: 'Historical reconstruction · Debated identification', text: 'The study collection contrasts an earlier chronology using the interval in 1 Kings 6:1 with a later chronology associated with the name Raamses in Exodus 1:11. These are proposed correlations, not an inscription naming Moses or identifying the Exodus Pharaoh.' },
    distinction: 'Keep the biblical text and the proposed historical identification in view separately. A proposed date is not the same kind of evidence as a named contemporary inscription.'
  },
  abraham: {
    title: 'A promise begins with a journey.', question: 'What kind of world did Abraham leave behind?', verse: 'Gen.12.1',
    lead: 'Begin with the call to leave home. Then trace Abraham’s story through the cities and family connections of Genesis, and onward to Paul’s reading of the promise.',
    record: { title: 'The world around the patriarchs', label: 'Cultural context · Not a personal attestation', text: 'The study collection points to Mesopotamian archives as background for names and customs. Cultural parallels can illuminate a setting, but they do not identify Abraham himself in an independent record.' },
    distinction: 'Ancient context and direct evidence for a particular person are different. Follow the covenant through Scripture while examining historical correlations on their own merits.'
  },
  david: {
    title: 'From a shepherd to a royal house.', question: 'Why does the phrase “house of David” matter?', verse: '2Sam.7.16',
    lead: 'The promise to David looks beyond a single lifetime to a house and a kingdom. Explore the later inscriptions discussed in the historical collection, then follow the promise toward Christ.',
    distinction: 'A later reference to a dynasty is different from a contemporary biography of its founder. Inscriptions and the theological meaning of the Davidic promise should be examined separately.'
  },
  isaiah: {
    title: 'A prophet in the shadow of empire.', question: 'What connects Isaiah’s prophecies to the kings of his world?', verse: 'Isa.7.14',
    lead: 'Isaiah speaks into a world of vulnerable kingdoms and imperial threats. Follow his connection to Hezekiah, then read the passages Christians understand in relation to Jesus.',
    distinction: 'The historical setting, the dating of a text, and its interpretation as prophecy are distinct lines of inquiry. The wider study gives you passages and records to examine.'
  },
  paul: {
    title: 'The Gospel enters a Roman courtroom.', question: 'How can a Roman official help place Paul in history?', verse: 'Acts.18.12',
    lead: 'Acts places Paul before Gallio in Achaia. Start with the courtroom scene, then explore the collection’s discussion of Gallio and the Delphi inscription.',
    distinction: 'An attested officeholder can help establish a chronological setting. That is a narrower claim than independently establishing every event in the surrounding narrative.'
  },
  peter: {
    title: 'An eyewitness speaks in Jerusalem.', question: 'What did Peter say he had witnessed?', verse: 'Acts.2.32',
    lead: 'Start with Peter’s proclamation. Follow the people he knew, and investigate the account of Herod Agrippa in the biblical and historical sources listed below.',
    distinction: 'Peter’s claim to be a witness is recorded in Scripture. A separate historical account about a ruler provides context; it does not by itself establish Peter’s whole testimony.'
  },
  jeremiah: {
    title: 'A warning, an exile, and a promise beyond it.', question: 'Why was Daniel reading Jeremiah in Babylon?', verse: 'Jer.25.11',
    lead: 'Jeremiah speaks of Babylonian rule. Daniel later reads Jeremiah’s words during the exile. Follow that connection across two books and into the history of Babylon.',
    distinction: 'Biblical cross-references connect the accounts. Archaeological identification of individual seal owners requires its own provenance and authentication; names alone are not enough.'
  },
  solomon: {
    title: 'A Temple with a date attached.', question: 'Why does Solomon’s Temple matter to the Exodus timeline?', verse: '1Kgs.6.1',
    lead: 'One verse joins Solomon’s reign to the Exodus with a numbered interval. Explore why that number matters to proposed biblical chronologies.',
    distinction: 'An interval in Scripture and the absolute date assigned to it are related but separate. Reconstructing a chronology requires stating how regnal years and other evidence are correlated.'
  },
  'ezra-nehemiah': {
    title: 'Rebuilding Jerusalem under a Persian king.', question: 'How does a Persian regnal year enter Nehemiah’s story?', verse: 'Neh.2.1',
    lead: 'Nehemiah dates his account to the reign of Artaxerxes. Follow the cupbearer from a Persian court to Jerusalem’s walls, then back to the earlier story of exile.',
    distinction: 'A named king and regnal year give a historical setting. Proposed links to Daniel’s prophecy involve additional chronological and interpretive decisions.'
  }
};
