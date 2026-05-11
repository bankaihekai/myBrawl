class PlayerHome extends Phaser.Scene {
    constructor() {
        super({ key: "playerHome" });

        this.currentCharDetails = {};
        this.isLock = false; // flag to lock unlock creating character

        this.flags = {
            isLock: false, // flag to lock unlock creating character
            isSaving: false // flag to lock naming while entering password
        }

        this.availableUtils = {
            pets: structuredClone(CONSTANTS._petsAll),
            weapons: structuredClone(CONSTANTS._weapons),
            skills: CONSTANTS._skills
        };
        this.binKey = "67d9878c8a456b7966787549";
        this.masterKey = "$2a$10$Mya1QQvt8foHg2AaLxkgaeZ2mRJ4HnwVKlD4ElQkL3TvUl94sJtau";
    }

    //#region Create Scene
    create() {
        // this.scene.start("playerFight");
        const loadIsLogin = loadCharacter("recentLogin");
        if (loadIsLogin) {
            this.createToast(generateRandomKeys(), CONSTANTS._successMessages.loginSuccess, true);
            localStorage.removeItem("recentLogin");
        };

        const loadedCharacter = loadCharacter(CONSTANTS._charDetailsKey);
        if (!!loadedCharacter) {
            this.currentCharDetails = loadedCharacter;
            this.validateLoggedIn(this.currentCharDetails.name);
        } else {

            localStorage.removeItem(CONSTANTS._charUserKey);
            localStorage.removeItem(CONSTANTS._charDetailsKey);

            setTimeout(() => {
                alert("No Data Found! returning to login page.");
            }, 1000);

            this.scene.start('playGame');
        }

        this.loadedCharacterLogs = loadCharacter("fightLogs");

        this.availableUtils = validateAvailableUtils(this.currentCharDetails, this.availableUtils);

        this.latestFight = JSON.parse(decryptData("fightLogs"));
        if (!!this.latestFight && this.latestFight.length > 0) {

            const recentFight = this.latestFight[this.latestFight.length - 1];
            const withFightResult = localStorage.getItem("fightResult");

            if (withFightResult && withFightResult == "true") {
                const playerWin = recentFight.winner == "player";
                const fightMessage = playerWin ? "You win!" : "You lose!";

                this.createToast(generateRandomKeys(), fightMessage, playerWin);

                localStorage.setItem("fightResult", false);
            }
        }

        this.centerX = this.sys.game.config.width / 2;
        this.centerY = this.sys.game.config.height / 2;

        this.mainContainer = this.add.container(0, 0);
        this.mainContainer.setSize(CONSTANTS._gameWidth, CONSTANTS._gameHeight);

        this.background = this.add.image(0, 0, "bg-open").setOrigin(0);
        this.background.displayWidth = CONSTANTS._gameWidth;
        this.background.displayHeight = CONSTANTS._gameHeight;
        this.mainContainer.add(this.background);

        this.characterContainer = this.add.container(0, 0);
        this.characterContainer.setSize(CONSTANTS._gameWidth, CONSTANTS._gameHeight);
        this.characterContainer.add(this.createBorder(CONSTANTS._gameWidth, CONSTANTS._gameHeight));

        this.buttonContainer = this.add.container(0, 0);
        this.buttonContainer.setSize(CONSTANTS._gameWidth, CONSTANTS._gameHeight);

        this.charNameContainer = this.add.container(0, 0);
        this.charNameContainer.setSize(CONSTANTS._gameWidth, CONSTANTS._gameHeight);

        this.renderCreateCharacter();
        this.createBarStatus(this.currentCharDetails.attributes);
        this.renderButtons();
    }

    createBorder(width, height) {
        const border = this.add.graphics();
        border.lineStyle(4, 0xffffff, 1); // Set border thickness and color (white)
        border.strokeRect(-0, -0 / 2, width, height); // Draw the rectangle centered around the origin
        return border;
    }

    renderCreateCharacter() {
        // Clear the preview container
        this.characterContainer.removeAll(true);
        this.calculateLevelExp(this.currentCharDetails.level);
        // this.currentCharDetails.level.points = 1; ///////
        this.calculateLevelUp();
        this.createName();
        this.renderButtons();

        console.log({ loadedCharacter: this.currentCharDetails });
        console.log({ loadedCharacterLogs: JSON.parse(this.loadedCharacterLogs) });

        // Define your desired numbers
        const gender = this.currentCharDetails.gender != null ? this.currentCharDetails.gender : CONSTANTS._genders[randomizer(CONSTANTS._genders.length - 1)];
        const bodyFrame = this.currentCharDetails.bodyFrame != null ? this.currentCharDetails.bodyFrame : CONSTANTS._bodyFrames[randomizer(CONSTANTS._bodyFrames.length - 1)];

        const randomHairFrames = this.currentCharDetails.hair.frame != null ? this.currentCharDetails.hair.frame : Phaser.Utils.Array.GetRandom(CONSTANTS._hairFrames);
        const hairGenderValue = gender == CONSTANTS._genders[1] ? CONSTANTS._hairSpriteCount.male : CONSTANTS._hairSpriteCount.female;
        const hairNumber = this.currentCharDetails.hair.number != null ? this.currentCharDetails.hair.number : randomizer(hairGenderValue);
        const hairFrameNumber = this.currentCharDetails.hair.frame != null ? this.currentCharDetails.hair.frame : randomHairFrames;

        const basicAttireRandomFrames = this.currentCharDetails.basicAttire != null ? this.currentCharDetails.basicAttire : Phaser.Utils.Array.GetRandom(CONSTANTS._basicAttireFrames);
        const basicAttireFrameNumber = this.currentCharDetails.basicAttire != null ? this.currentCharDetails.basicAttire : basicAttireRandomFrames;

        let currentCharDetails = {
            gender: gender,
            bodyFrame: bodyFrame,
            hair: {
                number: hairNumber,
                frame: hairFrameNumber
            },
            basicAttire: basicAttireFrameNumber
        }

        let charDetails = {
            x: CONSTANTS._charPositionX,
            y: (this.characterContainer.height / 2) - CONSTANTS._charPostionY,
            frame: 0,
            scale: 3,
            origin: 0.5
        }

        this.currentCharDetails.gender = currentCharDetails.gender;
        this.currentCharDetails.bodyFrame = currentCharDetails.bodyFrame;
        this.currentCharDetails.hair.number = currentCharDetails.hair.number;
        this.currentCharDetails.hair.frame = currentCharDetails.hair.frame;
        this.currentCharDetails.basicAttire = currentCharDetails.basicAttire;

        this.renderSprite(this.characterContainer, currentCharDetails, charDetails);
    }

    renderSprite(container, currentCharDetails, charDetails) {
        const charShadow = this.add.sprite(charDetails.x - 20, charDetails.y - 5, "buttons").setFrame(8).setScale(3);
        container.add(charShadow);

        const charType = "body_".concat(currentCharDetails.gender);
        const charSprite = this.add.sprite(charDetails.x, charDetails.y, charType)
            .setFrame(currentCharDetails.bodyFrame)
            .setScale(charDetails.scale)
            .setOrigin(charDetails.origin);

        container.add(charSprite);

        const charAttireType = "body_basic_attire_".concat(currentCharDetails.gender);
        const charAttireSprite = this.add.sprite(charDetails.x, charDetails.y, charAttireType)
            .setFrame(currentCharDetails.basicAttire)
            .setScale(charDetails.scale)
            .setOrigin(charDetails.origin);

        container.add(charAttireSprite);

        const armorResult = this.currentCharDetails.utilities.skills.find(skill => skill == 44);
        if (armorResult && !!this.currentCharDetails.armorName) {
            const charArmorSprite = this.add.sprite(charDetails.x, charDetails.y, this.currentCharDetails.armorName)
                .setFrame(0) // set to 1 because no other skill yet added
                .setScale(charDetails.scale)
                .setOrigin(charDetails.origin);

            container.add(charArmorSprite);
        }

        if (currentCharDetails.hair.number !== 0 && currentCharDetails.hair.number !== null) {
            const charHair = "hair_".concat(currentCharDetails.gender, currentCharDetails.hair.number);
            const charHairSprite = this.add.sprite(charDetails.x, charDetails.y, charHair)
                .setFrame(currentCharDetails.hair.frame)
                .setScale(charDetails.scale)
                .setOrigin(charDetails.origin);

            container.add(charHairSprite);
        }

        this.renderUtils(container, charDetails);
    }

    renderButtons() {
        this.buttonContainer.removeAll(true);

        const setting_icon = this.add.sprite(this.centerX / 2 - 100, this.centerY + 30, "buttons").setFrame(17); // setting icon
        setting_icon.setInteractive();
        this.buttonContainer.add(setting_icon);
        this.createToolTip(setting_icon, "Settings", "buttons", "settings");

        setting_icon.on("pointerdown", () => {
            this.createModalTable3('Settings', "<h1 class='text-danger'>Settings not yet available</h1>");
        });

        const fightHistory_icon = this.add.sprite(this.centerX / 2 - 40, this.centerY + 30, "buttons").setFrame(31);
        fightHistory_icon.setInteractive();
        this.buttonContainer.add(fightHistory_icon);
        this.createToolTip(fightHistory_icon, "Fight History", "buttons", "fhistory");

        fightHistory_icon.on("pointerdown", () => {
            // this.createModalTable2('Fight History', "<h1 class='text-danger'>Fight History not yet available</h1>");
            let logData = this.latestFight;

            if (logData.length > 5) {
                const latestFights = logData.slice(-5);
                logData = latestFights;
            }

            // if (this.latestFight.length > 5) {
            //     logData = this.latestFight.slice(-5);
            // }
            let id = 1;
            const fightTableDetails = logData.map((data) => {

                const playerName = data.playerDetails.name;
                const opponentName = data.opponentDetails.name;
                const playerLevel = data.playerDetails.level.current;
                const opponentLevel = data.opponentDetails.level.current;
                const winner = data.winner == "player" ? "🏆" : "🥈";
                const title = `${winner + " " + playerName} (lvl ${playerLevel}) VS. ${opponentName} (lvl ${opponentLevel})`;

                const playerLife = data.playerDetails.attributes.life;
                const opponentLife = data.opponentDetails.attributes.life;

                // const playerLifePetMax = data.playerDetails.utilities.pets.length > 0 ? data.playerDetails.utilities.pets[0].life : 0;
                // const opponentLifePetMax = data.opponentDetails.utilities.pets.length > 0 ? data.opponentDetails.utilities.pets[0].life : 0;

                // const PlayerPetLife = data.fightScript.filter(data => data.action && data.action.target == "playerPet");
                // const OpponentPetLife = data.fightScript.filter(data => data.action && data.action.target == "opponentPet");

                // const lastLifePlayerPet = playerLifePetMax > 0 && PlayerPetLife.length > 0 ? PlayerPetLife[PlayerPetLife.length -1].action.remainingLife : 0;
                // const lastLifeOpponentPet = opponentLifePetMax > 0 && OpponentPetLife.length > 0 ? OpponentPetLife[OpponentPetLife.length -1].action.remainingLife : 0;

                const fightScriptLength = data.fightScript.length - 1;

                const withLifeLogs = data.fightScript[fightScriptLength - 1]?.life ? true : false;

                const playerLifeLogs = withLifeLogs ? data.fightScript[fightScriptLength - 1].life.player : data.fightScript[fightScriptLength - 2].life.player;
                const opponentLifeLogs = withLifeLogs ? data.fightScript[fightScriptLength - 1].life.opponent : data.fightScript[fightScriptLength - 2].life.opponent;

                const lifeRemaining = {
                    player: playerLifeLogs,
                    opponent: opponentLifeLogs
                };

                const attackThrow = data.fightScript.filter(data => data.action && (data.action.type == "Attack" || data.action.type == "Throw"));
                const dodgeDetails = data.fightScript.filter(data => data.action && (data.action.type == "Dodge"));
                const blockDetails = data.fightScript.filter(data => data.action && (data.action.type == "Block"));

                // target human / playerPet / opponentPet
                const playerAttackThrow = attackThrow.filter(data => data.action.by == "player");
                const opponentAttackThrow = attackThrow.filter(data => data.action.by == "opponent");

                const playerDodgeCount = dodgeDetails.filter(data => data.action.by == "player").length;
                const opponentDodgeCount = dodgeDetails.filter(data => data.action.by == "opponent").length;

                const playerBlockCount = blockDetails.filter(data => data.action.by == "player").length;
                const opponentBlockCount = blockDetails.filter(data => data.action.by == "opponent").length;

                const playerTotalHits = playerAttackThrow.length + opponentDodgeCount;
                const opponentTotalHits = opponentAttackThrow.length + playerDodgeCount;

                const lastAction = withLifeLogs ? data.fightScript.slice(-2) : data.fightScript.slice(-3);
                const lastHit = {
                    actionBy: lastAction[0].action,
                    weaponUsed: lastAction[0].weapon
                };
                const lastHitMessage = `${lastHit.actionBy.by} ${lastHit.actionBy.type} with ${lastHit.weaponUsed.name}`;

                const playerLifeDesign = lifeRemaining.player > 0 ? "text-success fw-bold" : "text-danger fw-bold";
                const opponentLifeDesign = lifeRemaining.opponent > 0 ? "text-success fw-bold" : "text-danger fw-bold";

                const resultDetail = {
                    id: data.id,
                    player: {
                        name: playerName,
                        lifeRemaining: `<b class="${playerLifeDesign}">${lifeRemaining.player || 0}</b> / ${playerLife}`, // remaining life in logs
                        // petLifeRemaining: lastLifePlayerPet + " / " + playerLifePetMax,
                        dodgeCount: `${playerDodgeCount}`,
                        blockCount: `${playerBlockCount}`
                    },
                    opponent: {
                        name: opponentName,
                        lifeRemaining: `<b class="${opponentLifeDesign}">${lifeRemaining.opponent || 0}</b> / ${opponentLife}`,
                        // petLifeRemaining: lastLifeOpponentPet + " / " + opponentLifePetMax,
                        dodgeCount: `${opponentDodgeCount}`,
                        blockCount: `${opponentBlockCount}`
                    },
                    lastAction: lastHitMessage
                };

                id++;
                return this.htmlFormat(title, resultDetail, data.winner);
            });

            this.createModalTable3('Fight History (Latest 5 fights)', fightTableDetails);
        });

        // center
        const fightIcon = this.add.sprite(this.centerX / 2 + 20, this.centerY + 30, "buttons").setFrame(30);
        fightIcon.setInteractive();
        this.buttonContainer.add(fightIcon);
        this.createToolTip(fightIcon, "Fight!", "buttons");

        fightIcon.on("pointerdown", () => {
            // this.createModalTable2('Select Opponent', "<h1 class='text-danger'>Fight not yet available</h1>", "fight");
            document.getElementById("phaser-tooltip")?.remove();
            this.scene.start("playerSelect");
        });

        const learnBook_icon = this.add.sprite(this.centerX / 2 + 80, this.centerY + 30, "buttons").setFrame(32); // book icon
        learnBook_icon.setInteractive();
        this.buttonContainer.add(learnBook_icon);
        this.createToolTip(learnBook_icon, "Library", "buttons");

        learnBook_icon.on("pointerdown", () => {
            this.createModalTable3('Library', "<h1 class='text-danger'>Library not yet available</h1>", "library");
        });

        const lvlUpHistory_icon = this.add.sprite(this.centerX / 2 + 140, this.centerY + 30, "buttons").setFrame(29);
        lvlUpHistory_icon.setInteractive();
        this.buttonContainer.add(lvlUpHistory_icon);
        this.createToolTip(lvlUpHistory_icon, "Utility Logs", "buttons");

        lvlUpHistory_icon.on("pointerdown", () => {
            this.createModalTable2('Utility Logs', this.currentCharDetails.logs.utility, "utilLogs");
        });

    }

    changeColor() {
        this.currentCharDetails.hair.frame = CONSTANTS._hairFrames[randomizer(CONSTANTS._hairFrames.length - 1)];
        this.currentCharDetails.bodyFrame = CONSTANTS._bodyFrames[randomizer(CONSTANTS._bodyFrames.length - 1)];
        this.currentCharDetails.basicAttire = CONSTANTS._basicAttireFrames[randomizer(CONSTANTS._bodyFrames.length - 1)];
        this.renderCreateCharacter();
    }

    createBarStatus(charAttributes) {

        const barWidth = 80; // Total width of the bar
        const barHeight = 15; // Height of each segment
        const maxSegments = 10; // Always 10 segments per bar
        const segmentWidth = barWidth / maxSegments; // Width of each segment

        // CREATE COLORED BARs
        // this.creteBars(this.characterContainer);

        const getColor = (value) => {
            // Return colors based on value ranges
            if (value == 0) return CONSTANTS._colors[1]; // 01-10 slight Yellow-Green
            if (value == 1) return CONSTANTS._colors[2]; // 11-20 Yellow-Green
            if (value == 2) return CONSTANTS._colors[3]; // 21-30 Yellow
            if (value == 3) return CONSTANTS._colors[4]; // 31-40 Yellow-Orange
            if (value == 4) return CONSTANTS._colors[5]; // 41-50 Orange
            if (value == 5) return CONSTANTS._colors[6]; // 51-60 Red-Orange
            if (value == 6) return CONSTANTS._colors[7]; // 61-70 Red
            if (value == 7) return CONSTANTS._colors[8]; // 81-90 Dark Red
            if (value == 8) return CONSTANTS._colors[9]; // 91-100 Pink
            if (value == 9) return CONSTANTS._colors[10]; // 101-110 Dark Pink
            if (value == 10) return CONSTANTS._colors[11]; // 111-120 Violet
            if (value >= 11 && value <= 14) return CONSTANTS._colors[12]; // 121-150 Dark Blue
            if (value > 14) return CONSTANTS._colors[13]; // 151+ Black
        };

        Object.entries(charAttributes).forEach(([attribute, value], index) => {
            // Create a container for the health bar
            this.barContainer = this.add.container(this.centerX - 160, 135 + index * (barHeight + 5));

            if (attribute !== "life") {
                // Calculate the quotient and fractional part for the segments
                const quotient = value / 10;
                const integerPart = Math.floor(quotient);
                const fractionalPart = Math.round((quotient - integerPart) * 10);
                const remainingCount = 10 - fractionalPart;
                const integerPartColor = integerPart == 0 && remainingCount == 0 ? CONSTANTS._colors[0] : getColor(integerPart);
                let remainingColor = integerPart == 0 && remainingCount == 0 ? CONSTANTS._colors[0] : CONSTANTS._colors[CONSTANTS._colors.indexOf(integerPartColor) - 1];

                if (value >= 151) {
                    remainingColor = CONSTANTS._colors[13];
                }

                let setOfColor = [];

                // Add filled segments with integer color
                for (let i = 0; i < fractionalPart; i++) {
                    setOfColor.push(integerPartColor);
                }

                // Add unfilled segments with remaining color
                for (let i = 0; i < remainingCount; i++) {
                    setOfColor.push(remainingColor);
                }

                // Create segments for the bar
                for (let i = 0; i < maxSegments; i++) {
                    const color = setOfColor[i]; // Use the pre-determined colors
                    const borderThickness = 1; // Thickness of the border
                    const borderColor = setOfColor[i] == CONSTANTS._colors[13] ? 0xffffff : 0x000000;
                    // Create the outer rectangle (border)
                    const outerSegment = this.add.rectangle(
                        i * segmentWidth, // Position segments horizontally with spacing
                        0, // Align vertically
                        segmentWidth, // Outer rectangle includes the border
                        barHeight, // Outer rectangle includes the border
                        borderColor // Border color (black)
                    );
                    outerSegment.setOrigin(0); // Align to the top-left
                    this.barContainer.add(outerSegment);

                    // Create the inner rectangle (fill)
                    const innerSegment = this.add.rectangle(
                        i * segmentWidth + borderThickness, // Adjust for border thickness
                        borderThickness, // Adjust for border thickness
                        segmentWidth - 2, // Adjust for border thickness
                        barHeight - 2, // Adjust for border thickness
                        Phaser.Display.Color.HexStringToColor(color || "#ffffff").color // Set color based on filled/unfilled segments
                    );
                    innerSegment.setOrigin(0); // Align to the top-left
                    this.barContainer.add(innerSegment);
                }
            }
            let iconFrame = 0;
            switch (attribute) {
                case "life":
                    iconFrame = 25;
                    break;
                case "damage":
                    iconFrame = 26;
                    break;
                case "agile":
                    iconFrame = 28;
                    break;
                case "speed":
                    iconFrame = 27;
                    break;
                case "armor":
                    iconFrame = 34;
                    break;
                default:
                    break;
            }

            const charShadow = this.add.sprite(-15, 8, "buttons").setFrame(iconFrame).setScale(0.4);
            this.barContainer.add(charShadow);

            // Add a label for the attribute
            // const attributeText = attribute.charAt(0).toUpperCase() + attribute.slice(1);
            // const label = this.add.text(-51, 0, attributeText, {
            //     fontSize: "14px",
            //     color: "#ffffff"
            // });
            // this.barContainer.add(label);

            const txtLocation = attribute == "life" ? 0 : 85;
            const valueLabel = this.add.text(txtLocation, 0, value, {
                fontSize: "14px",
                color: "#ffffff"
            });
            this.barContainer.add(valueLabel);
        });

        const charLevelDetails = this.currentCharDetails.level;
        const valueLabel = this.add.text(0, 20, "LVL.".concat(this.currentCharDetails.level.current), {
            fontSize: "20px",
            color: "#ffffff",
            fill: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000', // Border color
            strokeThickness: 3 // Border thickness
        });
        this.barContainer.add(valueLabel);

        const labelPart1 = this.add.text(0, 40, `EXP.${charLevelDetails.experience}/`, {
            fontSize: "20px",
            color: "#ffffff",
            stroke: '#000000',
            strokeThickness: 3,
            fontStyle: 'bold',
        });

        const labelPart2 = this.add.text(labelPart1.width, 40, `${this.maxExp}`, {
            fontSize: "20px",
            color: "#00aaff", // Blue color
            stroke: '#000000',
            strokeThickness: 3,
            fontStyle: 'bold',
        });

        this.barContainer.add(labelPart1);
        this.barContainer.add(labelPart2);

    }

    createBarStatus2(petAttributes) {

        const barWidth = 80; // Total width of the bar
        const barHeight = 15; // Height of each segment
        const maxSegments = 10; // Always 10 segments per bar
        const segmentWidth = barWidth / maxSegments; // Width of each segment

        // CREATE COLORED BARs
        // this.creteBars(this.characterContainer);

        const getColor = (value) => {
            // Return colors based on value ranges
            if (value == 0) return CONSTANTS._colors[1]; // 01-10 slight Yellow-Green
            if (value == 1) return CONSTANTS._colors[2]; // 11-20 Yellow-Green
            if (value == 2) return CONSTANTS._colors[3]; // 21-30 Yellow
            if (value == 3) return CONSTANTS._colors[4]; // 31-40 Yellow-Orange
            if (value == 4) return CONSTANTS._colors[5]; // 41-50 Orange
            if (value == 5) return CONSTANTS._colors[6]; // 51-60 Red-Orange
            if (value == 6) return CONSTANTS._colors[7]; // 61-70 Red
            if (value == 7) return CONSTANTS._colors[8]; // 81-90 Dark Red
            if (value == 8) return CONSTANTS._colors[9]; // 91-100 Pink
            if (value == 9) return CONSTANTS._colors[10]; // 101-110 Dark Pink
            if (value == 10) return CONSTANTS._colors[11]; // 111-120 Violet
            if (value >= 11 && value <= 14) return CONSTANTS._colors[12]; // 121-150 Dark Blue
            if (value > 14) return CONSTANTS._colors[13]; // 151+ Black
        };

        Object.entries(petAttributes).forEach(([attribute, value], index) => {
            if (["name", "types", "level", "comboRate", "dodge", "maxAccuracy", "speed"].includes(attribute)) return;

            this.barContainer2 = this.add.container(this.centerX - 160, 350 + index * (barHeight + 5));

            if (attribute !== "life") {
                // Calculate the quotient and fractional part for the segments
                const quotient = value / 10;
                const integerPart = Math.floor(quotient);
                const fractionalPart = Math.round((quotient - integerPart) * 10);
                const remainingCount = 10 - fractionalPart;
                const integerPartColor = integerPart == 0 && remainingCount == 0 ? CONSTANTS._colors[0] : getColor(integerPart);
                let remainingColor = integerPart == 0 && remainingCount == 0 ? CONSTANTS._colors[0] : CONSTANTS._colors[CONSTANTS._colors.indexOf(integerPartColor) - 1];

                if (value >= 151) {
                    remainingColor = CONSTANTS._colors[13];
                }

                let setOfColor = [];

                // Add filled segments with integer color
                for (let i = 0; i < fractionalPart; i++) {
                    setOfColor.push(integerPartColor);
                }

                // Add unfilled segments with remaining color
                for (let i = 0; i < remainingCount; i++) {
                    setOfColor.push(remainingColor);
                }

                // Create segments for the bar
                for (let i = 0; i < maxSegments; i++) {
                    const color = setOfColor[i]; // Use the pre-determined colors
                    const borderThickness = 1; // Thickness of the border
                    const borderColor = setOfColor[i] == CONSTANTS._colors[13] ? 0xffffff : 0x000000;
                    // Create the outer rectangle (border)
                    const outerSegment = this.add.rectangle(
                        i * segmentWidth, // Position segments horizontally with spacing
                        0, // Align vertically
                        segmentWidth, // Outer rectangle includes the border
                        barHeight, // Outer rectangle includes the border
                        borderColor // Border color (black)
                    );
                    outerSegment.setOrigin(0); // Align to the top-left
                    this.barContainer2.add(outerSegment);

                    // Create the inner rectangle (fill)
                    const innerSegment = this.add.rectangle(
                        i * segmentWidth + borderThickness, // Adjust for border thickness
                        borderThickness, // Adjust for border thickness
                        segmentWidth - 2, // Adjust for border thickness
                        barHeight - 2, // Adjust for border thickness
                        Phaser.Display.Color.HexStringToColor(color || "#ffffff").color // Set color based on filled/unfilled segments
                    );
                    innerSegment.setOrigin(0); // Align to the top-left
                    this.barContainer2.add(innerSegment);
                }
            }
            let iconFrame = 0;
            switch (attribute) {
                case "life":
                    iconFrame = 25;
                    break;
                case "damage":
                    iconFrame = 26;
                    break;
                case "agile":
                    iconFrame = 28;
                    break;
                case "speed":
                    iconFrame = 27;
                    break;
                case "armor":
                    iconFrame = 34;
                    break;
                case "accuracy":
                    iconFrame = 35;
                    break;
                default:
                    break;
            }

            const charShadow = this.add.sprite(-15, 8, "buttons").setFrame(iconFrame).setScale(0.4);
            this.barContainer2.add(charShadow);

            // Add a label for the attribute
            // const attributeText = attribute.charAt(0).toUpperCase() + attribute.slice(1);
            // const label = this.add.text(-51, 0, attributeText, {
            //     fontSize: "14px",
            //     color: "#ffffff"
            // });
            // this.barContainer2.add(label);
            const valueTxt = attribute == "accuracy" ? value + "/" + petAttributes.maxAccuracy + "%" : value;
            const txtLocation = attribute == "life" ? 0 : 85;
            const valueLabel = this.add.text(txtLocation, 0, valueTxt, {
                fontSize: "14px",
                color: "#ffffff"
            });
            this.barContainer2.add(valueLabel);
        });

        const valueLabel = this.add.text(0, 20, "LVL.".concat(petAttributes.level), {
            fontSize: "20px",
            color: "#ffffff",
            fill: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000', // Border color
            strokeThickness: 3 // Border thickness
        });
        this.barContainer2.add(valueLabel);
    }

    createName() {
        this.calculateLevelExp(this.currentCharDetails.level);
        // Clear the container first
        this.charNameContainer.removeAll(true);

        // Add the "Enter Name" text below the "Create Character" title
        let nameText = this.add.text(215, 100, this.currentCharDetails.name || "N/A", {
            fontSize: '20px',
            fill: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000', // Border color
            strokeThickness: 3 // Border thickness
        });
        this.charNameContainer.add(nameText);

        if (this.currentCharDetails.utilities.pets.length > 0) {
            let nameTextPet = this.add.text(145, 400, this.currentCharDetails.utilities.pets[0].name || "N/A", {
                fontSize: '20px',
                fill: '#ffffff',
                fontStyle: 'bold',
                stroke: '#000000', // Border color
                strokeThickness: 3 // Border thickness
            });
            this.charNameContainer.add(nameTextPet);
        }

        const winRate = Math.floor(((this.currentCharDetails.kdStats.win / (this.currentCharDetails.kdStats.win + this.currentCharDetails.kdStats.lose)) * 100) || 0);
        const kdDisplay = "Winrate: " + winRate + "%";
        let kdrStat = this.add.text(130, 60, this.currentCharDetails.kdStats.win + "W/" + this.currentCharDetails.kdStats.lose + "L  " + kdDisplay, {
            fontSize: '16px',
            fill: '#ccada1',
            fontStyle: 'bold',
            stroke: '#000000', // Border color
            strokeThickness: 3 // Border thickness
        });
        this.charNameContainer.add(kdrStat);

        // to do - change to logout sprite
        const logoutTxt = this.add.sprite(this.scale.width - 110, 0, "logoutTxt").setFrame(0).setOrigin(0, 0);
        logoutTxt.setInteractive();
        this.charNameContainer.add(logoutTxt);

        logoutTxt.on("pointerdown", () => {
            let isLogout = this.currentCharDetails.psd ? true : false;
            if (!this.currentCharDetails.psd) {
                isLogout = confirm("Progress won't be save! Do you like to proceed?");
            }

            if (isLogout) {
                localStorage.removeItem(CONSTANTS._charUserKey);
                localStorage.removeItem(CONSTANTS._charDetailsKey);
                localStorage.removeItem("fightLogs");
                localStorage.setItem(CONSTANTS._logout, 'true');
                location.reload();
            }
        });

        if (!this.currentCharDetails.psd) {
            let noPassword = this.add.text(30, 10, "Please set account password to save your progress!", {
                fontSize: '20px',
                fill: '#ff0000',
                fontStyle: 'bold',
                stroke: '#ffffff', // Border color
                strokeThickness: 2 // Border thickness
            });
            noPassword.setInteractive();
            this.charNameContainer.add(noPassword);

            // Create the input element and style it
            const passwordInput = document.createElement('input');
            passwordInput.type = 'password';
            passwordInput.id = 'passwordInput';
            passwordInput.placeholder = 'Enter Password';
            passwordInput.style.position = 'absolute';
            passwordInput.style.left = '55%';
            passwordInput.style.top = '40%';
            passwordInput.style.transform = 'translate(-50%, -50%)';
            passwordInput.style.display = 'none'; // Hide it initially
            document.body.appendChild(passwordInput);

            const buttonContainer = document.createElement('div');
            buttonContainer.id = 'buttonContainer';
            buttonContainer.style.position = 'absolute';
            buttonContainer.style.left = '55%';
            buttonContainer.style.top = '45%';
            buttonContainer.style.transform = 'translate(-50%, -50%)';
            buttonContainer.style.display = 'none'; // Hide it initially
            document.body.appendChild(buttonContainer);

            const confirmButton = document.createElement('button');
            confirmButton.id = 'confirmButton';
            confirmButton.innerText = 'Confirm';
            buttonContainer.appendChild(confirmButton);

            const cancelButton = document.createElement('button');
            cancelButton.id = 'cancelButton';
            cancelButton.innerText = 'Cancel';
            buttonContainer.appendChild(cancelButton);

            // Show the input and buttons on pointerdown
            noPassword.on('pointerdown', () => {
                this.createToast(generateRandomKeys(), "🛠️ Under Maintenance", false);
                // passwordInput.style.display = 'block';
                // buttonContainer.style.display = 'block';
                // passwordInput.focus();
            });

            // Handle the confirm button click
            confirmButton.addEventListener('click', () => {
                const userInput = passwordInput.value;

                if (userInput.trim() !== '') {
                    // Your code to handle the confirmed input
                    // console.log('User confirmed input:', userInput);
                    // Hide the input and buttons
                    passwordInput.style.display = 'none';
                    buttonContainer.style.display = 'none';
                    // Clear the input value
                    passwordInput.value = '';
                    this.currentCharDetails.psd = encryptedData(userInput, userInput);
                    setLoading(true);
                    createUser(this.currentCharDetails).then((data) => {
                        if (data) {
                            saveToLocalStorage(CONSTANTS._charDetailsKey, this.currentCharDetails); // character data
                            this.createToast(generateRandomKeys(), CONSTANTS._successMessages.savedPassword, true);
                        } else {
                            throw { code: 500, message: "Saving data failed!" };
                        }
                    })
                        .catch(error => {
                            this.currentCharDetails.psd = null;
                            this.createToast(generateRandomKeys(), error.message || JSON.stringify(error), false);
                        }).finally(() => {
                            setLoading(false);
                        });

                    this.renderCreateCharacter();
                } else {
                    alert('No input provided. Action canceled.');
                }
            });

            // Handle the cancel button click
            cancelButton.addEventListener('click', () => {
                // Hide the input and buttons
                passwordInput.style.display = 'none';
                buttonContainer.style.display = 'none';
                // Clear the input value
                passwordInput.value = '';
            });
        }
    }

    createToolTip(toHover, content, utilKeys) {

        let position = {
            x: CONSTANTS._gameWidth,
            y: CONSTANTS._gameHeight
        };

        switch (utilKeys) {
            case "skills":
                position.x += -15, // left
                    position.y -= 300 // top
                break;
            case "weapons":
                break;
            case "pets":
                break;
            default:
                position.x -= 80, // left
                    position.y -= 220 // top
                break;
        }

        toHover.setInteractive();

        toHover.on("pointerover", () => {
            document.getElementById("phaser-tooltip")?.remove();

            const modal = document.createElement("div");
            modal.id = "phaser-tooltip";
            modal.innerHTML = `
            <div class="position-absolute bg-dark text-white border rounded p-3" 
                 style="left: ${position.x}px; top: ${position.y}px; z-index: 1000; 
                        max-width: 350px; padding: 15px; border-radius: 8px; 
                        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2); 
                        font-size: 18px; font-weight: bold; border: 2px solid #ffffff;">
                ${content}
            </div>
        `;

            document.body.appendChild(modal);
        });

        toHover.on("pointerout", () => document.getElementById("phaser-tooltip")?.remove());
    }

    validateLoggedIn(username) {
        const userLoggedKey = decryptData(CONSTANTS._charUserKey);
        const compareResult = userLoggedKey == username;

        if (!compareResult) {
            localStorage.removeItem("recentLogin");
            localStorage.removeItem(CONSTANTS._charUserKey);
            localStorage.removeItem(CONSTANTS._charDetailsKey);
            this.scene.start('playGame');
        }

        return true;
    }

    renderUtils(container, charDetails) {

        // render weapon shadows
        const weaponPosition = CONSTANTS._weaponPosition;
        for (let i = 1; i <= CONSTANTS._weapons.length; i++) {
            const charWeapon = "weapon_".concat(i);
            const charWeaponSprite = this.add.sprite(charDetails.x + weaponPosition.x, charDetails.y + weaponPosition.y, charWeapon).setFrame(0);

            container.add(charWeaponSprite);
        }

        // render pets shadows
        // for (let i = 1; i <= CONSTANTS._pets.length; i++) {
        //     const charPet = "pet_".concat(i);
        //     const charPetSprite = this.add.sprite(charDetails.x + 31.5, charDetails.y + 290, charPet).setFrame(0);

        //     container.add(charPetSprite);
        // }

        // render skills OPEN
        const columns = 11; // Number of sprites per row
        const spriteSize = 32; // Size of each sprite
        let maxSpritesOpen = 55;
        let maxSprites = 55;

        for (let i = 0; i < 55; i++) {
            let position = {
                x: 432 + (i % columns) * spriteSize,
                y: 401 + Math.floor(i / columns) * spriteSize
            };

            // Assign unique key using bgSkills_Open_i
            const uniqueKey = `bgSkills_Open_${maxSpritesOpen}`;
            const openSkill_sprite = this.add.image(position.x, position.y, 'bgSkills_Open', i);
            openSkill_sprite.setName(uniqueKey); // Set unique name for reference

            const skillDescription = CONSTANTS._skills.find(skill => skill.number == maxSpritesOpen);
            if (skillDescription) {
                const skillContent = `<span class="text-warning">${skillDescription.name}</span>: ${skillDescription.description}`;
                this.createToolTip(openSkill_sprite, skillContent, "skills");
            }

            this.characterContainer.add(openSkill_sprite);
            maxSpritesOpen--;
        }

        // render skills shadows
        for (let i = 0; i < 55; i++) {
            let position = {
                x: 432 + (i % columns) * spriteSize,
                y: 401 + Math.floor(i / columns) * spriteSize
            };

            // Assign unique key using bgSkills_Close_i
            const uniqueKey = `bgSkills_Close_${maxSprites}`;
            const closeSkill_sprite = this.add.image(position.x, position.y, 'bgSkills_Close', i);
            closeSkill_sprite.setName(uniqueKey); // Set unique name for reference

            const skillDescription = CONSTANTS._skills.find(skill => skill.number == maxSprites);
            if (skillDescription) {
                const skillContent = `<span class="text-warning">${skillDescription.name}</span>: ${skillDescription.description}`;
                this.createToolTip(closeSkill_sprite, skillContent, "skills");
            }

            this.characterContainer.add(closeSkill_sprite);
            maxSprites--;
        }

        // render weapons
        const weapons = CONSTANTS._weapons;
        const charWeapons = this.currentCharDetails.utilities.weapons;
        const filterWeapons = weapons.filter(weapon => charWeapons.includes(weapon.number));
        filterWeapons.forEach(weapon => {
            container.iterate((sprite) => {
                if (sprite.texture.key == "weapon_".concat(weapon.number)) {
                    sprite.destroy();
                }
            });
        });

        // render skills
        const skills = CONSTANTS._skills;
        const charSkills = this.currentCharDetails.utilities.skills;
        const filterSkills = skills.filter(skill => charSkills.includes(skill.number));

        filterSkills.forEach(filteredSkill => {
            let filterSame = skills.filter(skill => skill.number == filteredSkill.number);
            if (filterSame.length > 0) {
                container.iterate((sprite) => {
                    if (sprite.name == "bgSkills_Close_".concat(filterSame[0].number)) {
                        sprite.destroy();
                    }
                });
            }
        });

        // render pets
        const charPets = this.currentCharDetails.utilities.pets;
        if (charPets.length > 0) {
            const petFrames = validatePetFrame(this.currentCharDetails.utilities.pets[0]);
            const positionX = charPets[0].name == "Bear" ? 170 : 160;
            const positionY = charPets[0].name == "Bear" ? 420 : 420;
            const charPetSprite = this.add.sprite(positionX, positionY, "allPets")
                .setFrame(petFrames[0])
                .setScale(2);
            container.add(charPetSprite);

            this.createBarStatus2(this.currentCharDetails.utilities.pets[0]);
        }
    }

    //#region Level Up
    /**
     * Calculates character level-up and assigns new utilities.
     * @returns {void}
     */
    calculateLevelUp() {

        if (!this.currentCharDetails.attributes) { // set to default attributes
            this.currentCharDetails.attributes = {
                life: 30,
                damage: 2,
                agile: 2,
                speed: 2,
                armor: 0
            };
        }

        if (this.currentCharDetails.level.points > 0) {
            let gainedUtils = [];
            for (let i = 1; i <= this.currentCharDetails.level.points; i++) {

                let utilResults = "";
                let randomUtils = {};
                let utils = "";

                const toRender = [];
                const isWithLevel = this.currentCharDetails.level.current > 1;
                const skillChance = isWithLevel ? 30 : 45;
                const weaponChance = isWithLevel ? 35 : 45;
                const petChance = isWithLevel ? 20 : 10;
                const avail_stats = { "name": "stats", "chance": 15 };
                const zero_avail_Skills = this.availableUtils.skills.length == 0 ? {} : { "name": "skills", "chance": skillChance };
                const zero_avail_Weapons = this.availableUtils.weapons.length == 0 ? {} : { "name": "weapons", "chance": weaponChance };
                const zero_avail_Pets = this.availableUtils.pets.length == 0 ? {} : { "name": "pets", "chance": petChance };

                // checker for empty utilities
                if (isWithLevel) {
                    toRender.push(avail_stats);
                }

                // checker for animal lover skill that can support multiple pets

                if (this.availableUtils.skills.length > 0) toRender.push(zero_avail_Skills);
                if (this.availableUtils.weapons.length > 0) toRender.push(zero_avail_Weapons);
                if (this.availableUtils.pets.length > 0) {
                    if (this.currentCharDetails.utilities.pets.length >= 0) {
                        toRender.push(zero_avail_Pets);
                    }
                    else {
                        // do nothing -> dont add pets
                    }
                }

                randomUtils = getRandom_UtilsItem(toRender);
                randomUtils.name = "pets" // for manual testing overwrite
                let actionToDO = "";

                switch (randomUtils.name) {
                    case "skills":
                        const getRandomItemResult = getRandomItem(this.availableUtils.skills, this.currentCharDetails);
                        this.currentCharDetails = getRandomItemResult.characterDetails;
                        utils = getRandomItemResult.item;
                        break;
                    case "weapons":
                        const getRandomWeaponsResult = getRandomWeapons(this.availableUtils.weapons, this.currentCharDetails);
                        this.currentCharDetails = getRandomWeaponsResult.characterDetails;
                        utils = getRandomWeaponsResult.item;
                        break;
                    case "pets":
                        const getRandomPetsResult = getRandomPets(this.availableUtils.pets, this.currentCharDetails);
                        this.currentCharDetails = getRandomPetsResult.characterDetails;
                        const resultPet = getRandomPetsResult.item;
                        utils = resultPet[0];
                        actionToDO = resultPet[1];
                        break;
                    case "stats":
                        const armors = [51, 46, 44, 38, 17, 9];
                        let witharmor = false;

                        for (let armor of armors) {
                            if (this.currentCharDetails.utilities.skills.includes(armor)) {
                                witharmor = true;
                                break;
                            }
                        }

                        const randomStatsNumber = witharmor ? randomizer(4) : randomizer(3);
                        let keyName = "";
                        switch (randomStatsNumber) {
                            case 0: // life
                                this.currentCharDetails.attributes.life += 8;
                                const additionalLife = !!this.currentCharDetails.utilities.skills.find(skill => skill == 52);
                                const additionalLifeImmortality = !!this.currentCharDetails.utilities.skills.find(skill => skill == 51);
                                if (additionalLifeImmortality) this.currentCharDetails.attributes.life += 20;
                                if (additionalLife) this.currentCharDetails.attributes.life += 5;
                                keyName = "Life";
                                break;
                            case 1: // damage
                                this.currentCharDetails.attributes.damage += 2;
                                const additionalDamage = !!this.currentCharDetails.utilities.skills.find(skill => skill == 55);
                                const additionalDamage_GOD = !!this.currentCharDetails.utilities.skills.find(skill => skill == 10);
                                if (additionalDamage_GOD) this.currentCharDetails.attributes.damage += 2;
                                if (additionalDamage) this.currentCharDetails.attributes.damage++;
                                keyName = "Damage";
                                break;
                            case 2: // agile
                                this.currentCharDetails.attributes.agile += 2;
                                const additionalAgile = !!this.currentCharDetails.utilities.skills.find(skill => skill == 54);
                                const additionalAgile_GOD = !!this.currentCharDetails.utilities.skills.find(skill => skill == 8);
                                if (additionalAgile_GOD) this.currentCharDetails.attributes.agile += 2;
                                if (additionalAgile) this.currentCharDetails.attributes.agile++;
                                keyName = "Agile";
                                break;
                            case 3: // speed
                                this.currentCharDetails.attributes.speed += 2;
                                const additionalSpeed = !!this.currentCharDetails.utilities.skills.find(skill => skill == 53);
                                const additionalSpeed_GOD = !!this.currentCharDetails.utilities.skills.find(skill => skill == 29);
                                if (additionalSpeed_GOD) this.currentCharDetails.attributes.speed += 2;
                                if (additionalSpeed) this.currentCharDetails.attributes.speed++;
                                keyName = "Speed";
                                break;
                            case 4: // armor
                                const armorPlus = witharmor ? 2 : 1;
                                this.currentCharDetails.attributes.armor += armorPlus;
                                keyName = "Armor";
                                break;
                            default:
                                console.log("No stats found.");
                                break;
                        }
                        utils = { key: "stats", name: keyName }
                        break;
                    default:
                        console.log(CONSTANTS._errorMessages.noUtilitiesFound);
                }

                utilResults = utils ? { key: randomUtils.name, value: utils, action: actionToDO } : { key: "", value: "" };

                this.currentCharDetails.level.current++;

                this.availableUtils = validateAvailableUtils(this.currentCharDetails, this.availableUtils);

                const validateNewUtilsResult = validateNewUtils(utilResults, this.currentCharDetails);
                this.currentCharDetails = validateNewUtilsResult.characterDetails;
                const addedStatsResult = validateNewUtilsResult.addedStats;

                const userPet = this.currentCharDetails.utilities.pets;
                let additionalStatsTxt = "";
                gainedUtils.push({
                    acquired: utilResults.value.name,
                    charLevel: this.currentCharDetails.level.current,
                    addedStats: addedStatsResult,
                    charAttributes: { ...this.currentCharDetails.attributes }
                });
            }
            const dateAcquired = new Date().toLocaleDateString('en-US');
            // level, acquired, Bonus, Life, Damage, Agile, Speed, Armor, date
            const message = gainedUtils.map((util) => {
                return {
                    acquired: util.acquired,
                    charLevel: util.charLevel || "",
                    addedStats: util.addedStats,
                    charAttributes: util.charAttributes,
                    dateAcquired: dateAcquired
                }
            });

            this.currentCharDetails.logs.utility.push(message);
            this.createModalTable('LevelUp', message);

            this.currentCharDetails.level.points = 0;
            saveToLocalStorage(CONSTANTS._charUserKey, this.currentCharDetails.name); // character user key
            saveToLocalStorage(CONSTANTS._charDetailsKey, this.currentCharDetails); // character data
        }
    }

    /**
     * Create reusable modal with table component to display message
     * @param {string} key - use as button id
     * @param {string} message - modal message, must contain table row and data elements
     * @returns {void}
     */
    createModalTable(key, message) {

        const tableMessage = message.map((util) => {

            const stats = util.addedStats.character.stats;

            let bonusLifeStyle = stats == "Life" || util.acquired == "Life" ? CONSTANTS._styling.bonus : "";
            let bonusDamageStyle = stats == "Damage" || util.acquired == "Damage" ? CONSTANTS._styling.bonus : "";
            let bonusAgileStyle = stats == "Agile" || util.acquired == "Agile" ? CONSTANTS._styling.bonus : "";
            let bonusSpeedStyle = stats == "Speed" || util.acquired == "Speed" ? CONSTANTS._styling.bonus : "";
            let bonusArmorStyle = stats == "Armor" || util.acquired == "Armor" ? CONSTANTS._styling.bonus : "";
            
            return `
                <tr>
                    <td>${util.charLevel || ""}</td>
                    <td>${util.acquired}</td>
                    <td>${stats || ""}</td>
                    <td class='${bonusLifeStyle}'>${Number(util.charAttributes.life)}</td>
                    <td class='${bonusDamageStyle}'>${Number(util.charAttributes.damage)}</td>
                    <td class='${bonusAgileStyle}'>${Number(util.charAttributes.agile)}</td>
                    <td class='${bonusSpeedStyle}'>${Number(util.charAttributes.speed)}</td>
                    <td class='${bonusArmorStyle}'>${Number(util.charAttributes.armor)}</td>
                    <td>${util.dateAcquired || ""}</td>
                </tr>
            `;
        });
        const reversedTable = tableMessage.reverse().join("");
        const modal = document.createElement("div");
        // level, acquired, Bonus, Life, Damage, Agile, Speed, Armor, date
        modal.innerHTML = `
            <div class="modal fade show d-block" tabindex="-1" role="dialog">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-header bg-success">
                            <h5 class="modal-title text-light">Level Up!</h5>
                        </div>
                        <div class="modal-body" style="height: 200px; overflow-y: auto;">
                            <div class="table-responsive">
                                <table class="table table-sm table-bordered text-center" style="font-size: 0.8rem;">
                                    <tbody>
                                        <tr>
                                            <th>LvL</th>
                                            <th>Acquired</th>
                                            <th>Bonus</th>
                                            <th>Life</th>
                                            <th>Damage</th>
                                            <th>Agile</th>
                                            <th>Speed</th>
                                            <th>Armor</th>
                                            <th>Date</th>
                                        </tr>
                                        ${tableMessage}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button id="${key}closeModalBtn" class="btn btn-primary">OK</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal on button click
        document.getElementById(`${key}closeModalBtn`).addEventListener("click", function () {
            modal.remove();
        });
    }

    /**
     * Create reusable toast component to display message
     * @param {string} key - use as button id
     * @param {string} message - toast message
     * @param {boolean} isSuccess - flag for success or failed Message styling and display
     * @returns {void}
     */
    createToast(key, message, isSuccess) {
        const createSceneInstance = this;
        const color = isSuccess ? "success" : "danger";
        const header = isSuccess ? "Success" : "Failed";

        // Create toast container if not exists
        let toastContainer = document.getElementById("toast-container");
        if (!toastContainer) {
            toastContainer = document.createElement("div");
            toastContainer.id = "toast-container";
            toastContainer.className = "toast-container position-fixed top-0 end-0 p-3";
            document.body.appendChild(toastContainer);
        }

        // Generate a unique key for each toast
        const toastId = `toast-${Date.now()}`;

        // Create toast element
        const toast = document.createElement("div");
        toast.className = `toast align-items-center text-bg-${color} border-0 show mb-2`; // `mb-2` for spacing
        toast.setAttribute("role", "alert");
        toast.setAttribute("aria-live", "assertive");
        toast.setAttribute("aria-atomic", "true");
        toast.id = toastId; // Assign unique ID

        toast.innerHTML = `
            <div class="toast-header">
                <strong class="me-auto">${header}</strong>
                <small class="text-dark">Just now</small>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        `;

        toastContainer.appendChild(toast);

        // Initialize Bootstrap toast
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();

        // Close toast on button click
        toast.querySelector(".btn-close").addEventListener("click", function () {
            createSceneInstance.flags.isSaving = false;
            bsToast.hide();
            setTimeout(() => toast.remove(), 500);
        });

        // Auto-hide the toast after 3 seconds
        setTimeout(() => {
            createSceneInstance.flags.isSaving = false;
            bsToast.hide();
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }

    createModalTable2(title, message, key) {

        let reversedTable = message;
        let arrayOfUtils = reversedTable.flat();
        const tableMessage = arrayOfUtils.map((util) => {

            const bonusLifeStyle = util.addedStats.character.stats == "Life" || util.acquired == "Life" ? CONSTANTS._styling.bonus : "";
            const bonusDamageStyle = util.addedStats.character.stats == "Damage" || util.acquired == "Damage" ? CONSTANTS._styling.bonus : "";
            const bonusAgileStyle = util.addedStats.character.stats == "Agile" || util.acquired == "Agile" ? CONSTANTS._styling.bonus : "";
            const bonusSpeedStyle = util.addedStats.character.stats == "Speed" || util.acquired == "Speed" ? CONSTANTS._styling.bonus : "";
            const bonusArmorStyle = util.addedStats.character.stats == "Armor" || util.acquired == "Armor" ? CONSTANTS._styling.bonus : "";

            return (`
                <tr>
                    <td>${util.charLevel || ""}</td>
                    <td>${util.acquired || util.addedStats.maxUtils || ""}</td>
                    <td>${util.addedStats.character.stats || ""}</td>
                    <td class='${bonusLifeStyle}'>${Number(util.charAttributes.life)}</td>
                    <td class='${bonusDamageStyle}'>${Number(util.charAttributes.damage)}</td>
                    <td class='${bonusAgileStyle}'>${Number(util.charAttributes.agile)}</td>
                    <td class='${bonusSpeedStyle}'>${Number(util.charAttributes.speed)}</td>
                    <td class='${bonusArmorStyle}'>${Number(util.charAttributes.armor)}</td>
                    <td>${util.dateAcquired || ""}</td>
                </tr>`
            );
        });
        reversedTable = tableMessage.reverse().join("");

        const modal = document.createElement("div");

        modal.innerHTML = `
            <div class="modal fade show d-block" tabindex="-1" role="dialog">
                <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-header bg-success">
                            <h5 class="modal-title text-light">${title}</h5>
                        </div>
                        <div class="modal-body" style="height: 500px; overflow-y: auto;">
                            <div class="table-responsive">
                                <table class="table table-sm table-bordered text-center" style="font-size: 0.8rem;">
                                    <tr>
                                        <th>LvL</th>
                                        <th>Acquired</th>
                                        <th>Bonus</th>
                                        <th>Life</th>
                                        <th>Damage</th>
                                        <th>Agile</th>
                                        <th>Speed</th>
                                        <th>Armor</th>
                                        <th>Date</th>
                                    </tr>
                                    <tr>
                                        ${reversedTable}
                                    </tr>
                                </table>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button id="${key}closeModalBtn" class="btn btn-secondary">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal on button click
        document.getElementById(`${key}closeModalBtn`).addEventListener("click", function () {
            modal.remove();
        });
    }

    createModalTable3(title, message, key) {
        let finalMessage = message;
        if (Array.isArray(message)) {
            message = message.reverse();
            finalMessage = message.join('');
        }

        const modal = document.createElement("div");
        modal.innerHTML = `
            <div class="modal fade show d-block" tabindex="-1" role="dialog">
                <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-header bg-success">
                            <h5 class="modal-title text-light">${title}</h5>
                        </div>
                        <div class="modal-body" style="height: 500px; overflow-y: auto;">
                            ${finalMessage}
                        </div>
                        <div class="modal-footer">
                            <button id="${key}closeModalBtn" class="btn btn-secondary">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal on button click
        document.getElementById(`${key}closeModalBtn`).addEventListener("click", function () {
            modal.remove();
        });
    }

    calculateLevelExp(level) {
        this.maxExp = getMaxExpForLevel(level.current);
        if (level.experience >= this.maxExp && level.current != 0) {
            this.currentCharDetails.level.points += 1;
            this.currentCharDetails.level.experience = 0;
        }
    }

    //#region HTML Formatters

    htmlFormat(title, bodyMessage, winner) {
        const design = winner == "player" ? "bg-success" : "bg-danger";
        const accordionId = `accordion-${bodyMessage.id}`;
        const bodyMessageID = bodyMessage.id;

        const designPlayerDodgeCount = Number(bodyMessage.player.dodgeCount) > Number(bodyMessage.opponent.dodgeCount) ? "text-success fw-bold" : "text-danger  fw-bold";
        const designOpponentDodgeCount = Number(bodyMessage.player.dodgeCount) < Number(bodyMessage.opponent.dodgeCount) ? "text-success fw-bold" : "text-danger  fw-bold";

        const designPlayerBlockCount = Number(bodyMessage.player.blockCount) > Number(bodyMessage.opponent.blockCount) ? "text-success fw-bold" : "text-danger  fw-bold";
        const designOpponentBlockCount = Number(bodyMessage.player.blockCount) < Number(bodyMessage.opponent.blockCount) ? "text-success fw-bold" : "text-danger  fw-bold";

        const designPlayerLife = Number(bodyMessage.player.lifeRemaining) > Number(bodyMessage.opponent.lifeRemaining) ? "text-success fw-bold" : "text-danger fw-bold";
        const designOpponentLife = Number(bodyMessage.opponent.lifeRemaining) > Number(bodyMessage.player.lifeRemaining) ? "text-success fw-bold" : "text-danger fw-bold";
        // Get the key/value from the object (since you said only one entry per objec

        return `
            <div class="text-white rounded">
                <div class="accordion" id="${accordionId}">
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="heading-${bodyMessageID}">
                            <button class="accordion-button collapsed text-white ${design}" type="button"
                                    data-bs-toggle="collapse" 
                                    data-bs-target="#collapse-${bodyMessageID}" 
                                    aria-expanded="false" 
                                    aria-controls="collapse-${bodyMessageID}">
                                ${title}
                            </button>
                        </h2>
                        <div id="collapse-${bodyMessageID}" 
                            class="accordion-collapse collapse" 
                            aria-labelledby="heading-${bodyMessageID}" 
                            data-bs-parent="#${accordionId}">
                            <div class="accordion-body">
                                <table class="table table-sm table-bordered table-striped">
                                    <thead class="table-dark">
                                        <tr>
                                            <th>Attribute</th>
                                            <th>Player</th>
                                            <th>Opponent</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Name</td>
                                            <td>${bodyMessage.player.name}</td>
                                            <td>${bodyMessage.opponent.name}</td>
                                        </tr>
                                        <tr>
                                            <td>Life Remaining</td>
                                            <td>${bodyMessage.player.lifeRemaining}</td>
                                            <td>${bodyMessage.opponent.lifeRemaining}</td>
                                        </tr>
                                        <tr>
                                            <td>Dodge Count</td>
                                            <td class="${designPlayerDodgeCount}">${bodyMessage.player.dodgeCount}</td>
                                            <td class="${designOpponentDodgeCount}">${bodyMessage.opponent.dodgeCount}</td>
                                        </tr>
                                        <tr>
                                            <td>Block Count</td>
                                            <td class="${designPlayerBlockCount}">${bodyMessage.player.blockCount}</td>
                                            <td class="${designOpponentBlockCount}">${bodyMessage.opponent.blockCount}</td>
                                        </tr>
                                        <tr>
                                            <td>Last Action</td>
                                            <td colspan="2">${bodyMessage.lastAction}</td>
                                        </tr>
                                        <tr>
                                            <td colspan="3">
                                                <button class="btn btn-sm btn-secondary w-100" disabled>View fight is under maintenance</button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    //#endregion HTML Formatters
}


