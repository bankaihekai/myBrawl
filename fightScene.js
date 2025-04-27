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
        this.physicalWeapons = [-1, 3];
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

        this.firstAttack = {
            player: false,
            opponent: false
        }

        this.canSurvive = {
            player: false,
            opponent: false
        }

        this.canRevive = {
            player: false,
            opponent: false
        }

        this.healthPotion = {
            player: false,
            opponent: false
        }

        this.PoisonPotion = {
            player: {
                available: false,
                active: false,
                count: 0
            },
            opponent: {
                available: false,
                active: false,
                count: 0
            }
        }

        this.bomb = {
            player: false,
            opponent: false
        }

        this.bandage = {
            player: {
                available: false,
                active: false,
                count: 0
            },
            opponent: {
                available: false,
                active: false,
                count: 0
            }
        }

        this.poisonTouch = {
            player: false,
            opponent: false
        }

        this.buff = {
            player: {
                aura: false,
                susanoo: false,
            },
            opponent: {
                aura: false,
                susanoo: false,
            }
        }

        // true if player affected with debuff
        this.debuff = {
            player: {
                genjutsu: false
            },
            opponent: {
                genjutsu: false
            }
        }

        this.genjutsu = {
            player: false,
            opponent: false
        }

        this.discharge = {
            player: false,
            opponent: false
        }

        this.petMaster = {
            player: false,
            opponent: false
        }

        this.scare = {
            player: false,
            opponent: false
        }

        this.steal = {
            player: false,
            opponent: false
        }

        this.rage = {
            player: false,
            opponent: false
        }

        // 0- false 1- true 2-partial
        this.lightningBolt = {
            player: 0,
            opponent: 0
        }

        this.spellMaster = {
            player: false,
            opponent: false
        }

        this.thorns = {
            player: false,
            opponent: false
        }

        this.hollowForm = {
            player: {
                available: false,
                active: false,
                count: 0
            },
            opponent: {
                available: false,
                active: false,
                count: 0
            }
        }

        this.trueStrike = {
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
        this.currentCharDetails.utilities.skills.push(14);
        // this.currentCharDetails.utilities.weapons.push(11);
        // this.currentCharDetails.utilities.weapons.push(12);
        // this.currentCharDetails.utilities.weapons.push(13);
        this.currentCharDetails.utilities.pets.push({ "name": "Dog", types: 'A' });
        this.currentCharDetails.utilities.pets.push({ "name": "Dog", types: 'A' });
        this.currentCharDetails.utilities.pets.push({ "name": "Dog", types: 'A' });
        this.currentCharDetails.attributes.damage = 10;
        // opponent
        this.loadedOpponent.utilities.skills.push(14);
        // this.loadedOpponent.utilities.weapons.push(1);
        // this.loadedOpponent.utilities.weapons.push(2);
        // this.loadedOpponent.utilities.weapons.push(3);
        this.loadedOpponent.attributes.damage = 10;

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

        let playerPetWithStats = this.currentCharDetails.utilities.pets.map((pet, i) => {
            const playerPetStat = CONSTANTS._petStats.find(p => p.name == pet.name);
            return {
                index: i,
                ...playerPetStat,
                type: pet.types
            };
        });

        let opponentPetWithStats = this.loadedOpponent.utilities.pets.map((pet, i) => {
            const opponentPetStat = CONSTANTS._petStats.find(p => p.name == pet.name);
            return {
                index: i,
                ...opponentPetStat,
                type: pet.types
            };
        });

        this.playerUtils = {
            skills: this.currentCharDetails.utilities.skills || [],
            weapons: this.currentCharDetails.utilities.weapons || [],
            // pets: playerPetWithStats || [],
            pets: [
                {
                    "index": 0,
                    "name": "Dog",
                    "hp": 25,
                    "strength": 8,
                    "agility": 6,
                    "speed": 4,
                    "comboRate": 110,
                    "dodge": 15,
                    "type": "A"
                },
                {
                    "index": 1,
                    "name": "Dog",
                    "hp": 0,
                    "strength": 8,
                    "agility": 6,
                    "speed": 4,
                    "comboRate": 110,
                    "dodge": 15,
                    "type": "A"
                },
                {
                    "index": 2,
                    "name": "Dog",
                    "hp": 25,
                    "strength": 8,
                    "agility": 6,
                    "speed": 4,
                    "comboRate": 110,
                    "dodge": 15,
                    "type": "A"
                }
            ] || [],
            activeWeapon: null,
            activeSkill: null
        }

        this.opponentUtils = {
            skills: this.loadedOpponent.utilities.skills || [],
            weapons: this.loadedOpponent.utilities.weapons || [],
            pets: opponentPetWithStats || [],
            activeWeapon: null,
            activeSkill: null
        }

        // console.log({ loadedOpponent: this.loadedOpponent });
        // console.log({ loadedCharacter: this.currentCharDetails });
        console.log({ playerUtils: this.playerUtils.pets });
        console.log({ opponentUtils: this.opponentUtils.pets });

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
        toPush.action = action;

        if (weapon) toPush.weapon = weapon;

        if (life) toPush.life = life;

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
        let additionalCritBoost = 1;
        const weaponDamage = weapon ? weapon.damage : 0;
        const target = targetUser == CONSTANTS._player ? this.playerUtils : this.opponentUtils;
        const targetSkills = target.skills;
        const thrownWeaponsResult = this.thrownWeapons.find(w => w == weapon.number); // current used weapon type is thrown
        const heavyWeaponsResult = this.heavyWeapons.find(w => w == weapon.number); // current used  weapon type is heavy
        const sharpWeaponsResult = this.sharpWeapons.find(w => w == weapon.number); // current used  weapon type is heavy
        const physicalWeaponsResult = this.physicalWeapons.find(w => w == weapon.number); // current used  weapon type is heavy
        const weaponCritical = this.calculateChance(weapon.critical);

        // javelinist skill
        const skill_javelinist = targetSkills.find(skill => skill == 5);
        if (skill_javelinist && thrownWeaponsResult) additionalSkillDamage += weaponDamage * 0.25;

        // heavy lifter skill
        const skill_heavyLifter = targetSkills.find(skill => skill == 37);
        if (skill_heavyLifter && heavyWeaponsResult) additionalSkillDamage += weaponDamage * 0.25;

        // desolator skill
        const skill_desolator = targetSkills.find(skill => skill == 50);
        if (skill_desolator && sharpWeaponsResult) additionalSkillDamage += weaponDamage * 0.25;

        // dragon punch skill
        const skill_dragonPunch = targetSkills.find(skill => skill == 49);
        if (skill_dragonPunch && physicalWeaponsResult) additionalSkillDamage += weaponDamage * 2;

        // instant killer skill
        const skill_instantKiller = targetSkills.find(skill => skill == 18);
        if (skill_instantKiller) additionalCritBoost += 1;

        // true strike skill
        const trueStrike = targetSkills.find(skill => skill == 34);
        const calculateTrueStrike = this.calculateChance(15);
        if (trueStrike && this.trueStrike[targetUser] && calculateTrueStrike) {
            additionalCritBoost += 0.2;
        };

        const additionalCritical = weaponCritical ? additionalCritBoost : 0;
        const statsDamage = strength * 1.5;

        let totalDamage = statsDamage + weaponDamage + additionalSkillDamage;

        if (additionalCritical > 1) {
            totalDamage = totalDamage * additionalCritical;
        }

        const finalDamage = Math.round(Math.max(1, (totalDamage) - (opponentDefense * 1.5)));

        return {
            finalDamage: finalDamage,
            withCrit: additionalCritical > 1,
        };
    }

    calculateCombo(comboRate, attacker) {

        let additionalSkillCombo = 0;
        const targetAttacker = attacker == CONSTANTS._player ? this.playerUtils : this.opponentUtils;
        const bladeOfFurry = targetAttacker.skills.find(s => s == 47); // passive skill

        if (bladeOfFurry) additionalSkillCombo += 150;

        const finalCombo = additionalSkillCombo + comboRate;

        let comboPercentage = finalCombo || 0;
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

                    const actionType = this.script[index].action.type;

                    // attacker who execute the action
                    if (actionType == CONSTANTS._actions.attack ||
                        actionType == CONSTANTS._actions.throw
                    ) {
                        const attacker = this.script[index].action.by;
                        const defender = attacker == CONSTANTS._player ? CONSTANTS._opponent : CONSTANTS._player;
                        const remainingLife = attacker == CONSTANTS._player ? this.script[index].life.opponent : this.script[index].life.player;

                        this.updateLife(defender, remainingLife); // life to deduct, remaining life  
                        this.renderLife();
                    }

                    // attacker who dealt poison
                    if (actionType == CONSTANTS._actions.poison) {
                        const attacker = this.script[index].action.attacker;
                        const defender = attacker == CONSTANTS._player ? CONSTANTS._opponent : CONSTANTS._player;
                        const remainingLife = attacker == CONSTANTS._player ? this.script[index].life.opponent : this.script[index].life.player;

                        this.updateLife(defender, remainingLife); // life to deduct, remaining life  
                        this.renderLife();
                    }

                    // attacker who use the revive drink bandage
                    if (actionType == CONSTANTS._actions.revive ||
                        actionType == CONSTANTS._actions.drink ||
                        actionType == CONSTANTS._actions.bandage ||
                        actionType == CONSTANTS._actions.thorns
                    ) {
                        const attacker = this.script[index].action.by;

                        // with revive
                        const rlRevive = attacker == CONSTANTS._player ? this.script[index].life.player : this.script[index].life.opponent;

                        this.updateLife(attacker, rlRevive); // life to deduct, remaining life  
                        this.renderLife();
                    }

                    // attacker who have self inflicted damage
                    if (
                        actionType == CONSTANTS._actions.thorns
                    ) {
                        const defender = this.script[index].action.by; // the one with thorns defender
                        const attackerToBeHurt = defender == CONSTANTS._player ? CONSTANTS._opponent : CONSTANTS._player;
                        const remainingLifeLeft = defender == CONSTANTS._player ? this.script[index].life.opponent : this.script[index].life.player;

                        this.updateLife(attackerToBeHurt, remainingLifeLeft); // life to deduct, remaining life  
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

    calculateCounterAttack(counter, defender) {

        let additionalSkillCounter = 0;
        let counterPercentage = counter || 0;
        let result = false; // Initialize the result
        const targetDefender = defender == CONSTANTS._player ? this.playerUtils : this.opponentUtils;
        const counterStrike = targetDefender.skills.find(s => s == 45); // passive skill

        if (counterStrike) additionalSkillCounter += 30;

        const finalCounter = counterPercentage + additionalSkillCounter;

        // // Directly calculate the remaining chance (if below 100)
        if (finalCounter > 0) {
            const isSuccessful = this.calculateChance(finalCounter); // Attempt the remaining chance
            if (isSuccessful) result = true; // true -> do counter attack
        }

        return result;
    }

    calculateDisarm(attackerWeapon, target) {

        let additionalPercentage = 0;

        // attacker and its utils
        const whoDisarm = target == CONSTANTS._player ? CONSTANTS._opponent : CONSTANTS._player;
        const attackerSKills = target == CONSTANTS._player ? this.opponentUtils.skills : this.playerUtils.skills;
        const attacker_shieldBreaker = attackerSKills.find(skill => skill == 13); // shield breaker skill
        const attacker_shockWave = attackerSKills.find(skill => skill == 23); // shock wave skill

        // defender utils
        const weaponToRemove = target == CONSTANTS._player ? this.playerUtils.activeWeapon : this.opponentUtils.activeWeapon;
        const defender_heaterShield = weaponToRemove == 1; // heater shield weapon

        if (attacker_shieldBreaker && defender_heaterShield) additionalPercentage += 15;

        if (attacker_shockWave) additionalPercentage += 100;

        const total = attackerWeapon.disarm + additionalPercentage;
        let disarmPercentage = total || 0;
        let result = false; // Initialize the result

        // // Directly calculate the remaining chance (if below 100)
        if (disarmPercentage > 0) {
            const isSuccessful = this.calculateChance(disarmPercentage); // Attempt the remaining chance
            if (isSuccessful) result = true; // true -> do disarm
        }

        if (result) {

            if (weaponToRemove != null || weaponToRemove != undefined) {
                this.generateLogs(this.init, { type: CONSTANTS._actions.disarm, by: whoDisarm, weaponRemoved: weaponToRemove });

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

    calculateSureDisarm(target) {
        // attacker and its utils
        const whoDisarm = target == CONSTANTS._player ? CONSTANTS._opponent : CONSTANTS._player;
        let weaponToRemove = -1;
        let weaponLength = 0;

        if (target == CONSTANTS._player) {
            weaponLength = this.playerUtils.weapons.length;
            if (weaponLength >= 1) {
                weaponToRemove = this.playerUtils.weapons[weaponLength - 1];
                this.playerUtils.weapons.pop();
            }
        } else {
            weaponLength = this.opponentUtils.weapons.length;
            if (weaponLength >= 1) {
                weaponToRemove = this.opponentUtils.weapons[weaponLength - 1];
                this.opponentUtils.weapons.pop();
            }
        }

        if (weaponLength > 0) {
            this.generateLogs(this.init, { type: CONSTANTS._actions.sabotage, by: whoDisarm, weaponRemoved: weaponToRemove });
        }
    }

    calculateEvasion(evasion, target) {

        let additionSkillEvasion = 0;
        const targetDefender = target == CONSTANTS._player ? this.playerUtils : this.opponentUtils;
        const phanthomSteps = targetDefender.skills.find(s => s == 40); // passive skill

        if (phanthomSteps) additionSkillEvasion += 25;

        let evasionPercentage = evasion || 0;
        const additional = target == CONSTANTS._player ? this.playerEvasion : this.opponentEvasion;
        const final = evasionPercentage + additional + additionSkillEvasion;
        let result = false; // Initialize the result

        // // Directly calculate the remaining chance (if below 100)
        if (final > 0) {
            const isSuccessful = this.calculateChance(final); // Attempt the remaining chance
            if (isSuccessful) result = true; // true -> evade attack
        }

        return result;
    }

    calculateBlock(block, target) {

        let blockPercentage = block || 0;
        let result = false; // Initialize the result
        let skillAdditionalBlock = 0;

        const targetDefender = target == CONSTANTS._player ? this.playerUtils : this.opponentUtils;
        const shieldSkill = targetDefender.skills.find(s => s == 27);
        if (shieldSkill) skillAdditionalBlock += 15;

        const additional = target == CONSTANTS._player ? this.playerBlock : this.opponentBlock;
        const final = blockPercentage + additional + skillAdditionalBlock;

        // // Directly calculate the remaining chance (if below 100)
        if (final > 0) {
            const isSuccessful = this.calculateChance(final); // Attempt the remaining chance
            if (isSuccessful) result = true; // true -> evade attack
        }

        return result;
    }

    changeWeapon(target, isSteal, weaponToSteal) {

        const isPlayer = target == CONSTANTS._player;
        const randomChance = 25;
        const utils = isPlayer ? this.playerUtils : this.opponentUtils;
        const theDefender = isPlayer ? CONSTANTS._opponent : CONSTANTS._player;

        if (isSteal) {

            if (target == CONSTANTS._player) { // player execute steal
                this.playerUtils.activeWeapon = weaponToSteal; // change player weapon to opponent's
                this.opponentUtils.activeWeapon = null; // remove defender weapon
            } else {
                this.opponentUtils.activeWeapon = weaponToSteal; // change opponents weapon to player's
                this.playerUtils.activeWeapon = null; // remove defender weapon
            }

            this.generateLogs(
                this.init,
                { type: CONSTANTS._actions.skill, by: target },
                { skill: "Steal", target: theDefender, weapon: weaponToSteal }
            );
            return CONSTANTS.weaponStats.find(w => w.number === weaponToSteal);
        } else {
            const randomChanceResult = this.calculateChance(randomChance);
            if (utils.weapons.length > 0 && randomChanceResult) {
                const oldWeapon = utils.activeWeapon;
                const newWeapon = this.randomArrayIndex(utils.weapons);
                utils.weapons = utils.weapons.filter(w => w !== oldWeapon && w !== newWeapon);
                utils.activeWeapon = newWeapon;

                this.generateLogs(this.init, {
                    type: CONSTANTS._actions.changeWeapon,
                    by: target,
                    old: oldWeapon || -1,
                    new: newWeapon || -1
                });

                return CONSTANTS.weaponStats.find(w => w.number === newWeapon);
            }
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
        // survival skill 41
        const playerSurvival = this.playerUtils.skills.find(s => s == 41);
        const opponentSurvival = this.opponentUtils.skills.find(s => s == 41);

        if (playerSurvival) this.canSurvive.player = true;
        if (opponentSurvival) this.canSurvive.opponent = true;

        // revive skill 28
        const playerRevive = this.playerUtils.skills.find(s => s == 28);
        const opponentRevive = this.opponentUtils.skills.find(s => s == 28);

        if (playerRevive) this.canRevive.player = true;
        if (opponentRevive) this.canRevive.opponent = true;

        // preemptive strike skill 48
        const playerFirstAttack = this.playerUtils.skills.find(s => s == 48);
        const opponentFirstAttack = this.opponentUtils.skills.find(s => s == 48);

        if (playerFirstAttack) this.firstAttack.player = true;
        if (opponentFirstAttack) this.firstAttack.opponent = true;

        // health potion skill 1
        const playerHealthPotion = this.playerUtils.skills.find(s => s == 1);
        const opponentHealthPotion = this.opponentUtils.skills.find(s => s == 1);

        if (playerHealthPotion) this.healthPotion.player = true;
        if (opponentHealthPotion) this.healthPotion.opponent = true;

        // bandage skill 32
        const playerBandage = this.playerUtils.skills.find(s => s == 32);
        const opponentBandage = this.opponentUtils.skills.find(s => s == 32);

        if (playerBandage) this.bandage.player.available = true;
        if (opponentBandage) this.bandage.opponent.available = true;

        // poison potion skill 19
        const playerPoisonPotion = this.playerUtils.skills.find(s => s == 19);
        const opponentPoisonPotion = this.opponentUtils.skills.find(s => s == 19);

        if (playerPoisonPotion) this.PoisonPotion.player.available = true;
        if (opponentPoisonPotion) this.PoisonPotion.opponent.available = true;

        // Bomb skill 31
        const playerBomb = this.playerUtils.skills.find(s => s == 31);
        const opponentBomb = this.opponentUtils.skills.find(s => s == 31);

        if (playerBomb) this.bomb.player = true;
        if (opponentBomb) this.bomb.opponent = true;

        // poison touch skill 12
        const playerPoisonTouch = this.playerUtils.skills.find(s => s == 12);
        const opponentPoisonTouch = this.opponentUtils.skills.find(s => s == 12);

        if (playerPoisonTouch) this.poisonTouch.player = true;
        if (opponentPoisonTouch) this.poisonTouch.opponent = true;

        // aura skill 17
        const auraPlayer = this.playerUtils.skills.find(skill => skill == 17);
        const auraOpponent = this.opponentUtils.skills.find(skill => skill == 17);

        if (auraPlayer) this.buff.player.aura = true;
        if (auraOpponent) this.buff.opponent.aura = true;

        // susanoo skill 4
        const susanooPlayer = this.playerUtils.skills.find(skill => skill == 4);
        const susanooOpponent = this.opponentUtils.skills.find(skill => skill == 4);

        if (susanooPlayer) this.buff.player.susanoo = true;
        if (susanooOpponent) this.buff.opponent.susanoo = true;

        // genjutsu skill 2
        const genjutsuPlayer = this.playerUtils.skills.find(skill => skill == 2);
        const genjutsuOpponent = this.opponentUtils.skills.find(skill => skill == 2);

        if (genjutsuPlayer) this.genjutsu.player = true;
        if (genjutsuOpponent) this.genjutsu.opponent = true;

        // discharge skill 25
        const dischargePlayer = this.playerUtils.skills.find(skill => skill == 25);
        const dischargeOpponent = this.opponentUtils.skills.find(skill => skill == 25);

        if (dischargePlayer) this.discharge.player = true;
        if (dischargeOpponent) this.discharge.opponent = true;

        // pet master skill 11
        const petMasterPlayer = this.playerUtils.skills.find(skill => skill == 11);
        const petMasterOpponent = this.opponentUtils.skills.find(skill => skill == 11);

        if (petMasterPlayer) this.petMaster.player = true;
        if (petMasterOpponent) this.petMaster.opponent = true;

        // scare skill 22
        const scarePlayer = this.playerUtils.skills.find(skill => skill == 22);
        const scareOpponent = this.opponentUtils.skills.find(skill => skill == 22);

        if (scarePlayer) this.scare.player = true;
        if (scareOpponent) this.scare.opponent = true;

        // steal skill 26
        const stealPlayer = this.playerUtils.skills.find(skill => skill == 26);
        const stealOpponent = this.opponentUtils.skills.find(skill => skill == 26);

        if (stealPlayer) this.steal.player = true;
        if (stealOpponent) this.steal.opponent = true;

        // rage skill 14
        const ragePlayer = this.playerUtils.skills.find(skill => skill == 14);
        const rageOpponent = this.opponentUtils.skills.find(skill => skill == 14);

        if (ragePlayer) this.rage.player = true;
        if (rageOpponent) this.rage.opponent = true;

        // lightningBolt skill 20
        const lightningBoltPlayer = this.playerUtils.skills.find(skill => skill == 20);
        const lightningBoltOpponent = this.opponentUtils.skills.find(skill => skill == 20);

        if (lightningBoltPlayer) this.lightningBolt.player = 2;
        if (lightningBoltOpponent) this.lightningBolt.opponent = 2;

        // spellmaster skill 15
        const playerSpellMaster = this.playerUtils.skills.find(s => s == 15);
        const opponentSpellMaster = this.opponentUtils.skills.find(s => s == 15);

        if (playerSpellMaster) this.spellMaster.player = true;
        if (opponentSpellMaster) this.spellMaster.opponent = true;

        // thorns skill 30
        const thornsPlayer = this.playerUtils.skills.find(skill => skill == 30);
        const thornsOpponent = this.opponentUtils.skills.find(skill => skill == 30);

        if (thornsPlayer) this.thorns.player = true;
        if (thornsOpponent) this.thorns.opponent = true;

        // hollow form skill 3
        const playerHollow = this.playerUtils.skills.find(s => s == 3);
        const opponentHollow = this.opponentUtils.skills.find(s => s == 3);

        if (playerHollow) this.hollowForm.player.available = true;
        if (opponentHollow) this.hollowForm.opponent.available = true;

        // true strike skill 34
        const playerTrueStrike = this.playerUtils.skills.find(s => s == 34);
        const opponentTrueStrike = this.opponentUtils.skills.find(s => s == 34);

        if (playerTrueStrike) this.trueStrike.player = true;
        if (opponentTrueStrike) this.trueStrike.opponent = true;

        if (this.firstAttack.player && playerFirstAttack) {
            this.currentPlayerSpeed += 1000;
            this.firstAttack.player = false;
        }

        if (this.firstAttack.opponent && opponentFirstAttack) {
            this.currentOpponentSpeed += 1000;
            this.firstAttack.opponent = false;
        }

        // Loop until one character's life reaches zero
        while (this.playerLife > 0 && this.opponentLife > 0) {
            // Increment speeds for both characters
            this.currentPlayerSpeed += this.playerSpeed;
            this.currentOpponentSpeed += this.opponentSpeed;

            // Player
            const player_weaponNumber = this.playerUtils.activeWeapon || -1;
            let player_weaponToUse = CONSTANTS.weaponStats.find(w => w.number == player_weaponNumber);
            let playerDamage = this.calculateDamage(this.currentCharDetails.attributes.damage, this.loadedOpponent.attributes.armor, player_weaponToUse, CONSTANTS._player);
            let playerCombo = this.calculateCombo(player_weaponToUse.combo, CONSTANTS._player);

            // Opponent
            const opponent_weaponNumber = this.opponentUtils.activeWeapon || -1;
            let opponent_weaponToUse = CONSTANTS.weaponStats.find(w => w.number == opponent_weaponNumber);
            let oppponentDamage = this.calculateDamage(this.loadedOpponent.attributes.damage, this.currentCharDetails.attributes.armor, opponent_weaponToUse, CONSTANTS._opponent);
            let opponentCombo = this.calculateCombo(opponent_weaponToUse.combo, CONSTANTS._opponent);

            this.playerBlock = player_weaponToUse.block || 0;
            this.opponentBlock = opponent_weaponToUse.block || 0;

            // Reduce speed for using a Weapon
            this.currentPlayerSpeed += player_weaponToUse.speed; // negative values
            this.currentOpponentSpeed += opponent_weaponToUse.speed; // negative values

            if (this.currentPlayerSpeed >= this.maxSpeed && this.currentPlayerSpeed > this.currentOpponentSpeed) {
                if (this.isStun.player == false) {
                    this.processTurns(CONSTANTS._player, playerDamage, playerCombo, player_weaponToUse, opponent_weaponToUse, oppponentDamage);
                } else {
                    this.generateLogs(this.init, { type: CONSTANTS._actions.cantMove, by: CONSTANTS._player });
                    this.isStun.player = false;
                }
                this.init += 1;
            } else if (this.currentOpponentSpeed >= this.maxSpeed && this.currentOpponentSpeed > this.currentPlayerSpeed) {
                if (this.isStun.opponent == false) {
                    const opponentTargets = this.playerUtils.pets.filter(p => p.hp !== 0);
                    let opponentTargetNumbers = opponentTargets.map(o => { return o.index; });
                    opponentTargetNumbers.push(this.playerUtils.pets.length);
                    const opponentTarget = this.randomArrayIndex(opponentTargetNumbers);
                    if (opponentTarget == this.playerUtils.pets.length) { // attack player character
                        console.log('attack opponent', opponentTarget)
                        this.processTurns(
                            CONSTANTS._opponent, oppponentDamage, opponentCombo,
                            opponent_weaponToUse, player_weaponToUse, playerDamage
                        );
                    } else {
                        // this.processTurnsToPets(
                        //     CONSTANTS._opponent, oppponentDamage, opponentCombo,
                        //     opponent_weaponToUse, this.playerUtils.pets[opponentTarget]
                        // );
                        const petRemainingLife = this.playerUtils.pets[opponentTarget].hp - 25;
                        this.playerUtils.pets[opponentTarget].hp = petRemainingLife > 0 ? petRemainingLife : 0;
                        console.log('atack pet target damage 25 ->', this.playerUtils.pets[opponentTarget]);
                    }
                } else {
                    this.generateLogs(this.init, { type: CONSTANTS._actions.cantMove, by: CONSTANTS._opponent });
                    this.isStun.opponent = false;
                }
                this.init += 1;
            } else {
                const rand_value = this.randomizer(1);

                if (rand_value == 0) {
                    this.currentPlayerSpeed += 300;
                } else {
                    this.currentOpponentSpeed += 300;
                }
            }
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
        const defender = targetUser == CONSTANTS._player ? CONSTANTS._opponent : CONSTANTS._player;

        if (this.isStun[target]) {
            this.generateLogs(this.init, { type: CONSTANTS._actions.stunned, by: defender, attacker: target });
            this.isStun[target] = false;
            return true;
        }

        return false;
    }

    calculateStun(targetuser) { // target user == attacker
        const target = targetuser == CONSTANTS._player ? CONSTANTS._player : CONSTANTS._opponent;
        const defender = targetuser == CONSTANTS._player ? CONSTANTS._opponent : CONSTANTS._player;
        const theDefenderSkills = attacker == CONSTANTS._player ? this.opponentUtils : this.playerUtils;

        const octopusV = theDefenderSkills.skills.find(skill => skill == 35); // octopus viscous skill 35 passive
        const calculateIgnore = !!octopusV ? this.calculateChance(40) : false;

        const stunValue = calculateIgnore ? 0 : 15;
        const isStunned = this.calculateChance(stunValue); // 15% chance to stun default

        if (isStunned) {
            this.generateLogs(this.init, { type: CONSTANTS._actions.stunned, by: defender, attacker: target });
        }

        this.isStun[defender] = isStunned ? true : false;
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

    processTurns(attacker, attackerDamage, attackerCombo, attacker_weaponToUse, defender_weaponToUse, defenderDamage) {

        let skillFlag = 0; // flag for skill that should not be execute at the same time
        const theAttacker = attacker == CONSTANTS._player ? CONSTANTS._player : CONSTANTS._opponent;
        const theDefender = attacker == CONSTANTS._player ? CONSTANTS._opponent : CONSTANTS._player;

        const theAttackerUtils = attacker == CONSTANTS._player ? this.currentCharDetails : this.loadedOpponent;
        const theAttackerActiveUtils = attacker == CONSTANTS._player ? this.playerUtils : this.opponentUtils;
        const theAttackerLife = attacker == CONSTANTS._player ? this.playerLife : this.opponentLife;
        const theAttackerLifeMax = attacker == CONSTANTS._player ? this.life.max.player : this.life.max.opponent;

        const theDefenderUtils = attacker == CONSTANTS._player ? this.loadedOpponent : this.currentCharDetails;
        const theDefenderActiveUtils = attacker == CONSTANTS._player ? this.opponentUtils : this.playerUtils;
        const theDefenderCounter = attacker == CONSTANTS._player ? this.canCounter.opponent : this.canCounter.player;

        this.generateLogs(this.init, { type: CONSTANTS._actions.move, by: theAttacker });

        let isChangeWeapon = false;
        var changeWeaponResult = this.changeWeapon(theAttacker);
        if (changeWeaponResult) {
            attacker_weaponToUse = changeWeaponResult;
            attackerDamage = this.calculateDamage(theAttackerUtils.attributes.damage, theDefenderUtils.attributes.armor, attacker_weaponToUse, theAttacker);
            isChangeWeapon = true;
        };

        if (this.steal[theAttacker] && skillFlag != 1 && !isChangeWeapon) {
            const calculateSteal = this.calculateChance(15);
            if (calculateSteal && theDefenderActiveUtils.activeWeapon != null && theDefenderActiveUtils.activeWeapon != -1) {

                var stealWeaponResult = this.changeWeapon(theAttacker, true, theDefenderActiveUtils.activeWeapon);
                if (stealWeaponResult) {
                    attacker_weaponToUse = stealWeaponResult;
                    attackerDamage = this.calculateDamage(theAttackerUtils.attributes.damage, theDefenderUtils.attributes.armor, attacker_weaponToUse, theAttacker);
                };
            }
        }

        const calculateHollow = this.hollowForm[theAttacker].available ? this.calculateChance(15) : false;
        if (this.hollowForm[theAttacker].count <= 0 && this.hollowForm[theAttacker].active) {
            this.hollowForm[theAttacker].active = false;
            this.hollowForm[theAttacker].count = 0;
            this.hollowForm[theAttacker].available = false;
        }
        if (calculateHollow) {
            this.generateLogs(this.init, { type: CONSTANTS._actions.skill, by: theAttacker }, { skill: "Hollow Form" });
            this.hollowForm[theAttacker].active = true;
            this.hollowForm[theAttacker].count = 2;
            this.hollowForm[theAttacker].available = false;
        }

        if (this.hollowForm[theAttacker]) {
            const hollowForm = theAttackerActiveUtils.skills.find(s => s == 3); // passive skill

            if (hollowForm && this.hollowForm[theAttacker].active && this.hollowForm[theAttacker].count > 0) {
                attackerCombo += 2;
                this.hollowForm[theAttacker].count -= 1;
            };
        }

        // lightningbolt skill 20 
        const withSpellBook = theAttackerActiveUtils.activeWeapon == 11; // with spell book
        const executeBolt = this.calculateChance(15);
        if (this.lightningBolt[theAttacker] == 2 && withSpellBook && skillFlag != 1 && executeBolt) {
            const boltDamage = [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35];
            const boltNumber = this.randomizer(10);
            const withSpellMaster = this.spellMaster[theAttacker];
            const finalBoltDamage = withSpellMaster ? boltDamage[boltNumber] * 1.5 : boltDamage[boltNumber];

            if (theAttacker == CONSTANTS._player) {
                const finalLifeBolt = this.opponentLife - finalBoltDamage;
                this.opponentLife = finalLifeBolt < 0 ? 0 : finalLifeBolt;
                this.generateLogs(
                    this.init,
                    { type: CONSTANTS._actions.throw, by: CONSTANTS._player },
                    { name: "Lightning Bolt", damage: finalBoltDamage },
                    { player: this.playerLife, opponent: this.opponentLife }
                );
            } else {
                const finalLifeBomb = this.playerLife - finalBoltDamage;
                this.playerLife = finalLifeBomb < 0 ? 0 : finalLifeBomb;
                this.generateLogs(
                    this.init,
                    { type: CONSTANTS._actions.throw, by: CONSTANTS._opponent },
                    { name: "Lightning Bolt", damage: finalBoltDamage },
                    { player: this.playerLife, opponent: this.opponentLife }
                );
            }
            this.lightningBolt[theAttacker] = 0;
            skillFlag = 1;
        }

        // pet master skill 11 -> steal pets
        const defenderPets = theDefenderActiveUtils.pets.length;
        if (this.scare[theAttacker] && defenderPets > 0 && skillFlag != 1) {
            const executeScarePet = this.calculateChance(15);
            if (executeScarePet) {
                const petToScare = theDefenderActiveUtils.pets;

                if (theAttacker == CONSTANTS._player) {
                    this.opponentUtils.pets = [];
                } else {
                    this.playerUtils.pets = [];
                }
                this.generateLogs(this.init, { type: CONSTANTS._actions.skill, by: theAttacker }, { skill: "Scare", target: theDefender, pets: petToScare });
                this.scare[theAttacker] = false;
                skillFlag = 1;
            }
        }

        // pet master skill 11 -> steal pets
        if (this.petMaster[theAttacker] && defenderPets > 0 && skillFlag != 1) {
            const executeStealPet = this.calculateChance(15);
            if (executeStealPet) {
                const petToSteal = theDefenderActiveUtils.pets;
                const newPets = theAttackerActiveUtils.pets.concat(theDefenderActiveUtils.pets);

                if (theAttacker == CONSTANTS._player) {
                    this.playerUtils.pets = newPets;
                    this.opponentUtils.pets = [];
                } else {
                    this.playerUtils.pets = [];
                    this.opponentUtils.pets = newPets;
                }
                this.generateLogs(this.init, { type: CONSTANTS._actions.skill, by: theAttacker }, { skill: "Pet Master", target: theDefender, pets: petToSteal });
                this.petMaster[theAttacker] = false;
                skillFlag = 1;
            }
        }

        // genjutsu debuff skill 2
        if (this.genjutsu[theAttacker] && skillFlag != 1) {
            const executeGenjutsu = this.calculateChance(15);
            if (executeGenjutsu) { // remove current opponent buff
                this.buff[theDefender].aura = false;
                this.buff[theDefender].susanoo = false;
                this.debuff[theDefender].genjutsu = true; // affect debuff
                this.genjutsu[theAttacker] = false;
                this.generateLogs(this.init, { type: CONSTANTS._actions.skill, by: theAttacker }, { skill: "Genjutsu", target: theDefender });
                skillFlag = 1;
            }
        }

        // bandage 32 skill
        const halfLifeBandage = theAttackerLifeMax / 2;
        if (this.bandage[theAttacker].available && theAttackerLife <= halfLifeBandage && skillFlag != 1) {
            if (this.calculateChance(15)) {
                this.bandage[theAttacker].active = true;
                this.bandage[theAttacker].available = false;
                this.bandage[theAttacker].count = 5;
                skillFlag = 1;
            }
        }

        if (this.bandage.player.count <= 0) this.bandage.player.active = false;
        if (this.bandage.player.active && this.bandage.player.count > 0) {
            this.bandage.player.count -= 1;
            this.playerLife += 5;
            this.generateLogs(
                this.init,
                { type: CONSTANTS._actions.bandage, by: CONSTANTS._player },
                { heal: `+${5}`, remaining: this.bandage.player.count },
                { player: this.playerLife, opponent: this.opponentLife }
            );
        }

        if (this.bandage.opponent.count <= 0) this.bandage.opponent.active = false;
        if (this.bandage.opponent.active && this.bandage.opponent.count > 0) {
            this.bandage.opponent.count -= 1;
            this.opponentLife += 5;
            this.generateLogs(
                this.init,
                { type: CONSTANTS._actions.bandage, by: CONSTANTS._opponent },
                { heal: `+${5}`, remaining: this.bandage.opponent.count },
                { player: this.playerLife, opponent: this.opponentLife }
            );
        }

        // health potion 1 skill
        const healthPotionPercentage = theAttackerLife < (theAttackerLifeMax * 0.6);
        const healthPointsPlus = [25, 30, 35];
        const hpRandom = this.randomizer(2);
        const hpToUse = healthPotionPercentage && this.healthPotion[theAttacker] ? healthPointsPlus[hpRandom] : 0;
        let finalHp = 0;
        if (hpToUse != 0 && skillFlag != 1) {
            const draftHP = theAttackerLife + hpToUse;
            const maxHpChecker = draftHP > this.life.max[theAttacker];
            finalHp = maxHpChecker ? theAttackerLifeMax - theAttackerLife : hpToUse;
            if (attacker == CONSTANTS._player) {
                this.playerLife += finalHp;
                this.PoisonPotion.opponent.active = false; // remove poison effect
                this.PoisonPotion.opponent.count = 0;
                this.poisonTouch.opponent = false;
            } else {
                this.opponentLife += finalHp;
                this.PoisonPotion.player.active = false; // remove poison effect
                this.PoisonPotion.player.count = 0;
                this.poisonTouch.player = false;
            }
            this.healthPotion[theAttacker] = false;
            skillFlag = 1;
            this.generateLogs(
                this.init,
                { type: CONSTANTS._actions.drink, by: theAttacker },
                { heal: `+${finalHp}` },
                { player: this.playerLife, opponent: this.opponentLife }
            );
        }

        // poision potion skill 19 (available, active, count)
        if (this.PoisonPotion[theAttacker].available && skillFlag != 1) {
            if (this.calculateChance(15)) {
                this.PoisonPotion[theAttacker].active = true;
                this.PoisonPotion[theAttacker].available = false;
                this.PoisonPotion[theAttacker].count = 5;
                skillFlag = 1;
            }
        }

        if (this.PoisonPotion.player.count <= 0) this.PoisonPotion.player.active = false;
        if (this.PoisonPotion.player.active && this.PoisonPotion.player.count > 0) {
            this.PoisonPotion.player.count -= 1;
            this.opponentLife -= 5;
            this.generateLogs(
                this.init,
                { type: CONSTANTS._actions.throw, by: CONSTANTS._player },
                { name: "Poison Potion", remaining: this.PoisonPotion.player.count, damage: 5 },
                { player: this.playerLife, opponent: this.opponentLife }
            );
        }

        if (this.PoisonPotion.opponent.count <= 0) this.PoisonPotion.opponent.active = false;
        if (this.PoisonPotion.opponent.active && this.PoisonPotion.opponent.count > 0) {
            this.PoisonPotion.opponent.count -= 1;
            this.playerLife -= 5;
            this.generateLogs(
                this.init,
                { type: CONSTANTS._actions.throw, by: CONSTANTS._opponent },
                { name: "Poison Potion", remaining: this.PoisonPotion.opponent.count, damage: 5 },
                { player: this.playerLife, opponent: this.opponentLife }
            );
        }

        if (this.bomb[theAttacker] && skillFlag != 1) {
            const executeBomb = this.calculateChance(15);
            if (executeBomb) {

                const bombDamage = [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
                const bombNumber = this.randomizer(10);
                const finalBombDamage = bombDamage[bombNumber];

                if (theAttacker == CONSTANTS._player) {
                    const finalLifeBomb = this.opponentLife - finalBombDamage;
                    this.opponentLife = finalLifeBomb < 0 ? 0 : finalLifeBomb;
                    this.generateLogs(
                        this.init,
                        { type: CONSTANTS._actions.throw, by: CONSTANTS._player },
                        { name: "Bomb", damage: finalBombDamage },
                        { player: this.playerLife, opponent: this.opponentLife }
                    );
                } else {
                    const finalLifeBomb = this.playerLife - finalBombDamage;
                    this.playerLife = finalLifeBomb < 0 ? 0 : finalLifeBomb;
                    this.generateLogs(
                        this.init,
                        { type: CONSTANTS._actions.throw, by: CONSTANTS._opponent },
                        { name: "Bomb", damage: finalBombDamage },
                        { player: this.playerLife, opponent: this.opponentLife }
                    );
                }

                this.bomb[theAttacker] = false;
                skillFlag = 1;
            }
        }

        const theAttackerDischarge = theAttackerActiveUtils.weapons.length; // 4 weapons to be thrown
        if (this.discharge[theAttacker] && theAttackerDischarge >= 4 && skillFlag != 1) {
            const executeDischarge = this.calculateChance(15);
            if (executeDischarge) {

                let dischargeDamage = 0;
                let weaponNumber = [];

                for (let i = 0; i < 4; i++) {
                    const weaponDischarge = theAttackerActiveUtils.weapons[i];
                    const weaponDetails = CONSTANTS.weaponStats.find(w => w.number == weaponDischarge);
                    dischargeDamage += weaponDetails.damage;
                    weaponNumber.push(weaponDetails.number);
                }

                const additionalDischargeDamage = Math.floor(dischargeDamage * 0.5);
                dischargeDamage += additionalDischargeDamage;

                if (theAttacker == CONSTANTS._player) {
                    const remainingWeapon = this.playerUtils.weapons.filter(w => !weaponNumber.includes(w));
                    this.playerUtils.weapons = remainingWeapon;
                    this.opponentLife -= dischargeDamage;
                } else {
                    const remainingWeapon = this.opponentUtils.weapons.filter(w => !weaponNumber.includes(w));
                    this.opponentUtils.weapons = remainingWeapon;
                    this.playerLife -= dischargeDamage;
                }

                this.generateLogs(
                    this.init,
                    { type: CONSTANTS._actions.throw, by: theAttacker },
                    { name: "Discharge", weapons: weaponNumber, damage: dischargeDamage },
                    { player: this.playerLife < 0 ? 0 : this.playerLife, opponent: this.opponentLife < 0 ? 0 : this.opponentLife }
                );

                this.discharge[theAttacker] = false;
                skillFlag = 1;
            }
        }

        if (this.poisonTouch[theAttacker]) {

            if (theAttacker == CONSTANTS._player) {
                const finalLifePoision = this.opponentLife - 1;
                this.opponentLife = finalLifePoision < 0 ? 0 : finalLifePoision;
            } else {
                const finalLifePoision = this.playerLife - 1;
                this.playerLife = finalLifePoision < 0 ? 0 : finalLifePoision;
            }

            this.generateLogs(
                this.init,
                { type: CONSTANTS._actions.poison, by: theDefender, attacker: theAttacker },
                { name: "Poison Touch", remaining: "unli", damage: 1 },
                { player: this.playerLife, opponent: this.opponentLife }
            );
        }

        // Opponent attacks!
        for (let i = 1; i <= attackerCombo; i++) {
            if (this.playerLife > 0 && this.opponentLife > 0) {
                this.processAttack(theAttacker, attacker_weaponToUse, attackerDamage, defender_weaponToUse, [i, attackerCombo]);
            }

            // theDefenderCounter
            if (theDefenderCounter && this.playerLife > 0 && this.opponentLife > 0) {
                this.generateLogs(this.init, { type: CONSTANTS._actions.counter, by: theDefender, attacker: theAttacker });
                this.processAttack(theDefender, defender_weaponToUse, defenderDamage, attacker_weaponToUse);
            }
        }

        // params player , opponent
        if (attacker == CONSTANTS._player) {
            this.calculateSpeed(true, false); // Reset Opponent speed counter
        } else {
            this.calculateSpeed(false, true); // Reset Opponent speed counter
        }

        if (this.playerLife <= 0 && this.canRevive.player) {
            this.playerLife = this.life.max.player * 0.2;
            this.canRevive.player = false;

            this.generateLogs(
                this.init,
                { type: CONSTANTS._actions.revive, by: CONSTANTS._player },
                {},
                { player: this.playerLife, opponent: this.opponentLife }
            );
        }
        if (this.opponentLife <= 0 && this.canRevive.opponent) {
            this.opponentLife = this.life.max.opponent * 0.2;
            this.canRevive.opponent = false;

            this.generateLogs(
                this.init,
                { type: CONSTANTS._actions.revive, by: CONSTANTS._opponent },
                {},
                { player: this.playerLife, opponent: this.opponentLife }
            );
        }


        if (this.playerLife > 0 && this.opponentLife > 0) {

            const attackerWithThrownWeapon = this.thrownWeapons.find(w => w == theAttackerActiveUtils.activeWeapon);
            if (attackerWithThrownWeapon) {
                this.generateLogs(this.init, { type: CONSTANTS._actions.stopThrow, by: theAttacker });
            } else {
                this.generateLogs(this.init, { type: CONSTANTS._actions.return, by: theAttacker });
            }

        } else {
            this.generateLogs(this.init, { type: CONSTANTS._actions.stop, by: CONSTANTS._player.concat(" and ", CONSTANTS._opponent) });
        }
    }

    processAttack(attacker, attackerWeapon, attackerDamage, defenderWeapon, comboInitMax) {

        const theAttacker = attacker == CONSTANTS._player ? CONSTANTS._player : CONSTANTS._opponent;
        const theAttackerSkills = attacker == CONSTANTS._player ? this.playerUtils : this.opponentUtils;
        const theDefenderSkills = attacker == CONSTANTS._player ? this.opponentUtils : this.playerUtils;

        const theDefender = attacker == CONSTANTS._player ? CONSTANTS._opponent : CONSTANTS._player;
        const theDefenderLife = attacker == CONSTANTS._player ? this.opponentLife : this.playerLife;

        const isWithThrownWeapon = this.thrownWeapons.find(w => w == attackerWeapon.number);

        let additionalAccuracy = 0;
        const bullsEye = theAttackerSkills.skills.find(skill => skill == 33); // bulls eye skill 33 passive
        const futureEye = theAttackerSkills.skills.find(skill => skill == 39); // future eye skill 39 passive
        const weaponBreaker = theAttackerSkills.skills.find(skill => skill == 43); // weapoBreaker skill 43 passive
        const weaponStriker = theAttackerSkills.skills.find(skill => skill == 42); // weaponStriker skill 42 passive

        // defender
        const hardHeaded = theDefenderSkills.skills.find(skill => skill == 36); // hard headed skill 36 passive

        if (hardHeaded) {
            const adjustedDamage = attackerDamage.finalDamage * 0.1;
            attackerDamage.finalDamage -= adjustedDamage;
        }

        if (this.buff[theDefender].aura) {
            attackerWeapon.counter += 3;
            attackerWeapon.evasion += 3;
            attackerWeapon.block += 3;
        }

        if (this.buff[theAttacker].susanoo) {
            attackerWeapon.finalDamage += 10;
            additionalAccuracy += 10;
        }

        if (this.buff[theDefender].susanoo) {
            attackerWeapon.block += 10;
        }

        if (this.debuff[theAttacker].genjutsu) {
            attackerWeapon.counter -= 5;
            attackerWeapon.evasion -= 5;
            attackerWeapon.block -= 5;
        }

        if (bullsEye && isWithThrownWeapon) additionalAccuracy += 20;
        if (futureEye && !isWithThrownWeapon) additionalAccuracy += 25;
        if (this.trueStrike[theAttacker]) {
            additionalAccuracy += 100;
            this.trueStrike[theAttacker] = false;
        }

        const finalAccuracy = attackerWeapon.accuracy + additionalAccuracy;
        let isAccurate = this.calculateAccuracy(finalAccuracy);
        let isDodgeOrBlock = false;

        if (isAccurate) {

            let additionalSkillDodge = 0;
            const randomAction = this.randomizer(1);
            const randomActionCode = randomAction == 0 ? CONSTANTS._actions.dodge : CONSTANTS._actions.block;
            const randomActionUtils = randomAction == 0 ? defenderWeapon.evasion : defenderWeapon.block;

            if (this.hollowForm[theDefender].count > 0 && this.hollowForm[theDefender].active) additionalSkillDodge += 20;

            const finalSkillDodge = additionalSkillDodge + randomActionUtils;
            const randomActionResult = randomAction == 0 ?
                this.calculateEvasion(finalSkillDodge, theDefender) :
                this.calculateBlock(finalSkillDodge, theDefender);

            if (randomActionResult) {
                this.generateLogs(this.init, { type: randomActionCode, by: theDefender, attacker: theAttacker });
                const withCounter = isWithThrownWeapon ? false : true; // false to not counter attack with thrown weapon
                const counterResult = this.calculateCounterAttack(defenderWeapon.counter, theDefender);
                this.canCounter[theDefender] = !!counterResult && !!withCounter ? true : false;
                isDodgeOrBlock = true;
            }

            if (!isDodgeOrBlock) {

                const withRage = this.rage[theAttacker] && this.calculateChance(15);
                const withWeaponStriker = weaponStriker ? this.calculateChance(15) : false;
                const allowWeaponStriker = attackerWeapon.number != -1 && withWeaponStriker && !!comboInitMax && (comboInitMax[1] == 1);
                let finalDamageUse = withWeaponStriker ? attackerDamage.finalDamage * 2 : attackerDamage.finalDamage;
                if (withRage) {
                    finalDamageUse = Math.floor(finalDamageUse * 1.6);
                    this.rage[theAttacker] = false;
                    this.generateLogs(this.init, { type: CONSTANTS._actions.skill, by: theAttacker }, { skill: "Rage", target: theDefender });
                }

                var remaining_defenderLife = Math.max(0, theDefenderLife - finalDamageUse); // Ensure life doesn't go below zero

                let survivable = false;
                if (attacker == CONSTANTS._player && this.canSurvive.opponent && remaining_defenderLife <= 0) {
                    this.canSurvive.opponent = false;
                    survivable = true;
                } else if (attacker == CONSTANTS._opponent && this.canSurvive.player && remaining_defenderLife <= 0) {
                    this.canSurvive.player = false;
                    survivable = true;
                }

                if (survivable) {
                    remaining_defenderLife = 1;
                }

                // Passive Vampire Skill 
                const withVampire = theAttackerSkills.skills.find(skill => skill == 16);
                let healPoints = 0; // default heal per hit

                if (withVampire && !isWithThrownWeapon && !withWeaponStriker) healPoints += 5;

                const isPlayerAttacker = theAttacker == CONSTANTS._player;
                const logP1 = isPlayerAttacker ? this.playerLife : remaining_defenderLife;
                const logP2 = isPlayerAttacker ? remaining_defenderLife : this.opponentLife;

                if (allowWeaponStriker || isWithThrownWeapon) { // throw weapon
                    this.generateLogs(
                        this.init,
                        { type: CONSTANTS._actions.throw, by: theAttacker },
                        { name: attackerWeapon.name, damage: finalDamageUse, crit: attackerDamage.withCrit, heal: healPoints },
                        { player: logP1, opponent: logP2 }
                    );

                    if (withWeaponStriker) { // remove active weapon 
                        if (theAttacker == CONSTANTS._player) {
                            this.playerUtils.activeWeapon = null;
                        } else {
                            this.opponentUtils.activeWeapon = null;
                        }
                    }

                    if (isPlayerAttacker) {
                        this.opponentLife = remaining_defenderLife;
                    } else {
                        this.playerLife = remaining_defenderLife;
                    }
                } else {
                    this.generateLogs(
                        this.init,
                        { type: CONSTANTS._actions.attack, by: theAttacker },
                        { name: attackerWeapon.name, damage: finalDamageUse, crit: attackerDamage.withCrit, heal: healPoints },
                        { player: logP1, opponent: logP2 }
                    );

                    if (isPlayerAttacker) {
                        this.opponentLife = remaining_defenderLife;
                    } else {
                        this.playerLife = remaining_defenderLife;
                    }

                    if (this.thorns[theAttacker]) {
                        let remaingLifeThorns = 0;
                        const thornsDamage = Math.floor(finalDamageUse * 0.15);

                        if (isPlayerAttacker) {
                            remaingLifeThorns = Math.max(0, this.playerLife - thornsDamage);
                        } else {
                            remaingLifeThorns = Math.max(0, this.opponentLife - thornsDamage);
                        }
                        const tlogP1 = isPlayerAttacker ? remaingLifeThorns : this.playerLife;
                        const tlogP2 = !isPlayerAttacker ? remaingLifeThorns : this.opponentLife;

                        this.generateLogs(
                            this.init,
                            { type: CONSTANTS._actions.thorns, by: theDefender },
                            { skill: "Thorns", damage: thornsDamage },
                            { player: tlogP1, opponent: tlogP2 }
                        );

                        if (isPlayerAttacker) {
                            this.playerLife = remaingLifeThorns;
                        } else {
                            this.opponentLife = remaingLifeThorns;
                        }
                    }

                    if (weaponBreaker) {
                        this.calculateSureDisarm(theDefender);
                    } else {
                        this.calculateDisarm(attackerWeapon, theDefender);
                    }

                    // Passive Basher Skill 
                    const withBash = !!comboInitMax && (comboInitMax[0] == comboInitMax[1]);
                    if (withBash) {
                        const withBasher = theAttackerSkills.skills.find(skill => skill == 6);
                        const isWithHeavyWeapon = this.heavyWeapons.find(w => w == attackerWeapon.number);
                        if (withBasher && isWithHeavyWeapon) {
                            this.calculateStun(theAttacker);
                        };
                    }
                }

                this.canCounter[theDefender] = false;
            }
        } else {
            const random_missed_Action = this.randomizer(1);
            const random_missed_ActionCode = random_missed_Action == 0 ? CONSTANTS._actions.dodge : CONSTANTS._actions.block;

            this.generateLogs(this.init, { type: random_missed_ActionCode, by: theDefender, attacker: theAttacker });
            this.canCounter[theDefender] = false;
        }
    }

    processTurnsToPets(attacker, attackerDamage, attackerCombo, attacker_weaponToUse, petDetails) {

        let skillFlag = 0; // flag for skill that should not be execute at the same time
        const theAttacker = attacker == CONSTANTS._player ? CONSTANTS._player : CONSTANTS._opponent;
        const theDefender = attacker == CONSTANTS._player ? CONSTANTS._opponent : CONSTANTS._player;

        const theAttackerUtils = attacker == CONSTANTS._player ? this.currentCharDetails : this.loadedOpponent;
        const theAttackerActiveUtils = attacker == CONSTANTS._player ? this.playerUtils : this.opponentUtils;
        const theAttackerLife = attacker == CONSTANTS._player ? this.playerLife : this.opponentLife;
        const theAttackerLifeMax = attacker == CONSTANTS._player ? this.life.max.player : this.life.max.opponent;

        const theDefenderUtils = attacker == CONSTANTS._player ? this.loadedOpponent : this.currentCharDetails;
        const theDefenderActiveUtils = attacker == CONSTANTS._player ? this.opponentUtils : this.playerUtils;
        const theDefenderCounter = attacker == CONSTANTS._player ? this.canCounter.opponent : this.canCounter.player;

        this.generateLogs(this.init, { type: CONSTANTS._actions.move, by: theAttacker });

        let isChangeWeapon = false;
        var changeWeaponResult = this.changeWeapon(theAttacker);
        if (changeWeaponResult) {
            attacker_weaponToUse = changeWeaponResult;
            attackerDamage = this.calculateDamage(theAttackerUtils.attributes.damage, theDefenderUtils.attributes.armor, attacker_weaponToUse, theAttacker);
            isChangeWeapon = true;
        };

        if (this.steal[theAttacker] && skillFlag != 1 && !isChangeWeapon) {
            const calculateSteal = this.calculateChance(15);
            if (calculateSteal && theDefenderActiveUtils.activeWeapon != null && theDefenderActiveUtils.activeWeapon != -1) {

                var stealWeaponResult = this.changeWeapon(theAttacker, true, theDefenderActiveUtils.activeWeapon);
                if (stealWeaponResult) {
                    attacker_weaponToUse = stealWeaponResult;
                    attackerDamage = this.calculateDamage(theAttackerUtils.attributes.damage, theDefenderUtils.attributes.armor, attacker_weaponToUse, theAttacker);
                };
            }
        }

        const calculateHollow = this.hollowForm[theAttacker].available ? this.calculateChance(15) : false;
        if (this.hollowForm[theAttacker].count <= 0 && this.hollowForm[theAttacker].active) {
            this.hollowForm[theAttacker].active = false;
            this.hollowForm[theAttacker].count = 0;
            this.hollowForm[theAttacker].available = false;
        }
        if (calculateHollow) {
            this.generateLogs(this.init, { type: CONSTANTS._actions.skill, by: theAttacker }, { skill: "Hollow Form" });
            this.hollowForm[theAttacker].active = true;
            this.hollowForm[theAttacker].count = 2;
            this.hollowForm[theAttacker].available = false;
        }

        if (this.hollowForm[theAttacker]) {
            const hollowForm = theAttackerActiveUtils.skills.find(s => s == 3); // passive skill

            if (hollowForm && this.hollowForm[theAttacker].active && this.hollowForm[theAttacker].count > 0) {
                attackerCombo += 2;
                this.hollowForm[theAttacker].count -= 1;
            };
        }

        // lightningbolt skill 20 
        const withSpellBook = theAttackerActiveUtils.activeWeapon == 11; // with spell book
        const executeBolt = this.calculateChance(15);
        if (this.lightningBolt[theAttacker] == 2 && withSpellBook && skillFlag != 1 && executeBolt) {
            const boltDamage = [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35];
            const boltNumber = this.randomizer(10);
            const withSpellMaster = this.spellMaster[theAttacker];
            const finalBoltDamage = withSpellMaster ? boltDamage[boltNumber] * 1.5 : boltDamage[boltNumber];

            if (theAttacker == CONSTANTS._player) {
                const finalLifeBolt = this.opponentLife - finalBoltDamage;
                this.opponentLife = finalLifeBolt < 0 ? 0 : finalLifeBolt;
                this.generateLogs(
                    this.init,
                    { type: CONSTANTS._actions.throw, by: CONSTANTS._player },
                    { name: "Lightning Bolt", damage: finalBoltDamage },
                    { player: this.playerLife, opponent: this.opponentLife }
                );
            } else {
                const finalLifeBomb = this.playerLife - finalBoltDamage;
                this.playerLife = finalLifeBomb < 0 ? 0 : finalLifeBomb;
                this.generateLogs(
                    this.init,
                    { type: CONSTANTS._actions.throw, by: CONSTANTS._opponent },
                    { name: "Lightning Bolt", damage: finalBoltDamage },
                    { player: this.playerLife, opponent: this.opponentLife }
                );
            }
            this.lightningBolt[theAttacker] = 0;
            skillFlag = 1;
        }

        // pet master skill 11 -> steal pets
        const defenderPets = theDefenderActiveUtils.pets.length;
        if (this.scare[theAttacker] && defenderPets > 0 && skillFlag != 1) {
            const executeScarePet = this.calculateChance(15);
            if (executeScarePet) {
                const petToScare = theDefenderActiveUtils.pets;

                if (theAttacker == CONSTANTS._player) {
                    this.opponentUtils.pets = [];
                } else {
                    this.playerUtils.pets = [];
                }
                this.generateLogs(this.init, { type: CONSTANTS._actions.skill, by: theAttacker }, { skill: "Scare", target: theDefender, pets: petToScare });
                this.scare[theAttacker] = false;
                skillFlag = 1;
            }
        }

        // pet master skill 11 -> steal pets
        if (this.petMaster[theAttacker] && defenderPets > 0 && skillFlag != 1) {
            const executeStealPet = this.calculateChance(15);
            if (executeStealPet) {
                const petToSteal = theDefenderActiveUtils.pets;
                const newPets = theAttackerActiveUtils.pets.concat(theDefenderActiveUtils.pets);

                if (theAttacker == CONSTANTS._player) {
                    this.playerUtils.pets = newPets;
                    this.opponentUtils.pets = [];
                } else {
                    this.playerUtils.pets = [];
                    this.opponentUtils.pets = newPets;
                }
                this.generateLogs(this.init, { type: CONSTANTS._actions.skill, by: theAttacker }, { skill: "Pet Master", target: theDefender, pets: petToSteal });
                this.petMaster[theAttacker] = false;
                skillFlag = 1;
            }
        }

        // genjutsu debuff skill 2
        if (this.genjutsu[theAttacker] && skillFlag != 1) {
            const executeGenjutsu = this.calculateChance(15);
            if (executeGenjutsu) { // remove current opponent buff
                this.buff[theDefender].aura = false;
                this.buff[theDefender].susanoo = false;
                this.debuff[theDefender].genjutsu = true; // affect debuff
                this.genjutsu[theAttacker] = false;
                this.generateLogs(this.init, { type: CONSTANTS._actions.skill, by: theAttacker }, { skill: "Genjutsu", target: theDefender });
                skillFlag = 1;
            }
        }

        // bandage 32 skill
        const halfLifeBandage = theAttackerLifeMax / 2;
        if (this.bandage[theAttacker].available && theAttackerLife <= halfLifeBandage && skillFlag != 1) {
            if (this.calculateChance(15)) {
                this.bandage[theAttacker].active = true;
                this.bandage[theAttacker].available = false;
                this.bandage[theAttacker].count = 5;
                skillFlag = 1;
            }
        }

        if (this.bandage.player.count <= 0) this.bandage.player.active = false;
        if (this.bandage.player.active && this.bandage.player.count > 0) {
            this.bandage.player.count -= 1;
            this.playerLife += 5;
            this.generateLogs(
                this.init,
                { type: CONSTANTS._actions.bandage, by: CONSTANTS._player },
                { heal: `+${5}`, remaining: this.bandage.player.count },
                { player: this.playerLife, opponent: this.opponentLife }
            );
        }

        if (this.bandage.opponent.count <= 0) this.bandage.opponent.active = false;
        if (this.bandage.opponent.active && this.bandage.opponent.count > 0) {
            this.bandage.opponent.count -= 1;
            this.opponentLife += 5;
            this.generateLogs(
                this.init,
                { type: CONSTANTS._actions.bandage, by: CONSTANTS._opponent },
                { heal: `+${5}`, remaining: this.bandage.opponent.count },
                { player: this.playerLife, opponent: this.opponentLife }
            );
        }

        // health potion 1 skill
        const healthPotionPercentage = theAttackerLife < (theAttackerLifeMax * 0.6);
        const healthPointsPlus = [25, 30, 35];
        const hpRandom = this.randomizer(2);
        const hpToUse = healthPotionPercentage && this.healthPotion[theAttacker] ? healthPointsPlus[hpRandom] : 0;
        let finalHp = 0;
        if (hpToUse != 0 && skillFlag != 1) {
            const draftHP = theAttackerLife + hpToUse;
            const maxHpChecker = draftHP > this.life.max[theAttacker];
            finalHp = maxHpChecker ? theAttackerLifeMax - theAttackerLife : hpToUse;
            if (attacker == CONSTANTS._player) {
                this.playerLife += finalHp;
                this.PoisonPotion.opponent.active = false; // remove poison effect
                this.PoisonPotion.opponent.count = 0;
                this.poisonTouch.opponent = false;
            } else {
                this.opponentLife += finalHp;
                this.PoisonPotion.player.active = false; // remove poison effect
                this.PoisonPotion.player.count = 0;
                this.poisonTouch.player = false;
            }
            this.healthPotion[theAttacker] = false;
            skillFlag = 1;
            this.generateLogs(
                this.init,
                { type: CONSTANTS._actions.drink, by: theAttacker },
                { heal: `+${finalHp}` },
                { player: this.playerLife, opponent: this.opponentLife }
            );
        }

        // poision potion skill 19 (available, active, count)
        if (this.PoisonPotion[theAttacker].available && skillFlag != 1) {
            if (this.calculateChance(15)) {
                this.PoisonPotion[theAttacker].active = true;
                this.PoisonPotion[theAttacker].available = false;
                this.PoisonPotion[theAttacker].count = 5;
                skillFlag = 1;
            }
        }

        if (this.PoisonPotion.player.count <= 0) this.PoisonPotion.player.active = false;
        if (this.PoisonPotion.player.active && this.PoisonPotion.player.count > 0) {
            this.PoisonPotion.player.count -= 1;
            this.opponentLife -= 5;
            this.generateLogs(
                this.init,
                { type: CONSTANTS._actions.throw, by: CONSTANTS._player },
                { name: "Poison Potion", remaining: this.PoisonPotion.player.count, damage: 5 },
                { player: this.playerLife, opponent: this.opponentLife }
            );
        }

        if (this.PoisonPotion.opponent.count <= 0) this.PoisonPotion.opponent.active = false;
        if (this.PoisonPotion.opponent.active && this.PoisonPotion.opponent.count > 0) {
            this.PoisonPotion.opponent.count -= 1;
            this.playerLife -= 5;
            this.generateLogs(
                this.init,
                { type: CONSTANTS._actions.throw, by: CONSTANTS._opponent },
                { name: "Poison Potion", remaining: this.PoisonPotion.opponent.count, damage: 5 },
                { player: this.playerLife, opponent: this.opponentLife }
            );
        }

        if (this.bomb[theAttacker] && skillFlag != 1) {
            const executeBomb = this.calculateChance(15);
            if (executeBomb) {

                const bombDamage = [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
                const bombNumber = this.randomizer(10);
                const finalBombDamage = bombDamage[bombNumber];

                if (theAttacker == CONSTANTS._player) {
                    const finalLifeBomb = this.opponentLife - finalBombDamage;
                    this.opponentLife = finalLifeBomb < 0 ? 0 : finalLifeBomb;
                    this.generateLogs(
                        this.init,
                        { type: CONSTANTS._actions.throw, by: CONSTANTS._player },
                        { name: "Bomb", damage: finalBombDamage },
                        { player: this.playerLife, opponent: this.opponentLife }
                    );
                } else {
                    const finalLifeBomb = this.playerLife - finalBombDamage;
                    this.playerLife = finalLifeBomb < 0 ? 0 : finalLifeBomb;
                    this.generateLogs(
                        this.init,
                        { type: CONSTANTS._actions.throw, by: CONSTANTS._opponent },
                        { name: "Bomb", damage: finalBombDamage },
                        { player: this.playerLife, opponent: this.opponentLife }
                    );
                }

                this.bomb[theAttacker] = false;
                skillFlag = 1;
            }
        }

        const theAttackerDischarge = theAttackerActiveUtils.weapons.length; // 4 weapons to be thrown
        if (this.discharge[theAttacker] && theAttackerDischarge >= 4 && skillFlag != 1) {
            const executeDischarge = this.calculateChance(15);
            if (executeDischarge) {

                let dischargeDamage = 0;
                let weaponNumber = [];

                for (let i = 0; i < 4; i++) {
                    const weaponDischarge = theAttackerActiveUtils.weapons[i];
                    const weaponDetails = CONSTANTS.weaponStats.find(w => w.number == weaponDischarge);
                    dischargeDamage += weaponDetails.damage;
                    weaponNumber.push(weaponDetails.number);
                }

                const additionalDischargeDamage = Math.floor(dischargeDamage * 0.5);
                dischargeDamage += additionalDischargeDamage;

                if (theAttacker == CONSTANTS._player) {
                    const remainingWeapon = this.playerUtils.weapons.filter(w => !weaponNumber.includes(w));
                    this.playerUtils.weapons = remainingWeapon;
                    this.opponentLife -= dischargeDamage;
                } else {
                    const remainingWeapon = this.opponentUtils.weapons.filter(w => !weaponNumber.includes(w));
                    this.opponentUtils.weapons = remainingWeapon;
                    this.playerLife -= dischargeDamage;
                }

                this.generateLogs(
                    this.init,
                    { type: CONSTANTS._actions.throw, by: theAttacker },
                    { name: "Discharge", weapons: weaponNumber, damage: dischargeDamage },
                    { player: this.playerLife < 0 ? 0 : this.playerLife, opponent: this.opponentLife < 0 ? 0 : this.opponentLife }
                );

                this.discharge[theAttacker] = false;
                skillFlag = 1;
            }
        }

        if (this.poisonTouch[theAttacker]) {

            if (theAttacker == CONSTANTS._player) {
                const finalLifePoision = this.opponentLife - 1;
                this.opponentLife = finalLifePoision < 0 ? 0 : finalLifePoision;
            } else {
                const finalLifePoision = this.playerLife - 1;
                this.playerLife = finalLifePoision < 0 ? 0 : finalLifePoision;
            }

            this.generateLogs(
                this.init,
                { type: CONSTANTS._actions.poison, by: theDefender, attacker: theAttacker },
                { name: "Poison Touch", remaining: "unli", damage: 1 },
                { player: this.playerLife, opponent: this.opponentLife }
            );
        }

        // Opponent attacks!
        for (let i = 1; i <= attackerCombo; i++) {
            if (this.playerLife > 0 && this.opponentLife > 0) {
                this.processAttack(theAttacker, attacker_weaponToUse, attackerDamage, defender_weaponToUse, [i, attackerCombo]);
            }

            // theDefenderCounter
            if (theDefenderCounter && this.playerLife > 0 && this.opponentLife > 0) {
                this.generateLogs(this.init, { type: CONSTANTS._actions.counter, by: theDefender, attacker: theAttacker });
                this.processAttack(theDefender, defender_weaponToUse, defenderDamage, attacker_weaponToUse);
            }
        }

        // params player , opponent
        if (attacker == CONSTANTS._player) {
            this.calculateSpeed(true, false); // Reset Opponent speed counter
        } else {
            this.calculateSpeed(false, true); // Reset Opponent speed counter
        }

        if (this.playerLife <= 0 && this.canRevive.player) {
            this.playerLife = this.life.max.player * 0.2;
            this.canRevive.player = false;

            this.generateLogs(
                this.init,
                { type: CONSTANTS._actions.revive, by: CONSTANTS._player },
                {},
                { player: this.playerLife, opponent: this.opponentLife }
            );
        }
        if (this.opponentLife <= 0 && this.canRevive.opponent) {
            this.opponentLife = this.life.max.opponent * 0.2;
            this.canRevive.opponent = false;

            this.generateLogs(
                this.init,
                { type: CONSTANTS._actions.revive, by: CONSTANTS._opponent },
                {},
                { player: this.playerLife, opponent: this.opponentLife }
            );
        }


        if (this.playerLife > 0 && this.opponentLife > 0) {

            const attackerWithThrownWeapon = this.thrownWeapons.find(w => w == theAttackerActiveUtils.activeWeapon);
            if (attackerWithThrownWeapon) {
                this.generateLogs(this.init, { type: CONSTANTS._actions.stopThrow, by: theAttacker });
            } else {
                this.generateLogs(this.init, { type: CONSTANTS._actions.return, by: theAttacker });
            }

        } else {
            this.generateLogs(this.init, { type: CONSTANTS._actions.stop, by: CONSTANTS._player.concat(" and ", CONSTANTS._opponent) });
        }
    }
}