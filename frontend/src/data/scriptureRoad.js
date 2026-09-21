/** Scripture-first teaching road. New feature. Does not replace Counsel. */

export const ROAD_ORDER = [
  "genesis","exodus","leviticus","numbers","deuteronomy",
  "joshua","judges","ruth","1-samuel","2-samuel","1-kings","2-kings",
  "1-chronicles","2-chronicles","ezra","nehemiah","esther",
  "job","psalms","proverbs","ecclesiastes","song-of-songs",
  "isaiah","jeremiah","lamentations","ezekiel","daniel",
  "hosea","joel","amos","obadiah","jonah","micah","nahum","habakkuk","zephaniah","haggai","zechariah","malachi",
  "matthew","mark","luke","john","acts",
  "romans","1-corinthians","2-corinthians","galatians","ephesians","philippians","colossians",
  "1-thessalonians","2-thessalonians","1-timothy","2-timothy","titus","philemon",
  "hebrews","james","1-peter","2-peter","1-john","2-john","3-john","jude","revelation",
];

export const BESIDE = [
  "tobit","judith","wisdom","sirach","baruch","1-maccabees","2-maccabees",
  "1-enoch","jubilees","1-meqabyan","2-meqabyan","3-meqabyan","4-baruch",
];

export const CHEST = [
  { id: "grief", label: "Grief", book: "lamentations" },
  { id: "anger", label: "Anger", book: "jonah" },
  { id: "money", label: "Money", book: "amos" },
  { id: "child", label: "A child", book: "luke" },
  { id: "marriage", label: "Marriage", book: "hosea" },
  { id: "dying", label: "Fear of dying", book: "john" },
  { id: "hurt", label: "A church that hurt me", book: "1-peter" },
  { id: "unbelief", label: "I do not believe", book: "john" },
  { id: "start", label: "I want to start", book: "mark" },
];

function b(partial) {
  return {
    genre: "",
    door: "",
    campfire: "",
    pointAt: "",
    pageAsks: "",
    object: "",
    objectNote: "",
    thread: "",
    carry: "",
    beside: false,
    ...partial,
  };
}

export const BOOKS = {
  genesis: b({
    title: "Genesis", section: "Beginnings",
    door: "God makes a world, a family breaks, and a promise starts walking.",
    campfire: "God speaks a world into being and calls it good. Humans reach for a knowledge that splits them from God. Violence grows. God calls Abram: leave, and I will make you a blessing. Isaac is born. Jacob becomes Israel. Joseph is sold, then saves the family in Egypt. The book ends with a coffin in a foreign land and a promise still unpaid.",
    pointAt: "Walled cities, wells, and famine roads were the real weather of that world.",
    pageAsks: "What would you have to leave so a blessing can start?",
    object: "A city gate",
    objectNote: "A gate like this is not Abraham’s gate. It is the kind of world he walked in.",
    thread: "The promise to bless the nations walks all the way to Jesus.",
    carry: "The fracture is real, and the promise is older than the fracture.",
  }),
  exodus: b({
    title: "Exodus", section: "Beginnings",
    door: "A people cry from brick. God comes down. They meet Him at a mountain.",
    campfire: "A king forgets Joseph. Quotas rise. Moses meets God in a bush that burns and is not eaten. Ten blows fall. Lamb blood marks doors. Water opens. At Sinai they say we will do it, then break it with a calf. God stays. A tent is built so He can live in the middle of a stubborn camp.",
    pointAt: "Egypt painted brick-making and counted quotas. Missing straw was a punishment in their own pictures.",
    pageAsks: "What would you have to put down to walk out?",
    object: "A brick mold",
    objectNote: "This does not name the Pharaoh. It names the work.",
    thread: "Jesus keeps Passover and calls Himself the lamb of a new exit.",
    carry: "Freedom is a road to a mountain, not only a door out of pain.",
  }),
  leviticus: b({
    title: "Leviticus", section: "Beginnings",
    door: "A holy God moves into the camp and teaches a people how to live near Him.",
    campfire: "Offerings, priests, clean and unclean, a day when one man walks behind a veil with blood, a call to be holy because He is. It is how a rescued people stay close.",
    pointAt: "Four-horned stone altars have come out of the ground in that land.",
    pageAsks: "What in an ordinary week would change if God lived in the middle of it?",
    object: "A four-horned altar",
    objectNote: "Not “the” Leviticus altar. The kind of furniture the book assumes.",
    thread: "Hebrews says the veil and the blood were pointing at a better priest.",
    carry: "Holiness is nearness, not a score.",
  }),
  numbers: b({
    title: "Numbers", section: "Beginnings",
    door: "A counted people walk, refuse the land, and a new generation is counted at the door.",
    campfire: "They leave Sinai. They spy the land and freeze. Forty years eat a generation. Balaam is hired to curse and can only bless. The children stand on the edge and are numbered again.",
    pointAt: "A silver blessing from about 600 BC carries the priestly words of Numbers 6.",
    pageAsks: "Where are you refusing a land you asked for?",
    object: "A tiny silver scroll",
    objectNote: "It does not prove Moses engraved those pieces. It proves the blessing is old.",
    thread: "John lifts the bronze snake: look and live.",
    carry: "Unbelief can cost a generation, and God still keeps a count.",
  }),
  deuteronomy: b({
    title: "Deuteronomy", section: "Beginnings",
    door: "An old man on a ridge puts life and death in front of a people about to cross.",
    campfire: "Hear, O Israel. Love the LORD with all you are. Teach these words to children. Moses dies in sight of the land he will not enter.",
    pointAt: "The Shema was worn and written on doorways. Copies of it sat in the desert caves.",
    pageAsks: "What would you write on your door if you meant it?",
    object: "Words on a door",
    thread: "Jesus answers the tester with this book.",
    carry: "Love is a command you walk, not a feeling you wait for.",
  }),
  joshua: b({ title: "Joshua", section: "Land", door: "The promise gets dirt under it.", campfire: "They cross a river. Jericho falls after a march. Land is divided. Joshua says choose this day.", pointAt: "Hill villages and collar-rim jars mark that early Iron Age world.", pageAsks: "Will you choose today?", object: "A storage jar", thread: "The name Joshua is Jesus’ name in Hebrew.", carry: "Gift-land still asks for a choice." }),
  judges: b({ title: "Judges", section: "Land", door: "No king. Everyone does what is right in their own eyes.", campfire: "They forget, they are crushed, they cry, a judge rises, they forget again. The last chapters are a cliff.", pointAt: "Small clustered houses and grindstones — village life under raid.", pageAsks: "What cycle are you repeating?", object: "A grindstone", thread: "The book is hungry for a true king.", carry: "Rescue without a changed heart is only a pause." }),
  ruth: b({ title: "Ruth", section: "Land", door: "In the days of the judges, kindness walks home from Moab.", campfire: "Famine. A grave. Ruth will not let go. She gleans. A sandal in the gate. A child in David’s line.", pointAt: "Barley, threshing floors, and a village gate were how land and family were settled.", pageAsks: "Whom will you refuse to leave?", object: "A grinding stone", thread: "Matthew keeps Ruth in Jesus’ list on purpose.", carry: "Loyal love can change a family name." }),
  "1-samuel": b({ title: "1 Samuel", section: "Kings", door: "A boy hears a name in the night. A tall king is chosen. A shepherd is anointed.", campfire: "Hannah prays. Israel wants a king like the nations. Saul is afraid. David is hunted.", pointAt: "Shiloh was a real shrine-town. Its storage jars are in the dirt.", pageAsks: "Do you want a king, or do you want God?", object: "A shrine jar", thread: "A shepherd-king after God’s heart is a shape Jesus will fill.", carry: "Wanting a king is not the same as wanting God." }),
  "2-samuel": b({ title: "2 Samuel", section: "Kings", door: "The shepherd gets the city, then a roof, then a cry on a stair.", campfire: "David reigns. Bathsheba. Nathan’s story. Absalom. O my son.", pointAt: "A stone from Tel Dan names the House of David.", pageAsks: "What have you taken that was not yours?", object: "A royal inscription", objectNote: "It names a house. It does not wash the roof clean.", thread: "An forever house over David’s line is the road to a son of David.", carry: "Getting the throne is not the same as keeping a heart." }),
  "1-kings": b({ title: "1 Kings", section: "Kings", door: "Wisdom asks for a listening heart, then luxury splits the kingdom.", campfire: "Solomon prays. A temple. Then gold and other gods. Elijah on Carmel.", pointAt: "Ivory from Samaria matches the luxury the prophets hated.", pageAsks: "What is eating your listening heart?", object: "An ivory plaque", thread: "Something greater than Solomon is here.", carry: "A listening heart can still drown in gold." }),
  "2-kings": b({ title: "2 Kings", section: "Kings", door: "Prophets and bad kings until the north is taken and the south is burned.", campfire: "Elisha. Hezekiah’s tunnel. Josiah finds a book. Then 722 and 586.", pointAt: "Letters from Lachish and a relief of the siege are in museums.", pageAsks: "Will you open the book before the fire?", object: "A potsherd letter", thread: "David’s line goes to Babylon alive. Matthew starts there.", carry: "Finding the book late is still mercy." }),
  "1-chronicles": b({ title: "1 Chronicles", section: "After the fire", door: "After the fire, someone counts the families and retells David as a worshiper.", campfire: "Lists. Singers. Gatekeepers. Less Bathsheba, more the house of God.", pointAt: "Small province seals from Yehud.", pageAsks: "What memory would rebuild you?", object: "A stamped handle", thread: "The son of David theme turns toward worship.", carry: "Memory can rebuild a people." }),
  "2-chronicles": b({ title: "2 Chronicles", section: "After the fire", door: "The temple’s life, and a fall that still ends with go home.", campfire: "Solomon’s house. Reforms. Fire. Cyrus.", pointAt: "A tunnel inscription in Jerusalem’s rock.", pageAsks: "Will you go home?", object: "Words in a tunnel", thread: "The last word is return.", carry: "Even an emperor can be used to send you home." }),
  ezra: b({ title: "Ezra", section: "After the fire", door: "Paper from a far king, a small altar, tears when the old men see the new house.", campfire: "Return. Enemies. A book read. A hard call about the family.", pointAt: "Persian policy sent people home. Yehud was a small province.", pageAsks: "Can you rebuild smaller than memory and still call it holy?", object: "A provincial seal", thread: "A people of the Book is being born.", carry: "Rebuilding is smaller than memory, and still holy." }),
  nehemiah: b({ title: "Nehemiah", section: "After the fire", door: "A cupbearer asks for stones. A wall goes up with a trumpet in one hand.", campfire: "Night ride. Mockers. The book is read. Then the old sins sneak back.", pointAt: "Jews in that empire wrote petitions on papyrus we can still read.", pageAsks: "Is the wall the end of the work?", object: "A letter on papyrus", thread: "Jesus will weep over this city later.", carry: "A finished wall is not a finished people." }),
  esther: b({ title: "Esther", section: "After the fire", door: "God’s name is never printed. A people is almost erased.", campfire: "A queen. A gallows. A forgotten book read at night. Purim.", pointAt: "Susa was a real palace. No tablet names Esther.", pageAsks: "What will you risk for a people?", object: "A palace stair", thread: "The line Jesus is born from stays in the world.", carry: "Silence on the page is not absence in the story." }),
  job: b({ title: "Job", section: "Wisdom", door: "A good man loses everything and will not accept cheap answers.", campfire: "Friends talk too long. God answers from a whirlwind. Job covers his mouth.", pointAt: "The book points at a world too big to put on trial.", pageAsks: "Will you let God be God when the theory fails?", object: "Dust and a storm", thread: "A righteous sufferer. Jesus is the sufferer who can ask why and still trust.", carry: "Presence is a better answer than a theory." }),
  psalms: b({ title: "Psalms", section: "Wisdom", door: "Prayers for every weather of a life.", campfire: "Praise, rage, how long, thank you. Ends with everything that has breath.", pointAt: "A great Psalms scroll was in the desert caves, including a 151st psalm.", pageAsks: "Will you say the true thing to God?", object: "An open psalm scroll", thread: "Jesus prays these.", carry: "You are allowed to tell God the truth." }),
  proverbs: b({ title: "Proverbs", section: "Wisdom", door: "Wisdom stands in the gate and calls fools home.", campfire: "Work, words, sex, money, friends. Fear of the LORD is the first skill.", pointAt: "Gates were where a town decided things.", pageAsks: "Which path are you actually walking?", object: "A gate at morning", thread: "Christ is called the wisdom of God.", carry: "Fear of the LORD is the first skill." }),
  ecclesiastes: b({ title: "Ecclesiastes", section: "Wisdom", door: "A wise man turns the sun over in his hand and finds it heavy.", campfire: "Vapor. Work. Death. Fear God. Enjoy the portion.", pointAt: "A copy of this book sat at Qumran.", pageAsks: "Can you receive the day as a gift?", object: "The same sun again", thread: "The ache is not cancelled. A risen life is put under it.", carry: "The gift of the day is still a gift." }),
  "song-of-songs": b({ title: "Song of Songs", section: "Wisdom", door: "Desire that is not ashamed, and a love that seeks.", campfire: "Two lovers. Vineyard. My beloved is mine.", pointAt: "This is love poetry the people of God kept.", pageAsks: "Will you honor a love that has a body and a vow?", object: "A locked garden", thread: "The church is later called a bride.", carry: "Holy love has a body and a vow." }),
  isaiah: b({ title: "Isaiah", section: "Prophets", door: "A man sees the Holy and is undone. Later he says comfort.", campfire: "Smoke in the house. Wounds. Then comfort my people. A servant who suffers.", pointAt: "The Great Isaiah Scroll is more than two thousand years old. Assyria left its own boast in stone.", pageAsks: "Here I am — will you go?", object: "A long Isaiah scroll", thread: "Jesus reads Isaiah in Nazareth. The servant songs map Him.", carry: "Comfort is spoken to people who have already been ruined." }),
  jeremiah: b({ title: "Jeremiah", section: "Prophets", door: "A young man has to say the city will fall.", campfire: "Temple sermon. Burned scroll. Cistern. Bought field. Plant gardens in exile.", pointAt: "Letters from the last days of Judah name the fear of fire-signals going out.", pageAsks: "Will you tell the truth when it sounds like betrayal?", object: "A potsherd letter", thread: "The new covenant sits at Jesus’ table.", carry: "Telling the truth can feel like betrayal and still be love." }),
  lamentations: b({ title: "Lamentations", section: "Prophets", door: "A city is opened like a sack, and someone still says His mercies are new.", campfire: "Five poems. Ash. Great is thy faithfulness is born here, not on a mug.", pointAt: "Jerusalem has a burn layer from 586.", pageAsks: "Will you tell God the city burned?", object: "Ash on stone", thread: "Jesus weeps over this city.", carry: "You can tell God the city burned and still wait for morning." }),
  ezekiel: b({ title: "Ezekiel", section: "Prophets", door: "A priest with no temple sees glory on a canal.", campfire: "Wheels. The glory leaves. Dry bones. A river from a threshold.", pointAt: "Judean families in Babylon signed contracts we can still read.", pageAsks: "Can God find you by a canal?", object: "A clay contract", thread: "John steals this throne-room language.", carry: "God can leave a building and still find a people." }),
  daniel: b({ title: "Daniel", section: "Prophets", door: "Judean boys in a palace learn that kingdoms have numbers.", campfire: "Furnace. Lions. Beasts. A human figure given a kingdom.", pointAt: "Ration tablets name King Jehoiachin in Babylon. Early copies of Daniel sat at Qumran.", pageAsks: "Will you bow?", object: "A ration tablet", thread: "Son of Man is Jesus’ favorite name for Himself.", carry: "The palace is not the last kingdom." }),
  hosea: b({ title: "Hosea", section: "The Twelve", door: "A marriage becomes a sermon: God will not quit.", campfire: "Hard names. Then I will heal their turning away.", pointAt: "Samaria’s wine-jars and tax notes.", pageAsks: "Will you let love come back?", object: "A tax ostracon", thread: "Out of Egypt I called my son.", carry: "Love that will not let go is not weakness." }),
  joel: b({ title: "Joel", section: "The Twelve", door: "Locusts first. Spirit later.", campfire: "The land is eaten. Afterward I will pour out my Spirit on all flesh.", pointAt: "Grain and empty silos.", pageAsks: "Will you rend your heart?", object: "A silo", thread: "Peter opens this book at Pentecost.", carry: "The worst field is not the last word." }),
  amos: b({ title: "Amos", section: "The Twelve", door: "A herdsman walks into luxury and says the poor have a witness.", campfire: "Ivory houses. A plumb line. Summer fruit.", pointAt: "Ivory from Samaria.", pageAsks: "Who is at the edge of your table?", object: "Ivory inlay", thread: "James quotes Amos when the church opens to the nations.", carry: "Worship that ignores the poor is noise." }),
  obadiah: b({ title: "Obadiah", section: "The Twelve", door: "A short shout at a brother who watched the city burn.", campfire: "Edom stood aside. The kingdom will be the LORD’s.", pointAt: "Edom’s high places look toward Judah.", pageAsks: "Did you gloat?", object: "A ridge", thread: "Brother-hate is not small in this family.", carry: "Gloating over a fall is remembered." }),
  jonah: b({ title: "Jonah", section: "The Twelve", door: "A prophet runs west from a God who loves the enemy city.", campfire: "Storm. Fish. Nineveh sits in dust. Jonah pouts under a plant.", pointAt: "Nineveh’s walls and reliefs are in the dirt. The fish is not.", pageAsks: "Can you stand it if God is kind to them?", object: "A palace relief", objectNote: "The relief proves the city. It does not prove the fish.", thread: "Jesus names Jonah as the sign — three days, then preach.", carry: "Can I stand it if God is kind to them?" }),
  micah: b({ title: "Micah", section: "The Twelve", door: "From a small town: do justice, love mercy, walk humbly. A ruler from Bethlehem.", campfire: "Heads who eat the poor. A promised ruler from a little clan.", pointAt: "Burned houses in the Shephelah.", pageAsks: "What does the LORD require of you?", object: "A burned doorway", thread: "Wise men get Bethlehem from this book.", carry: "What the LORD requires is not hidden." }),
  nahum: b({ title: "Nahum", section: "The Twelve", door: "The city Jonah pitied falls.", campfire: "Nineveh’s end. Slow to anger is not never angry.", pointAt: "A chronicle records the fall of Nineveh.", pageAsks: "Can comfort for the crushed sound like a dirge to a palace?", object: "A chronicle tablet", thread: "Empires are numbered.", carry: "Comfort for the crushed can sound like judgment to the palace." }),
  habakkuk: b({ title: "Habakkuk", section: "The Twelve", door: "A prophet asks how long, and learns to wait on a tower.", campfire: "The just shall live by faith. Yet I will rejoice.", pointAt: "A commentary on this book sat at Qumran.", pageAsks: "Will you rejoice before the field is green?", object: "A commentary column", thread: "Paul builds Romans and Galatians on that line.", carry: "Rejoicing can be a decision in the dark." }),
  zephaniah: b({ title: "Zephaniah", section: "The Twelve", door: "The Day is near. After the sweeping there is singing.", campfire: "He will quiet you with His love.", pointAt: "Silver blessings from the same century-world.", pageAsks: "Will you hide in complacency?", object: "A silver amulet", thread: "The remnant feeds the Gospels’ poor-in-spirit.", carry: "The Day is not only fire. It is also a song." }),
  haggai: b({ title: "Haggai", section: "The Twelve", door: "You live in paneled houses and the LORD’s house is a ruin.", campfire: "Work restarts. The latter house will have greater glory.", pointAt: "Yehud seals from a small rebuilt province.", pageAsks: "What work did you postpone?", object: "A seal", thread: "Jesus walks in a modest second temple.", carry: "Start the work you postponed." }),
  zechariah: b({ title: "Zechariah", section: "The Twelve", door: "Night visions and a humble king on a donkey.", campfire: "Lampstand. Thirty pieces. A fountain.", pointAt: "Early second-temple stone.", pageAsks: "Will you receive a small king?", object: "Temple stone", thread: "Palm Sunday rides this donkey on purpose.", carry: "The king you wanted may arrive small." }),
  malachi: b({ title: "Malachi", section: "The Twelve", door: "A tired province asks where is the God of justice. A messenger is coming.", campfire: "Polluted offerings. A scroll of remembrance. Elijah before the Day.", pointAt: "Small provincial coins.", pageAsks: "Are you giving leftovers?", object: "A tiny coin", thread: "Gospels open with a messenger in Elijah’s coat.", carry: "Weariness is not an excuse to give God leftovers." }),
  matthew: b({ title: "Matthew", section: "Gospels", door: "A Gospel that keeps saying this was to fulfill, and ends with go to the nations.", campfire: "A genealogy with unexpected women. A mountain sermon. An empty tomb. Make disciples.", pointAt: "A first-century synagogue stone from Magdala.", pageAsks: "Will you go?", object: "A synagogue stone", thread: "This whole book is the thread. God with us.", carry: "The mountain at the end is still open." }),
  mark: b({
    title: "Mark", section: "Gospels",
    door: "A working village meets a man who will not slow down.",
    campfire: "John in the wilderness. Jesus calls fishermen. He heals and is opposed. Three times He says He will be killed and rise. His friends do not get it. In Jerusalem He is arrested, denied, crucified. A Roman officer says this man was the Son of God. Women find the tomb open. In the oldest ending they run, trembling. The next step is in your hands.",
    pointAt: "Lead net-weights and a first-century boat came out of Galilee’s mud. Fishing was a trade.",
    pageAsks: "What would you drop if He said your name at the boat?",
    object: "A net-weight",
    objectNote: "This weight is not Andrew’s. It is the kind of tool “follow me” cost.",
    thread: "Do not use power the way the tax booth uses it. The Son of God is on a cross.",
    carry: "Follow me costs supper.",
    ink: "The oldest big copies stop at the empty tomb and the women running. Most Bibles also print twelve more verses the church has loved. The risen Jesus is already announced before that seam.",
  }),
  luke: b({ title: "Luke", section: "Gospels", door: "An orderly account full of songs, meals, and people on the edges.", campfire: "A trough. A prodigal. A road to Emmaus. He is known in the bread.", pointAt: "Synagogue floors and mikveh steps from that world.", pageAsks: "Will you sit at the table with the wrong people?", object: "Steps into water", thread: "He eats with the wrong people and opens Scripture on the road.", carry: "He is known in the breaking of bread." }),
  john: b({ title: "John", section: "Gospels", door: "In the beginning was the Word, and the Word became flesh.", campfire: "Signs. I AM. A well at noon. A tomb. A charcoal fire on a shore.", pointAt: "A stamp-sized scrap of John from the early second century. A stone names Pilate.", pageAsks: "Will you believe and have life?", object: "A tiny papyrus", thread: "This book exists so you may believe Jesus is the Christ.", carry: "Life is a Person, not a theory." }),
  acts: b({ title: "Acts", section: "The churches", door: "The risen Jesus leaves. The Spirit arrives. The message walks to Rome.", campfire: "Wind. Stephen. Saul knocked down. Gentiles receive the Spirit. Unhindered.", pointAt: "An inscription dates Gallio in Corinth — a pin in Paul’s calendar.", pageAsks: "Will you walk?", object: "A civic inscription", thread: "Jesus keeps acting.", carry: "The gospel is a person walking, not a poster staying." }),
  romans: b({ title: "Romans", section: "Letters", door: "How God makes enemies into a family without erasing Israel.", campfire: "All have sinned. God justifies the ungodly by faith. Spirit and adoption. A living sacrifice.", pointAt: "A mixed neighborhood in Rome’s brick apartments is the first audience’s weather.", pageAsks: "Will you stop boasting and receive mercy?", object: "A brick stamp", thread: "The cross here is not a mood. God puts the ungodly right.", carry: "There is no boasting left. There is a mercy left." }),
  "1-corinthians": b({ title: "1 Corinthians", section: "Letters", door: "A gifted messy church is told that love is a way and a raised body is the hope.", campfire: "Divisions. The table. Gifts. Love. Resurrection.", pointAt: "Shops sat against temple precincts. Meat had a story.", pageAsks: "Is your gift serving anyone?", object: "A market stall", thread: "Christ crucified, then raised.", carry: "Gifts without love are noise." }),
  "2-corinthians": b({ title: "2 Corinthians", section: "Letters", door: "A wounded apostle defends a ministry that looks like dying.", campfire: "Treasure in clay jars. A thorn. Boasting in weakness.", pointAt: "The road in and out of Corinth was ordinary and tired.", pageAsks: "Can weakness be a place God stays?", object: "A cracked jar", thread: "Cross-shaped power.", carry: "Weakness can be a place God stays." }),
  galatians: b({ title: "Galatians", section: "Letters", door: "If you add a badge to Jesus, you have another gospel.", campfire: "Abraham. Faith. Fruit of the Spirit. No east or west in this family.", pointAt: "Roman towns with imperial writing.", pageAsks: "What badge are you adding?", object: "An inscription", thread: "Christ lives in me.", carry: "Freedom is not a new law with a Jesus sticker." }),
  ephesians: b({ title: "Ephesians", section: "Letters", door: "One new humanity. A wall down.", campfire: "Saved by grace. Jew and Gentile one. Stand.", pointAt: "Ephesus had a vast precinct. The letter talks over that noise.", pageAsks: "Is the wall still up in you?", object: "Precinct stone", thread: "Grace is how you got in.", carry: "Grace is not a feeling. It is how you got in." }),
  philippians: b({ title: "Philippians", section: "Letters", door: "Joy from a jail, and a Lord who went down.", campfire: "He emptied Himself. Press on. A peace that guards.", pointAt: "A Roman colony on a main road.", pageAsks: "Will you go down?", object: "Road paving", thread: "The name above every name.", carry: "Citizenship is in heaven." }),
  colossians: b({ title: "Colossians", section: "Letters", door: "Christ is not one option on a spiritual menu.", campfire: "He is the image. Through Him all things. Do not be captured by shadows.", pointAt: "Towns in a river valley full of other lords.", pageAsks: "Who is actually first?", object: "Valley towns", thread: "You are complete in Him.", carry: "You are complete in Him, not in extra stairs." }),
  "1-thessalonians": b({ title: "1 Thessalonians", section: "Letters", door: "A young church waiting, working, and grieving with hope.", campfire: "The dead in Christ. Encourage one another.", pointAt: "A civic stone from that city’s officers.", pageAsks: "Can you grieve with hope?", object: "A civic stone", thread: "The coming is a comfort, not a chart.", carry: "Grief is allowed. Despair is not required." }),
  "2-thessalonians": b({ title: "2 Thessalonians", section: "Letters", door: "Do not panic. The Day has not slipped past you.", campfire: "Stand. Keep working.", pointAt: "Same town, rumor weather.", pageAsks: "Will you keep your work in a rumor?", object: "The same stone", thread: "Stand.", carry: "Do not quit your job for a rumor." }),
  "1-timothy": b({ title: "1 Timothy", section: "Letters", door: "How a household of God should behave.", campfire: "False teachers. Prayer. Elders. Guard the deposit.", pointAt: "Churches in houses.", pageAsks: "What are you guarding?", object: "A household doorway", thread: "Christ Jesus came to save sinners.", carry: "Guard the good deposit." }),
  "2-timothy": b({ title: "2 Timothy", section: "Letters", door: "Last letter weather. Come before winter.", campfire: "All Scripture is God-breathed. I have finished.", pointAt: "A cloak and scrolls in a rented room.", pageAsks: "Will you fan the gift?", object: "A lamp", thread: "The work can outlive the worker.", carry: "The work can outlive the worker." }),
  titus: b({ title: "Titus", section: "Letters", door: "Put what remains in order on a hard island.", campfire: "Elders. Grace that trains.", pointAt: "Crete’s harbor towns.", pageAsks: "Will grace train you, or will you shrug?", object: "A harbor", thread: "Grace trains.", carry: "Grace teaches; it does not shrug." }),
  philemon: b({ title: "Philemon", section: "Letters", door: "A runaway’s name is now useful. A master is asked to receive a brother.", campfire: "Paul could command. He asks. Charge it to me.", pointAt: "People were bought on tablets.", pageAsks: "What does calling someone brother cost you?", object: "A sale tablet", thread: "The gospel gets into property law.", carry: "Calling someone brother has a cost." }),
  hebrews: b({ title: "Hebrews", section: "Letters", door: "Jesus is better than the steps that led to Him, so do not drift.", campfire: "Better priest. A veil opened. A race. A cloud of witnesses.", pointAt: "Stone cups and mikvehs from that purity world.", pageAsks: "Will you draw near?", object: "A stone cup", thread: "The priest who is also the offering.", carry: "Draw near." }),
  james: b({ title: "James", section: "Letters", door: "Faith that does not work is dead on the floor.", campfire: "Tongue. Widows. Rich and poor. Be doers.", pointAt: "Grindstones and loom weights in the same room as a gold ring.", pageAsks: "What would doing the word look like by sunset?", object: "A grindstone", thread: "A brother of Jesus who sounds like the mountain sermon.", carry: "Be doers." }),
  "1-peter": b({ title: "1 Peter", section: "Letters", door: "Exiles, live holy while the empire watches.", campfire: "A living hope. Suffer as a Christian.", pointAt: "A modest threshold under Rome.", pageAsks: "Where will you stay holy when watched?", object: "A doorway", thread: "Christ suffered, leaving you an example.", carry: "Hope has a body that was raised." }),
  "2-peter": b({ title: "2 Peter", section: "Letters", door: "Remember. Do not let mockers steal the promise.", campfire: "A delayed fire that is still coming.", pointAt: "An early papyrus of this letter exists.", pageAsks: "Will you call delay forgetfulness?", object: "A papyrus page", thread: "Patience is not forgetfulness.", carry: "Patience is not forgetfulness." }),
  "1-john": b({ title: "1 John", section: "Letters", door: "God is light and love. Testers of the spirits are in the house.", campfire: "What we have touched. Love one another.", pointAt: "Early Johannine pages.", pageAsks: "Do you love the brother in the room?", object: "Light through a door", thread: "Love is how you know you have passed out of death.", carry: "Love is how you know." }),
  "2-john": b({ title: "2 John", section: "Letters", door: "A short warning at a doorway.", campfire: "Do not take a false teacher in.", pointAt: "Hospitality was a latch, not a slogan.", pageAsks: "Who gets in?", object: "A latch", thread: "Truth and love together.", carry: "Hospitality has a latch." }),
  "3-john": b({ title: "3 John", section: "Letters", door: "Welcome the ones who go out for the Name.", campfire: "Do not copy the man who loves to be first.", pointAt: "The same door from inside.", pageAsks: "Who gets the bed?", object: "A stool", thread: "The Name is enough reason to welcome.", carry: "Who gets the bed tells the truth about a church." }),
  jude: b({ title: "Jude", section: "Letters", door: "Contend for the faith. Some have slipped in.", campfire: "Keep yourselves in love. He is able to keep you.", pointAt: "Jude quotes a line also found in Enoch.", pageAsks: "Will you show mercy to the doubting?", object: "A short letter", thread: "He is able to keep you from falling.", carry: "Mercy on those who doubt." }),
  revelation: b({
    title: "Revelation", section: "The end of the road",
    door: "A vision for seven churches under Rome, and a Lamb who looks slain.",
    campfire: "Letters. Throne. A city called Babylon falls. A city called Jerusalem comes down.",
    pointAt: "Laodicea’s water was lukewarm in the pipes. That line is local.",
    pageAsks: "Will you worship when an empire wants your knee?",
    object: "Water pipes",
    objectNote: "Pipes explain lukewarm. They do not explain the throne.",
    thread: "The slain Lamb is the one on the throne.",
    carry: "Worship is how you stay human under an empire.",
  }),

  tobit: b({ title: "Tobit", beside: true, door: "A diaspora family, a grave at night, a journey, and God using a companion.", campfire: "Tobit goes blind doing right. Tobias walks with an unrecognized companion. Eyes opened.", pointAt: "Aramaic copies sat at Qumran. This story is old.", pageAsks: "Will you do right in a foreign street?", object: "A cave copy", thread: "God sees in Nineveh’s shadow.", carry: "Faithfulness in a foreign street still counts.", objectNote: "Read beside the story. Not a church test." }),
  judith: b({ title: "Judith", beside: true, door: "A widow walks into a general’s camp to save her town.", campfire: "A siege. Judith prays and the terror ends.", pointAt: "Hill towns under Hellenistic camps.", pageAsks: "What courage have you called impossible?", object: "A hill town", carry: "Courage can look like a woman the officers underestimated." }),
  wisdom: b({ title: "Wisdom of Solomon", beside: true, door: "Wisdom loves humans. Idol-making is a tragic craft.", campfire: "The souls of the righteous. A critique of statues.", pointAt: "Alexandria’s shops sold images. Some Jews would not.", pageAsks: "What do you bow to?", object: "A stone cup", thread: "The church later used this language for Christ as Wisdom.", carry: "What you bow to makes you." }),
  sirach: b({ title: "Sirach", beside: true, door: "A Jerusalem teacher writes a book his grandson will translate.", campfire: "Fear of the Lord. Friends. Praise of the fathers.", pointAt: "Hebrew copies at Masada and Qumran.", pageAsks: "Whom will you honor before you?", object: "A Hebrew fragment", carry: "Honor the wise who came before you." }),
  baruch: b({ title: "Baruch", beside: true, door: "Confession from exile, and Jerusalem told to take off mourning.", campfire: "We have sinned. Look east.", pointAt: "Exile letters were a real genre.", pageAsks: "Will you confess and look east?", object: "A letter", carry: "Confession is a road home." }),
  "1-maccabees": b({ title: "1 Maccabees", beside: true, door: "A family fights so the altar can be clean again.", campfire: "Antiochus. Dedication. Then politics after the miracle.", pointAt: "Hasmonean coins.", pageAsks: "What happens to a holy fight when it gets a throne?", object: "A coin", carry: "Freedom can start holy and turn into a throne." }),
  "2-maccabees": b({ title: "2 Maccabees", beside: true, door: "The same years told as theology: martyrs and a God who raises the dead.", campfire: "A mother and sons. Mercy. Resurrection hope.", pointAt: "Seleucid coins of that pressure.", pageAsks: "What would you not accept release from?", object: "A coin", thread: "Hebrews remembers people who would not accept release.", carry: "Resurrection hope is older than Easter morning in this writing." }),
  "1-enoch": b({ title: "1 Enoch", beside: true, door: "Watchers cross a line. A righteous man is shown the world.", campfire: "Violence. Enoch walks. Judgment written in heaven.", pointAt: "Aramaic Enoch was in the desert caves. Ethiopia kept the long book.", pageAsks: "Will you treat this with honor, not hype?", object: "A cave fragment", objectNote: "Beside the story. Not a forbidden-book show.", thread: "Jude quotes a line.", carry: "Heaven keeps books." }),
  jubilees: b({ title: "Jubilees", beside: true, door: "Genesis and Exodus retold with a holy calendar.", campfire: "Weeks of years. Ancestors keeping Torah before Sinai.", pointAt: "Hebrew Jubilees at Qumran.", pageAsks: "Can time itself be worship?", object: "A calendar wheel", carry: "Time itself can be an act of worship." }),
  "1-meqabyan": b({ title: "1 Meqabyan", beside: true, door: "An Ethiopian book about kings and the fear of God — not the Greek Maccabees under another name.", campfire: "A Ge’ez witness the Ethiopian church kept.", pointAt: "Manuscripts on a wooden rest, not a Dead Sea twin.", pageAsks: "Will you let another church’s library be itself?", object: "A Ge’ez book", carry: "Different churches kept different wars of the soul on the page." }),
  "2-meqabyan": b({ title: "2 Meqabyan", beside: true, door: "More of that Ethiopian room: pride of kings and the fear of God.", campfire: "Do not file this under Judas Maccabeus and walk away.", pointAt: "Ge’ez transmission.", pageAsks: "Will you listen before you label?", object: "A manuscript", carry: "Listen before you label." }),
  "3-meqabyan": b({ title: "3 Meqabyan", beside: true, door: "A third book in the same Ge’ez room.", campfire: "Kept in the Ethiopian library.", pointAt: "The manuscript is the witness.", pageAsks: "Can you leave room for a library you did not grow up in?", object: "A manuscript", carry: "Leave room." }),
  "4-baruch": b({ title: "4 Baruch", beside: true, door: "After the fire, Jeremiah’s circle keeps a story going about coming home.", campfire: "Figs, sleep, home.", pointAt: "The wound of 586 and 70.", pageAsks: "Will you let the ruins have the last sentence?", object: "A field after fire", carry: "Some sequels are how a people refuse the ruins the last sentence." }),
};

export function nextOnRoad(id) {
  const i = ROAD_ORDER.indexOf(id);
  if (i < 0 || i === ROAD_ORDER.length - 1) return null;
  return ROAD_ORDER[i + 1];
}

export function groupedRoad() {
  const groups = [];
  for (const id of ROAD_ORDER) {
    const book = BOOKS[id];
    const last = groups[groups.length - 1];
    if (!last || last.section !== book.section) groups.push({ section: book.section, books: [id] });
    else last.books.push(id);
  }
  return groups;
}
