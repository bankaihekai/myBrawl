class PlayerFight extends Phaser.Scene {
    constructor() {
        super({ key: "playerFight" });

        this.isLock = false; // flag to lock unlock creating character
        this.flags = {
            isLock: false, // flag to lock unlock creating character
            isSaving: false // flag to lock naming while entering password
        }
        this.script = [];
        this.thrownWeapons = [5, 6, 20, 28];
        this.heavyWeapons = [1, 2, 4, 7, 12, 14, 15, 19, 21, 22, 25];
        this.sharpWeapons = [8, 10, 16, 17, 18, 23, 26, 27, 30, 32];
        this.maxSpeed = 1000; // Threshold for cyclic comparison

        // for skill basher 6
        this.isStun = {
            player: false,
            opponent: false
        }
        this.canCounter = {
            player: false,
            opponent: false
        }
    }

    create() {

        const loadIsLogin = this.loadCharacter("recentLogin");
        if (loadIsLogin) {
            this.createToast(this.generateRandomKeys(), CONSTANTS._successMessages.loginSuccess, true);
            localStorage.removeItem("recentLogin");
        };

        const loadedCharacter = this.loadCharacter(CONSTANTS._charDetailsKey);
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
        // this.validateAvailableUtils();

        this.loadedOpponent = this.loadCharacter(CONSTANTS._opponent);
        if (!this.loadedOpponent) {
            this.scene.start('playGame');
        }

        // ----------------------------------------
        // // TEST CODE
        // // ---------------------------------------
        // player
        this.currentCharDetails.utilities.skills.push(6);
        this.currentCharDetails.utilities.weapons.push(19);
        // opponent
        this.loadedOpponent.utilities.skills.push(6);
        this.loadedOpponent.utilities.weapons.push(19);
        // this.loadedOpponent.attributes.damage = 50;
        console.log({ loadedOpponent: this.loadedOpponent });
        console.log({ loadedCharacter: this.currentCharDetails });

        // ----------------------------------------
        // TEST CODE
        // ---------------------------------------

        this.centerX = this.sys.game.config.width / 2;
        this.centerY = this.sys.game.config.height / 2;

        this.mainContainer = this.add.container(0, 0);
        this.mainContainer.setSize(CONSTANTS._gameWidth, CONSTANTS._gameHeight);

        const rand_bg = this.randomizer(14);
        this.background = this.add.image(0, 0, "bg-".concat(rand_bg)).setOrigin(0);
        this.background.displayWidth = CONSTANTS._gameWidth;
        this.background.displayHeight = CONSTANTS._gameHeight;
        this.mainContainer.add(this.background);

        this.characterContainer = this.add.container(0, 0);
        this.characterContainer.setSize(CONSTANTS._gameWidth, CONSTANTS._gameHeight);

        this.charNameContainer = this.add.container(0, 0);
        this.charNameContainer.setSize(CONSTANTS._gameWidth, CONSTANTS._gameHeight);

        this.charLifeBarContainer = this.add.container(0, 0);
        this.charLifeBarContainer.setSize(CONSTANTS._gameWidth, CONSTANTS._gameHeight);

        this.life = {
            max: {
                player: this.currentCharDetails.attributes.life,
                opponent: this.loadedOpponent.attributes.life
            },
            current: {
                player: this.currentCharDetails.attributes.life,
                opponent: this.loadedOpponent.attributes.life,
                playerWidth: 350,
                opponentWidth: 350,
            }
        }

        this.playerUtils = {
            skills: this.currentCharDetails.utilities.skills || [],
            weapons: this.currentCharDetails.utilities.weapons || [],
            pets: this.currentCharDetails.utilities.pets || [],
            activeWeapon: null,
            activeSkill: null
        }

        this.opponentUtils = {
            skills: this.loadedOpponent.utilities.skills || [],
            weapons: this.loadedOpponent.utilities.weapons || [],
            pets: this.loadedOpponent.utilities.pets || [],
            activeWeapon: null,
            activeSkill: null
        }

        this.createName();
        this.attackAndUpdate(); // initialize render life bar
        // this.renderCreateCharacter();
        // this.renderButtons();
    }

    renderCreateCharacter() {
        // Clear the preview container
        this.characterContainer.removeAll(true);

        // let rand_chars = this.renderRandomCharacter(10);
        // console.log({ rand_chars: rand_chars });

        // this.calculateLevelUp();
        // this.renderButtons();
        // let startX = 110;
        // let gap = 100;
        // let rowLimit = 7;
        // let nextRow_X = startX;

        // for (let i = 0; i < rand_chars.length; i++) {
        //     const randCharDetails = rand_chars[i];

        //     // Check if we need to reset for the next row
        //     if (i % rowLimit === 0 && i !== 0) {
        //         nextRow_X = startX; // Reset x position for new row
        //     }

        //     const xSpacing = nextRow_X;
        //     const ySpacing = 220;
        //     const useSpacing_y = i < rowLimit
        //         ? (this.characterContainer.height / 2) - CONSTANTS._charPostionY
        //         : (this.characterContainer.height / 2) - CONSTANTS._charPostionY + ySpacing;

        //     let currentCharDetails = {
        //         gender: randCharDetails.gender,
        //         bodyFrame: randCharDetails.bodyFrame,
        //         hair: {
        //             number: randCharDetails.hair.number,
        //             frame: randCharDetails.hair.frame
        //         },
        //         basicAttire: randCharDetails.basicAttire
        //     };

        //     let charDetails = {
        //         x: xSpacing,
        //         y: useSpacing_y,
        //         frame: 0,
        //         scale: 3,
        //         origin: 0.5
        //     };

        //     this.renderSprite(this.characterContainer, currentCharDetails, charDetails, randCharDetails);

        //     let selectTxtOpponent = this.add.text(charDetails.x - 50, charDetails.y + 100, "Select", {
        //         fontSize: '20px',
        //         fill: '#000000',
        //         fontStyle: 'bold',
        //         stroke: '#ffffff', // Border color
        //         strokeThickness: 2 // Border thickness
        //     });
        //     selectTxtOpponent.setInteractive();
        //     this.characterContainer.add(selectTxtOpponent);

        //     selectTxtOpponent.on("pointerdown", () => {
        //         // this.scene.start('playerHome');
        //         // to do create a fight scene simulation
        //         this.saveToLocalStorage(CONSTANTS._opponent, rand_chars);
        //         this.scene.start('playerFight');
        //     });

        //     nextRow_X += gap; // Move to the next position in row
        // }
    }

    renderSprite(container, currentCharDetails, charDetails, charAllData) {
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

        const armorResult = charAllData.utilities.skills.find(skill => skill == 44);
        if (armorResult) {
            const randomSkin = this.randomArrayIndex([1, 2, 3, 4, 5]);
            const charArmor = currentCharDetails.gender.concat("_armor", randomSkin); // set to 1 because no other skill yet added
            const charArmorSprite = this.add.sprite(charDetails.x, charDetails.y, charArmor)
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

        // this.renderUtils(container, charDetails);
    }

    randomizer(max) {
        return Phaser.Math.Between(0, max);
    }

    createName() {
        // Clear the container first
        this.charNameContainer.removeAll(true);

        let backTxt = this.add.text(30, 565, "Home", {
            fontSize: '20px',
            fill: '#000000',
            fontStyle: 'bold',
            stroke: '#ffffff', // Border color
            strokeThickness: 2 // Border thickness
        });
        backTxt.setInteractive();
        this.charNameContainer.add(backTxt);

        backTxt.on("pointerdown", () => {
            localStorage.removeItem(CONSTANTS._opponent);
            this.scene.start('playerHome');
        });

        let playerName = this.add.text(40, 60, this.currentCharDetails.name, {
            fontSize: '30px',
            fill: '#000000',
            fontStyle: 'bold',
            stroke: '#ffffff', // Border color
            strokeThickness: 2 // Border thickness
        });
        this.charNameContainer.add(playerName);

        let opponentName = this.add.text(405, 60, this.loadedOpponent.name, {
            fontSize: '30px',
            fill: '#000000',
            fontStyle: 'bold',
            stroke: '#ffffff', // Border color
            strokeThickness: 2 // Border thickness
        });
        this.charNameContainer.add(opponentName);
    }

    saveToLocalStorage(key, data) {
        const encryptedData = this.encryptedData(key, data);
        localStorage.setItem(key, encryptedData);
    };

    encryptedData(key, data) {
        return CryptoJS.AES.encrypt(JSON.stringify(data), key.concat("1")).toString();
    }

    decryptData(key) {
        const encryptedData = localStorage.getItem(key);
        const bytes = CryptoJS.AES.decrypt(encryptedData, key.concat("1"));
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    };

    loadCharacter(key) {
        const encryptedData = localStorage.getItem(key);

        if (encryptedData) {
            try {
                return this.decryptData(key);
            } catch (error) {
                console.error(CONSTANTS._errorMessages.failedDecrypt, error);
                return null;
            }
        }

        return null;
    }

    validateLoggedIn(username) {
        const userLoggedKey = this.decryptData(CONSTANTS._charUserKey);
        const compareResult = userLoggedKey == username;

        if (!compareResult) {
            localStorage.removeItem("recentLogin");
            localStorage.removeItem(CONSTANTS._charUserKey);
            localStorage.removeItem(CONSTANTS._charDetailsKey);
            this.scene.start('playGame');
        }

        return true;
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

    generateRandomKeys() {
        return Math.random().toString(36).substring(2, 7);
    }

    randomArrayIndex(data) {

        // Generate a random index
        const randomIndex = Math.floor(Math.random() * data.length);

        // Select the random value from the array
        return data[randomIndex];
    }

    setLoading(withLoading) {
        const loadingScreen = document.getElementById("loading-screen");
        if (loadingScreen) {
            loadingScreen.style.display = withLoading ? "flex" : "none";
        } else {
            console.warn("Loading screen element not found!");
        }
    }

    generateLogs(init, action, weapon, life) {

        var toPush = {};
        toPush.init = init;

        if (action.type == "Change weapon") {
            toPush.action = {
                type: action.type,
                by: action.charTitle,
                oldWeapon: action.oldWeapon || "none",
                newWeapon: action.newWeapon || "none"
            };
        } else {
            toPush.action = {
                type: action.type,
                by: action.charTitle,
                attacker: action.attacker,
            };
        }

        if (weapon) {
            toPush.weapon = {
                name: weapon ? weapon.name : "",
                damage: weapon ? weapon.damage : ""
            };
        }

        if (life) {
            toPush.life = {
                player: life ? life.p1 : '',
                opponent: life ? life.p2 : ''
            }
        }

        this.script.push(toPush);
    }

    calculateChance(chance) {
        if (chance < 0) return false;
        if (chance > 100) return true;

        const randomValue = Math.random() * 100; // Generates a random number between 0 and 100
        return randomValue <= chance; // Returns true if item is achieved, false otherwise
    }

    calculateDamage(strength, opponentDefense, weapon, targetUser) {

        let additionalSkillDamage = 0;
        const weaponDamage = weapon ? weapon.damage : 0;
        const target = targetUser == CONSTANTS._player ? this.playerUtils : this.opponentUtils;
        const targetSkills = target.skills;
        const thrownWeaponsResult = this.thrownWeapons.find(w => w == weapon.number);
        const skill_javelinist = targetSkills.find(skill => skill == 5); // javelinist skill

        if (skill_javelinist && thrownWeaponsResult) {
            additionalSkillDamage += weaponDamage * 0.25;
        }

        const weaponCritical = this.calculateChance(weapon.critical);
        const additionalCritical = weaponCritical ? weaponDamage * 0.5 : 0;
        const additionalDamage = strength * 1.5;
        const totalDamage = additionalDamage + additionalCritical + weaponDamage + additionalSkillDamage;
        const finalDamage = Math.round(Math.max(1, (totalDamage) - opponentDefense))

        return finalDamage;
    }

    calculateCombo(comboRate) {
        let comboPercentage = comboRate || 0;
        let result = 1; // Initialize the result

        if (comboPercentage >= 100) {
            // Process full hundreds
            const mainChance = Math.floor(comboPercentage / 100); // How many full 100s
            result += mainChance; // Add the full chances to the result
            comboPercentage -= mainChance * 100; // Subtract processed portion
        }

        // Directly calculate the remaining chance (if below 100)
        if (comboPercentage > 0) {
            const isSuccessful = this.calculateChance(comboPercentage); // Attempt the remaining chance
            if (isSuccessful) result += 1; // Increment result for successful chance
        }

        return result;
    }

    // render LIFE BARS
    renderLife() {

        this.charLifeBarContainer.removeAll(true);
        const defaultWidth = 350;
        const barWidthPlayer = this.life.current.playerWidth;
        const barWidthOpponent = this.life.current.opponentWidth;

        const barLength = 20;
        const colorRed = 0xff0000;
        const colorGreen = 0x00ff00;
        const borderColor = 0x000000;
        // Player life bar (Lost - Red)
        this.playerLifeBarLost = this.add.rectangle(220, 100, 350, barLength, colorRed);
        this.charLifeBarContainer.add(this.playerLifeBarLost);

        // Add border for Player life bar (Lost - Red)
        const playerLifeBarLostBorder = this.add.graphics();
        playerLifeBarLostBorder.lineStyle(2, borderColor, 1); // Border width: 2px
        playerLifeBarLostBorder.strokeRect(
            this.playerLifeBarLost.x - this.playerLifeBarLost.width / 2,
            this.playerLifeBarLost.y - this.playerLifeBarLost.height / 2,
            this.playerLifeBarLost.width,
            this.playerLifeBarLost.height
        );
        this.charLifeBarContainer.add(playerLifeBarLostBorder);


        // Player life bar (Green)
        this.playerLifeBar = this.add.rectangle(
            220 - (350 - barWidthPlayer) / 2, // Shift left when reducing width
            100,
            barWidthPlayer,
            barLength,
            colorGreen
        );
        this.charLifeBarContainer.add(this.playerLifeBar);
        // Opponent life bar (Lost - Red)
        this.opponentLifeBarLost = this.add.rectangle(580, 100, 350, barLength, colorRed);
        this.charLifeBarContainer.add(this.opponentLifeBarLost);

        // Add border for Opponent life bar (Lost - Red)
        const opponentLifeBarLostBorder = this.add.graphics();
        opponentLifeBarLostBorder.lineStyle(2, borderColor, 1); // Border width: 2px
        opponentLifeBarLostBorder.strokeRect(
            this.opponentLifeBarLost.x - this.opponentLifeBarLost.width / 2,
            this.opponentLifeBarLost.y - this.opponentLifeBarLost.height / 2,
            this.opponentLifeBarLost.width,
            this.opponentLifeBarLost.height
        );
        this.charLifeBarContainer.add(opponentLifeBarLostBorder);

        // Opponent life bar (Green)
        this.opponentLifeBar = this.add.rectangle(
            580 - (350 - barWidthOpponent) / 2, // Shift left when reducing width
            100,
            barWidthOpponent,
            barLength,
            colorGreen
        );
        this.charLifeBarContainer.add(this.opponentLifeBar);
    }

    displayLogs(withInterval) {

        const winner = this.playerLife > 0 ? CONSTANTS._player : CONSTANTS._opponent;

        if (withInterval) {
            // Use setInterval to print each script element every 1 second
            let index = 0;
            const intervalId = setInterval(() => {
                if (index < this.script.length) {
                    console.log(JSON.stringify(this.script[index])); // Print the current script element

                    if (this.script[index].action.type == "attack") {
                        var attacker = this.script[index].action.by;
                        var defender = attacker == CONSTANTS._player ? CONSTANTS._opponent : CONSTANTS._player;
                        var remainingLife = attacker == CONSTANTS._player ? this.script[index].life.opponent : this.script[index].life.player;

                        this.updateLife(defender, remainingLife); // life to deduct, remaining life  
                        this.renderLife();
                    }

                    index++; // Move to the next element
                } else {
                    clearInterval(intervalId); // Stop the interval once all elements are printed
                    this.showWinner(winner);
                }
            }, 800);
        } else {
            this.showWinner(winner);
        }
    }

    playerAttack(playerWeapon, damage, opponentWeapon) {
        // const isStunned = this.checkStunned(CONSTANTS._player);
        // if (isStunned) return false; // no attack if stunned

        const isWithThrownWeapon = this.thrownWeapons.find(w => w == playerWeapon.number);
        var isAccurate = this.calculateAccuracy(playerWeapon.accuracy);

        if (isAccurate) {

            var isEvade = this.calculateEvasion(opponentWeapon.evasion, CONSTANTS._opponent);
            if (isEvade) {
                this.generateLogs(this.init, { type: "Dodge", charTitle: CONSTANTS._opponent, attacker: CONSTANTS._player });
                this.canCounter.opponent = true;
            }

            var isBlock = this.calculateEvasion(opponentWeapon.evasion, CONSTANTS._opponent);
            if (isBlock) {
                this.generateLogs(this.init, { type: "Block", charTitle: CONSTANTS._opponent, attacker: CONSTANTS._player });
                this.canCounter.opponent = true;
            }

            // Player attacks!
            var remaining_opponentLife = Math.max(0, this.opponentLife - damage); // Ensure life doesn't go below zero

            this.generateLogs(
                this.init,
                { type: "attack", charTitle: CONSTANTS._player },
                { name: playerWeapon.name, damage: damage },
                { p1: this.playerLife, p2: remaining_opponentLife }
            );
            this.opponentLife = remaining_opponentLife;

            this.calculateDisarm(playerWeapon.disarm, CONSTANTS._opponent);

            // const withBasher = this.currentCharDetails.utilities.skills.find(skill => skill == 6); // basher skill
            // const isWithHeavyWeapon = this.heavyWeapons.find(w => w == playerWeapon.number);
            // if (withBasher && isWithHeavyWeapon) this.calculateStun(CONSTANTS._opponent);

            this.canCounter.opponent = false;
        }

        // with counter attack if not thrown weapons
        if (isWithThrownWeapon) {
            this.canCounter.opponent = false;
        } else {
            this.canCounter.opponent = true;
        }
    }

    opponentAttack(opponentWeapon, damage, playerWeapon) {
        // const isStunned = this.checkStunned(CONSTANTS._opponent);
        // if (isStunned) return false; // no attack if stunned

        const isWithThrownWeapon = this.thrownWeapons.find(w => w == opponentWeapon.number);
        var isAccurate = this.calculateAccuracy(opponentWeapon.accuracy);

        if (isAccurate) {

            var isEvade = this.calculateEvasion(playerWeapon.evasion, CONSTANTS._player);
            if (isEvade) {
                this.generateLogs(this.init, { type: "Dodge", charTitle: CONSTANTS._player, attacker: CONSTANTS._opponent });
                this.canCounter.player = true;
            }

            var isBlock = this.calculateBlock(playerWeapon.block, CONSTANTS._player);
            if (isBlock) {
                this.generateLogs(this.init, { type: "Block", charTitle: CONSTANTS._player, attacker: CONSTANTS._opponent });
                this.canCounter.player = true;
            }

            // Opponent attacks!
            var remaining_playerLife = Math.max(0, this.playerLife - damage); // Ensure life doesn't go below zero

            this.generateLogs(
                this.init,
                { type: "attack", charTitle: CONSTANTS._opponent },
                { name: opponentWeapon.name, damage: damage },
                { p1: remaining_playerLife, p2: this.opponentLife }
            );
            this.playerLife = remaining_playerLife;

            this.calculateDisarm(opponentWeapon.disarm, CONSTANTS._player);

            // const withBasher = this.loadedOpponent.utilities.skills.find(skill => skill == 6); // basher skill
            // const isWithHeavyWeapon = this.heavyWeapons.find(w => w == opponentWeapon.number);
            // if (withBasher && isWithHeavyWeapon) this.calculateStun(CONSTANTS._player);

            // return false; // no counter attack
            this.canCounter.player = false;
        }

        // with counter attack if not thrown weapons
        if (isWithThrownWeapon) {
            this.canCounter.player = false;
        } else {
            this.canCounter.player = true;
        }
    }

    calculateSpeed(changePlayer, changeOpponent) {
        if (changePlayer) {
            this.currentPlayerSpeed -= this.maxSpeed; // Player speed counter
        }
        if (changeOpponent) {
            this.currentOpponentSpeed -= this.maxSpeed; // Opponent speed counter
        }
    }

    calculateAccuracy(accuracy) {

        let accuracyPercentage = accuracy || 0;
        let result = false; // Initialize the result

        // // Directly calculate the remaining chance (if below 100)
        if (accuracyPercentage > 0) {
            const isSuccessful = this.calculateChance(accuracyPercentage); // Attempt the remaining chance
            if (isSuccessful) result = true; // true -> hit by attack
        }

        return result;
    }

    calculateCounterAttack(counter) {

        let counterPercentage = counter || 0;
        let result = false; // Initialize the result

        // // Directly calculate the remaining chance (if below 100)
        if (counterPercentage > 0) {
            const isSuccessful = this.calculateChance(counterPercentage); // Attempt the remaining chance
            if (isSuccessful) result = true; // true -> do counter attack
        }

        return result;
    }

    calculateDisarm(disarm, target) {

        let additionalPercentage = 0;

        // attacker and its utils
        const whoDisarm = target == CONSTANTS._player ? CONSTANTS._opponent : CONSTANTS._player;
        const attackerSKills = target == CONSTANTS._player ? this.opponentUtils.skills : this.playerUtils.skills;
        const attacker_shieldBreaker = attackerSKills.find(skill => skill == 13); // shield breaker skill

        // defender utils
        const weaponToRemove = target == CONSTANTS._player ? this.playerUtils.activeWeapon : this.opponentUtils.activeWeapon;
        const defender_heaterShield = weaponToRemove == 1; // heater shield weapon

        if (attacker_shieldBreaker && defender_heaterShield) {
            additionalPercentage += 15;
        }

        const total = disarm + additionalPercentage;
        let disarmPercentage = total || 0;
        let result = false; // Initialize the result

        // // Directly calculate the remaining chance (if below 100)
        if (disarmPercentage > 0) {
            const isSuccessful = this.calculateChance(disarmPercentage); // Attempt the remaining chance
            if (isSuccessful) result = true; // true -> do disarm
        }

        if (result) {

            if (weaponToRemove != null || weaponToRemove != undefined) {
                this.generateLogs(this.init, { type: "disarm", charTitle: whoDisarm, weaponRemoved: weaponToRemove });

                if (target == CONSTANTS._player) {
                    this.playerUtils.weapons = this.playerUtils.weapons.filter(w => w !== weaponToRemove);
                    this.playerUtils.activeWeapon = null;
                } else {
                    this.opponentUtils.weapons = this.opponentUtils.weapons.filter(w => w !== weaponToRemove);
                    this.opponentUtils.activeWeapon = null;
                }
            }
        }
    }

    calculateEvasion(evasion, target) {

        let evasionPercentage = evasion || 0;
        const additional = target == CONSTANTS._player ? this.playerEvasion : this.opponentEvasion;
        const final = evasionPercentage + additional;
        let result = false; // Initialize the result

        // // Directly calculate the remaining chance (if below 100)
        if (final > 0) {
            const isSuccessful = this.calculateChance(evasionPercentage); // Attempt the remaining chance
            if (isSuccessful) result = true; // true -> evade attack
        }

        return result;
    }

    calculateBlock(block, target) {

        let blockPercentage = block || 0;
        const additional = target == CONSTANTS._player ? this.playerBlock : this.opponentBlock;
        const final = blockPercentage + additional;
        let result = false; // Initialize the result

        // // Directly calculate the remaining chance (if below 100)
        if (final > 0) {
            const isSuccessful = this.calculateChance(blockPercentage); // Attempt the remaining chance
            if (isSuccessful) result = true; // true -> evade attack
        }

        return result;
    }

    changeWeapon(target) {
        const randomChance = 25;
        const isPlayer = target == CONSTANTS._player;
        const utils = isPlayer ? this.playerUtils : this.opponentUtils;
        const randomChanceResult = this.calculateChance(randomChance);

        if (utils.weapons.length > 0 && randomChanceResult) {
            const oldWeapon = utils.activeWeapon;
            const newWeapon = this.randomArrayIndex(utils.weapons);
            utils.weapons = utils.weapons.filter(w => w !== oldWeapon && w !== newWeapon);
            utils.activeWeapon = newWeapon;

            this.generateLogs(this.init, {
                type: "Change weapon",
                charTitle: target,
                oldWeapon,
                newWeapon
            });

            return CONSTANTS.weaponStats.find(w => w.number === newWeapon);
        }
    }

    attackAndUpdate() {

        this.renderLife();
        this.playerLife = this.currentCharDetails.attributes.life;
        this.opponentLife = this.loadedOpponent.attributes.life;

        this.currentPlayerSpeed = 0; // Player speed counter
        this.currentOpponentSpeed = 0; // Opponent speed counter
        this.playerSpeed = this.currentCharDetails.attributes.speed;
        this.opponentSpeed = this.loadedOpponent.attributes.speed;

        // initialize agility / evasion additional
        this.playerEvasion = Math.round(this.currentCharDetails.attributes.agile * 0.5);
        this.opponentEvasion = Math.round(this.loadedOpponent.attributes.agile * 0.5);

        // initialize block rate
        this.playerBlock = 0;
        this.opponentBlock = 0;

        this.init = 0;

        // Loop until one character's life reaches zero
        while (this.playerLife > 0 && this.opponentLife > 0) {
            // Increment speeds for both characters
            this.currentPlayerSpeed += this.playerSpeed;
            this.currentOpponentSpeed += this.opponentSpeed;

            // Player
            const player_weaponNumber = this.playerUtils.activeWeapon || -1;
            let player_weaponToUse = CONSTANTS.weaponStats.find(w => w.number == player_weaponNumber);
            let playerDamage = this.calculateDamage(this.currentCharDetails.attributes.damage, this.loadedOpponent.attributes.armor, player_weaponToUse, CONSTANTS._player);
            let playerCombo = this.calculateCombo(player_weaponToUse.combo);

            // Opponent
            const opponent_weaponNumber = this.opponentUtils.activeWeapon || -1;
            let opponent_weaponToUse = CONSTANTS.weaponStats.find(w => w.number == opponent_weaponNumber);
            let oppponentDamage = this.calculateDamage(this.loadedOpponent.attributes.damage, this.currentCharDetails.attributes.armor, opponent_weaponToUse, CONSTANTS._opponent);
            let opponentCombo = this.calculateCombo(opponent_weaponToUse.combo);

            this.playerBlock = player_weaponToUse.block || 0;
            this.opponentBlock = player_weaponToUse.block || 0;

            // Reduce speed for using a Weapon
            this.currentPlayerSpeed += player_weaponToUse.speed; // negative values
            this.currentOpponentSpeed += opponent_weaponToUse.speed; // negative values

            // Check if either character reaches maxSpeed
            // if (this.currentPlayerSpeed >= this.maxSpeed && this.currentOpponentSpeed >= this.maxSpeed) {
            //     const equalSpeed = this.currentPlayerSpeed == this.currentOpponentSpeed;
            //     const rand_value = this.randomizer(1);

            //     if(equalSpeed){
            //         if(rand_value == 0){
            //             this.currentPlayerSpeed += 0.1;
            //         } else {
            //             this.currentOpponentSpeed += 0.1;
            //         }
            //     }

            // } else 
            if (this.currentPlayerSpeed >= this.maxSpeed && this.currentPlayerSpeed > this.currentOpponentSpeed) {
                this.generateLogs(this.init, { type: "Move", charTitle: CONSTANTS._player });

                // Player attacks!
                for (let i = 1; i <= playerCombo; i++) {

                    var changeWeaponResult = this.changeWeapon(CONSTANTS._player);
                    if (changeWeaponResult) {
                        player_weaponToUse = changeWeaponResult;
                        playerDamage = this.calculateDamage(this.currentCharDetails.attributes.damage, this.loadedOpponent.attributes.armor, player_weaponToUse, CONSTANTS._player);
                    };

                    if (this.playerLife > 0 && this.opponentLife > 0) {
                        this.playerAttack(player_weaponToUse, playerDamage, opponent_weaponToUse);
                    }

                    if (this.canCounter.opponent && this.playerLife > 0 && this.opponentLife > 0) {
                        this.generateLogs(this.init, { type: "counter", charTitle: CONSTANTS._opponent, attacker: CONSTANTS._player });
                        this.opponentAttack(opponent_weaponToUse, oppponentDamage, player_weaponToUse);
                    }
                }
                this.calculateSpeed(true, false); // Reset Player speed counter

                if (this.playerLife > 0 && this.opponentLife > 0) {
                    const playerWithThrownWeapon = this.thrownWeapons.find(w => w == this.playerUtils.activeWeapon);
                    if (playerWithThrownWeapon) {
                        this.generateLogs(this.init, { type: "Stop throwing", charTitle: CONSTANTS._player });
                    } else {
                        this.generateLogs(this.init, { type: "Return", charTitle: CONSTANTS._player });
                    }
                } else {
                    this.generateLogs(this.init, { type: "Stop", charTitle: CONSTANTS._player });
                    this.generateLogs(this.init, { type: "Stop", charTitle: CONSTANTS._opponent });
                }

            } else if (this.currentOpponentSpeed >= this.maxSpeed && this.currentOpponentSpeed > this.currentPlayerSpeed) {
                this.generateLogs(this.init, { type: "Move", charTitle: CONSTANTS._opponent });

                var changeWeaponResult = this.changeWeapon(CONSTANTS._opponent);
                if (changeWeaponResult) {
                    opponent_weaponToUse = changeWeaponResult;
                    oppponentDamage = this.calculateDamage(this.loadedOpponent.attributes.damage, this.currentCharDetails.attributes.armor, opponent_weaponToUse, CONSTANTS._opponent);
                };

                // Opponent attacks!
                for (let i = 1; i <= opponentCombo; i++) {

                    var changeWeaponResult = this.changeWeapon(CONSTANTS._opponent);
                    if (changeWeaponResult) {
                        opponent_weaponToUse = changeWeaponResult;
                        oppponentDamage = this.calculateDamage(this.loadedOpponent.attributes.damage, this.currentCharDetails.attributes.armor, opponent_weaponToUse, CONSTANTS._opponent);
                    };

                    if (this.playerLife > 0 && this.opponentLife > 0) {
                        this.opponentAttack(opponent_weaponToUse, oppponentDamage, player_weaponToUse);
                    }

                    if (this.canCounter.player && this.playerLife > 0 && this.opponentLife > 0) {
                        this.generateLogs(this.init, { type: "counter", charTitle: CONSTANTS._player, attacker: CONSTANTS._opponent });
                        this.playerAttack(player_weaponToUse, playerDamage, opponent_weaponToUse);
                    }
                }
                this.calculateSpeed(false, true); // Reset Opponent speed counter

                if (this.playerLife > 0 && this.opponentLife > 0) {

                    const opponentWithThrownWeapon = this.thrownWeapons.find(w => w == this.opponentUtils.activeWeapon);
                    if (opponentWithThrownWeapon) {
                        this.generateLogs(this.init, { type: "Stop throwing", charTitle: CONSTANTS._opponent });
                    } else {
                        this.generateLogs(this.init, { type: "Return", charTitle: CONSTANTS._opponent });
                    }

                } else {
                    this.generateLogs(this.init, { type: "Stop", charTitle: CONSTANTS._player });
                    this.generateLogs(this.init, { type: "Stop", charTitle: CONSTANTS._opponent });
                }
            } else {
                const rand_value = this.randomizer(1);

                if (rand_value == 0) {
                    this.currentPlayerSpeed += 0.01;
                } else {
                    this.currentOpponentSpeed += 0.01;
                }
            }
            this.init += 1;
        }
        this.displayLogs(true); // true for setinterval 1sec
    }

    updateLife(target, remaining) {
        const maxWidth = 350;
        if (target == CONSTANTS._player) {
            let playerMaxLife = this.life.max.player;  // life
            let playerCurrentLife = remaining;  // life

            const healthBarWidth = (playerCurrentLife / playerMaxLife) * maxWidth;
            this.life.current.playerWidth = healthBarWidth;
            this.life.current.player = playerCurrentLife;
        } else {
            let opponentMaxLife = this.life.max.opponent;  // life
            let opponentCurrentLife = remaining;  // life

            const healthBarWidth = (opponentCurrentLife / opponentMaxLife) * maxWidth;
            this.life.current.opponentWidth = healthBarWidth;
            this.life.current.opponent = opponentCurrentLife;
        }
    }

    checkStunned(targetUser) {
        // check if the target user is stunned to skip movement
        const target = targetUser == CONSTANTS._player ? CONSTANTS._player : CONSTANTS._opponent;

        if (target == CONSTANTS._player) {
            if (this.isStun.player) {
                this.generateLogs(this.init, { type: "Stunned", charTitle: CONSTANTS._player, attacker: CONSTANTS._opponent });
                this.isStun.player = false;
                return true;
            }
        } else {
            if (this.isStun.opponent) {
                this.generateLogs(this.init, { type: "Stunned", charTitle: CONSTANTS._opponent, attacker: CONSTANTS._player });
                this.isStun.opponent = false;
                return true;
            }
        }

        return false;
    }

    calculateStun(targetuser) {
        const target = targetuser == CONSTANTS._player ? CONSTANTS._player : CONSTANTS._opponent;
        const isStunned = this.calculateChance(100); // 15% chance to stun

        if (isStunned) {
            if (target == CONSTANTS._player) {
                this.isStun.player = true;
            } else {
                this.isStun.opponent = true;
            }
        }
    }

    showWinner(winner) {
        console.log(`Winner: ${winner}`); // Print the victor

        const winner_X = winner == CONSTANTS._player ? 100 : 480;
        const winner_y = 150;
        let winnerDisplay = this.add.text(winner_X, winner_y, "Winner!", {
            fontSize: '50px',
            fill: '#000000',
            fontStyle: 'bold',
            stroke: '#00ff00', // Border color
            strokeThickness: 3 // Border thickness
        });
        this.charNameContainer.add(winnerDisplay);
    }
}