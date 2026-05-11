const CONSTANTS = {
    _gameWidth: 800,
    _gameHeight: 600,
    _charPositionX: 185, // width
    _charPostionY: 125, // height
    _weaponPosition: {
        x: 406,
        y: 36.5
    },
    _genders: ["female", "male"],
    _skinColors: ["White", "Peach", "Asian", "Dark"],
    _player: "player",
    _opponent: "opponent",
    _bodyFrames: [0, 44, 88, 132],
    _hairFrames: [0, 44, 88, 132, 176, 220, 264, 308, 352, 396],
    _basicAttireFrames: [0, 44, 88, 132, 176, 220, 264, 308, 352, 396],
    _hairSpriteCount: {
        female: 5,
        male: 5
    },
    _charDetailsKey: "chrdtls",
    _charUserKey: "chrUsr",
    _logout: "logout",
    _messages: {
        inputName: "Please input a name.",
    },
    _errorMessages: {
        userAlreadyExist: "User already existing.",
        invalidCreds: "Incorrect username or password.",
        requireCreds: "Username and Password are required.",
        notMatchPassword: "Passwords do not match.",
        featureNotAvailable: "{key} Feature not available.",
        noUtilitiesFound: "No random utils found.",
        failedDecrypt: "Failed to decrypt data.",
        noSpace: "Spaces are not allowed!",
        noSpecialChar: "Special characters are not allowed!",
        maxCharNameLength: "Name cannot exceed 14 characters! Current length: ",
        phaserError: "Error fetching users in Phaser:",
    },
    _successMessages: {
        savedPassword: "Password saved successfully!",
        loginSuccess: "Login successfully!",
        logoutSuccess: "Logout successfully!",
    },
    _colors: [
        "#ffffff", // 0 no value
        "#ccff99", // 01-10 slight Yellow-Green
        "#c2f200", // 11-20 Yellow-Green
        "#ffff00", // 21-30 Yellow
        "#ffcc00", // 31-40 Yellow-Orange
        "#ff9900", // 41-50 Orange
        "#ff6600", // 51-60 Red-Orange
        "#ff0000", // 61-70 Red
        "#ac0000", // 81-90 dark red
        "#6f0037", // 91-100 pink
        "#500028", // 101-110 Dark pink
        "#3f007e", // 111-120 violet
        "#00007e", // 121-150 dark blue
        "#000000"  // 151+ Black
    ],
    _utils: [
        { "name": "weapons", "chance": 50 },
        { "name": "pets", "chance": 20 },
        { "name": "skills", "chance": 30 },
    ],
    _weapons: [
        { "name": "Heater Shield", "chance": 2.43, "number": 1 },
        { "name": "Trophy", "chance": 1.82, "number": 2 },
        { "name": "Coffee of Cup", "chance": 7.28, "number": 3 },
        { "name": "Gold Key", "chance": 3.64, "number": 4 },
        { "name": "Rock", "chance": 7.28, "number": 5 },
        { "name": "Cacti", "chance": 7.28, "number": 6 },
        { "name": "Guitar", "chance": 2.43, "number": 7 },
        { "name": "Katana", "chance": 0.81, "number": 8 },
        { "name": "Wizard Staff", "chance": 1.21, "number": 9 },
        { "name": "Obsidian Blade", "chance": 0.73, "number": 10 },
        { "name": "Spell Book", "chance": 1.46, "number": 11 },
        { "name": "Wrench", "chance": 3.64, "number": 12 },
        { "name": "Slipper", "chance": 7.28, "number": 13 },
        { "name": "Wooden Club", "chance": 3.64, "number": 14 },
        { "name": "Kanabo", "chance": 0.81, "number": 15 },
        { "name": "Saber", "chance": 1.04, "number": 16 },
        { "name": "Short Sword", "chance": 3.64, "number": 17 },
        { "name": "Scythe", "chance": 0.91, "number": 18 },
        { "name": "Hammer", "chance": 1.04, "number": 19 },
        { "name": "Rubber Duck", "chance": 7.21, "number": 20 },
        { "name": "Mace", "chance": 1.46, "number": 21 },
        { "name": "Behemoth Bone", "chance": 1.21, "number": 22 },
        { "name": "Sai", "chance": 1.21, "number": 23 },
        { "name": "Wooden Sword", "chance": 7.28, "number": 24 },
        { "name": "Hatchet", "chance": 1.46, "number": 25 },
        { "name": "Long Sword", "chance": 1.04, "number": 26 },
        { "name": "Spadone Sword", "chance": 0.91, "number": 27 },
        { "name": "Shuriken", "chance": 1.82, "number": 28 },
        { "name": "Stick", "chance": 7.28, "number": 29 },
        { "name": "Spear", "chance": 1.04, "number": 30 },
        { "name": "Leek", "chance": 7.28, "number": 31 },
        { "name": "Knife", "chance": 2.43, "number": 32 }
    ],
    _pets: [
        { "name": "Bear", "chance": 5, types: ['A', 'B', 'C'], number: 1 },
        { "name": "Dog", "chance": 16, types: ['A', 'B'], number: 2 },
        { "name": "Snake", "chance": 10, types: ['A', 'B'], number: 3 },
        { "name": "Rat", "chance": 23, types: ['A', 'B'], number: 4 },
        { "name": "Cat", "chance": 23, types: ['A', 'B'], number: 5 },
        { "name": "Bird", "chance": 23, types: ['A', 'B'], number: 6 }
    ],
    _petsNew: [
        { "name": "Bear", "chance": 5, number: 1 },
        { "name": "Dog", "chance": 16, number: 2 },
        { "name": "Snake", "chance": 10, number: 3 },
        { "name": "Rat", "chance": 23, number: 4 },
        { "name": "Cat", "chance": 23, number: 5 },
        { "name": "Bird", "chance": 23, number: 6 }
    ],
    _skills: [
        {
            "name": "Health Potion",
            "description": "A magical drink that tastes like expired apple juice but heals you anyway!",
            "chance": 1.78,
            number: 1
        },
        {
            "name": "Genjutsu",
            "description": "Confuse your enemies so badly they forget how to fight basically, a Jedi mind trick.",
            "chance": 1.19,
            number: 2
        },
        {
            "name": "Hollow Form",
            "description": "Turn into a spooky ghost and zoom around like you just had 10 energy drinks!",
            "chance": 1.19,
            number: 3
        },
        {
            "name": "Susanoo",
            "description": "Summon a giant warrior spirit to flex on your enemies while protecting you.",
            "chance": 1.19,
            number: 4
        },
        {
            "name": "Javelinist",
            "description": "Throw weapons with the precision of an Olympic athlete, but way deadlier!",
            "chance": 1.49,
            number: 5
        },
        {
            "name": "Basher",
            "description": "Heavy weapons hit hard... but also make you question your life choices.",
            "chance": 1.19,
            number: 6
        },
        {
            "name": "Adventurer",
            "description": "Gain extra XP! Because grinding is fun, right? Right?",
            "chance": 0.89,
            number: 7
        },
        {
            "name": "God Of Agility Scurry",
            "description": "Dodge so fast, your enemies will think you're teleporting... or lagging.",
            "chance": 0.59,
            number: 8,
            require: 54
        },
        {
            "name": "Body Armor",
            "description": "Gain muscle and flex your confidence.",
            "chance": 1.19,
            number: 9
        },
        {
            "name": "God Of Strength",
            "description": "Become so strong you can high-five a mountain and leave a dent.",
            "chance": 0.89,
            number: 10,
            require: 55
        },
        {
            "name": "Pet Master",
            "description": "Your pet’s aim just got scary good.",
            "chance": 0.89,
            number: 11,
            require: 101
        },
        {
            "name": "Poisonous touch",
            "description": "Add poison to your weapon because fights are more fun when they’re unfair!",
            "chance": 1.19,
            number: 12
        },
        {
            "name": "Shield Breaker",
            "description": "Shields? Pfft. More like ‘shards’ after you’re done with them!",
            "chance": 1.19,
            number: 13
        },
        {
            "name": "Rage",
            "description": "Enter beast mode. Smash first, ask questions later!",
            "chance": 1.19,
            number: 14
        },
        {
            "name": "Spell Master",
            "description": "Wield magic like a pro, or at least like someone who read half a spellbook.",
            "chance": 0.89,
            number: 15
        },
        {
            "name": "Vampire",
            "description": "Bite enemies and steal HP! No, you don’t sparkle in the sunlight.",
            "chance": 1.19,
            number: 16
        },
        {
            "name": "Aura",
            "description": "Your presence looks familiar hmm...kakarot?",
            "chance": 0.89,
            number: 17
        },
        {
            "name": "Instant Killer",
            "description": "Why fight? Just wait for them to drop.",
            "chance": 1.19,
            number: 18
        },
        {
            "name": "Poison Potion",
            "description": "I'm not an Alchemist, but I can still throw a mean concoction.",
            "chance": 1.19,
            number: 19
        },
        {
            "name": "Lightning Bolt",
            "description": "Summon lightning like an angry thunder god. ZAP!",
            "chance": 1.19,
            number: 20
        },
        {
            "name": "Strong Bite",
            "description": "Your pet thinks enemies are chew toys. More bite, less bark",
            "chance": 0.89,
            number: 21,
            require: 101
        },
        {
            "name": "Scare",
            "description": "Make enemy pets run away like they just saw a vacuum cleaner.",
            "chance": 0.89,
            number: 22
        },
        {
            "name": "Shockwave Hit",
            "description": "Disarm enemies by hitting them so hard their weapons quit before they do.",
            "chance": 1.49,
            number: 23
        },
        {
            "name": "Animals Lover",
            "description": "Your clingy pet fights hard and attacks twice or more",
            "chance": 1.19,
            number: 24,
            require: 101
        },
        {
            "name": "Discharge",
            "description": "Hurl random weapons at your enemy because why use one when you can use four?",
            "chance": 1.19,
            number: 25
        },
        {
            "name": "Steal",
            "description": "Yoink! Take your enemy’s weapon and make it yours.",
            "chance": 1.19,
            number: 26
        },
        {
            "name": "Shield",
            "description": "Gain an extra shield because one is never enough!",
            "chance": 1.19,
            number: 27
        },
        {
            "name": "Revive",
            "description": "Come back from the dead! Because losing is for quitters.",
            "chance": 0.89,
            number: 28
        },
        {
            "name": "Flash Step",
            "description": "Move so fast even your shadow gives up trying to follow you.",
            "chance": 0.59,
            number: 29,
            require: 53
        },
        {
            "name": "Thorns",
            "description": "Sharing is caring... especially when it comes to pain.",
            "chance": 0.89,
            number: 30
        },
        {
            "name": "Bomb",
            "description": "Boom! Now you see them... now you don't. Explosions solve everything.",
            "chance": 1.19,
            number: 31
        },
        {
            "name": "Bandage",
            "description": " warrior’s strength isn’t just in battle, but in rising again.",
            "chance": 1.19,
            number: 32
        },
        {
            "name": "Bullseye",
            "description": "Hit your target so accurately, even atoms are damaged",
            "chance": 1.19,
            number: 33
        },
        {
            "name": "True Strike",
            "description": "The ultimate trust exercise your enemy fails every time.",
            "chance": 1.49,
            number: 34
        },
        {
            "name": "Octopus Viscous",
            "description": "Slip, slide, and slither your way to victory. Just don't get inked.",
            "chance": 0.89,
            number: 35
        },
        {
            "name": "Hard Headed",
            "description": "Blunt force trauma? Never heard of it.",
            "chance": 1.19,
            number: 36
        },
        {
            "name": "Heavy Lifter",
            "description": "Carry your team... and maybe a small building while you're at it.",
            "chance": 1.19,
            number: 37
        },
        {
            "name": "Leviathan Armor",
            "description": "Become an unstoppable sea monster, minus the fishy smell.",
            "chance": 0.89,
            number: 38
        },
        {
            "name": "Future Eye",
            "description": "You see everything. Your enemies wish they could say the same.",
            "chance": 1.49,
            number: 39
        },
        {
            "name": "Phantom Step",
            "description": "Walk so stealthily that even your own shadow loses track of you.",
            "chance": 1.19,
            number: 40
        },
        {
            "name": "Survival",
            "description": "Because dying is for the weak.",
            "chance": 0.89,
            number: 41
        },
        {
            "name": "Weapon Striker",
            "description": "Hit hard, hit fast, hit first. Simple but effective.",
            "chance": 1.19,
            number: 42
        },
        {
            "name": "Weapon Breaker",
            "description": "Break their weapons, break their spirits. Easy game.",
            "chance": 0.89,
            number: 43
        },
        {
            "name": "Champion Skin",
            "description": "Look good, feel good, but not pay to win.",
            "chance": 1.19,
            number: 44
        },
        {
            "name": "Counter Strike",
            "description": "They hit you, you hit back harder. Fair trade.",
            "chance": 1.19,
            number: 45
        },
        {
            "name": "Surge Of Armor",
            "description": "Gain some extra defense! Looks cool, feels heavy, and impresses no one.",
            "chance": 10,
            number: 46
        },
        {
            "name": "Blade Of Furry",
            "description": "Slice and dice like a rabid squirrel on energy drinks.",
            "chance": 1.49,
            number: 47
        },
        {
            "name": "Preemptive Strike",
            "description": "Why wait for them to hit first? Strike now, apologize never.",
            "chance": 0.89,
            number: 48
        },
        {
            "name": "Dragon Punch",
            "description": "Punch so hard, even dragons take notes.",
            "chance": 0.89,
            number: 49
        },
        {
            "name": "Desolator",
            "description": "So sharp, it whispers ‘oops’ every time it slices.",
            "chance": 0.89,
            number: 50
        },
        {
            "name": "God Immortality",
            "description": "Die? not on my dictionary!",
            "chance": 0.59,
            number: 51,
            require: 52
        },
        {
            "name": "Surge Of Life",
            "description": "Longevity is the best because respawning sucks",
            "chance": 10,
            number: 52
        },
        {
            "name": "Surge Of Speed",
            "description": "Run so fast even WiFi signals can't catch you.",
            "chance": 10,
            number: 53
        },
        {
            "name": "Surge Of Agile",
            "description": "Swift as the wind, untouchable as a ghost.",
            "chance": 10,
            number: 54
        },
        {
            "name": "Surge Of Strength",
            "description": "Lift like gravity is just a suggestion.",
            "chance": 10,
            number: 55
        }
    ],
    _petsAll: [
        { "name": "Bear", types: 'A', level: 1, life: 120, damage: 20, agile: 1, armor: 0, accuracy: 5, dodge: 5, maxAccuracy: 70 },
        { "name": "Bear", types: 'B', level: 1, life: 120, damage: 20, agile: 1, armor: 0, accuracy: 5, dodge: 5, maxAccuracy: 70 },
        { "name": "Bear", types: 'C', level: 1, life: 120, damage: 20, agile: 1, armor: 0, accuracy: 5, dodge: 5, maxAccuracy: 70 },

        { "name": "Dog", types: 'A', level: 1, life: 25, damage: 8, agile: 6, armor: 0, accuracy: 15, dodge: 15, maxAccuracy: 85 },
        { "name": "Dog", types: 'B', level: 1, life: 25, damage: 8, agile: 6, armor: 0, accuracy: 15, dodge: 15, maxAccuracy: 85 },

        { "name": "Snake", types: 'A', level: 1, life: 15, damage: 10, agile: 6, armor: 0, accuracy: 10, dodge: 15, maxAccuracy: 75 },
        { "name": "Snake", types: 'B', level: 1, life: 15, damage: 10, agile: 6, armor: 0, accuracy: 10, dodge: 15, maxAccuracy: 75 },

        { "name": "Rat", types: 'A', level: 1, life: 5, damage: 7, agile: 8, armor: 0, accuracy: 30, dodge: 5, maxAccuracy: 100 },
        { "name": "Rat", types: 'B', level: 1, life: 5, damage: 7, agile: 8, armor: 0, accuracy: 30, dodge: 5, maxAccuracy: 100 },

        { "name": "Cat", types: 'A', level: 1, life: 20, damage: 6, agile: 6, armor: 0, accuracy: 20, dodge: 17, maxAccuracy: 90 },
        { "name": "Cat", types: 'B', level: 1, life: 20, damage: 6, agile: 6, armor: 0, accuracy: 20, dodge: 17, maxAccuracy: 90 },

        { "name": "Bird", types: 'A', level: 1, life: 8, damage: 5, agile: 7, armor: 0, accuracy: 25, dodge: 10, maxAccuracy: 95 },
        { "name": "Bird", types: 'B', level: 1, life: 8, damage: 5, agile: 7, armor: 0, accuracy: 25, dodge: 10, maxAccuracy: 95 }
    ],
    weaponStats: [
        { number: -1, name: "Hands", damage: 0, combo: 20, speed: 0, counter: 3, accuracy: 80, block: 10, disarm: 5, critical: 0 },
        { number: 1, name: "Heater Shield", damage: 12, combo: -150, speed: 200, counter: 30, accuracy: 60, block: 45, disarm: 15, critical: 0 },
        { number: 2, name: "Trophy", damage: 11, combo: 7, speed: 100, counter: 10, accuracy: 90, block: -10, disarm: 17, critical: 0 },
        { number: 3, name: "Cup of Coffee", damage: 3, combo: 250, speed: 0, counter: 3, accuracy: 90, block: 15, disarm: 5, critical: 5 },
        { number: 4, name: "Gold Key", damage: 15, combo: 40, speed: 100, counter: 3, accuracy: 85, block: -10, disarm: 50, critical: 5 },
        { number: 5, name: "Rock", damage: 12, combo: 210, speed: 0, counter: 0, accuracy: 90, block: 15, disarm: 5, critical: 0 },
        { number: 6, name: "Cacti", damage: 7, combo: 210, speed: 0, counter: 0, accuracy: 90, block: 15, disarm: 5, critical: 0 },
        { number: 7, name: "Guitar", damage: 12, combo: 0, speed: 100, counter: 3, accuracy: 70, block: -10, disarm: 15, critical: 5 },
        { number: 8, name: "Katana", damage: 30, combo: 80, speed: 100, counter: 15, accuracy: 90, block: 10, disarm: 20, critical: 10 },
        { number: 9, name: "Wizard Staff", damage: 10, combo: 40, speed: 100, counter: 15, accuracy: 90, block: 10, disarm: 10, critical: 10 },
        { number: 10, name: "Obsidian Blade", damage: 40, combo: -80, speed: 100, counter: 15, accuracy: 95, block: 10, disarm: 20, critical: 10 },
        { number: 11, name: "Spell Book", damage: 8, combo: 90, speed: 0, counter: 3, accuracy: 90, block: 15, disarm: 8, critical: 10 },
        { number: 12, name: "Wrench", damage: 10, combo: 30, speed: 0, counter: 3, accuracy: 90, block: -10, disarm: 15, critical: 5 },
        { number: 13, name: "Slipper", damage: 2, combo: 450, speed: 0, counter: 10, accuracy: 100, block: 15, disarm: 10, critical: 30 },
        { number: 14, name: "Wooden Club", damage: 26, combo: -80, speed: 100, counter: 0, accuracy: 75, block: -10, disarm: 15, critical: 5 },
        { number: 15, name: "Kanabo", damage: 36, combo: 60, speed: 100, counter: 0, accuracy: 80, block: -10, disarm: 15, critical: 5 },
        { number: 16, name: "Saber", damage: 10, combo: 150, speed: 100, counter: 3, accuracy: 90, block: 15, disarm: 8, critical: 5 },
        { number: 17, name: "Short Sword", damage: 14, combo: 110, speed: 0, counter: 15, accuracy: 85, block: 15, disarm: 10, critical: 5 },
        { number: 18, name: "Scythe", damage: 22, combo: 80, speed: 100, counter: 15, accuracy: 85, block: 10, disarm: 15, critical: 10 },
        { number: 19, name: "Hammer", damage: 55, combo: -100, speed: 150, counter: 0, accuracy: 45, block: -20, disarm: 20, critical: 0 },
        { number: 20, name: "Rubber Duck", damage: 1, combo: 560, speed: 0, counter: 0, accuracy: 95, block: 15, disarm: 5, critical: 0 },
        { number: 21, name: "Mace", damage: 20, combo: 0, speed: 0, counter: 10, accuracy: 80, block: -10, disarm: 15, critical: 5 },
        { number: 22, name: "Behemoth Bone", damage: 16, combo: 100, speed: 0, counter: 3, accuracy: 90, block: -10, disarm: 15, critical: 10 },
        { number: 23, name: "Sai", damage: 9, combo: 125, speed: 0, counter: 15, accuracy: 80, block: 15, disarm: 70, critical: 5 },
        { number: 24, name: "Wooden Sword", damage: 7, combo: 80, speed: 0, counter: 15, accuracy: 90, block: 10, disarm: 10, critical: 10 },
        { number: 25, name: "Hatchet", damage: 18, combo: 0, speed: 0, counter: 3, accuracy: 80, block: -10, disarm: 15, critical: 10 },
        { number: 26, name: "Long Sword", damage: 25, combo: 90, speed: 100, counter: 15, accuracy: 85, block: 10, disarm: 15, critical: 10 },
        { number: 27, name: "Spadone Sword", damage: 28, combo: 60, speed: 100, counter: 15, accuracy: 85, block: 10, disarm: 15, critical: 5 },
        { number: 28, name: "Shuriken", damage: 3, combo: 410, speed: 0, counter: 0, accuracy: 90, block: 15, disarm: 5, critical: 0 },
        { number: 29, name: "Stick", damage: 4, combo: 150, speed: 0, counter: 30, accuracy: 90, block: 20, disarm: 30, critical: 7.28 },
        { number: 30, name: "Spear", damage: 13, combo: 70, speed: 100, counter: 15, accuracy: 85, block: 10, disarm: 15, critical: 10 },
        { number: 31, name: "Leek", damage: 5, combo: 220, speed: 0, counter: 10, accuracy: 90, block: 15, disarm: 5, critical: 5 },
        { number: 32, name: "Knife", damage: 8, combo: 180, speed: 0, counter: 3, accuracy: 90, block: 15, disarm: 8, critical: 5 }
    ],
    _actions: {
        attack: "Attack",
        throw: "Throw",
        dodge: "Dodge",
        counter: "Counter",
        block: "Block",
        return: "Return",
        stop: "Stop",
        stopThrow: "Stop throwing",
        revive: "Revive",
        move: "Move",
        cantMove: "Cannot move",
        stunned: "Stunned",
        changeWeapon: "Change weapon",
        sabotage: "Sabotage",
        disarm: "Disarm",
        drink: "Drink",
        bandage: "Bandage",
        poison: "Poison",
        skill: "Skill",
        thorns: "Thorns",
        died: "died"
    },
    testScript: [
        {
            "init": 0,
            "action": {
                "type": "Move",
                "by": "player"
            }
        },
        {
            "init": 0,
            "action": {
                "type": "Dodge",
                "by": "opponent",
                "attacker": "player"
            }
        },
        {
            "init": 0,
            "action": {
                "type": "Return",
                "by": "player"
            }
        },
        {
            "init": 0,
            "action": {
                "type": "Move",
                "by": "opponent"
            }
        },
        {
            "init": 0,
            "action": {
                "type": "Dodge",
                "by": "player",
                "attacker": "opponent"
            }
        },
        {
            "init": 0,
            "action": {
                "type": "Return",
                "by": "opponent"
            }
        },
        {
            "init": 1,
            "action": {
                "type": "Move",
                "by": "opponentPet"
            }
        },
        {
            "init": 1,
            "action": {
                "type": "Dodge",
                "by": "player",
                "attacker": "opponentPet"
            }
        },
        {
            "init": 1,
            "action": {
                "type": "Counter",
                "by": "opponent",
                "attacker": "opponentPet"
            }
        },
        {
            "init": 1,
            "action": {
                "type": "Dodge",
                "by": "opponentPet",
                "attacker": "player"
            }
        },
        {
            "init": 1,
            "action": {
                "type": "Return",
                "by": "opponentPet"
            }
        },
        {
            "init": 2,
            "action": {
                "type": "Move",
                "by": "player"
            }
        },
        {
            "init": 2,
            "action": {
                "type": "Attack",
                "by": "player",
                "target": "human"
            },
            "weapon": {
                "name": "Hands",
                "damage": 4,
                "crit": false,
                "heal": 0
            },
            "life": {
                "player": 105,
                "opponent": 54
            }
        },
        {
            "init": 2,
            "action": {
                "type": "Attack",
                "by": "player",
                "target": "human"
            },
            "weapon": {
                "name": "Hands",
                "damage": 4,
                "crit": false,
                "heal": 0
            },
            "life": {
                "player": 105,
                "opponent": 50
            }
        },
        {
            "init": 2,
            "action": {
                "type": "Return",
                "by": "player"
            }
        },
        {
            "init": 3,
            "action": {
                "type": "Move",
                "by": "opponent"
            }
        },
        {
            "init": 3,
            "action": {
                "type": "Block",
                "by": "player",
                "attacker": "opponent"
            }
        },
        {
            "init": 3,
            "action": {
                "type": "Dodge",
                "by": "player",
                "attacker": "opponent"
            }
        },
        {
            "init": 3,
            "action": {
                "type": "Return",
                "by": "opponent"
            }
        },
        {
            "init": 4,
            "action": {
                "type": "Move",
                "by": "opponentPet"
            }
        },
        {
            "init": 4,
            "action": {
                "type": "Attack",
                "by": "opponentPet",
                "target": "human"
            },
            "weapon": {
                "name": "wild",
                "damage": 9,
                "crit": false
            },
            "life": {
                "player": 96,
                "opponent": 50
            }
        },
        {
            "init": 4,
            "action": {
                "type": "Return",
                "by": "opponentPet"
            }
        },
        {
            "init": 5,
            "action": {
                "type": "Move",
                "by": "player"
            }
        },
        {
            "init": 5,
            "action": {
                "type": "Attack",
                "by": "player",
                "target": "human"
            },
            "weapon": {
                "name": "Hands",
                "damage": 3,
                "crit": false,
                "heal": 0
            },
            "life": {
                "player": 96,
                "opponent": 47
            }
        },
        {
            "init": 5,
            "action": {
                "type": "Return",
                "by": "player"
            }
        },
        {
            "init": 6,
            "action": {
                "type": "Move",
                "by": "opponent"
            }
        },
        {
            "init": 6,
            "action": {
                "type": "Block",
                "by": "player",
                "attacker": "opponent"
            }
        },
        {
            "init": 6,
            "action": {
                "type": "Return",
                "by": "opponent"
            }
        },
        {
            "init": 7,
            "action": {
                "type": "Move",
                "by": "opponentPet"
            }
        },
        {
            "init": 7,
            "action": {
                "type": "Attack",
                "by": "opponentPet",
                "target": "human"
            },
            "weapon": {
                "name": "wild",
                "damage": 8,
                "crit": false
            },
            "life": {
                "player": 88,
                "opponent": 47
            }
        },
        {
            "init": 7,
            "action": {
                "type": "Return",
                "by": "opponentPet"
            }
        },
        {
            "init": 8,
            "action": {
                "type": "Move",
                "by": "opponentPet"
            }
        },
        {
            "init": 8,
            "action": {
                "type": "Attack",
                "by": "opponentPet",
                "target": "human"
            },
            "weapon": {
                "name": "wild",
                "damage": 9,
                "crit": false
            },
            "life": {
                "player": 79,
                "opponent": 47
            }
        },
        {
            "init": 8,
            "action": {
                "type": "Return",
                "by": "opponentPet"
            }
        },
        {
            "init": 9,
            "action": {
                "type": "Move",
                "by": "player"
            }
        },
        {
            "init": 9,
            "action": {
                "type": "Dodge",
                "by": "opponent",
                "attacker": "player"
            }
        },
        {
            "init": 9,
            "action": {
                "type": "Return",
                "by": "player"
            }
        },
        {
            "init": 10,
            "action": {
                "type": "Move",
                "by": "opponent"
            }
        },
        {
            "init": 10,
            "action": {
                "type": "Attack",
                "by": "opponent",
                "target": "human"
            },
            "weapon": {
                "name": "Hands",
                "damage": 4,
                "crit": false,
                "heal": 0
            },
            "life": {
                "player": 75,
                "opponent": 47
            }
        },
        {
            "init": 10,
            "action": {
                "type": "Return",
                "by": "opponent"
            }
        },
        {
            "init": 11,
            "action": {
                "type": "Move",
                "by": "player"
            }
        },
        {
            "init": 11,
            "action": {
                "type": "Attack",
                "by": "player",
                "target": "opponentPet",
                "remainingLife": 5,
                "alive": true
            },
            "weapon": {
                "name": "Hands",
                "damage": 3,
                "crit": false,
                "heal": 0
            },
            "life": {
                "player": 75,
                "opponent": 47
            }
        },
        {
            "init": 11,
            "action": {
                "type": "Return",
                "by": "player"
            }
        },
        {
            "init": 12,
            "action": {
                "type": "Move",
                "by": "opponent"
            }
        },
        {
            "init": 12,
            "action": {
                "type": "Attack",
                "by": "opponent",
                "target": "human"
            },
            "weapon": {
                "name": "Hands",
                "damage": 3,
                "crit": false,
                "heal": 0
            },
            "life": {
                "player": 72,
                "opponent": 47
            }
        },
        {
            "init": 12,
            "action": {
                "type": "Return",
                "by": "opponent"
            }
        },
        {
            "init": 13,
            "action": {
                "type": "Move",
                "by": "opponentPet"
            }
        },
        {
            "init": 13,
            "action": {
                "type": "Attack",
                "by": "opponentPet",
                "target": "human"
            },
            "weapon": {
                "name": "wild",
                "damage": 8,
                "crit": false
            },
            "life": {
                "player": 64,
                "opponent": 47
            }
        },
        {
            "init": 13,
            "action": {
                "type": "Return",
                "by": "opponentPet"
            }
        },
        {
            "init": 14,
            "action": {
                "type": "Move",
                "by": "player"
            }
        },
        {
            "init": 14,
            "action": {
                "type": "Attack",
                "by": "player",
                "target": "opponentPet",
                "remainingLife": 2,
                "alive": true
            },
            "weapon": {
                "name": "Hands",
                "damage": 3,
                "crit": false,
                "heal": 0
            },
            "life": {
                "player": 64,
                "opponent": 47
            }
        },
        {
            "init": 14,
            "action": {
                "type": "Return",
                "by": "player"
            }
        },
        {
            "init": 15,
            "action": {
                "type": "Move",
                "by": "opponent"
            }
        },
        {
            "init": 15,
            "action": {
                "type": "Attack",
                "by": "opponent",
                "target": "human"
            },
            "weapon": {
                "name": "Hands",
                "damage": 3,
                "crit": false,
                "heal": 0
            },
            "life": {
                "player": 61,
                "opponent": 47
            }
        },
        {
            "init": 15,
            "action": {
                "type": "Block",
                "by": "player",
                "attacker": "opponent"
            }
        },
        {
            "init": 15,
            "action": {
                "type": "Return",
                "by": "opponent"
            }
        },
        {
            "init": 16,
            "action": {
                "type": "Move",
                "by": "opponentPet"
            }
        },
        {
            "init": 16,
            "action": {
                "type": "Dodge",
                "by": "player",
                "attacker": "opponentPet"
            }
        },
        {
            "init": 16,
            "action": {
                "type": "Counter",
                "by": "opponent",
                "attacker": "opponentPet"
            }
        },
        {
            "init": 16,
            "action": {
                "type": "Attack",
                "by": "player",
                "target": "opponentPet",
                "remainingLife": 0,
                "alive": false
            },
            "weapon": {
                "name": "Hands",
                "damage": 4,
                "crit": false,
                "heal": 0
            },
            "life": {
                "player": 61,
                "opponent": 47
            }
        },
        {
            "init": 16,
            "action": {
                "type": "died",
                "by": "opponentPet"
            }
        },
        {
            "init": 18,
            "action": {
                "type": "Move",
                "by": "player"
            }
        },
        {
            "init": 18,
            "action": {
                "type": "Attack",
                "by": "player",
                "target": "human"
            },
            "weapon": {
                "name": "Hands",
                "damage": 4,
                "crit": false,
                "heal": 0
            },
            "life": {
                "player": 61,
                "opponent": 43
            }
        },
        {
            "init": 18,
            "action": {
                "type": "Block",
                "by": "opponent",
                "attacker": "player"
            }
        },
        {
            "init": 18,
            "action": {
                "type": "Return",
                "by": "player"
            }
        },
        {
            "init": 19,
            "action": {
                "type": "Move",
                "by": "opponent"
            }
        },
        {
            "init": 19,
            "action": {
                "type": "Attack",
                "by": "opponent",
                "target": "human"
            },
            "weapon": {
                "name": "Hands",
                "damage": 4,
                "crit": false,
                "heal": 0
            },
            "life": {
                "player": 57,
                "opponent": 43
            }
        },
        {
            "init": 19,
            "action": {
                "type": "Return",
                "by": "opponent"
            }
        },
        {
            "init": 21,
            "action": {
                "type": "Move",
                "by": "opponent"
            }
        },
        {
            "init": 21,
            "action": {
                "type": "Attack",
                "by": "opponent",
                "target": "human"
            },
            "weapon": {
                "name": "Hands",
                "damage": 4,
                "crit": false,
                "heal": 0
            },
            "life": {
                "player": 53,
                "opponent": 43
            }
        },
        {
            "init": 21,
            "action": {
                "type": "Return",
                "by": "opponent"
            }
        },
        {
            "init": 23,
            "action": {
                "type": "Move",
                "by": "player"
            }
        },
        {
            "init": 23,
            "action": {
                "type": "Attack",
                "by": "player",
                "target": "human"
            },
            "weapon": {
                "name": "Hands",
                "damage": 4,
                "crit": false,
                "heal": 0
            },
            "life": {
                "player": 53,
                "opponent": 39
            }
        },
        {
            "init": 23,
            "action": {
                "type": "Return",
                "by": "player"
            }
        },
        {
            "init": 24,
            "action": {
                "type": "Move",
                "by": "opponent"
            }
        },
        {
            "init": 24,
            "action": {
                "type": "Attack",
                "by": "opponent",
                "target": "human"
            },
            "weapon": {
                "name": "Hands",
                "damage": 4,
                "crit": false,
                "heal": 0
            },
            "life": {
                "player": 49,
                "opponent": 39
            }
        },
        {
            "init": 24,
            "action": {
                "type": "Return",
                "by": "opponent"
            }
        },
        {
            "init": 27,
            "action": {
                "type": "Move",
                "by": "player"
            }
        },
        {
            "init": 27,
            "action": {
                "type": "Attack",
                "by": "player",
                "target": "human"
            },
            "weapon": {
                "name": "Hands",
                "damage": 3,
                "crit": false,
                "heal": 0
            },
            "life": {
                "player": 49,
                "opponent": 36
            }
        },
        {
            "init": 27,
            "action": {
                "type": "Return",
                "by": "player"
            }
        },
        {
            "init": 28,
            "action": {
                "type": "Move",
                "by": "opponent"
            }
        },
        {
            "init": 28,
            "action": {
                "type": "Attack",
                "by": "opponent",
                "target": "human"
            },
            "weapon": {
                "name": "Hands",
                "damage": 4,
                "crit": false,
                "heal": 0
            },
            "life": {
                "player": 45,
                "opponent": 36
            }
        },
        {
            "init": 28,
            "action": {
                "type": "Return",
                "by": "opponent"
            }
        },
        {
            "init": 29,
            "action": {
                "type": "Move",
                "by": "player"
            }
        },
        {
            "init": 29,
            "action": {
                "type": "Attack",
                "by": "player",
                "target": "human"
            },
            "weapon": {
                "name": "Hands",
                "damage": 3,
                "crit": false,
                "heal": 0
            },
            "life": {
                "player": 45,
                "opponent": 33
            }
        },
        {
            "init": 29,
            "action": {
                "type": "Return",
                "by": "player"
            }
        },
        {
            "init": 30,
            "action": {
                "type": "Move",
                "by": "opponent"
            }
        },
        {
            "init": 30,
            "action": {
                "type": "Attack",
                "by": "opponent",
                "target": "human"
            },
            "weapon": {
                "name": "Hands",
                "damage": 4,
                "crit": false,
                "heal": 0
            },
            "life": {
                "player": 41,
                "opponent": 33
            }
        },
        {
            "init": 30,
            "action": {
                "type": "Attack",
                "by": "opponent",
                "target": "human"
            },
            "weapon": {
                "name": "Hands",
                "damage": 4,
                "crit": false,
                "heal": 0
            },
            "life": {
                "player": 37,
                "opponent": 33
            }
        },
        {
            "init": 30,
            "action": {
                "type": "Return",
                "by": "opponent"
            }
        },
        {
            "init": 33,
            "action": {
                "type": "Move",
                "by": "opponent"
            }
        },
        {
            "init": 33,
            "action": {
                "type": "Attack",
                "by": "opponent",
                "target": "human"
            },
            "weapon": {
                "name": "Hands",
                "damage": 3,
                "crit": false,
                "heal": 0
            },
            "life": {
                "player": 34,
                "opponent": 33
            }
        },
        {
            "init": 33,
            "action": {
                "type": "Return",
                "by": "opponent"
            }
        },
        {
            "init": 35,
            "action": {
                "type": "Move",
                "by": "player"
            }
        },
        {
            "init": 35,
            "action": {
                "type": "Block",
                "by": "opponent",
                "attacker": "player"
            }
        },
        {
            "init": 35,
            "action": {
                "type": "Return",
                "by": "player"
            }
        },
        {
            "init": 36,
            "action": {
                "type": "Move",
                "by": "opponent"
            }
        },
        {
            "init": 36,
            "action": {
                "type": "Attack",
                "by": "opponent",
                "target": "human"
            },
            "weapon": {
                "name": "Hands",
                "damage": 3,
                "crit": false,
                "heal": 0
            },
            "life": {
                "player": 31,
                "opponent": 33
            }
        },
        {
            "init": 36,
            "action": {
                "type": "Return",
                "by": "opponent"
            }
        },
        {
            "init": 39,
            "action": {
                "type": "Move",
                "by": "player"
            }
        },
        {
            "init": 39,
            "action": {
                "type": "Block",
                "by": "opponent",
                "attacker": "player"
            }
        },
        {
            "init": 39,
            "action": {
                "type": "Return",
                "by": "player"
            }
        },
        {
            "init": 40,
            "action": {
                "type": "Move",
                "by": "opponent"
            }
        },
        {
            "init": 40,
            "action": {
                "type": "Attack",
                "by": "opponent",
                "target": "human"
            },
            "weapon": {
                "name": "Hands",
                "damage": 3,
                "crit": false,
                "heal": 0
            },
            "life": {
                "player": 28,
                "opponent": 33
            }
        },
        {
            "init": 40,
            "action": {
                "type": "Return",
                "by": "opponent"
            }
        },
        {
            "init": 41,
            "action": {
                "type": "Move",
                "by": "player"
            }
        },
        {
            "init": 41,
            "action": {
                "type": "Dodge",
                "by": "opponent",
                "attacker": "player"
            }
        },
        {
            "init": 41,
            "action": {
                "type": "Return",
                "by": "player"
            }
        },
        {
            "init": 42,
            "action": {
                "type": "Move",
                "by": "opponent"
            }
        },
        {
            "init": 42,
            "action": {
                "type": "Attack",
                "by": "opponent",
                "target": "human"
            },
            "weapon": {
                "name": "Hands",
                "damage": 4,
                "crit": false,
                "heal": 0
            },
            "life": {
                "player": 24,
                "opponent": 33
            }
        },
        {
            "init": 42,
            "action": {
                "type": "Return",
                "by": "opponent"
            }
        },
        {
            "init": 45,
            "action": {
                "type": "Move",
                "by": "opponent"
            }
        },
        {
            "init": 45,
            "action": {
                "type": "Attack",
                "by": "opponent",
                "target": "human"
            },
            "weapon": {
                "name": "Hands",
                "damage": 3,
                "crit": false,
                "heal": 0
            },
            "life": {
                "player": 21,
                "opponent": 33
            }
        },
        {
            "init": 45,
            "action": {
                "type": "Return",
                "by": "opponent"
            }
        },
        {
            "init": 48,
            "action": {
                "type": "Move",
                "by": "player"
            }
        },
        {
            "init": 48,
            "action": {
                "type": "Attack",
                "by": "player",
                "target": "human"
            },
            "weapon": {
                "name": "Hands",
                "damage": 4,
                "crit": false,
                "heal": 0
            },
            "life": {
                "player": 21,
                "opponent": 29
            }
        },
        {
            "init": 48,
            "action": {
                "type": "Return",
                "by": "player"
            }
        },
        {
            "init": 49,
            "action": {
                "type": "Move",
                "by": "opponent"
            }
        },
        {
            "init": 49,
            "action": {
                "type": "Attack",
                "by": "opponent",
                "target": "human"
            },
            "weapon": {
                "name": "Hands",
                "damage": 4,
                "crit": false,
                "heal": 0
            },
            "life": {
                "player": 17,
                "opponent": 29
            }
        },
        {
            "init": 49,
            "action": {
                "type": "Attack",
                "by": "opponent",
                "target": "human"
            },
            "weapon": {
                "name": "Hands",
                "damage": 4,
                "crit": false,
                "heal": 0
            },
            "life": {
                "player": 13,
                "opponent": 29
            }
        },
        {
            "init": 49,
            "action": {
                "type": "Return",
                "by": "opponent"
            }
        },
        {
            "init": 50,
            "action": {
                "type": "Move",
                "by": "player"
            }
        },
        {
            "init": 50,
            "action": {
                "type": "Attack",
                "by": "player",
                "target": "human"
            },
            "weapon": {
                "name": "Hands",
                "damage": 3,
                "crit": false,
                "heal": 0
            },
            "life": {
                "player": 13,
                "opponent": 26
            }
        },
        {
            "init": 50,
            "action": {
                "type": "Return",
                "by": "player"
            }
        },
        {
            "init": 51,
            "action": {
                "type": "Move",
                "by": "opponent"
            }
        },
        {
            "init": 51,
            "action": {
                "type": "Dodge",
                "by": "player",
                "attacker": "opponent"
            }
        },
        {
            "init": 51,
            "action": {
                "type": "Attack",
                "by": "opponent",
                "target": "human"
            },
            "weapon": {
                "name": "Hands",
                "damage": 3,
                "crit": false,
                "heal": 0
            },
            "life": {
                "player": 10,
                "opponent": 26
            }
        },
        {
            "init": 51,
            "action": {
                "type": "Return",
                "by": "opponent"
            }
        },
        {
            "init": 54,
            "action": {
                "type": "Move",
                "by": "opponent"
            }
        },
        {
            "init": 54,
            "action": {
                "type": "Attack",
                "by": "opponent",
                "target": "human"
            },
            "weapon": {
                "name": "Hands",
                "damage": 4,
                "crit": false,
                "heal": 0
            },
            "life": {
                "player": 6,
                "opponent": 26
            }
        },
        {
            "init": 54,
            "action": {
                "type": "Return",
                "by": "opponent"
            }
        },
        {
            "init": 58,
            "action": {
                "type": "Move",
                "by": "opponent"
            }
        },
        {
            "init": 58,
            "action": {
                "type": "Attack",
                "by": "opponent",
                "target": "human"
            },
            "weapon": {
                "name": "Hands",
                "damage": 3,
                "crit": false,
                "heal": 0
            },
            "life": {
                "player": 3,
                "opponent": 26
            }
        },
        {
            "init": 58,
            "action": {
                "type": "Return",
                "by": "opponent"
            }
        },
        {
            "init": 59,
            "action": {
                "type": "Move",
                "by": "player"
            }
        },
        {
            "init": 59,
            "action": {
                "type": "Attack",
                "by": "player",
                "target": "human"
            },
            "weapon": {
                "name": "Hands",
                "damage": 3,
                "crit": false,
                "heal": 0
            },
            "life": {
                "player": 3,
                "opponent": 23
            }
        },
        {
            "init": 59,
            "action": {
                "type": "Attack",
                "by": "player",
                "target": "human"
            },
            "weapon": {
                "name": "Hands",
                "damage": 3,
                "crit": false,
                "heal": 0
            },
            "life": {
                "player": 3,
                "opponent": 20
            }
        },
        {
            "init": 59,
            "action": {
                "type": "Return",
                "by": "player"
            }
        },
        {
            "init": 60,
            "action": {
                "type": "Move",
                "by": "opponent"
            }
        },
        {
            "init": 60,
            "action": {
                "type": "Attack",
                "by": "opponent",
                "target": "human"
            },
            "weapon": {
                "name": "Hands",
                "damage": 3,
                "crit": false,
                "heal": 0
            },
            "life": {
                "player": 0,
                "opponent": 20
            }
        },
        {
            "init": 60,
            "action": {
                "type": "died",
                "by": "player"
            }
        }
    ],
    _thrownWeapons: [5, 6, 20, 28],
    _heavyWeapons: [1, 2, 4, 7, 12, 14, 15, 19, 21, 22, 25],
    _sharpWeapons: [8, 10, 16, 17, 18, 23, 26, 27, 30, 32],
    _physicalWeapons: [-1, 3],
    _maxSpeed: 1000, // Threshold for cyclic comparison
};

// Optionally freeze the object to prevent modification
Object.freeze(CONSTANTS);

