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
        this.currentCharDetails.utilities.skills.push(41);
        this.currentCharDetails.attributes.damage = 50;
        // this.currentCharDetails.utilities.weapons.push(11);
        // this.currentCharDetails.utilities.weapons.push(12);
        // this.currentCharDetails.utilities.weapons.push(13);
        // this.currentCharDetails.utilities.weapons.push(14);
        // opponent
        this.loadedOpponent.utilities.skills.push(41);
        // this.loadedOpponent.utilities.weapons.push(11);
        this.loadedOpponent.attributes.damage = 50;
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
                opponent: this.loadedOpponent.attributes.life,
                player20: this.currentCharDetails.attributes.life * 0.2, // 20% of life
                opponent20: this.loadedOpponent.attributes.life * 0.2, // 20% of life
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

        const additionalCritical = weaponCritical ? additionalCritBoost : 0;
        const statsDamage = strength * 1.5;

        let totalDamage = statsDamage + weaponDamage + additionalSkillDamage;

        if (additionalCritical > 1) {
            totalDamage = totalDamage * additionalCritical;
        }

        const finalDamage = Math.round(Math.max(1, (totalDamage) - opponentDefense));

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

                    if (this.script[index].action.type == "attack") {
                        var attacker = this.script[index].action.by;
                        var defender = attacker == CONSTANTS._player ? CONSTANTS._opponent : CONSTANTS._player;
                        var remainingLife = attacker == CONSTANTS._player ? this.script[index].life.opponent : this.script[index].life.player;
                        
                        this.updateLife(defender, remainingLife); // life to deduct, remaining life  
                        this.renderLife();
                    }

                    if (this.script[index].action.type == "Revive") {
                        var attacker = this.script[index].action.by;
                        
                        // with revive
                        var rlRevive = attacker == CONSTANTS._player ? this.script[index].life.player : this.script[index].life.opponent;
                        
                        this.updateLife(attacker, rlRevive); // life to deduct, remaining life  
                        this.renderLife();
                    }

                    index++; // Move to the next element
                } else {
                    clearInterval(intervalId); // Stop the interval once all elements are printed
                    this.showWinner(winner);
                }
            }, 1000);
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
                this.generateLogs(this.init, { type: "disarm", by: whoDisarm, weaponRemoved: weaponToRemove });

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

        if(target == CONSTANTS._player){
            weaponLength = this.playerUtils.weapons.length;
            if(weaponLength >= 1){
                weaponToRemove = this.playerUtils.weapons[weaponLength - 1];
                this.playerUtils.weapons.pop();
            }
        } else {
            weaponLength = this.opponentUtils.weapons.length;
            if(weaponLength >= 1){
                weaponToRemove = this.opponentUtils.weapons[weaponLength - 1];
                this.opponentUtils.weapons.pop();
            }
        }

        if (weaponLength > 0) {
            this.generateLogs(this.init, { type: "Sabotage", by: whoDisarm, weaponRemoved: weaponToRemove });
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
        const additional = target == CONSTANTS._player ? this.playerBlock : this.opponentBlock;
        const final = blockPercentage + additional;
        let result = false; // Initialize the result

        // // Directly calculate the remaining chance (if below 100)
        if (final > 0) {
            const isSuccessful = this.calculateChance(final); // Attempt the remaining chance
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
                by: target,
                old: oldWeapon || -1,
                new: newWeapon || -1
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
                    this.generateLogs(this.init, { type: "Cannot Move", by: CONSTANTS._player });
                    this.isStun.player = false;
                }
                this.init += 1;
            } else if (this.currentOpponentSpeed >= this.maxSpeed && this.currentOpponentSpeed > this.currentPlayerSpeed) {
                if (this.isStun.opponent == false) {
                    this.processTurns(CONSTANTS._opponent, oppponentDamage, opponentCombo, opponent_weaponToUse, player_weaponToUse, playerDamage);
                } else {
                    this.generateLogs(this.init, { type: "Cannot Move", by: CONSTANTS._opponent });
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
            this.generateLogs(this.init, { type: "Stunned", by: defender, attacker: target });
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
            this.generateLogs(this.init, { type: "Stunned", by: defender, attacker: target });
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

        const theAttacker = attacker == CONSTANTS._player ? CONSTANTS._player : CONSTANTS._opponent;
        const theDefender = attacker == CONSTANTS._player ? CONSTANTS._opponent : CONSTANTS._player;

        const theAttackerUtils = attacker == CONSTANTS._player ? this.currentCharDetails : this.loadedOpponent;
        const theAttackerActiveUtils = attacker == CONSTANTS._player ? this.playerUtils : this.opponentUtils;

        const theDefenderUtils = attacker == CONSTANTS._player ? this.loadedOpponent : this.currentCharDetails;
        const theDefenderCounter = attacker == CONSTANTS._player ? this.canCounter.opponent : this.canCounter.player;

        this.generateLogs(this.init, { type: "Move", by: theAttacker });

        var changeWeaponResult = this.changeWeapon(theAttacker);
        if (changeWeaponResult) {
            attacker_weaponToUse = changeWeaponResult;
            attackerDamage = this.calculateDamage(theAttackerUtils.attributes.damage, theDefenderUtils.attributes.armor, attacker_weaponToUse, theAttacker);
        };

        // Opponent attacks!
        for (let i = 1; i <= attackerCombo; i++) {
            if (this.playerLife > 0 && this.opponentLife > 0) {
                this.processAttack(theAttacker, attacker_weaponToUse, attackerDamage, defender_weaponToUse, [i, attackerCombo]);
            }

            // theDefenderCounter
            if (theDefenderCounter && this.playerLife > 0 && this.opponentLife > 0) {
                this.generateLogs(this.init, { type: "counter", by: theDefender, attacker: theAttacker });
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
            this.playerLife = this.life.max.player20;
            this.canRevive.player = false;

            this.generateLogs(
                this.init,
                { type: "Revive", by: CONSTANTS._player },
                {},
                { player: this.playerLife, opponent: this.opponentLife }
            );
        }    
        if (this.opponentLife <= 0 && this.canRevive.opponent) {
            this.opponentLife = this.life.max.opponent20;
            this.canRevive.opponent = false;

            this.generateLogs(
                this.init,
                { type: "Revive", by: CONSTANTS._opponent },
                {},
                { player: this.playerLife, opponent: this.opponentLife }
            );
        } 
        
        
        if (this.playerLife > 0 && this.opponentLife > 0) {

            const attackerWithThrownWeapon = this.thrownWeapons.find(w => w == theAttackerActiveUtils.activeWeapon);
            if (attackerWithThrownWeapon) {
                this.generateLogs(this.init, { type: "Stop throwing", by: theAttacker });
            } else {
                this.generateLogs(this.init, { type: "Return", by: theAttacker });
            }

        } else {
            this.generateLogs(this.init, { type: "Stop", by: theDefender });
            this.generateLogs(this.init, { type: "Stop", by: theAttacker });
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
        const aura = theAttackerSkills.skills.find(skill => skill == 17); // aura skill 17 passive
        const weapoBreaker = theAttackerSkills.skills.find(skill => skill == 43); // weapoBreaker skill 43 passive

        // defender
        const hardHeaded = theDefenderSkills.skills.find(skill => skill == 36); // hard headed skill 36 passive

        if (hardHeaded) {
            const adjustedDamage = attackerDamage.finalDamage * 0.1;
            attackerDamage.finalDamage -= adjustedDamage;
        }

        if (aura) {
            attackerWeapon.counter += 1;
            attackerWeapon.evasion += 1;
            attackerWeapon.block += 1;
        }

        if (bullsEye && isWithThrownWeapon) additionalAccuracy += 20;
        if (futureEye && !isWithThrownWeapon) additionalAccuracy += 25;

        const finalAccuracy = attackerWeapon.accuracy + additionalAccuracy;
        let isAccurate = this.calculateAccuracy(finalAccuracy);
        let isDodgeOrBlock = false;

        if (isAccurate) {

            const randomAction = this.randomizer(1);
            const randomActionCode = randomAction == 0 ? "Dodge" : "Block";
            const randomActionUtils = randomAction == 0 ? defenderWeapon.evasion : defenderWeapon.block;
            const randomActionResult = randomAction == 0 ?
                this.calculateEvasion(randomActionUtils, theDefender) :
                this.calculateBlock(randomActionUtils, theDefender);

            if (randomActionResult) {
                this.generateLogs(this.init, { type: randomActionCode, by: theDefender, attacker: theAttacker });
                const withCounter = isWithThrownWeapon ? false : true; // false to not counter attack with thrown weapon
                const counterResult = this.calculateCounterAttack(defenderWeapon.counter, theDefender);
                this.canCounter[theDefender] = !!counterResult && !!withCounter ? true : false;
                isDodgeOrBlock = true;
            }

            if (!isDodgeOrBlock) {
                var remaining_defenderLife = Math.max(0, theDefenderLife - attackerDamage.finalDamage); // Ensure life doesn't go below zero

                let survivable = false;
                if(attacker == CONSTANTS._player && this.canSurvive.opponent && remaining_defenderLife <= 0){
                    this.canSurvive.opponent = false;
                    survivable = true;
                } else if(attacker == CONSTANTS._opponent && this.canSurvive.player && remaining_defenderLife <= 0){
                    this.canSurvive.player = false;
                    survivable = true;
                }

                if(survivable){
                    remaining_defenderLife = 1;
                }

                // Passive Vampire Skill 
                const withVampire = theAttackerSkills.skills.find(skill => skill == 16);
                let healPoints = 0; // default heal per hit

                if (withVampire && !isWithThrownWeapon) healPoints += 5;

                const isPlayerAttacker = theAttacker == CONSTANTS._player;
                const logP1 = isPlayerAttacker ? this.playerLife : remaining_defenderLife;
                const logP2 = isPlayerAttacker ? remaining_defenderLife : this.opponentLife;

                this.generateLogs(
                    this.init,
                    { type: "attack", by: theAttacker },
                    { name: attackerWeapon.name, damage: attackerDamage.finalDamage, crit: attackerDamage.withCrit, heal: healPoints },
                    { player: logP1, opponent: logP2 }
                );

                if (isPlayerAttacker) {
                    this.opponentLife = remaining_defenderLife;
                } else {
                    this.playerLife = remaining_defenderLife;
                }

                this.canCounter[theDefender] = false;

                if(weapoBreaker){
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
        } else {
            const random_missed_Action = this.randomizer(1);
            const random_missed_ActionCode = random_missed_Action == 0 ? "Dodge" : "Block";

            this.generateLogs(this.init, { type: random_missed_ActionCode, by: theDefender, attacker: theAttacker });
            this.canCounter[theDefender] = false;
        }
    }
}