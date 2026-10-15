# Bible Network v0.01.00 - KJV PDF Audit

- Audit run (UTC): 2026-10-15T01:26:14.983255+00:00
- Authoritative comparison source: `E:\HistoricalBible\Bible.pdf` (SHA-256 `350c32f5e611917ef3d58942dc50802cc9c9119904b6094c37ebb3e07afc9aad`).
- Method: extract each tagged `{chapter:verse}` from all PDF pages with pypdf default reading order; map printed Bible pages via the PDF table of contents; normalize whitespace/hyphenated line wraps; compare literal text and case-folded word-token sequences. Scripture was not repaired. Name detection reuses the exporter’s case-sensitive whole-name matcher. Cross-reference endpoints and every expanded range verse are checked against extracted PDF verse tags.
- Scope boundary: this is a mechanical text/reference audit. It does not establish that an editor’s cross-reference is theologically relevant or that a name gloss is correct. Those questions remain for contextual Astra review.

## Text and extraction

- PDF pages: **1,162**; extracted tagged verse instances: **31,098**; distinct verse keys: **31,098**.
- Imported verses: **31,102**; keys found in both: **31,098**; PDF-missing imported keys: **4**; PDF-only keys: **0**; duplicate PDF verse tags: **15**; empty/malformed extracted bodies: **0**.
- Text agreement among common keys: **14,632** whitespace-normalized exact; **15,682** typography/bracketing/word-spacing differences with equal case-folded token sequence; **784** token-sequence differences, which may reflect wording, editorial insertions, or PDF extraction artifacts and are not all visually adjudicated.
- Visible/interleaved page-label contamination found inside verse text: **13** verse(s). These labels were retained as wording differences, not silently stripped.
- Pages with no extracted verse marker (expected cover/contents are included): **1**; pages: `[365]`.
- Visual spot checks of rendered PDF pages: p. 15 Genesis 16:6 visibly reads `thy hand` although text extraction split `thy` as `th y`; p. 70 (printed p. 68) visibly repeats Exodus 16:1-2; p. 365 is blank; p. 501 (printed p. 499) visibly interleaves `Page 293 Esther` into Esther 9:22; p. 1143 (printed p. 1141) prints 2 John 1:1-13 twice. These confirm extraction/printing defects, not scripture edits by the audit.
- Visual spot checks confirm the PDF ends at 1 Thessalonians 5:27 on p. 1104, Hebrews 13:24 on p. 1127, Philippians 4:22 on p. 1097, and Revelation 22:20 on p. 1162; each imported final verse is omitted from this PDF.

Missing verses:
- `1 Thessalonians 5:28`: no tagged text in PDF; preceding verse `1 Thessalonians 5:27` is on physical p. 1104 (printed p. 1102). Do not infer the omitted wording from this PDF.
- `Hebrews 13:25`: no tagged text in PDF; preceding verse `Hebrews 13:24` is on physical p. 1127 (printed p. 1125). Do not infer the omitted wording from this PDF.
- `Philippians 4:23`: no tagged text in PDF; preceding verse `Philippians 4:22` is on physical p. 1097 (printed p. 1095). Do not infer the omitted wording from this PDF.
- `Revelation 22:21`: no tagged text in PDF; preceding verse `Revelation 22:20` is on physical p. 1162 (printed p. 1160). Do not infer the omitted wording from this PDF.

### Duplicate PDF verse tags

- `Exodus 16:1` tagged twice on physical p. 70 (printed p. 68); rendered-page review confirms the PDF itself repeats the verse text.
- `Exodus 16:2` tagged twice on physical p. 70 (printed p. 68); rendered-page review confirms the PDF itself repeats the verse text.
- `2 John 1:1` tagged twice on physical p. 1143 (printed p. 1141); rendered-page review confirms the PDF itself repeats the verse text.
- `2 John 1:2` tagged twice on physical p. 1143 (printed p. 1141); rendered-page review confirms the PDF itself repeats the verse text.
- `2 John 1:3` tagged twice on physical p. 1143 (printed p. 1141); rendered-page review confirms the PDF itself repeats the verse text.
- `2 John 1:4` tagged twice on physical p. 1143 (printed p. 1141); rendered-page review confirms the PDF itself repeats the verse text.
- `2 John 1:5` tagged twice on physical p. 1143 (printed p. 1141); rendered-page review confirms the PDF itself repeats the verse text.
- `2 John 1:6` tagged twice on physical p. 1143 (printed p. 1141); rendered-page review confirms the PDF itself repeats the verse text.
- `2 John 1:7` tagged twice on physical p. 1143 (printed p. 1141); rendered-page review confirms the PDF itself repeats the verse text.
- `2 John 1:8` tagged twice on physical p. 1143 (printed p. 1141); rendered-page review confirms the PDF itself repeats the verse text.
- `2 John 1:9` tagged twice on physical p. 1143 (printed p. 1141); rendered-page review confirms the PDF itself repeats the verse text.
- `2 John 1:10` tagged twice on physical p. 1143 (printed p. 1141); rendered-page review confirms the PDF itself repeats the verse text.
- `2 John 1:11` tagged twice on physical p. 1143 (printed p. 1141); rendered-page review confirms the PDF itself repeats the verse text.
- `2 John 1:12` tagged twice on physical p. 1143 (printed p. 1141); rendered-page review confirms the PDF itself repeats the verse text.
- `2 John 1:13` tagged twice on physical p. 1143 (printed p. 1141); rendered-page review confirms the PDF itself repeats the verse text.

### Wording differences (all listed when at most 100; otherwise first 100)

- `Genesis 3:24`, PDF p. 5: source `So he drove out the man; and he placed at the east of the garden of Eden Cherubims, and a flaming sword which turned every way, to keep the way of the tree of life.`; PDF `So he drove out the man; and he placed at the east of the garden of Eden Cherubim, and a flaming sword which turned every way, to keep the way of the tree of life.`.
- `Genesis 10:7`, PDF p. 10: source `And the sons of Cush; Seba, and Havilah, and Sabtah, and Raamah, and Sabtecha: and the sons of Raamah; Sheba, and Dedan.`; PDF `And the sons of Cush; Seba, and Havilah, and Sabtah, and Raamah, and Sabtechah: and the sons of Raamah; Sheba, and Dedan.`.
- `Genesis 12:8`, PDF p. 12: source `And he removed from thence unto a mountain on the east of Beth-el, and pitched his tent, having Beth-el on the west, and Hai on the east: and there he builded an altar unto the LORD , and called upon the name of the LORD .`; PDF `And he removed from thence unto a mountain on the east of Bethel, and pitched his tent,[having] Bethel on the west, and Hai on the east: and there he builded an altar unto the LORD, and called upon the name of the LORD.`.
- `Genesis 13:3`, PDF p. 13: source `And he went on his journeys from the south even to Beth-el, unto the place where his tent had been at the beginning, between Beth-el and Hai;`; PDF `And he went on his journeys from the south even to Bethel, unto the place where his tent had been at the beginning, between Bethel and Hai;`.
- `Genesis 16:6`, PDF p. 15: source `But Abram said unto Sarai, Behold, thy maid is in thy hand; do to her as it pleaseth thee. And when Sarai dealt hardly with her, she fled from her face.`; PDF `But Abram said unto Sarai, Behold, thy maid [is] in th y hand; do to her as it pleaseth thee. And when Sarai dealt hardly with her, she fled from her face.`.
- `Genesis 19:38`, PDF p. 19: source `And the younger, she also bare a son, and called his name Ben-ammi: the same is the father of the children of Ammon unto this day.`; PDF `And the younger, she also bare a son, and called his name Benammi: the same [is] the father of the children of Ammon unto this day.`.
- `Genesis 21:17`, PDF p. 20: source `And God heard the voice of the lad; and the angel of God called to Hagar out of heaven, and said unto her, What aileth thee, Hagar? fear not; for God hath heard the voice of the lad where he is .`; PDF `And God heard the voice of the lad; and the angel of God called Hagar out of heaven, and said unto her, What aileth thee, Hagar? fear not; for God hath heard the voice of the lad where he [is.]`.
- `Genesis 22:14`, PDF p. 21: source `And Abraham called the name of that place Jehovah-jireh: as it is said to this day, In the mount of the LORD it shall be seen.`; PDF `And Abraham called the name of that place Jehovahjireh: as it is said [to] this day, In the mount of the LORD it shall be seen.`.
- `Genesis 23:13`, PDF p. 22: source `And he spake unto Ephron in the audience of the people of the land, saying, But if thou wilt give it , I pray thee, hear me: I will give thee money for the field; take it of me, and I will bury my dead there.`; PDF `And he spake unto Ephron in the audience of the people of the land, saying, But if thou [wilt give it,] I pray thee, hear me: I will give thee money for the field; take [it] o f me, and I will bury my dead there.`.
- `Genesis 25:11`, PDF p. 25: source `And it came to pass after the death of Abraham, that God blessed his son Isaac; and Isaac dwelt by the well Lahai-roi.`; PDF `And it came to pass after the death of Abraham, that God blessed his son Isaac; and Isaac dwelt by the well Lahairoi.`.
- `Genesis 27:20`, PDF p. 27: source `And Isaac said unto his son, How is it that thou hast found it so quickly, my son? And he said, Because the LORD thy God brought it to me.`; PDF `And Isaac said unto his son, How [is it] that thou has t found [it] so quickly, my son? And he said, Because the LORD thy God brought [it] to me.`.
- `Genesis 28:5`, PDF p. 28: source `And Isaac sent away Jacob: and he went to Padan-aram unto Laban, son of Bethuel the Syrian, the brother of Rebekah, Jacob’s and Esau’s mother.`; PDF `And Isaac sent away Jacob: and he went to Padanaram unto Laban, son of Bethuel the Syrian, the brother of Rebekah, Jacob's and Esau's mother.`.
- `Genesis 28:19`, PDF p. 29: source `And he called the name of that place Beth-el: but the name of that city was called Luz at the first.`; PDF `And he called the name of that place Bethel: but the name of that city [was called] Luz at the first.`.
- `Genesis 31:13`, PDF p. 32: source `I am the God of Beth-el, where thou anointedst the pillar, and where thou vowedst a vow unto me: now arise, get thee out from this land, and return unto the land of thy kindred.`; PDF `I [am] the God of Bethel, where thou anointedst the pillar, [and] where thou vowedst a vow unto me: now arise, get thee out from this land, and return unto the land of thy kindred.`.
- `Genesis 33:20`, PDF p. 35: source `And he erected there an altar, and called it El-elohe-Israel.`; PDF `And he erected there an altar, and called it El-eloheIsrael.`.
- `Genesis 35:1`, PDF p. 36: source `And God said unto Jacob, Arise, go up to Beth-el, and dwell there: and make there an altar unto God, that appeared unto thee when thou fleddest from the face of Esau thy brother.`; PDF `And God said unto Jacob, Arise, go up to Bethel, and dwell there: and make there an altar unto God, that appeared unto thee when thou fleddest from the face of Esau thy brother.`.
- `Genesis 35:3`, PDF p. 36: source `And let us arise, and go up to Beth-el; and I will make there an altar unto God, who answered me in the day of my distress, and was with me in the way which I went.`; PDF `And let us arise, and go up to Bethel; and I will make there an altar unto God, who answered me in the day of my distress, and was with me in the way which I went.`.
- `Genesis 35:6`, PDF p. 36: source `So Jacob came to Luz, which is in the land of Canaan, that is , Beth-el, he and all the people that were with him.`; PDF `So Jacob came to Luz, which [is] in the land of Canaan, that [is,] Bethel, he and all the people that [were] with him.`.
- `Genesis 35:7`, PDF p. 36: source `And he built there an altar, and called the place El-beth-el: because there God appeared unto him, when he fled from the face of his brother.`; PDF `And he built there an altar, and called the place Elbeth-el: because there God appeared unto him, when he fled from the face of his brother.`.
- `Genesis 35:8`, PDF p. 36: source `But Deborah Rebekah’s nurse died, and she was buried beneath Beth-el under an oak: and the name of it was called Allon-bachuth.`; PDF `But Deborah Rebekah's nurse died, and she was buried beneath Bethel under an oak: and the name of it was called Allon-bachuth.`.
- `Genesis 35:15`, PDF p. 37: source `And Jacob called the name of the place where God spake with him, Beth-el.`; PDF `And Jacob called the name of the place where God spake with him, Bethel.`.
- `Genesis 35:16`, PDF p. 37: source `And they journeyed from Beth-el; and there was but a little way to come to Ephrath: and Rachel travailed, and she had hard labour.`; PDF `And they journeyed from Bethel; and there was but a little way to come to Ephrath: and Rachel travailed, and she had hard labour.`.
- `Genesis 35:19`, PDF p. 37: source `And Rachel died, and was buried in the way to Ephrath, which is Beth-lehem.`; PDF `And Rachel died, and was buried in the way to Ephrath, which [is] Bethlehem.`.
- `Genesis 41:45`, PDF p. 44: source `And Pharaoh called Joseph’s name Zaphnath-paaneah; and he gave him to wife Asenath the daughter of Poti-pherah priest of On. And Joseph went out over all the land of Egypt.`; PDF `And Pharaoh called Joseph's name Zaphnathpaaneah; and he gave him to wife Asenath the daughter of Poti- pherah priest of On. And Joseph went out over [all] the land of Egypt.`.
- `Genesis 41:50`, PDF p. 44: source `And unto Joseph were born two sons before the years of famine came, which Asenath the daughter of Poti-pherah priest of On bare unto him.`; PDF `And unto Joseph were born two sons before the years of famine came, which Asenath the daughter of Pot ipherah priest of On bare unto him.`.
- `Genesis 46:12`, PDF p. 49: source `And the sons of Judah; Er, and Onan, and Shelah, and Pharez, and Zerah: but Er and Onan died in the land of Canaan. And the sons of Pharez were Hezron and Hamul.`; PDF `And the sons of Judah; Er, and Onan, and Shelah, and Pharez, and Zarah: but Er and Onan died in the land of Canaan. And the sons of Pharez were Hezron and Hamul.`.
- `Genesis 46:20`, PDF p. 49: source `And unto Joseph in the land of Egypt were born Manasseh and Ephraim, which Asenath the daughter of Poti-pherah priest of On bare unto him.`; PDF `And unto Joseph in the land of Egypt were born Manasseh and Ephraim, which Asenath the daughter of Po tipherah priest of On bare unto him.`.
- `Genesis 48:7`, PDF p. 51: source `And as for me, when I came from Padan, Rachel died by me in the land of Canaan in the way, when yet there was but a little way to come unto Ephrath: and I buried her there in the way of Ephrath; the same is Beth-lehem.`; PDF `And as for me, when I came from Padan, Rachel died by me in the land of Canaan in the way, when yet [there was] but a little way to come unto Ephrath: and I buried her there in the way of Ephrath; the same is Bethlehem.`.
- `Genesis 50:23`, PDF p. 54: source `And Joseph saw Ephraim’s children of the third generation: the children also of Machir the son of Manasseh were brought up upon Joseph’s knees.`; PDF `And Joseph saw Ephraim's children of the third [generation:] the children also of Machir the son Manasseh were brought up upon Joseph's knees.`.
- `Exodus 3:6`, PDF p. 56: source `Moreover he said, I am the God of thy father, the God of Abraham, the God of Isaac, and the God of Jacob. And Moses hid his face; for he was afraid to look upon God.`; PDF `Moreover he said, I [am] the God of thy father, the God of Abraham, the God of Isaac, and the God of Jacob. And Moses hid his face; for he was afraid to look Exodus Page 32 upon God.`.
- `Exodus 6:2`, PDF p. 59: source `And God spake unto Moses, and said unto him, I am the LORD : : or, JEHOVAH`; PDF `And God spake unto Moses, and said unto him, I [am] the LORD:`.
- `Exodus 12:20`, PDF p. 66: source `Ye shall eat nothing leavened; in all your habitations shall ye eat unleavened bread.`; PDF `Ye shall eat nothing leavened; in all your habitat ions shall ye eat unleavened bread.`.
- `Exodus 14:9`, PDF p. 68: source `But the Egyptians pursued after them, all the horses and chariots of Pharaoh, and his horsemen, and his army, and overtook them encamping by the sea, beside Pi-hahiroth, before Baal-zephon.`; PDF `But the Egyptians pursued after them, all the horses [and] chariots of Pharaoh, and his horsemen, and his army, and overtook them encamping by the sea, beside Pihahiroth, before Baal-zephon.`.
- `Exodus 15:25`, PDF p. 70: source `And he cried unto the LORD ; and the LORD shewed him a tree, which when he had cast into the waters, the waters were made sweet: there he made for them a statute and an ordinance, and there he proved them,`; PDF `And he cried unto the LORD; and the LORD shewed him a tree, [which] when he had cast into the waters, th e waters were made sweet: there he made for them a statute and an ordinance, and there he proved them,`.
- `Exodus 17:15`, PDF p. 72: source `And Moses built an altar, and called the name of it Jehovah-nissi: my banner`; PDF `And Moses built an altar, and called the name of it Jehovahnissi:`.
- `Exodus 17:16`, PDF p. 72: source `For he said, Because the LORD hath sworn that the LORD will have war with Amalek from generation to generation. , therefore, etc hath…: Heb. the hand upon the throne of the LORD`; PDF `For he said, Because the LORD hath sworn [that] the LORD [will have] war with Amalek from generation to generation.`.
- `Exodus 18:19`, PDF p. 73: source `Hearken now unto my voice, I will give thee counsel, and God shall be with thee: Be thou for the people to God-ward, that thou mayest bring the causes unto God:`; PDF `Hearken now unto my voice, I will give thee counsel, and God shall be with thee: Be thou for the people to Godward, that thou mayest bring the causes unto God:`.
- `Exodus 23:23`, PDF p. 77: source `For mine Angel shall go before thee, and bring thee in unto the Amorites, and the Hittites, and the Perizzites, and the Canaanites, the Hivites, and the Jebusites: and I will cut them off.`; PDF `For mine Angel shall go before thee, and bring thee in unto the Amorites, and the Hittites, and the Perizzites, and the Canaanites, and the Hivites, and the Jebusites: and I will cut them off.`.
- `Exodus 25:20`, PDF p. 79: source `And the cherubims shall stretch forth their wings on high, covering the mercy seat with their wings, and their faces shall look one to another; toward the mercy seat shall the faces of the cherubims be.`; PDF `And the cherubim shall stretch forth [their] wings on high, covering the mercy seat with their wings, and their faces [shall look] one to another; toward the mercy seat shall the faces of the cherubims be.`.
- `Exodus 28:41`, PDF p. 83: source `And thou shalt put them upon Aaron thy brother, and his sons with him; and shalt anoint them, and consecrate them, and sanctify them, that they may minister unto me in the priest’s office.`; PDF `And thou shalt put them upon Aaron thy brother, and his sons with him; and shalt anoint them, and consecrate them, and sanctify them, that they may minist er unto me in the priest's office.`.
- `Exodus 32:11`, PDF p. 87: source `And Moses besought the LORD his God, and said, LORD , why doth thy wrath wax hot against thy people, which thou hast brought forth out of the land of Egypt with great power, and with a mighty hand? : Heb. the face of the LORD`; PDF `And Moses besought the LORD his God, and said, LORD, why doth thy wrath wax hot against thy people, which thou hast brought forth out of the land of Egypt with great power, and with a mighty hand?`.
- `Exodus 32:29`, PDF p. 88: source `For Moses had said, Consecrate yourselves to day to the LORD , even every man upon his son, and upon his brother; that he may bestow upon you a blessing this day. , because every man hath been against his brother, etc`; PDF `For Moses had said, Consecrate yourselves to day to the LORD, even every man upon his son, and upon his brother; that he may bestow upon you a blessing this day.`.
- `Exodus 39:7`, PDF p. 95: source `And he put them on the shoulders of the ephod, that they should be stones for a memorial to the children of Israel; as the LORD commanded Moses.`; PDF `And he put them on the shoulders of the ephod, [th at they should be] stones for a memorial to the children of Israel; as the LORD commanded Moses.`.
- `Exodus 39:43`, PDF p. 96: source `And Moses did look upon all the work, and, behold, they had done it as the LORD had commanded, even so had they done it: and Moses blessed them.`; PDF `And Moses did look upon all the work, and, behold, they have done it as the LORD had commanded, even so had they done it: and Moses blessed them.`.
- `Leviticus 2:3`, PDF p. 99: source `And the remnant of the meat offering shall be Aaron’s and his sons’: it is a thing most holy of the offerings of the LORD made by fire.`; PDF `And the remnant of the meat offerings [shall be] Aaron's and his sons': [it is] a thing most holy of the offerings of the LORD made by fire.`.
- `Leviticus 2:7`, PDF p. 99: source `And if thy oblation be a meat offering baken in the fryingpan, it shall be made of fine flour with oil.`; PDF `And if thy oblation [be] a meat offering [baken] in the frying pan, it shall be made [of] fine flour with oil.`.
- `Leviticus 5:8`, PDF p. 102: source `And he shall bring them unto the priest, who shall offer that which is for the sin offering first, and wring off his head from his neck, but shall not divide it asunder:`; PDF `And he shall bring them unto the priest, who shall of fer [that] which [is] for the sin offering first, and wring off his head from his neck, but shall not divide [it] asunder:`.
- `Leviticus 7:21`, PDF p. 105: source `Moreover the soul that shall touch any unclean thing, as the uncleanness of man, or any unclean beast, or any abominable unclean thing , and eat of the flesh of the sacrifice of peace offerings, which pertain unto the LORD , even that soul shall be cut off from his people.`; PDF `Moreover the soul that shall touch any unclean [thin g, as] the uncleanness of man, or [any] unclean beast, or any abominable unclean [thing,] and eat of the flesh of the sacrifice of peace offerings, which [pertain] unto the LORD, even that soul shall be cut off from his people.`.
- `Leviticus 8:16`, PDF p. 106: source `And he took all the fat that was upon the inwards, and the caul above the liver, and the two kidneys, and their fat, and Moses burned it upon the altar.`; PDF `And he took all the fat that [was] upon the inwards, and caul [above] the liver, and the two kidneys, and their fat, and Moses burned [it] upon the altar.`.
- `Leviticus 13:2`, PDF p. 110: source `When a man shall have in the skin of his flesh a rising, a scab, or bright spot, and it be in the skin of his flesh like the plague of leprosy; then he shall be brought unto Aaron the priest, or unto one of his sons the priests:`; PDF `When a man shall have in the skin of his flesh a rising, a scab, or a bright spot, and it be in the skin of his flesh [like] the plague of leprosy; then he shall be brought unto Aaron the priest, or unto one of his sons the priests:`.
- `Leviticus 17:8`, PDF p. 117: source `And thou shalt say unto them, Whatsoever man there be of the house of Israel, or of the strangers which sojourn among you, that offereth a burnt offering or sacrifice,`; PDF `And thou shalt say unto them, Whatsoever man [there be] of the house of Israel, or of the strangers which sojourn among you, that offereth a burnt offering of sacrifice,`.
- `Leviticus 23:20`, PDF p. 124: source `And the priest shall wave them with the bread of the firstfruits for a wave offering before the LORD , with the two lambs: they shall be holy to the LORD for the priest.`; PDF `And the priest shall wave them with the bread of the first fruits [for] a wave offering before the LORD, with the two lambs: they shall be holy to the LORD for the priest.`.
- `Numbers 10:17`, PDF p. 144: source `And the tabernacle was taken down; and the sons of Gershon and the sons of Merari set forward, bearing the tabernacle.`; PDF `And the tabernacle was taken down; and the sons of Gershon and the sons of Merari set forward, bearing`.
- `Numbers 11:34`, PDF p. 146: source `And he called the name of that place Kibroth-hattaavah: because there they buried the people that lusted.`; PDF `And he called the name of that place Kibrothhattaavah: because there they buried the people that lusted.`.
- `Numbers 11:35`, PDF p. 146: source `And the people journeyed from Kibroth-hattaavah unto Hazeroth; and abode at Hazeroth.`; PDF `[And] the people journeyed from Kibrothhattaavah unto Hazeroth; and abode at Hazeroth.`.
- `Numbers 13:25`, PDF p. 147: source `And they returned from searching of the land after forty days.`; PDF `And they returned from searching of the land afte r forty days.`.
- `Numbers 14:14`, PDF p. 148: source `And they will tell it to the inhabitants of this land: for they have heard that thou LORD art among this people, that thou LORD art seen face to face, and that thy cloud standeth over them, and that thou goest before them, by day time in a pillar of a cloud, and in a pillar of fire by night.`; PDF `And they will tell [it] to the inhabitants of this land: [for] they have heard that thou LORD [art] among this people, that thou LORD art seen face to face, and [that] thy cloud standeth over them, and [that] thou goest before them, by daytime in a pillar of a cloud, and in a pillar of fire by night.`.
- `Numbers 21:11`, PDF p. 157: source `And they journeyed from Oboth, and pitched at Ije-abarim, in the wilderness which is before Moab, toward the sunrising.`; PDF `And they journeyed from Oboth, and pitched at Ijeabarim, in the wilderness which [is] before Moab, toward the sunrising.`.
- `Numbers 22:39`, PDF p. 159: source `And Balaam went with Balak, and they came unto Kirjath-huzoth.`; PDF `And Balaam went with Balak, and they came unto Kirjathhuzoth.`.
- `Numbers 28:10`, PDF p. 165: source `This is the burnt offering of every sabbath, beside the continual burnt offering, and his drink offering.`; PDF `[This is] the burnt offering of every sabbath, beside the continual burnt offering, and his drink offering. Page 97 Numbers`.
- `Numbers 32:8`, PDF p. 169: source `Thus did your fathers, when I sent them from Kadesh-barnea to see the land.`; PDF `Thus did your fathers, when I sent them from Kadeshbarnea to see the land.`.
- `Numbers 32:36`, PDF p. 170: source `And Beth-nimrah, and Beth-haran, fenced cities: and folds for sheep.`; PDF `And Beth-nimrah, and Bethharan, fenced cities: and folds for sheep.`.
- `Numbers 33:16`, PDF p. 171: source `And they removed from the desert of Sinai, and pitched at Kibroth-hattaavah.`; PDF `And they removed from the desert of Sinai, and pitched at Kibrothhattaavah.`.
- `Numbers 33:17`, PDF p. 171: source `And they departed from Kibroth-hattaavah, and encamped at Hazeroth.`; PDF `And they departed from Kibrothhattaavah, and encamped at Hazeroth.`.
- `Numbers 33:19`, PDF p. 171: source `And they departed from Rithmah, and pitched at Rimmon-parez.`; PDF `And they departed from Rithmah, and pitched at Rimmonparez.`.
- `Numbers 33:44`, PDF p. 172: source `And they departed from Oboth, and pitched in Ije-abarim, in the border of Moab.`; PDF `And they departed from Oboth, and pitched in Ijeabarim, in the border of Moab.`.
- `Numbers 33:45`, PDF p. 172: source `And they departed from Iim, and pitched in Dibon-gad.`; PDF `And they departed from Iim, and pitched in Dibongad.`.
- `Numbers 34:10`, PDF p. 172: source `And ye shall point out your east border from Hazar-enan to Shepham:`; PDF `And ye shall point out your east border from Hazarenan to Shepham:`.
- `Deuteronomy 2:5`, PDF p. 177: source `Meddle not with them; for I will not give you of their land, no, not so much as a foot breadth; because I have given mount Seir unto Esau for a possession.`; PDF `Meddle not with them; for I will not give you of their land, no, not so much as a footbreadth; because I have given mount Seir unto Esau [for] a possession.`.
- `Deuteronomy 3:26`, PDF p. 179: source `But the LORD was wroth with me for your sakes, and would not hear me: and the LORD said unto me, Let it suffice thee; speak no more unto me of this matter.`; PDF `But the LORD was wroth with me for your sakes, and would not hear me: and the LORD said unto me, Let it suffi ce thee; speak no more unto me of this matter.`.
- `Deuteronomy 4:3`, PDF p. 180: source `Your eyes have seen what the LORD did because of Baal-peor: for all the men that followed Baal-peor, the LORD thy God hath destroyed them from among you.`; PDF `Your eyes have seen what the LORD did because of Baal-peor: for all the men that followed Baalpeor, the LORD thy God hath destroyed them from among you.`.
- `Deuteronomy 4:46`, PDF p. 181: source `On this side Jordan, in the valley over against Beth-peor, in the land of Sihon king of the Amorites, who dwelt at Heshbon, whom Moses and the children of Israel smote, after they were come forth out of Egypt:`; PDF `On this side Jordan, in the valley over against Bethpeor, in the land of Sihon king of the Amorites, who dwelt at Heshbon, whom Moses and the children of Israel smote, after they were come forth out of Egypt:`.
- `Deuteronomy 9:22`, PDF p. 186: source `And at Taberah, and at Massah, and at Kibroth-hattaavah, ye provoked the LORD to wrath.`; PDF `And at Taberah, and at Massah, and at Kibrothhattaavah, ye provoked the LORD to wrath.`.
- `Deuteronomy 9:23`, PDF p. 186: source `Likewise when the LORD sent you from Kadesh-barnea, saying, Go up and possess the land which I have given you; then ye rebelled against the commandment of the LORD your God, and ye believed him not, nor hearkened to his voice.`; PDF `Likewise when the LORD sent you from Kadeshbarnea, saying, Go up and possess the land which I have given you; then ye rebelled against the commandment of the LORD your God, and ye believed him not, nor hearkened to his voice.`.
- `Deuteronomy 14:12`, PDF p. 191: source `But these are they of which ye shall not eat: the eagle, and the ossifrage, and the ospray,`; PDF `But these [are they] of which ye shall not eat: the eagle, and ossifrage, and the ospray,`.
- `Deuteronomy 22:1`, PDF p. 198: source `Thou shalt not see thy brother’s ox or his sheep go astray, and hide thyself from them: thou shalt in any case bring them again unto thy brother.`; PDF `Thou shalt not see the brother's ox or his sheep go astray, and hide thyself from them: thou shalt in any case bring them again unto thy brother.`.
- `Deuteronomy 22:3`, PDF p. 198: source `In like manner shalt thou do with his ass; and so shalt thou do with his raiment; and with all lost thing of thy brother’s, which he hath lost, and thou hast found, shalt thou do likewise: thou mayest not hide thyself.`; PDF `In like manner shalt thou do with his ass; and so shalt thou do with his raiment; and with all lost things of thy brother's, which he hath lost, and thou hast found, shalt thou do likewise: thou mayest not hide thyself.`.
- `Deuteronomy 22:10`, PDF p. 198: source `Thou shalt not plow with an ox and an ass together.`; PDF `Thou shalt not plow with an ox and an ass`.
- `Deuteronomy 29:22`, PDF p. 206: source `So that the generation to come of your children that shall rise up after you, and the stranger that shall come from a far land, shall say, when they see the plagues of that land, and the sicknesses which the LORD hath laid upon it; hath made it sick`; PDF `So that the generation to come of your children that shall rise up after you, and the stranger that shall come from a far land, shall say, when they see the plagues of that land, and the sicknesses which the LORD hath laid upon it;`.
- `Deuteronomy 32:27`, PDF p. 210: source `Were it not that I feared the wrath of the enemy, lest their adversaries should behave themselves strangely, and lest they should say, Our hand is high, and the LORD hath not done all this. hath done`; PDF `Were it not that I feared the wrath of the enemy, lest their adversaries should behave themselves strangely, [and] lest they should say, Our hand is high, and the LORD hath not done all this.`.
- `Joshua 2:5`, PDF p. 213: source `And it came to pass about the time of shutting of the gate, when it was dark, that the men went out: whither the men went I wot not: pursue after them quickly; for ye shall overtake them.`; PDF `And it came to pass [about the time] of shutting of t he gate, when it was dark, that the men went out: whither the men went I wot not: pursue after them quickly; for ye shall overtake them.`.
- `Joshua 6:23`, PDF p. 218: source `And the young men that were spies went in, and brought out Rahab, and her father, and her mother, and her brethren, and all that she had; and they brought out all her kindred, and left them without the camp of Israel.`; PDF `And the young men that were spies went in, and brought Rahab, and her father, and her mother, and her brethren, and all that she had; and they brought out all her kindred, and left them without the camp of Israel.`.
- `Joshua 7:2`, PDF p. 218: source `And Joshua sent men from Jericho to Ai, which is beside Beth-aven, on the east side of Beth-el, and spake unto them, saying, Go up and view the country. And the men went up and viewed Ai.`; PDF `And Joshua sent men from Jericho to Ai, which [is] beside Beth-aven, on the east side of Bethel, and spake unto them, saying, Go up and view the country. And the men went up and viewed Ai.`.
- `Joshua 8:9`, PDF p. 219: source `Joshua therefore sent them forth: and they went to lie in ambush, and abode between Beth-el and Ai, on the west side of Ai: but Joshua lodged that night among the people.`; PDF `Joshua therefore sent them forth: and they went to lie in ambush, and abode between Bethel and Ai, on the west side of Ai: but Joshua lodged that night among the people.`.
- `Joshua 8:12`, PDF p. 219: source `And he took about five thousand men, and set them to lie in ambush between Beth-el and Ai, on the west side of the city.`; PDF `And he took about five thousand men, and set them to lie in ambush between Bethel and Ai, on the west side of the city.`.
- `Joshua 8:17`, PDF p. 220: source `And there was not a man left in Ai or Beth-el, that went not out after Israel: and they left the city open, and pursued after Israel.`; PDF `And there was not a man left in Ai or Bethel, that went not out after Israel: and they left the city open, and pursued after Israel.`.
- `Joshua 12:9`, PDF p. 225: source `The king of Jericho, one; the king of Ai, which is beside Beth-el, one;`; PDF `The king of Jericho, one; the king of Ai, which [is] beside Bethel, one;`.
- `Joshua 12:16`, PDF p. 225: source `The king of Makkedah, one; the king of Beth-el, one;`; PDF `The king of Makkedah, one; the king of Bethel, one;`.
- `Joshua 12:20`, PDF p. 225: source `The king of Shimron-meron, one; the king of Achshaph, one;`; PDF `The king of Shimronmeron, one; the king of Achshaph, one;`.
- `Joshua 13:18`, PDF p. 225: source `And Jahazah, and Kedemoth, and Mephaath,`; PDF `And Jahaza, and Kedemoth, and Mephaath,`.
- `Joshua 13:20`, PDF p. 225: source `And Beth-peor, and Ashdoth-pisgah, and Beth-jeshimoth,`; PDF `And Bethpeor, and Ashdoth-pisgah, and Bethjeshimoth,`.
- `Joshua 13:26`, PDF p. 226: source `And from Heshbon unto Ramath-mizpeh, and Betonim; and from Mahanaim unto the border of Debir;`; PDF `And from Heshbon unto Ramathmizpeh, and Betonim; and from Mahanaim unto the border of Debir;`.
- `Joshua 13:27`, PDF p. 226: source `And in the valley, Beth-aram, and Beth-nimrah, and Succoth, and Zaphon, the rest of the kingdom of Sihon king of Heshbon, Jordan and his border, even unto the edge of the sea of Chinnereth on the other side Jordan eastward.`; PDF `And in the valley, Beth-aram, and Bethnimrah, and Succoth, and Zaphon, the rest of the kingdom of Sihon king of Heshbon, Jordan and [his] border, [even] unto the edge of the sea of Chinnereth on the other side Jordan eastward.`.
- `Joshua 14:6`, PDF p. 226: source `Then the children of Judah came unto Joshua in Gilgal: and Caleb the son of Jephunneh the Kenezite said unto him, Thou knowest the thing that the LORD said unto Moses the man of God concerning me and thee in Kadesh-barnea.`; PDF `Then the children of Judah came unto Joshua in Gilgal: and Caleb the son of Jephunneh the Kenezite said unto him, Thou knowest the thing that the LORD said unto Moses the man of God concerning me and thee in Kadeshbarnea.`.
- `Joshua 15:3`, PDF p. 227: source `And it went out to the south side to Maaleh-acrabbim, and passed along to Zin, and ascended up on the south side unto Kadesh-barnea, and passed along to Hezron, and went up to Adar, and fetched a compass to Karkaa:`; PDF `And it went out to the south side to Maalehacrabbim, and passed along to Zin, and ascended up on the south side unto Kadesh-barnea, and passed along to Hezron, and went up to Adar, and fetched a compass to Karkaa:`.
- `Joshua 15:9`, PDF p. 227: source `And the border was drawn from the top of the hill unto the fountain of the water of Nephtoah, and went out to the cities of mount Ephron; and the border was drawn to Baalah, which is Kirjath-jearim:`; PDF `And the border was drawn from the top of the hill unto the fountain of the water of Nephtoah, and went out to the cities of mount Ephron; and the border was drawn to Baalah, which [is] Kirjathjearim:`.
- `Joshua 15:41`, PDF p. 228: source `And Gederoth, Beth-dagon, and Naamah, and Makkedah; sixteen cities with their villages:`; PDF `And Gederoth, Bethdagon, and Naamah, and Makkedah; sixteen cities with their villages:`.
- `Joshua 16:1`, PDF p. 228: source `And the lot of the children of Joseph fell from Jordan by Jericho, unto the water of Jericho on the east, to the wilderness that goeth up from Jericho throughout mount Beth-el,`; PDF `And the lot of the children of Joseph fell from Jordan by Jericho, unto the water of Jericho on the east, to the wilderness that goeth up from Jericho throughout mount Bethel,`.
- `Joshua 16:2`, PDF p. 228: source `And goeth out from Beth-el to Luz, and passeth along unto the borders of Archi to Ataroth,`; PDF `And goeth out from Bethel to Luz, and passeth along unto the borders of Archi to Ataroth,`.
- `Joshua 16:5`, PDF p. 228: source `And the border of the children of Ephraim according to their families was thus: even the border of their inheritance on the east side was Ataroth-addar, unto Beth-horon the upper;`; PDF `And the border of the children of Ephraim according to their families was [thus:] even the border of their inheritance on the east side was Ataroth-addar, unto Bethhoron the upper;`.
- Plus 684 additional differing verses; not individually printed.

### Page labels interleaved with verse text

- `Numbers 28:10`, PDF physical p. 165 (printed p. 163): extracted text contains `Page 97 Numbers` inside the verse. Inspect the rendered page before treating this as Scripture.
- `1 Kings 8:10`, PDF physical p. 342 (printed p. 340): extracted text contains `Page 201 1` inside the verse. Inspect the rendered page before treating this as Scripture.
- `1 Kings 9:28`, PDF physical p. 345 (printed p. 343): extracted text contains `Page 203 1` inside the verse. Inspect the rendered page before treating this as Scripture.
- `1 Kings 12:17`, PDF physical p. 349 (printed p. 347): extracted text contains `Page 205 1` inside the verse. Inspect the rendered page before treating this as Scripture.
- `1 Kings 15:5`, PDF physical p. 353 (printed p. 351): extracted text contains `Page 207 1` inside the verse. Inspect the rendered page before treating this as Scripture.
- `1 Kings 18:5`, PDF physical p. 356 (printed p. 354): extracted text contains `Page 209 1` inside the verse. Inspect the rendered page before treating this as Scripture.
- `1 Kings 20:25`, PDF physical p. 360 (printed p. 358): extracted text contains `Page 211 1` inside the verse. Inspect the rendered page before treating this as Scripture.
- `1 Kings 22:39`, PDF physical p. 364 (printed p. 362): extracted text contains `Page 213 1` inside the verse. Inspect the rendered page before treating this as Scripture.
- `Esther 4:16`, PDF physical p. 497 (printed p. 495): extracted text contains `Page 291 Esther` inside the verse. Inspect the rendered page before treating this as Scripture.
- `Esther 9:22`, PDF physical p. 501 (printed p. 499): extracted text contains `Page 293 Esther` inside the verse. Inspect the rendered page before treating this as Scripture.
- `Job 6:26`, PDF physical p. 506 (printed p. 504): extracted text contains `Page 297 Job` inside the verse. Inspect the rendered page before treating this as Scripture.
- `Job 13:16`, PDF physical p. 510 (printed p. 508): extracted text contains `Page 299 Job` inside the verse. Inspect the rendered page before treating this as Scripture.
- `Micah 7:2`, PDF physical p. 858 (printed p. 856): extracted text contains `Page 539 Micah` inside the verse. Inspect the rendered page before treating this as Scripture.

### Formatting-only differences

- 15,682 verses differ in whitespace, punctuation, or editorial bracket/typography while their ordered case-folded word tokens match. Examples:
  - `Genesis 1:2`, PDF p. 3: source `And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.`; PDF `And the earth was without form, and void; and darkness [was] upon the face of the deep. And the Spirit of God moved upon the face of the waters.`.
  - `Genesis 1:4`, PDF p. 3: source `And God saw the light, that it was good: and God divided the light from the darkness.`; PDF `And God saw the light, that [it was] good: and God divided the light from the darkness.`.
  - `Genesis 1:7`, PDF p. 3: source `And God made the firmament, and divided the waters which were under the firmament from the waters which were above the firmament: and it was so.`; PDF `And God made the firmament, and divided the waters which [were] under the firmament from the waters which [were] above the firmament: and it was so.`.
  - `Genesis 1:9`, PDF p. 3: source `And God said, Let the waters under the heaven be gathered together unto one place, and let the dry land appear: and it was so.`; PDF `And God said, Let the waters under the heaven be gathered together unto one place, and let the dry [land] appear: and it was so.`.
  - `Genesis 1:10`, PDF p. 3: source `And God called the dry land Earth; and the gathering together of the waters called he Seas: and God saw that it was good.`; PDF `And God called the dry [land] Earth; and the gathering together of the waters called he Seas: and God saw that [it was] good.`.
  - `Genesis 1:11`, PDF p. 3: source `And God said, Let the earth bring forth grass, the herb yielding seed, and the fruit tree yielding fruit after his kind, whose seed is in itself, upon the earth: and it was so.`; PDF `And God said, Let the earth bring forth grass, the herb yielding seed, [and] the fruit tree yielding fruit after his kind, whose seed [is] in itself, upon the earth: and it was so.`.
  - `Genesis 1:12`, PDF p. 3: source `And the earth brought forth grass, and herb yielding seed after his kind, and the tree yielding fruit, whose seed was in itself, after his kind: and God saw that it was good.`; PDF `And the earth brought forth grass, [and] herb yielding seed after his kind, and the tree yielding fruit, whose seed [was] in itself, after his kind: and God saw that [it was] good.`.
  - `Genesis 1:16`, PDF p. 3: source `And God made two great lights; the greater light to rule the day, and the lesser light to rule the night: he made the stars also.`; PDF `And God made two great lights; the greater light to rule the day, and the lesser light to rule the night: [he made] the stars also.`.
  - `Genesis 1:18`, PDF p. 3: source `And to rule over the day and over the night, and to divide the light from the darkness: and God saw that it was good.`; PDF `And to rule over the day and over the night, and to divide the light from the darkness: and God saw that [it was] good.`.
  - `Genesis 1:20`, PDF p. 3: source `And God said, Let the waters bring forth abundantly the moving creature that hath life, and fowl that may fly above the earth in the open firmament of heaven.`; PDF `And God said, Let the waters bring forth abundantly the moving creature that hath life, and fowl [that] may fly above the earth in the open firmament of heaven.`.
  - `Genesis 1:21`, PDF p. 3: source `And God created great whales, and every living creature that moveth, which the waters brought forth abundantly, after their kind, and every winged fowl after his kind: and God saw that it was good.`; PDF `And God created great whales, and every living creature that moveth, which the waters brought forth abundantly, after their kind, and every winged fowl after his kind: and God saw that [it was] good.`.
  - `Genesis 1:25`, PDF p. 3: source `And God made the beast of the earth after his kind, and cattle after their kind, and every thing that creepeth upon the earth after his kind: and God saw that it was good.`; PDF `And God made the beast of the earth after his kind, and cattle after their kind, and every thing that creepeth upon the earth after his kind: and God saw that [it was] good.`.

## Name connections

- Name source notes/vertices: **2,408**; source co-occurrence edges: **12,058**; name-bearing verses compared in both texts: **31,098**.
- Verses whose detected name set changes between source and PDF: **406**; name-pair shared-verse counts differing from PDF recomputation: **584**.
- Each edge means only that two matching spellings occur in the same verse. It does not assert personal identity, kinship, contact, or agreement of ideas. Identical spellings are merged into a single node; ambiguous identities are a structural limitation across the network, not individually resolved.
- Every pair was deterministically recomputed from extracted PDF verses using the same matcher. A failed pair is a citation/count issue; a matched pair is not a claim that its relationship is biblically established.

### Name-detection differences (first 30)

- `Genesis 10:7`, PDF p. 10: source-only `none`; PDF-only `Sabtechah`.
- `Genesis 12:8`, PDF p. 12: source-only `Beth-el`; PDF-only `none`.
- `Genesis 13:3`, PDF p. 13: source-only `Beth-el`; PDF-only `none`.
- `Genesis 14:7`, PDF p. 13: source-only `Hazezon-tamar`; PDF-only `none`.
- `Genesis 19:38`, PDF p. 19: source-only `Ben-ammi`; PDF-only `none`.
- `Genesis 22:14`, PDF p. 21: source-only `Jehovah-jireh`; PDF-only `none`.
- `Genesis 25:11`, PDF p. 25: source-only `none`; PDF-only `Lahairoi`.
- `Genesis 26:18`, PDF p. 26: source-only `Philistines`; PDF-only `none`.
- `Genesis 28:5`, PDF p. 28: source-only `Padan-aram`; PDF-only `none`.
- `Genesis 28:19`, PDF p. 29: source-only `Beth-el`; PDF-only `none`.
- `Genesis 31:13`, PDF p. 32: source-only `Beth-el`; PDF-only `none`.
- `Genesis 33:20`, PDF p. 35: source-only `El-elohe-Israel`; PDF-only `none`.
- `Genesis 35:1`, PDF p. 36: source-only `Beth-el`; PDF-only `none`.
- `Genesis 35:3`, PDF p. 36: source-only `Beth-el`; PDF-only `none`.
- `Genesis 35:6`, PDF p. 36: source-only `Beth-el`; PDF-only `none`.
- `Genesis 35:7`, PDF p. 36: source-only `El-beth-el`; PDF-only `none`.
- `Genesis 35:8`, PDF p. 36: source-only `Beth-el`; PDF-only `none`.
- `Genesis 35:15`, PDF p. 37: source-only `Beth-el`; PDF-only `none`.
- `Genesis 35:16`, PDF p. 37: source-only `Beth-el`; PDF-only `none`.
- `Genesis 35:19`, PDF p. 37: source-only `Beth-lehem`; PDF-only `none`.
- `Genesis 41:45`, PDF p. 44: source-only `Zaphnath-paaneah`; PDF-only `none`.
- `Genesis 46:12`, PDF p. 49: source-only `Zerah`; PDF-only `Zarah`.
- `Genesis 48:7`, PDF p. 51: source-only `Beth-lehem`; PDF-only `none`.
- `Exodus 3:6`, PDF p. 56: source-only `none`; PDF-only `Exodus`.
- `Exodus 14:9`, PDF p. 68: source-only `Pi-hahiroth`; PDF-only `none`.
- `Exodus 17:15`, PDF p. 72: source-only `Jehovah-nissi`; PDF-only `none`.
- `Numbers 11:34`, PDF p. 146: source-only `Kibroth-hattaavah`; PDF-only `none`.
- `Numbers 11:35`, PDF p. 146: source-only `Kibroth-hattaavah`; PDF-only `none`.
- `Numbers 21:11`, PDF p. 157: source-only `Ije-abarim`; PDF-only `none`.
- `Numbers 22:39`, PDF p. 159: source-only `Kirjath-huzoth`; PDF-only `none`.
- Plus 376 additional verses; see counts above.

### Name-pair count differences (first 30)

- `Aaron ↔ Asaph`: source 0, PDF 1; no source evidence verse.
- `Aaron ↔ Judaea`: source 0, PDF 1; no source evidence verse.
- `Abednego ↔ Meshach`: source 0, PDF 3; no source evidence verse.
- `Abednego ↔ Nebuchadnezzar`: source 0, PDF 1; no source evidence verse.
- `Abednego ↔ Shadrach`: source 0, PDF 3; no source evidence verse.
- `Abel-beth-maachah ↔ Assyria`: source 1, PDF 0; example PDF evidence `2 Kings 15:29` p. 384.
- `Abel-beth-maachah ↔ Galilee`: source 1, PDF 0; example PDF evidence `2 Kings 15:29` p. 384.
- `Abel-beth-maachah ↔ Gilead`: source 1, PDF 0; example PDF evidence `2 Kings 15:29` p. 384.
- `Abel-beth-maachah ↔ Hazor`: source 1, PDF 0; example PDF evidence `2 Kings 15:29` p. 384.
- `Abel-beth-maachah ↔ Ijon`: source 2, PDF 1; example PDF evidence `1 Kings 15:20` p. 353.
- `Abel-beth-maachah ↔ Israel`: source 2, PDF 1; example PDF evidence `1 Kings 15:20` p. 353.
- `Abel-beth-maachah ↔ Janoah`: source 1, PDF 0; example PDF evidence `2 Kings 15:29` p. 384.
- `Abel-beth-maachah ↔ Naphtali`: source 2, PDF 1; example PDF evidence `1 Kings 15:20` p. 353.
- `Abel-beth-maachah ↔ Pekah`: source 1, PDF 0; example PDF evidence `2 Kings 15:29` p. 384.
- `Abel-beth-maachah ↔ Tiglath-pileser`: source 1, PDF 0; example PDF evidence `2 Kings 15:29` p. 384.
- `Abel-maim ↔ Asa`: source 1, PDF 0; example PDF evidence `2 Chronicles 16:4` p. 443.
- `Abel-maim ↔ Dan`: source 1, PDF 0; example PDF evidence `2 Chronicles 16:4` p. 443.
- `Abel-maim ↔ Ijon`: source 1, PDF 0; example PDF evidence `2 Chronicles 16:4` p. 443.
- `Abel-maim ↔ Israel`: source 1, PDF 0; example PDF evidence `2 Chronicles 16:4` p. 443.
- `Abel-maim ↔ Naphtali`: source 1, PDF 0; example PDF evidence `2 Chronicles 16:4` p. 443.
- `Abel-meholah ↔ Elisha`: source 1, PDF 0; example PDF evidence `1 Kings 19:16` p. 359.
- `Abel-meholah ↔ Israel`: source 1, PDF 0; example PDF evidence `1 Kings 19:16` p. 359.
- `Abel-meholah ↔ Jehu`: source 1, PDF 0; example PDF evidence `1 Kings 19:16` p. 359.
- `Abel-meholah ↔ Nimshi`: source 1, PDF 0; example PDF evidence `1 Kings 19:16` p. 359.
- `Abel-meholah ↔ Shaphat`: source 1, PDF 0; example PDF evidence `1 Kings 19:16` p. 359.
- `Abel-meholah ↔ Tabbath`: source 1, PDF 0; example PDF evidence `Judges 7:22` p. 246.
- `Abijah ↔ Beth-el`: source 1, PDF 0; example PDF evidence `2 Chronicles 13:19` p. 441.
- `Abilene ↔ Judaea`: source 0, PDF 1; no source evidence verse.
- `Abimelech ↔ David`: source 0, PDF 1; no source evidence verse.
- `Abinadab ↔ Esh-baal`: source 2, PDF 0; example PDF evidence `1 Chronicles 8:33` p. 407.
- Plus 554 additional pairs; not individually printed.

## Cross-references

- Source records audited: **344,799**; distinct target/range strings: **62,200**; negative-vote records included: **1,229**.
- Expanded target verse references checked: **614,280**; source verses absent from the PDF: **23**; missing range/singleton endpoints: **29**; missing verses within expanded ranges: **29**; malformed or reversed ranges: **0**.
- Contextual relevance classifications (supported / unsupported / ambiguous / contradictory): **0 / 0 / 0 / 0**. All **344,799** entries remain semantically unreviewed by this automated comparison; vote counts are community data, not KJV proof. Contradiction cannot be inferred merely because two passages differ or contrast.

### Missing cross-reference endpoints

- Source `Numbers 6:24` (PDF p. 139), target `Phil.4.23`, votes 19; details `[['Phil.4.23'], 139]`.
- Source `Jeremiah 28:6` (PDF p. 725), target `Rev.22.20-Rev.22.21`, votes 2; details `[['Rev.22.21'], 725]`.
- Source `Malachi 4:6` (PDF p. 881), target `Rev.22.20-Rev.22.21`, votes 8; details `[['Rev.22.21'], 881]`.
- Source `Matthew 28:20` (PDF p. 917), target `Rev.22.20-Rev.22.21`, votes 18; details `[['Rev.22.21'], 917]`.
- Source `Luke 24:53` (PDF p. 979), target `Rev.22.21`, votes 1; details `[['Rev.22.21'], 979]`.
- Source `John 16:13` (PDF p. 1001), target `Rev.22.1-Rev.22.21`, votes 13; details `[['Rev.22.21'], 1001]`.
- Source `Acts 11:30` (PDF p. 1022), target `2John.1.1-3John.1.15`, votes 2; details `[['3John.1.15'], 1022]`.
- Source `Romans 1:7` (PDF p. 1045), target `1Thess.5.28-2Thess.1.2`, votes 3; details `[['1Thess.5.28'], 1045]`.
- Source `Romans 1:7` (PDF p. 1045), target `Rev.22.21`, votes 4; details `[['Rev.22.21'], 1045]`.
- Source `Romans 1:7` (PDF p. 1045), target `Phil.4.23`, votes 3; details `[['Phil.4.23'], 1045]`.
- Source `Romans 16:20` (PDF p. 1059), target `Rev.22.21`, votes 9; details `[['Rev.22.21'], 1059]`.
- Source `Romans 16:20` (PDF p. 1059), target `Phil.4.23`, votes 5; details `[['Phil.4.23'], 1059]`.
- Source `Romans 16:20` (PDF p. 1059), target `1Thess.5.28`, votes 7; details `[['1Thess.5.28'], 1059]`.
- Source `2 Corinthians 13:11` (PDF p. 1083), target `Rev.22.21`, votes 3; details `[['Rev.22.21'], 1083]`.
- Source `Galatians 1:6` (PDF p. 1084), target `Rev.22.21`, votes 4; details `[['Rev.22.21'], 1084]`.
- Source `Galatians 6:18` (PDF p. 1088), target `Rev.22.21`, votes 3; details `[['Rev.22.21'], 1088]`.
- Source `Ephesians 2:5` (PDF p. 1089), target `Rev.22.21`, votes 5; details `[['Rev.22.21'], 1089]`.
- Source `Ephesians 6:24` (PDF p. 1093), target `Heb.13.25`, votes 1; details `[['Heb.13.25'], 1093]`.
- Source `Philippians 4:20` (PDF p. 1097), target `Phil.4.23`, votes 2; details `[['Phil.4.23'], 1097]`.
- Source `Colossians 4:18` (PDF p. 1101), target `Heb.13.25`, votes 4; details `[['Heb.13.25'], 1101]`.
- Source `1 Timothy 1:14` (PDF p. 1107), target `Rev.22.21`, votes 2; details `[['Rev.22.21'], 1107]`.
- Source `1 Timothy 6:21` (PDF p. 1110), target `Heb.13.25`, votes 2; details `[['Heb.13.25'], 1110]`.
- Source `2 Timothy 4:4` (PDF p. 1113), target `Heb.13.25`, votes 3; details `[['Heb.13.25'], 1113]`.
- Source `2 Timothy 4:22` (PDF p. 1113), target `Rev.22.21`, votes 3; details `[['Rev.22.21'], 1113]`.
- Source `Titus 3:15` (PDF p. 1115), target `Heb.13.25`, votes 3; details `[['Heb.13.25'], 1115]`.
- Source `Hebrews 13:25` (PDF p. None), target `Rev.22.21`, votes 3; details `[['Rev.22.21'], None]`.
- Source `1 Peter 5:1` (PDF p. 1135), target `2John.1.1-3John.1.15`, votes 8; details `[['3John.1.15'], 1135]`.
- Source `1 John 3:18` (PDF p. 1140), target `2John.1.1-3John.1.15`, votes 11; details `[['3John.1.15'], 1140]`.
- Source `2 John 1:1` (PDF p. 1143), target `2John.1.13-3John.1.15`, votes 7; details `[['3John.1.15'], 1143]`.
### Missing cross-reference source verses

- Source `Philippians 4:23` (PDF p. None), target `Rom.16.23`, votes 0; details `[None]`.
- Source `Philippians 4:23` (PDF p. None), target `Rom.16.20`, votes 5; details `[None]`.
- Source `Philippians 4:23` (PDF p. None), target `2Cor.13.14`, votes 5; details `[None]`.
- Source `1 Thessalonians 5:28` (PDF p. None), target `Rom.1.7`, votes 2; details `[None]`.
- Source `1 Thessalonians 5:28` (PDF p. None), target `Rom.16.23`, votes 2; details `[None]`.
- Source `1 Thessalonians 5:28` (PDF p. None), target `Rom.16.20`, votes 7; details `[None]`.
- Source `1 Thessalonians 5:28` (PDF p. None), target `2Thess.3.18`, votes 4; details `[None]`.
- Source `Hebrews 13:25` (PDF p. None), target `Rom.1.7`, votes 1; details `[None]`.
- Source `Hebrews 13:25` (PDF p. None), target `2Tim.4.22`, votes 3; details `[None]`.
- Source `Hebrews 13:25` (PDF p. None), target `Rom.16.23`, votes 1; details `[None]`.
- Source `Hebrews 13:25` (PDF p. None), target `Titus.3.15`, votes 3; details `[None]`.
- Source `Hebrews 13:25` (PDF p. None), target `Rom.16.20`, votes 3; details `[None]`.
- Source `Hebrews 13:25` (PDF p. None), target `Rev.22.21`, votes 3; details `[None]`.
- Source `Hebrews 13:25` (PDF p. None), target `Eph.6.24`, votes 3; details `[None]`.
- Source `Hebrews 13:25` (PDF p. None), target `Col.4.18`, votes 4; details `[None]`.
- Source `3 John 1:15` (PDF p. None), target `John.10.3`, votes 2; details `[None]`.
- Source `Revelation 22:21` (PDF p. None), target `2Cor.13.14`, votes 7; details `[None]`.
- Source `Revelation 22:21` (PDF p. None), target `Eph.6.23-Eph.6.24`, votes 2; details `[None]`.
- Source `Revelation 22:21` (PDF p. None), target `Rom.1.7`, votes 0; details `[None]`.
- Source `Revelation 22:21` (PDF p. None), target `Rom.16.23`, votes -1; details `[None]`.
- Source `Revelation 22:21` (PDF p. None), target `2Thess.3.18`, votes 10; details `[None]`.
- Source `Revelation 22:21` (PDF p. None), target `Rev.1.4`, votes 2; details `[None]`.
- Source `Revelation 22:21` (PDF p. None), target `Rom.16.20`, votes 8; details `[None]`.
### Missing verses within expanded ranges

- Source `Numbers 6:24` (PDF p. 139), target `Phil.4.23`, votes 19; details `[['Phil.4.23'], 139]`.
- Source `Jeremiah 28:6` (PDF p. 725), target `Rev.22.20-Rev.22.21`, votes 2; details `[['Rev.22.21'], 725]`.
- Source `Malachi 4:6` (PDF p. 881), target `Rev.22.20-Rev.22.21`, votes 8; details `[['Rev.22.21'], 881]`.
- Source `Matthew 28:20` (PDF p. 917), target `Rev.22.20-Rev.22.21`, votes 18; details `[['Rev.22.21'], 917]`.
- Source `Luke 24:53` (PDF p. 979), target `Rev.22.21`, votes 1; details `[['Rev.22.21'], 979]`.
- Source `John 16:13` (PDF p. 1001), target `Rev.22.1-Rev.22.21`, votes 13; details `[['Rev.22.21'], 1001]`.
- Source `Acts 11:30` (PDF p. 1022), target `2John.1.1-3John.1.15`, votes 2; details `[['3John.1.15'], 1022]`.
- Source `Romans 1:7` (PDF p. 1045), target `1Thess.5.28-2Thess.1.2`, votes 3; details `[['1Thess.5.28'], 1045]`.
- Source `Romans 1:7` (PDF p. 1045), target `Rev.22.21`, votes 4; details `[['Rev.22.21'], 1045]`.
- Source `Romans 1:7` (PDF p. 1045), target `Phil.4.23`, votes 3; details `[['Phil.4.23'], 1045]`.
- Source `Romans 16:20` (PDF p. 1059), target `Rev.22.21`, votes 9; details `[['Rev.22.21'], 1059]`.
- Source `Romans 16:20` (PDF p. 1059), target `Phil.4.23`, votes 5; details `[['Phil.4.23'], 1059]`.
- Source `Romans 16:20` (PDF p. 1059), target `1Thess.5.28`, votes 7; details `[['1Thess.5.28'], 1059]`.
- Source `2 Corinthians 13:11` (PDF p. 1083), target `Rev.22.21`, votes 3; details `[['Rev.22.21'], 1083]`.
- Source `Galatians 1:6` (PDF p. 1084), target `Rev.22.21`, votes 4; details `[['Rev.22.21'], 1084]`.
- Source `Galatians 6:18` (PDF p. 1088), target `Rev.22.21`, votes 3; details `[['Rev.22.21'], 1088]`.
- Source `Ephesians 2:5` (PDF p. 1089), target `Rev.22.21`, votes 5; details `[['Rev.22.21'], 1089]`.
- Source `Ephesians 6:24` (PDF p. 1093), target `Heb.13.25`, votes 1; details `[['Heb.13.25'], 1093]`.
- Source `Philippians 4:20` (PDF p. 1097), target `Phil.4.23`, votes 2; details `[['Phil.4.23'], 1097]`.
- Source `Colossians 4:18` (PDF p. 1101), target `Heb.13.25`, votes 4; details `[['Heb.13.25'], 1101]`.
- Source `1 Timothy 1:14` (PDF p. 1107), target `Rev.22.21`, votes 2; details `[['Rev.22.21'], 1107]`.
- Source `1 Timothy 6:21` (PDF p. 1110), target `Heb.13.25`, votes 2; details `[['Heb.13.25'], 1110]`.
- Source `2 Timothy 4:4` (PDF p. 1113), target `Heb.13.25`, votes 3; details `[['Heb.13.25'], 1113]`.
- Source `2 Timothy 4:22` (PDF p. 1113), target `Rev.22.21`, votes 3; details `[['Rev.22.21'], 1113]`.
- Source `Titus 3:15` (PDF p. 1115), target `Heb.13.25`, votes 3; details `[['Heb.13.25'], 1115]`.
- Source `Hebrews 13:25` (PDF p. None), target `Rev.22.21`, votes 3; details `[['Rev.22.21'], None]`.
- Source `1 Peter 5:1` (PDF p. 1135), target `2John.1.1-3John.1.15`, votes 8; details `[['3John.1.15'], 1135]`.
- Source `1 John 3:18` (PDF p. 1140), target `2John.1.1-3John.1.15`, votes 11; details `[['3John.1.15'], 1140]`.
- Source `2 John 1:1` (PDF p. 1143), target `2John.1.13-3John.1.15`, votes 7; details `[['3John.1.15'], 1143]`.
### Malformed ranges

- None.

## Dictionary and unresolved semantic claims

- Name notes carrying Hitchcock dictionary meanings: **2,408**. The PDF is a KJV text, not a Hebrew/Greek etymological source; dictionary glosses were **not independently verified** and must not be presented as facts established by KJV co-occurrence.
- Specific structural ambiguity: same-spelling people/places are merged (for example, the node `John` cannot distinguish all people named John). The names list also normalizes the dictionary entry `Shiloh (name of a city)` to `Shiloh`, so name-type distinctions are lost.
- Astra queue: (1) contextually assess all 344,799 cross-reference records, cite both passages, and classify supported / unsupported / ambiguous / contradictory; (2) review every name node/edge for homonyms or misleading identity implications; (3) verify all 2,408 dictionary glosses against appropriate lexical references; (4) examine every wording difference, missing key, duplicate, or extraction warning listed above against rendered PDF pages.
- Human review required: verify any suspected PDF extraction artifacts visually, especially page-boundary text and wording differences. This report does not claim exhaustive human or theological review.

## Reproduction

`"C:\Users\CrackenReleased\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe" "E:\AI_Hub\Tools\bible-network\audit_bible.py"`
- Audit script: `E:\AI_Hub\Tools\bible-network\audit_bible.py`. Network files, KJV data, PDF, and version were not modified.
