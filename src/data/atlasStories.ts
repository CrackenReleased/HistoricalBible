/**
 * HistoricalBible atlas editorial story index; canonical owner: this project.
 * Consumer: atlas menus/search. Sources: cited public/data/kjv_verses.json passages.
 * Notes are SCRIPTURAL_INFERENCE summaries, never Scripture quotations or coordinates.
 * Retain indefinitely with the atlas; review citations whenever an entry changes.
 * Bound: 120 entries before a separate editorial review. No copied corpus/private data.
 * Optional route links reuse existing stops; absence means a source-only reading card.
 */
export interface AtlasStory {
  id: string;
  title: string;
  eraId: string;
  ref: string;
  note: string;
  keywords: string;
  routeId?: string;
  stopIndex?: number;
}

export const ATLAS_STORY_PERIODS: { id: string; name: string }[] = [
  { id: 'primeval', name: 'Creation–Babel · Genesis 1–11' },
  { id: 'wisdom', name: 'Wisdom & worship · dates vary' },
  { id: 'last_kings', name: 'Judah’s last kings · before the exile' },
  { id: 'prophets', name: 'Prophetic books · dates vary' },
  { id: 'revelation', name: 'Revelation & things to come' },
];

const story = (id: string, title: string, eraId: string, ref: string, note: string, keywords = '', routeId?: string, stopIndex?: number): AtlasStory =>
  ({ id, title, eraId, ref, note, keywords, ...(routeId ? { routeId, stopIndex } : {}) });

export const ATLAS_STORIES: AtlasStory[] = [
  story('creation', 'Creation of heaven and earth', 'primeval', 'Gen.1.1', 'Genesis opens with God creating heaven and earth. This reading does not assign a modern map coordinate.', 'beginning six days seventh day sabbath'),
  story('eden-fall', 'Adam and Eve: Eden and the fall', 'primeval', 'Gen.3.6', 'Adam and Eve disobey God in the garden. Eden is not assigned a verified modern location.', 'serpent fruit temptation garden sin'),
  story('cain-abel', 'Cain and Abel', 'primeval', 'Gen.4.8', 'Cain kills his brother Abel. This is Abel the person, not a later city with the same spelling.', 'offering sacrifice brothers murder'),
  story('noah-flood', 'Noah, the ark and the flood', 'primeval', 'Gen.7.23', 'Noah and those with him are preserved in the ark. This is Noah in Genesis, not the daughter of Zelophehad.', 'rain rainbow covenant animals forty days'),
  story('babel', 'The tower of Babel', 'primeval', 'Gen.11.9', 'The LORD confounds the language at Babel and scatters the people. No tower site is asserted.', 'tower languages shinar scatter'),

  story('lot-sodom', 'Lot and the destruction of Sodom', 'patriarchs', 'Gen.19.29', 'God remembers Abraham and brings Lot out of the overthrow of the cities of the plain.', 'gomorrah wife salt angels'),
  story('hagar-ishmael', 'Hagar and Ishmael in the wilderness', 'patriarchs', 'Gen.21.17', 'God hears the lad and the angel of God calls to Hagar in her distress.', 'sarah abraham water well wilderness'),
  story('abraham-isaac', 'Abraham and Isaac: the offering', 'patriarchs', 'Gen.22.12', 'Abraham is stopped from killing Isaac. The chapter recounts the ram provided for the offering.', 'moriah ram sacrifice test son'),
  story('isaac-rebekah', 'Isaac and Rebekah', 'patriarchs', 'Gen.24.67', 'Genesis 24 tells the servant’s journey and Rebekah becoming Isaac’s wife.', 'rebecca servant well camels marriage'),
  story('esau-birthright', 'Jacob and Esau: the birthright', 'patriarchs', 'Gen.25.34', 'Esau exchanges his birthright for food; the passage describes his disregard for it.', 'pottage lentils brothers twins', 'jacob-padan-aram', 0),
  story('jacob-ladder', 'Jacob’s ladder at Bethel', 'patriarchs', 'Gen.28.12', 'Jacob dreams of a ladder reaching heaven with angels ascending and descending.', 'dream luz angels heaven', 'jacob-padan-aram', 1),
  story('jacob-wrestles', 'Jacob wrestles and is named Israel', 'patriarchs', 'Gen.32.28', 'Jacob receives the name Israel in the wrestling narrative at Peniel.', 'penuel jabbok blessing wrestling', 'jacob-padan-aram', 5),
  story('joseph-sold', 'Joseph sold by his brothers', 'patriarchs', 'Gen.37.28', 'Joseph is taken from the pit and sold to merchants who bring him into Egypt.', 'coat colours colors pit dothan slavery', 'joseph-egypt', 1),
  story('joseph-dreams', 'Joseph interprets Pharaoh’s dreams', 'patriarchs', 'Gen.41.39', 'Pharaoh recognizes the wisdom God has given Joseph after the dreams are interpreted.', 'cows kine corn seven plenty famine prison', 'joseph-egypt', 3),
  story('joseph-reunion', 'Joseph reveals himself to his brothers', 'patriarchs', 'Gen.45.5', 'Joseph tells his brothers that God sent him before them to preserve life.', 'benjamin judah forgiveness reunion famine', 'joseph-egypt', 4),

  story('baby-moses', 'Baby Moses in the bulrushes', 'exodus', 'Exod.2.10', 'Pharaoh’s daughter receives the child and names him Moses after he is drawn from the water.', 'basket river sister jochebed miriam'),
  story('burning-bush', 'Moses and the burning bush', 'exodus', 'Exod.3.4', 'God calls Moses from the bush in the account of his commission to bring Israel out of Egypt.', 'horeb holy ground sandals i am'),
  story('plagues', 'Moses, Pharaoh and the plagues', 'exodus', 'Exod.7.17', 'The turning of the river’s water to blood begins the sequence of plagues described in Exodus 7–12.', 'aaron frogs lice flies cattle boils hail locusts darkness firstborn'),
  story('passover', 'The first Passover', 'exodus', 'Exod.12.13', 'The blood marks the houses as God passes over them during the judgment on Egypt.', 'lamb blood unleavened firstborn deliverance'),
  story('red-sea', 'Crossing the Red Sea', 'exodus', 'Exod.14.21', 'The LORD divides the sea as Moses stretches out his hand. The precise modern crossing site is not supplied by this verse.', 'moses pharaoh chariots dry ground', 'exodus-route', 3),
  story('manna', 'Manna in the wilderness', 'exodus', 'Exod.16.15', 'Moses identifies the manna as the bread the LORD has given Israel to eat.', 'bread heaven quail food'),
  story('ten-commandments', 'The Ten Commandments at Sinai', 'exodus', 'Exod.20.3', 'Exodus 20 records the commandments spoken to Israel, beginning with the prohibition of other gods.', 'law tablets sabbath honour honor', 'exodus-route', 7),
  story('golden-calf', 'Aaron and the golden calf', 'exodus', 'Exod.32.8', 'Israel makes and worships a molten calf while Moses is on the mount.', 'idolatry tablets broken worship'),
  story('twelve-spies', 'Joshua, Caleb and the twelve spies', 'exodus', 'Num.13.30', 'Caleb urges Israel to go up and possess the land; Numbers 13–14 records the competing reports and response.', 'canaan giants grapes unbelief'),
  story('brass-serpent', 'The brass serpent', 'exodus', 'Num.21.9', 'Those bitten by serpents live when they look upon the serpent of brass made by Moses.', 'bronze snake pole healing'),

  story('rahab', 'Rahab hides the spies', 'judges', 'Josh.2.4', 'Rahab conceals the two men sent to view the land and Jericho.', 'scarlet cord spies jericho'),
  story('jericho', 'The walls of Jericho fall', 'judges', 'Josh.6.20', 'The people shout as the trumpets sound and the wall falls down.', 'joshua trumpets seven march', 'joshua-conquest', 2),
  story('deborah-jael', 'Deborah, Barak and Jael', 'judges', 'Judg.4.21', 'Judges 4–5 recounts Deborah and Barak’s deliverance and Jael’s killing of Sisera.', 'sisera jabin tent peg nail kishon'),
  story('gideon-three-hundred', 'Gideon and the three hundred', 'judges', 'Judg.7.20', 'Gideon’s companies sound trumpets and break pitchers as the battle against Midian unfolds.', '300 fleece lamps torches midian jerubbaal'),
  story('samson-delilah', 'Samson, Delilah and the pillars', 'judges', 'Judg.16.30', 'Samson brings down the house upon the Philistines at the end of his life.', 'hair strength gaza dagon', 'samson-judges', 6),
  story('ruth-redemption', 'Ruth, Naomi and Boaz', 'judges', 'Ruth.4.13', 'Ruth becomes Boaz’s wife and bears a son in the account of her family’s redemption.', 'kinsman redeemer gleaning obed bethlehem', 'ruth-boaz', 4),
  story('hannah-samuel', 'Hannah prays for a son', 'judges', '1Sam.1.20', 'Hannah bears Samuel after her petition to the LORD. Her prayer occurs at Shiloh before the family returns to Ramah.', 'eli prayer child shiloh'),
  story('samuel-call', 'The LORD calls Samuel', 'judges', '1Sam.3.10', 'Samuel answers when the LORD calls him in the night.', 'eli speak servant hears shiloh', 'samuel-circuit', 1),

  story('david-goliath', 'David and Goliath', 'united_monarchy', '1Sam.17.49', 'David strikes the Philistine with a stone from his sling in the Valley of Elah narrative.', 'giant shepherd five stones sling', 'david-exile-throne', 1),
  story('david-bathsheba', 'David, Bathsheba and Nathan’s rebuke', 'united_monarchy', '2Sam.12.7', 'Nathan confronts David after the account of Bathsheba and Uriah in 2 Samuel 11.', 'uriah adultery repentance ewe lamb'),
  story('absalom', 'Absalom’s rebellion and David’s grief', 'united_monarchy', '2Sam.18.33', 'David mourns Absalom following the rebellion and the death of his son.', 'rebellion joab son forest'),
  story('solomon-wisdom', 'Solomon and the two mothers', 'united_monarchy', '1Kgs.3.27', 'Solomon identifies the mother of the living child and orders that the child be spared.', 'wisdom judgment baby sword'),
  story('solomon-temple', 'Solomon dedicates the temple', 'united_monarchy', '1Kgs.8.20', 'Solomon speaks of the LORD fulfilling his promise as the house is built for his name.', 'dedication ark prayer temple', 'solomon-glory', 1),
  story('kingdom-divides', 'Rehoboam, Jeroboam and the divided kingdom', 'divided_monarchy_prophets', '1Kgs.12.16', 'Israel turns away from Rehoboam after the king refuses the people’s request.', 'ten tribes judah israel division shechem'),
  story('elijah-widow', 'Elijah and the widow of Zarephath', 'divided_monarchy_prophets', '1Kgs.17.22', 'The LORD hears Elijah and the widow’s child revives in the Zarephath account.', 'ravens flour oil son sidon', 'elijah-prophet', 2),
  story('elijah-carmel', 'Elijah and the prophets of Baal', 'divided_monarchy_prophets', '1Kgs.18.38', 'The fire of the LORD consumes the sacrifice on Mount Carmel.', 'ahab jezebel fire altar drought rain', 'elijah-prophet', 3),
  story('naaman', 'Elisha and Naaman’s cleansing', 'divided_monarchy_prophets', '2Kgs.5.14', 'Naaman dips seven times in the Jordan and is cleansed as the man of God instructed.', 'leprosy syrian servant girl jordan seven'),
  story('hezekiah-deliverance', 'Hezekiah and the Assyrian siege', 'assyrian_siege', '2Kgs.19.35', 'The angel of the LORD strikes the Assyrian camp in the account of Jerusalem’s deliverance.', 'sennacherib isaiah prayer jerusalem'),
  story('josiah-law', 'Josiah and the recovered book of the law', 'last_kings', '2Kgs.22.8', 'Hilkiah finds the book of the law; the following narrative records Josiah’s response and consultation of Huldah.', 'huldah hilkiah shaphan reform passover'),
  story('jeremiah-warning', 'Jeremiah warns Judah at the temple gate', 'last_kings', 'Jer.7.3', 'Jeremiah is sent to the temple gate to call Judah to amend its ways, rather than trusting in claims about the temple.', 'jeremiah temple sermon warning repentance exile judah'),

  story('fiery-furnace', 'Shadrach, Meshach and Abednego: the fiery furnace', 'babylonian_exile', 'Dan.3.27', 'The three men emerge unharmed from the furnace. Daniel is not named as one of the men cast into it.', 'hananiah mishael azariah nebuchadnezzar image fire', 'daniel-exile', 2),
  story('writing-wall', 'Belshazzar and the writing on the wall', 'babylonian_exile', 'Dan.5.25', 'Daniel reads the writing at Belshazzar’s feast in the account of the kingdom’s judgment.', 'mene tekel upharsin banquet hand', 'daniel-exile', 3),
  story('lions-den', 'Daniel in the lions’ den', 'babylonian_exile', 'Dan.6.22', 'Daniel says God sent his angel and shut the lions’ mouths.', 'darius prayer lions den', 'daniel-exile', 4),
  story('dry-bones', 'Ezekiel’s vision of the dry bones', 'babylonian_exile', 'Ezek.37.10', 'The bones live in Ezekiel’s vision. The vision is not presented here as a surveyed location.', 'valley breath resurrection israel vision'),
  story('esther-deliverance', 'Esther, Mordecai and Haman', 'persian_restoration', 'Esth.7.3', 'Esther petitions the king for her life and the lives of her people.', 'purim queen shushan susa banquet', 'esther-mordecai', 3),
  story('nehemiah-rebuilds', 'Nehemiah rebuilds Jerusalem’s walls', 'persian_restoration', 'Neh.6.15', 'The wall is completed in fifty-two days despite opposition.', 'sanballat tobiah walls gates', 'nehemiah-walls', 3),
  story('ezra-reads', 'Ezra reads the law to the people', 'persian_restoration', 'Neh.8.8', 'The law is read distinctly and explained so the people understand the reading.', 'water gate levites understanding', 'nehemiah-walls', 4),

  story('nativity', 'The birth of Jesus', 'roman_christ', 'Luke.2.11', 'The angel announces the birth of Christ the Lord in the city of David.', 'christmas mary joseph manger shepherds bethlehem', 'jesus-nativity-youth', 1),
  story('baptism-jesus', 'John baptizes Jesus', 'roman_christ', 'Matt.3.16', 'At Jesus’s baptism the heavens open and the Spirit of God descends like a dove.', 'john baptist jordan dove father', 'jesus-early-ministry', 0),
  story('temptation-jesus', 'Jesus tempted in the wilderness', 'roman_christ', 'Matt.4.10', 'Jesus answers the tempter with Scripture and rejects the demand to worship Satan.', 'forty days devil stones bread', 'jesus-early-ministry', 1),
  story('cana-wedding', 'Water into wine at Cana', 'roman_christ', 'John.2.9', 'The ruler of the feast tastes the water made wine at the wedding in Cana.', 'marriage wedding first miracle', 'jesus-early-ministry', 2),
  story('nicodemus', 'Nicodemus and the new birth', 'roman_christ', 'John.3.3', 'Jesus teaches Nicodemus about being born again.', 'born again night pharisee love world', 'jesus-early-ministry', 3),
  story('samaritan-woman', 'The Samaritan woman at the well', 'roman_christ', 'John.4.10', 'Jesus speaks to the Samaritan woman about the gift of God and living water.', 'sychar jacob well living water', 'jesus-early-ministry', 5),
  story('sermon-mount', 'The Sermon on the Mount', 'roman_christ', 'Matt.5.3', 'Matthew 5–7 records Jesus’s teaching, beginning with the beatitudes.', 'beatitudes lord prayer salt light golden rule', 'jesus-galilean-ministry', 2),
  story('storm-calmed', 'Jesus calms the storm', 'roman_christ', 'Mark.4.39', 'Jesus rebukes the wind and the sea becomes calm.', 'boat peace waves wind', 'jesus-galilean-ministry', 4),
  story('jairus-daughter', 'Jairus’s daughter', 'roman_christ', 'Mark.5.41', 'Jesus takes the child’s hand and tells her to arise. This passage does not name the town.', 'jairus daughter raised death child'),
  story('feeding-five-thousand', 'Jesus feeds the five thousand', 'roman_christ', 'Matt.14.19', 'Jesus blesses the loaves and gives them through the disciples to the multitude.', '5000 five loaves two fishes bread', 'jesus-galilean-ministry', 5),
  story('walking-water', 'Jesus and Peter on the water', 'roman_christ', 'Matt.14.29', 'Peter steps from the ship and walks on the water toward Jesus.', 'sea boat waves faith sinking', 'jesus-galilean-ministry', 5),
  story('transfiguration', 'The transfiguration of Jesus', 'roman_christ', 'Matt.17.2', 'Jesus is transfigured before the disciples. The passage does not name the mountain.', 'moses elijah glory mountain'),
  story('lazarus-bethany', 'Jesus raises Lazarus of Bethany', 'roman_christ', 'John.11.43', 'Jesus calls Lazarus from the tomb. This is Martha and Mary’s brother in John 11.', 'martha mary tomb four days resurrection', 'jesus-passion-resurrection', 1),
  story('zacchaeus', 'Zacchaeus in the sycomore tree', 'roman_christ', 'Luke.19.5', 'Jesus calls Zacchaeus down and tells him he will stay at his house.', 'sycamore tax collector publican jericho', 'jesus-passion-resurrection', 2),
  story('good-samaritan', 'The good Samaritan', 'roman_christ', 'Luke.10.33', 'In Jesus’s teaching, a Samaritan has compassion on the wounded man. This is not a documented traveller’s itinerary.', 'parable neighbour neighbor priest levite jericho'),
  story('prodigal-son', 'The prodigal son', 'roman_christ', 'Luke.15.20', 'The father welcomes his returning son with compassion in Jesus’s teaching.', 'lost son father brother pigs inheritance parable'),
  story('sower', 'The parable of the sower', 'roman_christ', 'Matt.13.18', 'Jesus explains the parable of the sower and the different responses to the word.', 'seed soils thorns rocky ground parable'),
  story('rich-man-lazarus', 'The rich man and Lazarus', 'roman_christ', 'Luke.16.25', 'Jesus’s account describes the rich man and Lazarus after death. The text does not identify this Lazarus as Lazarus of Bethany.', 'abraham bosom beggar rich man torment'),
  story('talents', 'The parable of the talents', 'roman_christ', 'Matt.25.15', 'A man entrusts talents to his servants. This entry does not merge Matthew’s talents with Luke 19’s pounds.', 'servants stewardship five two one money parable'),
  story('last-supper', 'The Last Supper', 'roman_christ', 'Luke.22.19', 'Jesus gives bread to the disciples and tells them to do this in remembrance of him.', 'passover upper room bread cup covenant', 'jesus-passion-resurrection', 3),
  story('crucifixion', 'The crucifixion of Jesus', 'roman_christ', 'Matt.27.50', 'Matthew records Jesus’s death on the cross in the account of his suffering and burial.', 'cross golgotha calvary pilate thief', 'jesus-passion-resurrection', 3),
  story('resurrection', 'The resurrection of Jesus', 'roman_christ', 'Luke.24.6', 'At the empty tomb the women hear that Jesus has risen.', 'easter tomb women mary risen', 'jesus-passion-resurrection', 3),
  story('thomas-risen', 'Thomas meets the risen Jesus', 'roman_christ', 'John.20.27', 'Jesus invites Thomas to examine his wounds and calls him to believe.', 'doubting thomas wounds hands side'),
  story('great-commission', 'The Great Commission', 'roman_christ', 'Matt.28.19', 'The risen Jesus commissions the disciples to teach all nations and baptize.', 'nations disciples father son holy ghost', 'jesus-passion-resurrection', 5),

  story('pentecost', 'Pentecost and the coming of the Holy Ghost', 'apostolic_church', 'Acts.2.4', 'The disciples are filled with the Holy Ghost and speak as the Spirit gives them utterance.', 'tongues peter church jerusalem', 'peter-philip-missions', 0),
  story('stephen', 'Stephen’s testimony and martyrdom', 'apostolic_church', 'Acts.7.59', 'Stephen calls upon the Lord Jesus while he is being stoned.', 'stones martyr saul deacon', 'stephen-philip-deacons', 0),
  story('ethiopian-eunuch', 'Philip and the Ethiopian eunuch', 'apostolic_church', 'Acts.8.35', 'Philip begins with the Scripture the eunuch is reading and preaches Jesus to him.', 'isaiah chariot candace baptism gaza', 'stephen-philip-deacons', 2),
  story('saul-conversion', 'Saul encounters Jesus on the Damascus road', 'apostolic_church', 'Acts.9.5', 'Jesus addresses Saul on the road. This Saul is later also called Paul, not King Saul.', 'paul conversion blind ananias', 'paul-conversion-early', 2),
  story('cornelius', 'Peter and the household of Cornelius', 'apostolic_church', 'Acts.10.44', 'The Holy Ghost falls on the hearers while Peter speaks in Cornelius’s household.', 'gentiles centurion caesarea', 'peter-philip-missions', 4),
  story('philippian-jailer', 'Paul, Silas and the Philippian jailer', 'apostolic_church', 'Acts.16.25', 'Paul and Silas pray and sing in prison; the chapter continues with the earthquake and the jailer’s response.', 'prison earthquake jailer philippi'),
  story('paul-shipwreck', 'Paul’s shipwreck', 'apostolic_church', 'Acts.27.44', 'Everyone aboard reaches land safely in the shipwreck account.', 'storm malta melita ship rome'),

  story('job-restoration', 'Job’s trials and restoration', 'wisdom', 'Job.42.10', 'The LORD restores Job after he prays for his friends. The book does not state a calendar date for his life.', 'uz suffering eliphaz bildad zophar eli hu whirlwind'),
  story('psalm-shepherd', 'Psalm 23: the LORD as shepherd', 'wisdom', 'Ps.23.1', 'This psalm speaks of the LORD’s care using the image of a shepherd. It is a reading, not a travel route.', 'david shepherd valley shadow death worship'),
  story('proverbs-wisdom', 'Proverbs: wisdom and the fear of the LORD', 'wisdom', 'Prov.1.7', 'Proverbs places the fear of the LORD at the beginning of knowledge.', 'solomon wisdom instruction knowledge'),
  story('ecclesiastes-seasons', 'Ecclesiastes: a time for every purpose', 'wisdom', 'Eccl.3.1', 'Ecclesiastes considers the seasons of human life and their purposes.', 'time season vanity preacher'),
  story('suffering-servant', 'Isaiah’s prophecy of the suffering servant', 'prophets', 'Isa.53.5', 'Isaiah describes suffering for transgressions and healing through the servant’s stripes.', 'servant wounds transgressions prophecy messiah'),
  story('seven-churches', 'John and the seven churches', 'revelation', 'Rev.1.11', 'John is instructed to write what he sees and send it to seven named churches in Asia.', 'patmos ephesus smyrna pergamos thyatira sardis philadelphia laodicea'),
  story('new-creation', 'New heaven, new earth and New Jerusalem', 'revelation', 'Rev.21.1', 'John sees a new heaven and a new earth. The vision is not assigned a present-day map location.', 'new jerusalem holy city bride no tears things to come'),
  story('river-life', 'The river and tree of life', 'revelation', 'Rev.22.2', 'Revelation describes the tree of life and the healing of the nations in the closing vision.', 'river water throne lamb tree leaves nations'),

  story('woman-blood', 'The woman with the issue of blood', 'roman_christ', 'Mark.5.29', 'The woman is healed after touching Jesus’s garment in the crowd.', 'bleeding garment touch healing twelve years'),
  story('ten-lepers', 'The ten lepers and the thankful Samaritan', 'roman_christ', 'Luke.17.15', 'Ten lepers are cleansed as they go; one returns to glorify God and thank Jesus.', 'leprosy ten thanks gratitude samaritan'),
  story('lost-sheep', 'The parable of the lost sheep', 'roman_christ', 'Luke.15.4', 'Jesus describes the search for one lost sheep and the rejoicing when it is found.', 'shepherd ninety nine 99 repentance parable'),
  story('lost-coin', 'The parable of the lost coin', 'roman_christ', 'Luke.15.8', 'A woman searches diligently for a lost piece of silver and rejoices when she finds it.', 'silver candle sweep house ten pieces parable'),
  story('ten-virgins', 'The ten virgins and their lamps', 'roman_christ', 'Matt.25.1', 'Jesus compares the kingdom of heaven to ten virgins awaiting the bridegroom, distinguishing the wise from the foolish.', 'bridegroom lamps oil wise foolish parable'),
  story('woman-adultery', 'Jesus and the woman taken in adultery', 'roman_christ', 'John.8.11', 'After the accusers depart, Jesus tells the woman that he does not condemn her and commands her to sin no more. The woman is unnamed.', 'accusers stones forgiveness woman adultery'),
  story('bethesda-healing', 'The healing at the pool of Bethesda', 'roman_christ', 'John.5.8', 'Jesus tells the infirm man to take up his bed and walk; the man is immediately made whole.', 'pool bethesda bed sabbath thirty eight years'),
  story('joseph-potiphar', 'Joseph refuses Potiphar’s wife', 'patriarchs', 'Gen.39.9', 'Joseph refuses his master’s wife because the act would be wickedness and sin against God; he later flees, leaving his garment.', 'potiphar wife temptation garment prison false accusation'),
  story('captured-ark', 'The Philistines capture the ark', 'judges', '1Sam.4.11', 'The Philistines defeat Israel and take the ark; Eli’s sons Hophni and Phinehas are killed.', 'ark covenant philistines eli hophni phinehas dagon'),
  story('ananias-sapphira', 'Ananias and Sapphira', 'apostolic_church', 'Acts.5.3', 'Peter confronts Ananias about lying to the Holy Ghost. The account then describes the deaths of Ananias and his wife Sapphira.', 'lying possession sale money peter sapphira'),
  story('triumphal-entry', 'Jesus enters Jerusalem in triumph', 'roman_christ', 'Matt.21.9', 'The multitudes spread garments and branches in the way and acclaim Jesus as the Son of David.', 'palm sunday hosanna branches donkey triumphal entry'),
  story('judas-betrayal', 'Judas betrays Jesus', 'roman_christ', 'Matt.26.49', 'Judas identifies Jesus with a kiss to the armed multitude that comes to seize him.', 'judas iscariot kiss betrayal arrest gethsemane'),
  story('peter-denial', 'Peter denies Jesus three times', 'roman_christ', 'Luke.22.61', 'When the cock crows and Jesus looks at him, Peter remembers the warning and goes out weeping.', 'peter denial rooster cock crow three times'),
  story('wise-foolish-builders', 'The wise and foolish builders', 'roman_christ', 'Matt.7.24', 'Jesus contrasts hearing and doing his sayings with hearing without doing, through houses built on rock and sand.', 'rock sand house storm rain foundation builders parable'),
  story('jacob-esau-blessing', 'Jacob receives Isaac’s blessing', 'patriarchs', 'Gen.27.35', 'Isaac tells Esau that his brother has taken the blessing by subtilty. This episode is distinct from the earlier sale of the birthright.', 'jacob esau isaac rebekah blessing disguise venison'),
];
