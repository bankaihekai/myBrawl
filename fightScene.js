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

        this.strongBite = {
            player: false,
            opponent: false
        }
    }

    create() {
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
        // this.validateAvailableUtils();

        this.loadedOpponent = loadCharacter(CONSTANTS._opponent);
        if (!this.loadedOpponent) {
            this.scene.start('playGame');
        }

        this.life = {
            max: {
                player: Number(this.currentCharDetails.attributes.life),
                opponent: Number(this.loadedOpponent.attributes.life)
            },
            current: {
                player: Number(this.currentCharDetails.attributes.life),
                opponent: Number(this.loadedOpponent.attributes.life),
                playerWidth: 350,
                opponentWidth: 350,
            }
        }

        this.playerUtils = {
            skills: structuredClone(this.currentCharDetails.utilities.skills) || [],
            weapons: structuredClone(this.currentCharDetails.utilities.weapons) || [],
            pets: this.currentCharDetails.utilities.pets.length > 0 ? structuredClone(this.currentCharDetails.utilities.pets[0]) : null,
            activeWeapon: null,
            activeSkill: null
        }

        this.opponentUtils = {
            skills: structuredClone(this.loadedOpponent.utilities.skills) || [],
            weapons: structuredClone(this.loadedOpponent.utilities.weapons) || [],
            pets: this.loadedOpponent.utilities.pets.length > 0 ? structuredClone(this.loadedOpponent.utilities.pets[0]) : null,
            activeWeapon: null,
            activeSkill: null
        }

        // console.log({ loadedOpponent: this.loadedOpponent });
        // console.log({ loadedCharacter: this.currentCharDetails });

        this.fightPlayerWeapons = structuredClone(this.playerUtils.weapons);
        this.fightOpponentWeapons = structuredClone(this.opponentUtils.weapons);

        this.attackAndUpdate();
    }

    renderCreateCharacter(script) {
        // Clear the preview container
        this.characterContainer.iterate(child => child.destroy());
        this.characterContainer.removeAll(true);

        const fPlayerWeapons = structuredClone(this.fightPlayerWeapons);
        const fOpponentWeapons = structuredClone(this.fightOpponentWeapons);

        const isWithAction = !!script && script.action;
        const target = isWithAction && script.action.target;
        const poisonDefender = isWithAction && script.action.by;

        const isChangeWeapon = isWithAction && script.action.type == "Change weapon";
        const isAttack = isWithAction && script.action.type == "Attack";
        const isDrink = isWithAction && script.action.type == "Drink";
        const isPoison = isWithAction && script.action.type == "Poison";
        const isSabotage = isWithAction && script.action.type == "Sabotage" && script.action.weaponRemoved;

        const isDamage = isAttack && script.weapon && script.weapon.damage;
        const isDamagePoisoned = isPoison && script.weapon && script.weapon.damage;
        const isWithNewWeapon = isWithAction ? script.action.new : false;

        const isPlayer = isWithAction && script.action.by == "player";
        const isPlayerWeaponUpdate = isWithAction && !!isChangeWeapon && !!isPlayer && !!isWithNewWeapon;

        const isOpponent = isWithAction && script.action.by == "opponent";
        const isOpponentWeaponUpdate = isWithAction && !!isChangeWeapon && !!isOpponent && !!isWithNewWeapon;

        this.renderFightAnimation(this.characterContainer, script);

        // player
        if (isPlayerWeaponUpdate) {
            this.fightPlayerWeapons = fPlayerWeapons.filter(weapon => weapon !== isWithNewWeapon);
        }

        if (isSabotage && isPlayer) {
            this.fightOpponentWeapons = fOpponentWeapons.filter(weapon => weapon !== script.action.weaponRemoved);
        }

        if (fPlayerWeapons.length > 0) {
            const initialPosition = {
                x: 60,
                y: 130,
                rowHeight: 20,
                perRow: 12
            };

            let currentX = initialPosition.x;
            let currentY = initialPosition.y;

            for (const [index, playerWeapon] of this.fightPlayerWeapons.entries()) {
                // New row every 9 icons
                if (index > 0 && index % initialPosition.perRow === 0) {
                    currentY += initialPosition.rowHeight;
                    currentX = initialPosition.x; // Reset x position
                }

                const charSprite = this.add.sprite(currentX, currentY, "weaponIcons")
                    .setFrame(playerWeapon - 1)
                    .setScale(0.3);

                this.characterContainer.add(charSprite);

                currentX += 30;
            }
        }

        // opponent
        if (isOpponentWeaponUpdate) {
            this.fightOpponentWeapons = fOpponentWeapons.filter(weapon => weapon !== isWithNewWeapon);
        }

        if (isSabotage && isOpponent) {
            this.fightPlayerWeapons = fPlayerWeapons.filter(weapon => weapon !== script.action.weaponRemoved);
        }

        if (fOpponentWeapons.length > 0) {
            const initialPosition2 = {
                x: 420,
                y: 130,
                rowHeight: 20,
                perRow: 12
            };

            let currentX2 = initialPosition2.x;
            let currentY2 = initialPosition2.y;

            for (const [index, opponentWeapon] of this.fightOpponentWeapons.entries()) {
                // New row every 9 icons
                if (index > 0 && index % initialPosition2.perRow === 0) {
                    currentY2 += initialPosition2.rowHeight;
                    currentX2 = initialPosition2.x; // Reset x position
                }

                const charSprite = this.add.sprite(currentX2, currentY2, "weaponIcons")
                    .setFrame(opponentWeapon - 1)
                    .setScale(0.3);

                this.characterContainer.add(charSprite);

                currentX2 += 30;
            }
        }

        // display damage in opponent area
        const isPlayerXY = isPlayer ? { x: 600, y: 250 } : { x: 200, y: 250 };
        const isHealPlayerXY = isPlayer ? { x: 200, y: 250 } : { x: 600, y: 250 };
        const isPlayerTarget = isPlayer ? "opponentPet" : "playerPet";
        const colorTarget = target != isPlayerTarget ? "#ff0000" : "#f400ff";

        if ((isPlayer || isOpponent) && isAttack && isDamage && target) {
            let damageDisplay = this.add.text(isPlayerXY.x, isPlayerXY.y, `-${script.weapon.damage}`, {
                fontSize: '45px',
                fill: colorTarget,
                fontStyle: 'bolder',
                stroke: '#ffffff', // Border color
                strokeThickness: 5 // Border thickness
            });

            this.characterContainer.add(damageDisplay);

            // Remove the damage display after 1 second (1000ms)
            this.time.delayedCall(400, () => {
                damageDisplay.destroy();
            });
        }

        // poison
        if (poisonDefender && isDamagePoisoned && isPoison) {
            let damageDisplay = this.add.text(isHealPlayerXY.x, isHealPlayerXY.y, `-${script.weapon.damage}`, {
                fontSize: '45px',
                fill: "#ff0000",
                fontStyle: 'bolder',
                stroke: '#ffffff', // Border color
                strokeThickness: 5 // Border thickness
            });

            this.characterContainer.add(damageDisplay);

            // Remove the damage display after 1 second (1000ms)
            this.time.delayedCall(400, () => {
                damageDisplay.destroy();
            });
        }

        if (isDrink) {
            let drinkDisplay = this.add.text(isHealPlayerXY.x, isHealPlayerXY.y, `+${script.weapon.heal}`, {
                fontSize: '45px',
                fill: "#118712",
                fontStyle: 'bolder',
                stroke: '#ffffff', // Border color
                strokeThickness: 5 // Border thickness
            });

            this.characterContainer.add(drinkDisplay);

            // Remove the damage display after 1 second (1000ms)
            this.time.delayedCall(400, () => {
                drinkDisplay.destroy();
            });
        }
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
            location.reload();
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

    generateLogs(init, action, weapon, life) {

        var toPush = {};

        toPush.init = init;
        toPush.action = action;

        if (weapon) toPush.weapon = weapon;

        if (life) toPush.life = life;

        this.script.push(toPush);
    }

    calculateDamage(strength, opponentDefense, weapon, targetUser) {

        let additionalSkillDamage = 0;
        let additionalCritBoost = 1;
        const weaponDamage = weapon ? Number(weapon.damage) : 0;
        const target = targetUser == CONSTANTS._player ? this.playerUtils : this.opponentUtils;
        const targetSkills = target.skills;
        const thrownWeaponsResult = this.thrownWeapons.find(w => w == weapon.number); // current used weapon type is thrown
        const heavyWeaponsResult = this.heavyWeapons.find(w => w == weapon.number); // current used  weapon type is heavy
        const sharpWeaponsResult = this.sharpWeapons.find(w => w == weapon.number); // current used  weapon type is heavy
        const physicalWeaponsResult = this.physicalWeapons.find(w => w == weapon.number); // current used  weapon type is heavy
        const weaponCritical = calculateChance(weapon.critical);

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
        const withDragonPunch = skill_dragonPunch && physicalWeaponsResult ? 2 : 1;

        // instant killer skill
        const skill_instantKiller = targetSkills.find(skill => skill == 18);
        if (skill_instantKiller) additionalCritBoost += 1;

        // true strike skill
        const trueStrike = targetSkills.find(skill => skill == 34);
        const calculateTrueStrike = calculateChance(15);
        if (trueStrike && this.trueStrike[targetUser] && calculateTrueStrike) {
            additionalCritBoost += 0.2;
        };

        const additionalCritical = weaponCritical ? additionalCritBoost : 0;
        const statsDamage = strength * 1.5;

        let totalDamage = statsDamage + weaponDamage + additionalSkillDamage;

        if (additionalCritical > 1) {
            totalDamage = totalDamage * additionalCritical;
        }

        const calculatedDamage = Math.round(Math.max(1, (totalDamage) - (opponentDefense * 1.5)));
        const plusDamage = calculateChance(50) ? 1 : 0;
        const finalDamage = Math.floor((calculatedDamage + plusDamage) * withDragonPunch);
        return {
            finalDamage: finalDamage,
            withCrit: additionalCritical > 1,
        };
    }

    calculatePetDamage(strength, opponentDefense, critial, attacker) {
        const withPetMaster = this.petMaster[attacker] ? 1.5 : 1;
        const criticalAdditional = calculateChance(critial) ? 2 : 1;
        const initialDamage = Math.round(Math.max(1, ((strength * 1.5) * criticalAdditional) - opponentDefense));
        const plusDamage = calculateChance(50) ? 1 : 0;
        const finalDamage = initialDamage + plusDamage;
        return {
            finalDamage: Math.round(finalDamage * withPetMaster),
            withCrit: criticalAdditional > 1,
        };
    };

    calculateCombo(comboRate, attacker) {

        let finalCombo = Number(comboRate);
        if (attacker == CONSTANTS._player || attacker == CONSTANTS._opponent) {
            let additionalSkillCombo = 0;
            const targetAttacker = attacker == CONSTANTS._player ? this.playerUtils : this.opponentUtils;
            const bladeOfFurry = targetAttacker.skills.find(s => s == 47); // passive skill

            if (bladeOfFurry) additionalSkillCombo += 150;

            finalCombo += additionalSkillCombo;
        }

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
            const isSuccessful = calculateChance(comboPercentage); // Attempt the remaining chance
            if (isSuccessful) result += 1; // Increment result for successful chance
        }

        return result;
    }

    // accuracy, defender
    calculateAccuracy(accuracy, target) {

        let result = false; // Initialize the result
        let enemySkillDodgeRate = 0;

        const accuracyPercentage = Number(accuracy) || 0;
        const theAttacker = target == CONSTANTS._player ? CONSTANTS._opponent : CONSTANTS._player;
        const attackerAgileRate = target == CONSTANTS._player ? this.opponentEvasion : this.playerEvasion;

        const theDefender = target == CONSTANTS._player ? CONSTANTS._player : CONSTANTS._opponent;
        const targetDefenderBlock = target == CONSTANTS._player ? Number(this.playerBlock) : Number(this.opponentBlock);
        const targetDefenderUtils = target == CONSTANTS._player ? structuredClone(this.playerUtils) : structuredClone(this.opponentUtils);
        const targetDefenderAgile = target == CONSTANTS._player ? Number(this.playerEvasion) : Number(this.opponentEvasion);

        // passive skills
        const phanthomSteps = targetDefenderUtils.skills.includes(40);
        const shieldSkill = targetDefenderUtils.skills.includes(27);

        if (phanthomSteps) enemySkillDodgeRate += 25;
        if (shieldSkill) enemySkillDodgeRate += 15;
        if (this.hollowForm[theDefender].count > 0 && this.hollowForm[theDefender].active) enemySkillDodgeRate += 20;

        enemySkillDodgeRate = Math.min(enemySkillDodgeRate, 70);
        const finalAgile = Math.log2(targetDefenderAgile + 1) * 20;
        const finalEnemyDodge = Math.max(0, (finalAgile + targetDefenderBlock + enemySkillDodgeRate));
        const finalAttackerAccuracy = Math.min(100, accuracyPercentage + attackerAgileRate * 1.5);
        const hitChance = (finalAttackerAccuracy / (finalAttackerAccuracy + finalEnemyDodge)) * 100;

        if (hitChance > 0) {
            result = calculateChance(hitChance);
        }

        // skill 100% accuracy one time only
        if (this.trueStrike[theAttacker]) {
            result = true;
            this.trueStrike[theAttacker] = false;
        }

        return result;
    }

    calculateAccuracyPet(attackerAgile, attackerAccuracy, defenderDodge, defenderAgile, target) {
        let result = false;
        if (target.toLowerCase() == "pet") {
            const finalAgile = Math.log2(defenderAgile + 1) * 20;
            const finalEnemyDodge = Math.max(0, (finalAgile + defenderDodge));

            const finalAttackerAccuracy = Math.min(100, attackerAccuracy + (attackerAgile * 1.5));
            const hitChance = Math.max(5, (finalAttackerAccuracy / (finalAttackerAccuracy + finalEnemyDodge)) * 100);
            if (hitChance > 0) {
                result = calculateChance(hitChance);
            }
        } else {
            let enemySkillDodgeRate = 0;
            const theDefender = target == CONSTANTS._player ? CONSTANTS._player : CONSTANTS._opponent;
            const targetDefenderBlock = target == CONSTANTS._player ? Number(this.playerBlock) : Number(this.opponentBlock);
            const targetDefenderUtils = target == CONSTANTS._player ? structuredClone(this.playerUtils) : structuredClone(this.opponentUtils);
            const targetDefenderAgile = target == CONSTANTS._player ? Number(this.playerEvasion) : Number(this.opponentEvasion);

            // passive skills
            const phanthomSteps = targetDefenderUtils.skills.includes(40);
            const shieldSkill = targetDefenderUtils.skills.includes(27);

            if (phanthomSteps) enemySkillDodgeRate += 25;
            if (shieldSkill) enemySkillDodgeRate += 15;
            if (this.hollowForm[theDefender].count > 0 && this.hollowForm[theDefender].active) enemySkillDodgeRate += 20;

            enemySkillDodgeRate = Math.min(enemySkillDodgeRate, 70);
            const finalAgile = Math.log2(targetDefenderAgile + 1) * 20;
            const finalEnemyDodge = Math.max(0, (finalAgile + targetDefenderBlock + enemySkillDodgeRate));

            const finalAttackerAccuracy = Math.min(100, attackerAccuracy + (attackerAgile * 1.5));
            const hitChance = Math.max(5, (finalAttackerAccuracy / (finalAttackerAccuracy + finalEnemyDodge)) * 100);
            if (hitChance > 0) {
                result = calculateChance(hitChance);
            }
        }
        return result;
    }

    calculateCounterAttack(counter, defender) {

        let additionalSkillCounter = 0;
        let counterPercentage = Number(counter) || 0;
        let result = false; // Initialize the result
        const targetDefender = defender == CONSTANTS._player ? this.playerUtils : this.opponentUtils;
        const counterStrike = targetDefender.skills.find(s => s == 45); // passive skill

        if (counterStrike) additionalSkillCounter += 30;

        const finalCounter = counterPercentage + additionalSkillCounter;

        // // Directly calculate the remaining chance (if below 100)
        if (finalCounter > 0) {
            const isSuccessful = calculateChance(finalCounter); // Attempt the remaining chance
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

        const total = Number(attackerWeapon.disarm + additionalPercentage);
        let disarmPercentage = total || 0;
        let result = false; // Initialize the result

        // // Directly calculate the remaining chance (if below 100)
        if (disarmPercentage > 0) {
            const isSuccessful = calculateChance(disarmPercentage); // Attempt the remaining chance
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
            const randomChanceResult = calculateChance(randomChance);
            if (utils.weapons.length > 0 && randomChanceResult) {
                const oldWeapon = utils.activeWeapon;
                const newWeapon = randomArrayIndex(utils.weapons);
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

    //#region Attack and update
    attackAndUpdate() {

        // this.renderLife();
        const playerStats = structuredClone(this.currentCharDetails.attributes);
        const opponentStats = structuredClone(this.loadedOpponent.attributes);
        this.playerLife = playerStats.life;
        this.opponentLife = opponentStats.life;

        this.playerSpeed = playerStats.speed;
        this.opponentSpeed = opponentStats.speed;

        // initialize agility / evasion additional
        this.playerEvasion = Math.max(0, Math.round(playerStats.agile * 0.5));
        this.opponentEvasion = Math.max(0, Math.round(opponentStats.agile * 0.5));

        // initialize block rate
        this.playerBlock = 0;
        this.opponentBlock = 0;

        this.playerTarget = ["Opponent"];
        this.opponentTarget = ["Player"];

        this.init = 0;

        this.validateSkills();

        const playerSpeedDetails = {
            key: "Player",
            speed: playerStats.speed,
            current: 0
        }
        const opponentSpeedDetails = {
            key: "Opponent",
            speed: opponentStats.speed,
            current: 0
        }
        const playerSpeedDetailsPet = !!this.playerUtils.pets ? {
            key: "PlayerPet",
            speed: structuredClone(this.playerUtils.pets.speed),
            current: 0
        } : null;
        const opponentSpeedDetailsPet = !!this.opponentUtils.pets ? {
            key: "OpponentPet",
            speed: structuredClone(this.opponentUtils.pets.speed),
            current: 0
        } : null;
        let listOfAttackers = [playerSpeedDetails, opponentSpeedDetails];

        if (playerSpeedDetailsPet) {
            this.playerPetLife = Number(this.playerUtils.pets.life);
            // listOfAttackers.push(playerSpeedDetailsPet);
            this.opponentTarget.push("PlayerPet");
        }

        if (opponentSpeedDetailsPet) {
            this.opponentPetLife = Number(this.opponentUtils.pets.life);
            // listOfAttackers.push(opponentSpeedDetailsPet);
            this.playerTarget.push("OpponentPet");
        }

        const queueOfAttackers = this.sortAttackers(listOfAttackers);

        // Loop until one character's life reaches zero
        for (let i = 0; i < queueOfAttackers.length; i++) {

            if (this.playerLife <= 0 || this.opponentLife <= 0) {
                break; // Exit the loop if one character's life is zero
            }

            if (this.playerPetLife <= 0) {
                this.opponentTarget = ["Player"];
            }

            if (this.opponentPetLife <= 0) {
                this.playerTarget = ["Opponent"];
            }

            const attacker = queueOfAttackers[i];

            const isPlayer = attacker == "Player";
            const isPlayerPet = attacker == "PlayerPet";

            const isOpponent = attacker == "Opponent";
            const isOpponentPet = attacker == "OpponentPet";

            let target = isPlayer ? "Opponent" : "Player";

            // Determine the target based on the attacker
            if (isPlayer || isPlayerPet) {
                target = randomArrayIndex(this.playerTarget);
            }
            if (isOpponent || isOpponentPet) {
                target = randomArrayIndex(this.opponentTarget);
            }
            if (target == "") {
                throw new Error("Target is empty, cannot proceed with attack.");
            }

            // attacker attacks
            if (isPlayer) {
                let player_weaponNumber = this.playerUtils.activeWeapon || -1;
                let player_weaponToUse = CONSTANTS.weaponStats.find(w => w.number == player_weaponNumber);
                let playerFinalCombo = player_weaponToUse.combo - player_weaponToUse.speed;
                let playerCombo = this.calculateCombo(playerFinalCombo, CONSTANTS._player);

                let opponent_weaponNumber = this.opponentUtils.activeWeapon || -1;
                let opponent_weaponToUse = CONSTANTS.weaponStats.find(w => w.number == opponent_weaponNumber);
                let opponentDamage = this.calculateDamage(this.loadedOpponent.attributes.damage, this.currentCharDetails.attributes.armor, opponent_weaponToUse, CONSTANTS._opponent);

                if (target == "Opponent") {
                    let playerDamage = this.calculateDamage(playerStats.damage, opponentStats.armor, player_weaponToUse, CONSTANTS._player);
                    this.playerBlock = player_weaponToUse.block || 0;
                    this.opponentBlock = opponent_weaponToUse.block || 0;

                    if (this.isStun.player == false) {
                        this.processTurns(
                            CONSTANTS._player, playerDamage, playerCombo,
                            player_weaponToUse, opponent_weaponToUse, opponentDamage, null, false
                        );
                    } else {
                        this.generateLogs(this.init, { type: CONSTANTS._actions.cantMove, by: CONSTANTS._player });
                        this.isStun.player = false;
                    }
                }
                else {
                    // Player attacks opponent's pet
                    let opponentPetDefender = this.opponentUtils.pets;
                    if (!!opponentPetDefender && opponentPetDefender.life > 0) {
                        let playerDamage = this.calculateDamage(playerStats.damage, opponentPetDefender.armor, player_weaponToUse, CONSTANTS._player);
                        let opponentPetDamage = this.calculatePetDamage(opponentPetDefender.damage, playerStats.armor, opponentPetDefender.critical || 0, CONSTANTS._player);
                        let petWeaponToUse = this.petWeaponToUse(opponentPetDefender);

                        this.processTurns(
                            CONSTANTS._player, playerDamage, playerCombo,
                            player_weaponToUse, petWeaponToUse, opponentPetDamage, opponentPetDefender, false
                        );
                    }
                }
            }

            if (isOpponent) {
                let opponent_weaponNumber = this.opponentUtils.activeWeapon || -1;
                let opponent_weaponToUse = CONSTANTS.weaponStats.find(w => w.number == opponent_weaponNumber);
                let opponentFinalCombo = opponent_weaponToUse.combo - opponent_weaponToUse.speed;
                let opponentCombo = this.calculateCombo(opponentFinalCombo, CONSTANTS._opponent);

                let player_weaponNumber = this.playerUtils.activeWeapon || -1;
                let player_weaponToUse = CONSTANTS.weaponStats.find(w => w.number == player_weaponNumber);
                let playerDamage = this.calculateDamage(playerStats.damage, opponentStats.armor, player_weaponToUse, CONSTANTS._player);

                if (target == "Player") {
                    let opponentDamage = this.calculateDamage(opponentStats.damage, playerStats.armor, opponent_weaponToUse, CONSTANTS._opponent);
                    this.playerBlock = player_weaponToUse.block || 0;
                    this.opponentBlock = opponent_weaponToUse.block || 0;

                    if (this.isStun.opponent == false) {
                        this.processTurns(
                            CONSTANTS._opponent, opponentDamage, opponentCombo,
                            opponent_weaponToUse, player_weaponToUse, playerDamage, null, false
                        );
                    } else {
                        this.generateLogs(this.init, { type: CONSTANTS._actions.cantMove, by: CONSTANTS._opponent });
                        this.isStun.opponent = false;
                    }
                }
                else {
                    // Opponent attacks player's pet
                    let playerPetDefender = this.playerUtils.pets;
                    if (!!playerPetDefender && playerPetDefender.life > 0) {
                        let opponentDamage = this.calculateDamage(opponentStats.damage, playerPetDefender.armor, opponent_weaponToUse, CONSTANTS._opponent);
                        let playerPetDamage = this.calculatePetDamage(playerPetDefender.damage, opponentStats.armor, playerPetDefender.critical || 0, CONSTANTS._opponent);
                        let petWeaponToUse = this.petWeaponToUse(playerPetDefender);

                        this.processTurns(
                            CONSTANTS._opponent, opponentDamage, opponentCombo,
                            opponent_weaponToUse, petWeaponToUse, playerPetDamage, playerPetDefender, false
                        );
                    }
                }
            }

            this.init = i;
        }

        let prevFightData = JSON.parse(decryptData("fightLogs"));
        const fightLogsId = prevFightData ? String(prevFightData.length + 1) : 0;
        const winner = this.playerLife > 0 ? CONSTANTS._player : CONSTANTS._opponent;
        const fightDetailsRaw = {
            id: fightLogsId,
            playerDetails: this.currentCharDetails,
            opponentDetails: this.loadedOpponent,
            fightScript: this.script,
            winner: this.playerLife > 0 ? CONSTANTS._player : CONSTANTS._opponent
        };
        prevFightData.push(fightDetailsRaw);

        this.calculateWinner(winner);
        localStorage.setItem("fightLogs", encryptedData("fightLogs", JSON.stringify(prevFightData))); // html table
        localStorage.setItem("fightResult", true);
        localStorage.removeItem("opponent");
        location.reload();
    }

    calculateStun(targetuser) { // target user == attacker
        const target = targetuser == CONSTANTS._player ? CONSTANTS._player : CONSTANTS._opponent;
        const defender = targetuser == CONSTANTS._player ? CONSTANTS._opponent : CONSTANTS._player;
        const theDefenderSkills = targetuser == CONSTANTS._player ? this.opponentUtils : this.playerUtils;

        const octopusV = theDefenderSkills.skills.find(skill => skill == 35); // octopus viscous skill 35 passive
        const calculateIgnore = !!octopusV ? calculateChance(40) : false;

        const stunValue = calculateIgnore ? 0 : 15;
        const isStunned = calculateChance(stunValue); // 15% chance to stun default

        if (isStunned) {
            this.generateLogs(this.init, { type: CONSTANTS._actions.stunned, by: defender, attacker: target });
        }

        this.isStun[defender] = isStunned ? true : false;
    }

    processTurns(attacker, attackerDamage, attackerCombo, attacker_weaponToUse, defender_weaponToUse, defenderDamage, petDetails, isCounter) {

        const withPet = !!petDetails && petDetails.life > 0; // attack defender pet
        const withCounter = !!isCounter;
        let noAttackToPet = false;

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

        if (!withCounter) {
            this.generateLogs(this.init, { type: CONSTANTS._actions.move, by: theAttacker });
        }

        let isChangeWeapon = false;
        var changeWeaponResult = this.changeWeapon(theAttacker);
        if (changeWeaponResult) {
            attacker_weaponToUse = changeWeaponResult;
            attackerCombo = this.calculateCombo(changeWeaponResult.combo, theAttacker);
            attackerDamage = this.calculateDamage(theAttackerUtils.attributes.damage, theDefenderUtils.attributes.armor, attacker_weaponToUse, theAttacker);
            isChangeWeapon = true;
        };

        if (this.steal[theAttacker] && skillFlag != 1 && !isChangeWeapon && !withPet) {
            const calculateSteal = calculateChance(15);
            if (calculateSteal && theDefenderActiveUtils.activeWeapon != null && theDefenderActiveUtils.activeWeapon != -1) {

                var stealWeaponResult = this.changeWeapon(theAttacker, true, theDefenderActiveUtils.activeWeapon);
                if (stealWeaponResult) {
                    attacker_weaponToUse = stealWeaponResult;
                    attackerDamage = this.calculateDamage(theAttackerUtils.attributes.damage, theDefenderUtils.attributes.armor, attacker_weaponToUse, theAttacker);
                };
            }
        }

        const calculateHollow = this.hollowForm[theAttacker].available ? calculateChance(15) : false;
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
        const executeBolt = calculateChance(15);
        if (this.lightningBolt[theAttacker] == 2 && withSpellBook && skillFlag != 1 && executeBolt) {
            const boltDamage = [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35];
            const boltNumber = randomizer(10);
            const withSpellMaster = this.spellMaster[theAttacker];
            const finalBoltDamage = withSpellMaster ? boltDamage[boltNumber] * 1.5 : boltDamage[boltNumber];

            if (theAttacker == CONSTANTS._player) {
                const finalLifeBolt = this.opponentLife - finalBoltDamage;
                this.opponentLife = finalLifeBolt < 0 ? 0 : finalLifeBolt;

                // damage pet
                if (theDefenderActiveUtils.pets && theDefenderActiveUtils.pets.life > 0) {
                    const finalLifePet = Math.max(0, theDefenderActiveUtils.pets.life - finalBoltDamage);
                    theDefenderActiveUtils.pets.life = finalLifePet;
                    this.generateLogs(
                        this.init,
                        { type: CONSTANTS._actions.throw, by: CONSTANTS._player },
                        { name: "Lightning Bolt", damage: finalBoltDamage },
                        { player: this.playerLife, opponent: this.opponentLife, opponentPetLife: finalLifePet }
                    );
                } else {
                    this.generateLogs(
                        this.init,
                        { type: CONSTANTS._actions.throw, by: CONSTANTS._player },
                        { name: "Lightning Bolt", damage: finalBoltDamage },
                        { player: this.playerLife, opponent: this.opponentLife }
                    );
                }

            } else {
                const finalLifeBomb = this.playerLife - finalBoltDamage;
                this.playerLife = finalLifeBomb < 0 ? 0 : finalLifeBomb;

                // damage pet
                if (theDefenderActiveUtils.pets && theDefenderActiveUtils.pets.life > 0) {
                    const finalLifePet = Math.max(0, theDefenderActiveUtils.pets.life - finalBoltDamage);
                    theDefenderActiveUtils.pets.life = finalLifePet;
                    this.generateLogs(
                        this.init,
                        { type: CONSTANTS._actions.throw, by: CONSTANTS._opponent },
                        { name: "Lightning Bolt", damage: finalBoltDamage },
                        { player: this.playerLife, opponent: this.opponentLife, playerPetLife: finalLifePet }
                    );
                } else {
                    this.generateLogs(
                        this.init,
                        { type: CONSTANTS._actions.throw, by: CONSTANTS._opponent },
                        { name: "Lightning Bolt", damage: finalBoltDamage },
                        { player: this.playerLife, opponent: this.opponentLife }
                    );
                }
            }
            this.lightningBolt[theAttacker] = 0;
            skillFlag = 1;
        }

        // scare skill 22 -> steal pets
        const defenderPets = !!theDefenderActiveUtils.pets;
        if (this.scare[theAttacker] && defenderPets > 0 && skillFlag != 1) {
            const executeScarePet = calculateChance(15);
            if (executeScarePet) {
                const petToScare = theDefenderActiveUtils.pets.name;

                if (theAttacker == CONSTANTS._player) {
                    this.opponentUtils.pets = null;
                } else {
                    this.playerUtils.pets = null;
                }
                this.generateLogs(this.init, { type: CONSTANTS._actions.skill, by: theAttacker }, { skill: "Scare", target: theDefender, pets: petToScare });
                this.scare[theAttacker] = false;
                skillFlag = 1;
                noAttackToPet = true;
            }
        }

        // genjutsu debuff skill 2
        if (this.genjutsu[theAttacker] && skillFlag != 1) {
            const executeGenjutsu = calculateChance(15);
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
            if (calculateChance(15)) {
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
        const hpRandom = randomizer(2);
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
                { heal: finalHp },
                { player: this.playerLife, opponent: this.opponentLife }
            );
        }

        // poision potion skill 19 (available, active, count)
        if (this.PoisonPotion[theAttacker].available && skillFlag != 1) {
            if (calculateChance(15)) {
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

            // damage pet
            if (this.opponentUtils.pets && this.opponentUtils.pets.life > 0) {
                const finalLifePet = Math.max(0, this.opponentUtils.pets.life - 5);
                this.opponentUtils.pets.life = finalLifePet;
                this.generateLogs(
                    this.init,
                    { type: CONSTANTS._actions.throw, by: CONSTANTS._player },
                    { name: "Poison Potion", remaining: this.PoisonPotion.player.count, damage: 5 },
                    { player: this.playerLife, opponent: this.opponentLife, opponentPetLife: finalLifePet }
                );
            } else {
                this.generateLogs(
                    this.init,
                    { type: CONSTANTS._actions.throw, by: CONSTANTS._player },
                    { name: "Poison Potion", remaining: this.PoisonPotion.player.count, damage: 5 },
                    { player: this.playerLife, opponent: this.opponentLife }
                );
            }
        }

        if (this.PoisonPotion.opponent.count <= 0) this.PoisonPotion.opponent.active = false;
        if (this.PoisonPotion.opponent.active && this.PoisonPotion.opponent.count > 0) {
            this.PoisonPotion.opponent.count -= 1;
            this.playerLife -= 5;

            //damage pet
            if (this.playerUtils.pets && this.playerUtils.pets.life > 0) {
                const finalLifePet = Math.max(0, this.playerUtils.pets.life - 5);
                this.playerUtils.pets.life = finalLifePet;
                this.generateLogs(
                    this.init,
                    { type: CONSTANTS._actions.throw, by: CONSTANTS._opponent },
                    { name: "Poison Potion", remaining: this.PoisonPotion.opponent.count, damage: 5 },
                    { player: this.playerLife, opponent: this.opponentLife, playerPetLife: finalLifePet }
                );
            } else {
                this.generateLogs(
                    this.init,
                    { type: CONSTANTS._actions.throw, by: CONSTANTS._opponent },
                    { name: "Poison Potion", remaining: this.PoisonPotion.opponent.count, damage: 5 },
                    { player: this.playerLife, opponent: this.opponentLife }
                );
            }
        }

        if (this.bomb[theAttacker] && skillFlag != 1) {
            const executeBomb = calculateChance(15);
            if (executeBomb) {

                const bombDamage = [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
                const bombNumber = randomizer(10);
                const finalBombDamage = bombDamage[bombNumber];

                if (theAttacker == CONSTANTS._player) {
                    const finalLifeBomb = this.opponentLife - finalBombDamage;
                    this.opponentLife = finalLifeBomb < 0 ? 0 : finalLifeBomb;

                    // damage pet
                    if (this.opponentUtils && this.opponentUtils.pets.life > 0) {
                        const finalLifePet = Math.max(0, this.opponentUtils.pets.life - finalBombDamage);
                        this.opponentUtils.pets.life = finalLifePet;
                        this.generateLogs(
                            this.init,
                            { type: CONSTANTS._actions.throw, by: CONSTANTS._player },
                            { name: "Bomb", damage: finalBombDamage },
                            { player: this.playerLife, opponent: this.opponentLife, opponentPetLife: finalLifePet }
                        );
                    } else {
                        this.generateLogs(
                            this.init,
                            { type: CONSTANTS._actions.throw, by: CONSTANTS._player },
                            { name: "Bomb", damage: finalBombDamage },
                            { player: this.playerLife, opponent: this.opponentLife }
                        );
                    }
                } else {
                    const finalLifeBomb = this.playerLife - finalBombDamage;
                    this.playerLife = finalLifeBomb < 0 ? 0 : finalLifeBomb;

                    // damage pet
                    if (this.playerUtils && this.playerUtils.pets.life > 0) {
                        const finalLifePet = Math.max(0, this.playerUtils.pets.life - finalBombDamage);
                        this.playerUtils.pets.life = finalLifePet;
                        this.generateLogs(
                            this.init,
                            { type: CONSTANTS._actions.throw, by: CONSTANTS._opponent },
                            { name: "Bomb", damage: finalBombDamage },
                            { player: this.playerLife, opponent: this.opponentLife, playerPetLife: finalLifePet }
                        );
                    } else {
                        this.generateLogs(
                            this.init,
                            { type: CONSTANTS._actions.throw, by: CONSTANTS._opponent },
                            { name: "Bomb", damage: finalBombDamage },
                            { player: this.playerLife, opponent: this.opponentLife }
                        );
                    }
                }

                this.bomb[theAttacker] = false;
                skillFlag = 1;
            }
        }

        const theAttackerDischarge = theAttackerActiveUtils.weapons.length; // 4 weapons to be thrown
        if (this.discharge[theAttacker] && theAttackerDischarge >= 4 && skillFlag != 1) {
            const executeDischarge = calculateChance(15);
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

                let dischargeTarget = "human";
                if (theAttacker == CONSTANTS._player) {
                    const remainingWeapon = this.playerUtils.weapons.filter(w => !weaponNumber.includes(w));
                    this.playerUtils.weapons = remainingWeapon;
                    if (!withPet) {
                        this.opponentLife -= dischargeDamage;
                    } else {
                        dischargeTarget = "pet";
                        const petRemainingLife = Math.max(0, this.opponentUtils.pets.life - dischargeDamage);
                        this.opponentUtils.pets.life = petRemainingLife;
                        this.generateLogs(
                            this.init,
                            { type: CONSTANTS._actions.throw, by: theAttacker, target: "pet" },
                            { name: "Discharge", weapons: weaponNumber, damage: dischargeDamage },
                            { player: this.playerLife < 0 ? 0 : this.playerLife, opponent: this.opponentLife < 0 ? 0 : this.opponentLife, opponentPetLife: petRemainingLife }
                        );
                    }
                } else {
                    const remainingWeapon = this.opponentUtils.weapons.filter(w => !weaponNumber.includes(w));
                    this.opponentUtils.weapons = remainingWeapon;
                    if (!withPet) {
                        this.playerLife -= dischargeDamage;
                    } else {
                        dischargeTarget = "pet";
                        const petRemainingLife = Math.max(0, this.playerUtils.pets.life - dischargeDamage);
                        this.playerUtils.pets.life = petRemainingLife;
                        this.generateLogs(
                            this.init,
                            { type: CONSTANTS._actions.throw, by: theAttacker, target: "pet" },
                            { name: "Discharge", weapons: weaponNumber, damage: dischargeDamage },
                            { player: this.playerLife < 0 ? 0 : this.playerLife, opponent: this.opponentLife < 0 ? 0 : this.opponentLife, playerPetLife: petRemainingLife }
                        );
                    }
                }

                if (dischargeTarget == "human") {
                    this.generateLogs(
                        this.init,
                        { type: CONSTANTS._actions.throw, by: theAttacker, target: "human" },
                        { name: "Discharge", weapons: weaponNumber, damage: dischargeDamage },
                        { player: this.playerLife < 0 ? 0 : this.playerLife, opponent: this.opponentLife < 0 ? 0 : this.opponentLife }
                    );
                }

                this.discharge[theAttacker] = false;
                skillFlag = 1;
            }
        }

        if (this.poisonTouch[theAttacker]) {
            if (theAttacker == CONSTANTS._player) {
                const finalLifePoision = Math.max(0, this.opponentLife - 3);
                this.opponentLife = finalLifePoision;

                // damage pet
                if (!!this.opponentUtils.pets && this.opponentPetLife > 0) {
                    const finalLifePet = Math.max(0, this.opponentPetLife - 3);
                    this.opponentPetLife = finalLifePet;
                    this.generateLogs(
                        this.init,
                        { type: CONSTANTS._actions.poison, by: theDefender, attacker: theAttacker },
                        { name: "Poison Touch", remaining: "unli", damage: 3 },
                        { player: this.playerLife, opponent: this.opponentLife, opponentPetLife: finalLifePet }
                    );
                } else {
                    this.generateLogs(
                        this.init,
                        { type: CONSTANTS._actions.poison, by: theDefender, attacker: theAttacker },
                        { name: "Poison Touch", remaining: "unli", damage: 3 },
                        { player: this.playerLife, opponent: this.opponentLife }
                    );
                }
            } else {
                const finalLifePoision = Math.max(0, this.playerLife - 1);
                this.playerLife = finalLifePoision;

                if (!!this.playerUtils.pets && this.playerPetLife > 0) {
                    const finalLifePet = Math.max(0, this.playerPetLife - 1);
                    this.playerPetLife = finalLifePet;
                    this.generateLogs(
                        this.init,
                        { type: CONSTANTS._actions.poison, by: theDefender, attacker: theAttacker },
                        { name: "Poison Touch", remaining: "unli", damage: 1 },
                        { player: this.playerLife, opponent: this.opponentLife, playerPetLife: finalLifePet }
                    );
                } else {
                    this.generateLogs(
                        this.init,
                        { type: CONSTANTS._actions.poison, by: theDefender, attacker: theAttacker },
                        { name: "Poison Touch", remaining: "unli", damage: 1 },
                        { player: this.playerLife, opponent: this.opponentLife }
                    );
                }
            }
        }

        if (!withPet) { // attack human
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
        } else { // attack pet
            if (!noAttackToPet) {
                for (let i = 1; i <= attackerCombo; i++) {
                    if (this.playerLife > 0 && this.opponentLife > 0) {
                        this.processAttack(theAttacker, attacker_weaponToUse, attackerDamage, defender_weaponToUse, [i, attackerCombo], petDetails);
                    }
                }
            }
        }

        if (this.playerLife <= 0 && this.canRevive.player) {
            this.playerLife = Math.max(0, Math.floor(this.life.max.player * 0.2));
            this.canRevive.player = false;

            this.generateLogs(
                this.init,
                { type: CONSTANTS._actions.revive, by: CONSTANTS._player },
                {},
                { player: this.playerLife, opponent: this.opponentLife }
            );
        }
        if (this.opponentLife <= 0 && this.canRevive.opponent) {
            this.opponentLife = Math.max(0, Math.floor(this.life.max.opponent * 0.2));
            this.canRevive.opponent = false;

            this.generateLogs(
                this.init,
                { type: CONSTANTS._actions.revive, by: CONSTANTS._opponent },
                {},
                { player: this.playerLife, opponent: this.opponentLife }
            );
        }

        if (this.playerLife > 0 && this.opponentLife > 0) {
            if (!withCounter) {
                const attackerWithThrownWeapon = this.thrownWeapons.find(w => w == theAttackerActiveUtils.activeWeapon);
                if (attackerWithThrownWeapon) {
                    this.generateLogs(this.init, { type: CONSTANTS._actions.stopThrow, by: theAttacker });
                } else {
                    this.generateLogs(this.init, { type: CONSTANTS._actions.return, by: theAttacker });
                }
            }
        } else {
            const theDead = this.playerLife <= 0 ? CONSTANTS._player : CONSTANTS._opponent;
            this.generateLogs(this.init, { type: CONSTANTS._actions.died, by: theDead });
        }
    }

    // character attack character or pet
    processAttack(attacker, attackerWeapon, attackerDamage, defenderWeapon, comboInitMax, petDetails) {

        let attackerInitialDamage = Number(attackerDamage.finalDamage);
        const withPet = !!petDetails && petDetails.life > 0; // target pets
        const theAttacker = attacker == CONSTANTS._player ? CONSTANTS._player : CONSTANTS._opponent;
        const theAttackerSkills = attacker == CONSTANTS._player ? this.playerUtils : this.opponentUtils;
        const theDefenderSkills = attacker == CONSTANTS._player ? this.opponentUtils : this.playerUtils;

        const theDefender = attacker == CONSTANTS._player ? CONSTANTS._opponent : CONSTANTS._player;
        const theDefenderLife = attacker == CONSTANTS._player ? this.opponentLife : this.playerLife;
        const theDefenderUtils = attacker == CONSTANTS._player ? this.loadedOpponent : this.currentCharDetails;

        const isPlayerAttacker = theAttacker == CONSTANTS._player;

        const isWithThrownWeapon = this.thrownWeapons.find(w => w == attackerWeapon.number);

        let additionalAccuracy = 0;
        const bullsEye = theAttackerSkills.skills.find(skill => skill == 33); // bulls eye skill 33 passive
        const futureEye = theAttackerSkills.skills.find(skill => skill == 39); // future eye skill 39 passive
        const weaponBreaker = theAttackerSkills.skills.find(skill => skill == 43); // weapoBreaker skill 43 passive
        const weaponStriker = theAttackerSkills.skills.find(skill => skill == 42); // weaponStriker skill 42 passive

        // defender
        const hardHeaded = theDefenderSkills.skills.find(skill => skill == 36); // hard headed skill 36 passive

        if (hardHeaded) {
            const adjustedDamage = attackerInitialDamage * 0.1;
            attackerInitialDamage -= adjustedDamage;
        }

        if (this.buff[theDefender].aura) {
            defenderWeapon.counter += 3;
            defenderWeapon.block += 3;
        }

        if (this.buff[theAttacker].susanoo) {
            const susanoDamage = Math.floor(Number(attackerInitialDamage) * 0.2);
            attackerInitialDamage += susanoDamage;
            additionalAccuracy += 20;
        }

        if (this.buff[theDefender].susanoo) {
            defenderWeapon.block += 10;
        }

        if (this.debuff[theAttacker].genjutsu) {
            attackerWeapon.counter -= 20;
            attackerWeapon.block -= 20;
        }

        if (bullsEye && isWithThrownWeapon) additionalAccuracy += 20;
        if (futureEye && !isWithThrownWeapon) additionalAccuracy += 25;

        const finalAccuracy = attackerWeapon.accuracy + additionalAccuracy;
        let isAccurate = this.calculateAccuracy(finalAccuracy, theDefender);
        let healPoints = 0; // default heal per hit

        if (isAccurate) {
            const withRage = this.rage[theAttacker] && calculateChance(15);
            const withWeaponStriker = weaponStriker ? calculateChance(15) : false;
            const allowWeaponStriker = attackerWeapon.number != -1 && withWeaponStriker && !!comboInitMax && (comboInitMax[1] == 1);
            let finalDamageUse = withWeaponStriker ? Math.floor(attackerInitialDamage * 2) : Math.floor(attackerInitialDamage);

            if (isWithThrownWeapon) {
                finalDamageUse = attackerWeapon.damage;
            }

            if (withRage) {
                finalDamageUse = Math.floor(finalDamageUse * 1.6);
                this.rage[theAttacker] = false;
                this.generateLogs(this.init, { type: CONSTANTS._actions.skill, by: theAttacker }, { skill: "Rage", target: theDefender });
            }

            if (!withPet) {
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
            } else {
                theDefenderSkills.pets.life = Math.max(0, theDefenderSkills.pets.life - finalDamageUse);
            }

            // Passive Vampire Skill 
            const withVampire = theAttackerSkills.skills.find(skill => skill == 16);

            if (withVampire && !isWithThrownWeapon && !withWeaponStriker) healPoints += 5;

            if (!withPet) {
                const logP1 = isPlayerAttacker ? this.playerLife : remaining_defenderLife;
                const logP2 = isPlayerAttacker ? remaining_defenderLife : this.opponentLife;

                if (allowWeaponStriker || isWithThrownWeapon) { // throw weapon
                    this.generateLogs(
                        this.init,
                        { type: CONSTANTS._actions.throw, by: theAttacker, target: "human" },
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
                        { type: CONSTANTS._actions.attack, by: theAttacker, target: "human" },
                        { name: attackerWeapon.name, damage: finalDamageUse, crit: attackerDamage.withCrit, heal: healPoints },
                        { player: logP1, opponent: logP2 }
                    );

                    if (isPlayerAttacker) {
                        this.opponentLife = remaining_defenderLife;
                    } else {
                        this.playerLife = remaining_defenderLife;
                    }

                    if (this.thorns[theDefender]) {
                        let remaingLifeThorns = 0;
                        const thornsDamage = Math.floor(finalDamageUse - (finalDamageUse * 0.50));

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
            } else {
                // hit enemy pet
                const petRemainingLife = theAttacker == CONSTANTS._player ? this.opponentUtils.pets.life : this.playerUtils.pets.life;
                this.generateLogs(
                    this.init,
                    { type: CONSTANTS._actions.attack, by: theAttacker, target: theDefender.concat("Pet"), remainingLife: petRemainingLife, alive: petRemainingLife > 0 },
                    { name: attackerWeapon.name, damage: finalDamageUse, crit: attackerDamage.withCrit, heal: healPoints },
                    { player: this.playerLife, opponent: this.opponentLife }
                );
                if (petRemainingLife <= 0) {
                    this.generateLogs(this.init, { type: CONSTANTS._actions.died, by: theDefender.concat("Pet") });
                }
            }

            this.canCounter[theDefender] = false;
        } else {
            const random_missed_Action = randomizer(1);
            const random_missed_ActionCode = random_missed_Action == 0 ? CONSTANTS._actions.dodge : CONSTANTS._actions.block;

            if (withPet) {
                this.generateLogs(this.init, { type: CONSTANTS._actions.dodge, by: theDefender.concat("Pet"), attacker: theAttacker });
            } else {
                this.generateLogs(this.init, { type: random_missed_ActionCode, by: theDefender, attacker: theAttacker });
                this.canCounter[theDefender] = false;
            }

            const withCounter = isWithThrownWeapon ? false : true; // false to not counter attack with thrown weapon
            const counterResult = this.calculateCounterAttack(defenderWeapon.counter || 0, theDefender);
            this.canCounter[theDefender] = !!counterResult && !!withCounter;
        }

        // pet attacks
        if (theAttackerSkills.pets !== null && theAttackerSkills.pets.length > 0 && theAttackerSkills.pets[0].life > 0) {

            let attackerPetName = "";
            let petTargets = [];
            let target = isPlayer ? "Opponent" : "Player";

            if (attacker == CONSTANTS._player) {
                petTargets = structuredClone(this.playerTarget);
                attackerPetName = "PlayerPet";

                if (theDefenderUtils.pets[0] && theDefenderUtils.pets[0].life <= 0) {
                    petTargets = ["Opponent"];
                }
            } else {
                petTargets = structuredClone(this.opponentTarget);
                attackerPetName = "OpponentPet";

                if (theDefenderUtils.pets[0] && theDefenderUtils.pets[0].life <= 0) {
                    petTargets = ["Player"];
                }
            }

            // Determine the target based on the attacker
            if (petTargets.length > 1) {
                target = randomArrayIndex(petTargets);
            }
            if (target == "") {
                throw new Error("Pet target is empty, cannot proceed with attack.");
            }

            const isPetAccurate = calculateChance(theAttackerSkills.pets[0].accuracy);

            if (isPetAccurate) {

                const playerWithAnimalsLover = this.playerUtils.skills.includes(24);
                const opponentWithAnimalsLover = this.opponentUtils.skills.includes(24);

                // pet targets
                switch (target) {
                    case "Player":
                        const playerFinalDefenderArmor = Math.max(0, playerStats.armor);
                        let opponentPetAttackerToPlayer = structuredClone(this.opponentUtils.pets);
                        let opponentPetDamage = this.calculatePetDamage(opponentPetAttackerToPlayer.damage, playerFinalDefenderArmor, opponentPetAttackerToPlayer.critical || 0, CONSTANTS._opponent);
                        let opponentPetCombo = calculatePetCombo(opponentWithAnimalsLover, theAttackerSkills.pets[0]);
                        let opponentPetWeaponToUse = this.petWeaponToUse(opponentPetAttackerToPlayer);

                        let player_weaponNumber = this.playerUtils.activeWeapon || -1;
                        let player_weaponToUse = CONSTANTS.weaponStats.find(w => w.number == player_weaponNumber);
                        let playerDamage = this.calculateDamage(playerStats.damage, opponentStats.armor, player_weaponToUse, CONSTANTS._player);

                        this.playerBlock = player_weaponToUse.block || 0;

                        this.processTurnsPet(
                            CONSTANTS._opponent, opponentPetDamage, opponentPetCombo, opponentPetWeaponToUse,
                            player_weaponToUse, playerDamage, target
                        );
                        break;
                    case "Opponent":
                        const finalDefenderArmorOpponent = Math.max(0, opponentStats.armor);
                        let playerPetAttackerToOpponent = this.playerUtils.pets;
                        let playerPetDamage = this.calculatePetDamage(playerPetAttackerToOpponent.damage, finalDefenderArmorOpponent, playerPetAttackerToOpponent.critical || 0, CONSTANTS._player);
                        let playerPetCombo = calculatePetCombo(playerWithAnimalsLover, theAttackerSkills.pets[0]);
                        let playerPetWeaponToUse = this.petWeaponToUse(playerPetAttackerToOpponent);

                        let opponent_weaponNumber = this.opponentUtils.activeWeapon || -1;
                        let opponent_weaponToUse = CONSTANTS.weaponStats.find(w => w.number == opponent_weaponNumber);
                        let opponentDamage = this.calculateDamage(this.loadedOpponent.attributes.damage, this.currentCharDetails.attributes.armor, opponent_weaponToUse, CONSTANTS._opponent);

                        const playerStats = structuredClone(this.currentCharDetails.attributes);
                        const opponentStats = structuredClone(this.loadedOpponent.attributes);
                        this.playerLife = playerStats.life;
                        this.opponentLife = opponentStats.life;

                        this.opponentBlock = opponent_weaponToUse.block || 0;

                        this.processTurnsPet(
                            CONSTANTS._player, playerPetDamage, playerPetCombo, playerPetWeaponToUse,
                            opponent_weaponToUse, opponentDamage, target
                        );
                        break;
                    case "PlayerPet":
                        // opponent pet attacks players's pet
                        let playerPetDefender = this.playerUtils.pets;
                        let opponentPetAttacker = this.opponentUtils.pets;
                        if (!!opponentPetAttacker && opponentPetAttacker.life > 0 && !!playerPetDefender && playerPetDefender.life > 0) {
                            const defenderArmor = this.strongBite.opponent ? Math.floor(playerPetDefender.armor * 0.2) : 0;
                            const finalDefenderArmor = Math.max(0, playerPetDefender.armor - defenderArmor);
                            let opponentPetDamage = this.calculatePetDamage(opponentPetAttacker.damage, finalDefenderArmor, opponentPetAttacker.critical || 0, CONSTANTS._opponent);
                            let opponentPetCombo = calculatePetCombo(opponentWithAnimalsLover, theAttackerSkills.pets[0]);
                            let playerPetDamage = this.calculatePetDamage(playerPetDefender.damage, opponentPetAttacker.armor, playerPetDefender.critical || 0, CONSTANTS._player);
                            let playerPetWeaponToUse = this.petWeaponToUse(playerPetDefender);
                            let opponentPetWeaponToUse = this.petWeaponToUse(opponentPetAttacker);

                            this.processTurnsPet(
                                CONSTANTS._opponent, opponentPetDamage, opponentPetCombo,
                                opponentPetWeaponToUse, playerPetWeaponToUse, playerPetDamage, target
                            );
                        }
                        break;
                    case "OpponentPet":
                        // Player pet attacks opponent's pet
                        let playerPetAttacker = this.playerUtils.pets;
                        let opponentPetDefender = this.opponentUtils.pets;
                        if (!!opponentPetDefender && opponentPetDefender.life > 0 && !!playerPetAttacker && playerPetAttacker.life > 0) {
                            const defenderArmor = this.strongBite.player ? Math.floor(opponentPetDefender.armor * 0.2) : 0;
                            const finalDefenderArmor = Math.max(0, opponentPetDefender.armor - defenderArmor);
                            let playerPetDamage = this.calculatePetDamage(playerPetAttacker.damage, finalDefenderArmor, playerPetAttacker.critical || 0, CONSTANTS._player);
                            let playerPetCombo = calculatePetCombo(playerWithAnimalsLover, theAttackerSkills.pets[0]);
                            let opponentPetDamage = this.calculatePetDamage(opponentPetDefender.damage, playerPetAttacker.armor, opponentPetDefender.critical || 0, CONSTANTS._opponent);
                            let opponentPetWeaponToUse = this.petWeaponToUse(opponentPetDefender);
                            let playerPetWeaponToUse = this.petWeaponToUse(playerPetAttacker);

                            this.processTurnsPet(
                                CONSTANTS._player, playerPetDamage, playerPetCombo,
                                playerPetWeaponToUse, opponentPetWeaponToUse, opponentPetDamage, target
                            );
                        }
                        break;
                    default:
                        break;
                }
            } else {
                this.generateLogs(this.init, { type: CONSTANTS._actions.dodge, by: target, attacker: attackerPetName });
            }
        }
    }

    sortAttackers(listOfAttackers) {
        const attackersQueue = [];
        let queueIndex = 0;
        const queueLimit = 1000;
        const maxSpeed = 1000;
        const baseSpeedBonus = 300;
        const attackerCount = listOfAttackers.length;
        const skippedPlayers = new Set(); // To track skipped players

        // First attack skill
        if (this.firstAttack.player && this.firstAttack.opponent) {
            const randAttacker = randomizer(1);
            attackersQueue[queueIndex++] = listOfAttackers[randAttacker].key;
        } else if (this.firstAttack.player) {
            attackersQueue[queueIndex++] = listOfAttackers[0].key;
        } else if (this.firstAttack.opponent) {
            attackersQueue[queueIndex++] = listOfAttackers[1].key;
        }

        if (attackerCount < 2) {
            return attackersQueue.slice(0, queueIndex);
        }

        for (let step = 0; step < queueLimit; step++) {
            const readyAttackers = [];
            const availableAttackers = []; // To handle skipped players

            for (let i = 0; i < attackerCount; i++) {
                const attacker = listOfAttackers[i];
                if (attacker.hp <= 0) continue;

                attacker.current += (attacker.speed + baseSpeedBonus);

                if (attacker.current >= maxSpeed) {
                    readyAttackers.push(attacker);
                } else {
                    availableAttackers.push(attacker); // Track players who are not ready yet
                }
            }

            if (readyAttackers.length > 1) {
                readyAttackers.sort((a, b) => {
                    // First sort by current progress, then by speed
                    if (b.current === a.current) {
                        return b.speed - a.speed; // If they're at the same progress, sort by speed
                    }
                    return b.current - a.current; // Sort by progress (catch up first)
                });
            }

            // If there are skipped players, give them a guaranteed turn after a few rounds
            if (availableAttackers.length > 0 && attackersQueue.length < queueLimit) {
                availableAttackers.forEach((attacker) => {
                    if (!skippedPlayers.has(attacker.key)) {
                        skippedPlayers.add(attacker.key); // Mark player as skipped
                    }

                    // Give skipped players a guaranteed turn after being skipped for a few rounds
                    if (skippedPlayers.has(attacker.key) && attackersQueue.length < queueLimit) {
                        attackersQueue[queueIndex++] = attacker.key;
                        skippedPlayers.delete(attacker.key); // Reset skipped flag after their turn
                    }
                });
            }

            // Push ready attackers to the queue if space allows
            for (const attacker of readyAttackers) {
                if (queueIndex >= queueLimit) break;
                attacker.current -= maxSpeed;
                attackersQueue[queueIndex++] = attacker.key;
            }

            if (queueIndex >= queueLimit) break;
        }

        return attackersQueue.slice(0, queueIndex);
    }

    validateSkills() {

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
    }

    // pet attack pet or character
    processTurnsPet(attacker, attackerDamage, attackerCombo, attacker_weaponToUse, defender_weaponToUse, defenderDamage, target) {
        let isTargetPet = target == "pet";
        let defenderPetAlive = false;

        if (isTargetPet) {
            defenderPetAlive = attacker == CONSTANTS._player ? this.opponentUtils.pets.life > 0 : this.playerUtils.pets.life > 0;
        }

        const playerPet = CONSTANTS._player.concat("Pet");
        const opponentPet = CONSTANTS._opponent.concat("Pet");
        const theAttackerPetName = attacker == CONSTANTS._player ? playerPet : opponentPet;
        const theAttackerActiveUtils = attacker == CONSTANTS._player ? this.playerUtils.pets : this.opponentUtils.pets;

        const defenderUtils = attacker == CONSTANTS._player ? this.opponentUtils : this.playerUtils;
        this.generateLogs(this.init, { type: CONSTANTS._actions.move, by: theAttackerPetName });

        const petDamageProfiles = {
            Bear: [1, 1],             // Attack 1 = 100%, Attack 2 = 100%
            Dog: [1, 0.5],            // Attack 1 = 100%, Attack 2 = 50%
            Snake: [1, 0.7],          // Attack 1 = 100%, Attack 2 = 70%
            Rat: [1, 0.5, 0.5],       // Attack 1 = 100%, Attack 2 = 50%, Attack 3 = 50%
            Cat: [1, 0.7],            // Attack 1 = 100%, Attack 2 = 80%
            Bird: [1, 0.5]            // Attack 1 = 100%, Attack 2 = 50%
        };

        if (defenderPetAlive && target.toLowerCase() == "pet") {
            const theDefenderPetName = attacker == CONSTANTS._player ? opponentPet : playerPet;
            const theDefenderActiveUtils = attacker == CONSTANTS._player ? this.opponentUtils.pets : this.playerUtils.pets;

            for (let i = 1; i <= attackerCombo; i++) {
                const newPetDamage = Math.min(1, Math.floor(attackerDamage.finalDamage * petDamageProfiles[theAttackerActiveUtils[0].name][i]));
                const defenderPetAliveAgain = attacker == CONSTANTS._player ? this.opponentUtils.pets.life > 0 : this.playerUtils.pets.life > 0;

                if (defenderPetAliveAgain) {
                    const isccurate = this.calculateAccuracyPet(theAttackerActiveUtils.agile, attacker_weaponToUse.accuracy, theDefenderActiveUtils.dodge, theDefenderActiveUtils.agile, target);
                    if (!isccurate) {
                        this.generateLogs(this.init, { type: CONSTANTS._actions.dodge, by: theDefenderPetName, attacker: theAttackerPetName });
                    } else {
                        theDefenderActiveUtils.life = Math.max(0, theDefenderActiveUtils.life - newPetDamage);
                        this.generateLogs(
                            this.init,
                            { type: CONSTANTS._actions.attack, by: theAttackerPetName, target: theDefenderPetName, remainingLife: theDefenderActiveUtils.life, alive: theDefenderActiveUtils.life > 0 },
                            { name: attacker_weaponToUse.name, damage: newPetDamage, crit: attackerDamage.withCrit },
                            { player: this.playerLife, opponent: this.opponentLife }
                        );
                        if (theDefenderActiveUtils.life <= 0) {
                            this.generateLogs(this.init, { type: CONSTANTS._actions.died, by: theDefenderPetName });
                        }
                    }
                }
            }
        }
        else {
            for (let i = 1; i <= attackerCombo; i++) {
                let newPetDamage = Math.max(1, Math.floor(attackerDamage.finalDamage * petDamageProfiles[theAttackerActiveUtils[0].name][i]));
                const theDefender = attacker == CONSTANTS._player ? CONSTANTS._opponent : CONSTANTS._player;
                const theDefenderLife = attacker == CONSTANTS._player ? this.opponentLife : this.playerLife;
                const theDefenderUtils = attacker == CONSTANTS._player ? this.loadedOpponent : this.currentCharDetails;

                if (this.buff[theDefender].aura) {
                    defender_weaponToUse.counter += 3;
                    defender_weaponToUse.block += 3;
                }

                if (this.buff[theDefender].susanoo) {
                    defender_weaponToUse.block += 10;
                }

                const isAccurate = this.calculateAccuracyPet(theAttackerActiveUtils.agile, attacker_weaponToUse.accuracy, defender_weaponToUse.block, theDefenderUtils.attributes.agile, target);

                if (isAccurate) {

                    const additionDefend = this.hollowForm[theDefender].count > 0 && this.hollowForm[theDefender].active ? 20 : 0;
                    newPetDamage = Math.max(1, newPetDamage - additionDefend);

                    var remaining_defenderLife = Math.max(0, theDefenderLife - newPetDamage);

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

                    const logP1 = attacker == CONSTANTS._player ? this.playerLife : remaining_defenderLife;
                    const logP2 = attacker == CONSTANTS._player ? remaining_defenderLife : this.opponentLife;

                    this.generateLogs(
                        this.init,
                        { type: CONSTANTS._actions.attack, by: theAttackerPetName, target: "human" },
                        { name: attacker_weaponToUse.name, damage: newPetDamage, crit: attackerDamage.withCrit },
                        { player: logP1, opponent: logP2 }
                    );

                    if (attacker == CONSTANTS._player) {
                        this.opponentLife = remaining_defenderLife;
                    } else {
                        this.playerLife = remaining_defenderLife;
                    }

                    if (this.thorns[target.toLowerCase()]) {
                        let remaingLifeThorns = 0;
                        const thornsDamage = Math.floor(newPetDamage * 0.15);

                        remaingLifeThorns = Math.max(0, theAttackerActiveUtils.life - thornsDamage);

                        this.generateLogs(
                            this.init,
                            { type: CONSTANTS._actions.thorns, by: target },
                            { skill: "Thorns", damage: thornsDamage },
                            { attackerPetLife: remaingLifeThorns }
                        );
                    }

                } else {
                    const random_missed_Action = randomizer(1);
                    const random_missed_ActionCode = random_missed_Action == 0 ? CONSTANTS._actions.dodge : CONSTANTS._actions.block;

                    this.generateLogs(this.init, { type: random_missed_ActionCode, by: theDefender, attacker: theAttackerPetName });

                    if (!!theAttackerActiveUtils && theAttackerActiveUtils.life > 0) {
                        let defenderFinalCombo = defender_weaponToUse.combo - defender_weaponToUse.speed;
                        let defenderCombo = this.calculateCombo(defenderFinalCombo, target.toLowerCase());
                        this.generateLogs(this.init, { type: CONSTANTS._actions.counter, by: target.toLowerCase(), attacker: theAttackerPetName });
                        this.processTurns(
                            theDefender, defenderDamage, defenderCombo,
                            defender_weaponToUse, attacker_weaponToUse, newPetDamage, theAttackerActiveUtils, true
                        );
                    }
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
            }
        }

        if (this.playerLife > 0 && this.opponentLife > 0) {
            if (theAttackerActiveUtils.life > 0) {
                this.generateLogs(this.init, { type: CONSTANTS._actions.return, by: theAttackerPetName });
            }
        } else {
            const theDead = this.playerLife <= 0 ? CONSTANTS._player : CONSTANTS._opponent;
            this.generateLogs(this.init, { type: CONSTANTS._actions.died, by: theDead });
        }
    }

    petWeaponToUse(petDetails) {
        return {
            number: -1,
            name: "wild",
            damage: petDetails.damage,
            combo: petDetails.comboRate,
            speed: petDetails.speed,
            counter: 0,
            accuracy: petDetails.accuracy,
            block: petDetails.dodge,
            disarm: 0,
            critical: 0,
        };
    }

    calculateWinner(winner) {
        const isAdventurer = this.currentCharDetails.utilities.skills.includes(7) ? 1 : 0;
        const isPlayerWin = winner == CONSTANTS._player;
        const userExperience = isPlayerWin ? 2 : 1;
        const finalXp = userExperience + isAdventurer;

        this.currentCharDetails.level.experience += finalXp;

        if (isPlayerWin) {
            this.currentCharDetails.kdStats.win += 1;
        }
        else {
            this.currentCharDetails.kdStats.lose += 1;
        }
        saveToLocalStorage(CONSTANTS._charUserKey, this.currentCharDetails.name); // character user key
        saveToLocalStorage(CONSTANTS._charDetailsKey, this.currentCharDetails); // character data
    }

    //#region Fight Animation
    renderFightAnimation(container, script) {
        const isWithScript = !!script;
        const playerDetails = structuredClone(this.currentCharDetails);
        const opponentDetails = structuredClone(this.loadedOpponent);
        const playerPosition = {
            x: 250,
            y: 380,
            scale: 2
        };
        const opponentPosition = {
            x: 550,
            y: 380,
            scale: 2
        };

        if (!isWithScript) {

            // player
            const charType = "body_".concat(playerDetails.gender);
            this.anims.create({
                key: 'player_body_pose', // name of the animation
                frames: this.anims.generateFrameNames(charType, {
                    start: playerDetails.bodyFrame,
                    end: playerDetails.bodyFrame + 1
                }),
                frameRate: 8,     // how fast it animates
                // repeat: -1        // -1 means loop forever
            });
            const charSprite = this.add.sprite(playerPosition.x, playerPosition.y, charType).setScale(playerPosition.scale).play('player_body_pose');
            container.add(charSprite);

            const charAttireType = "body_basic_attire_".concat(playerDetails.gender);
            this.anims.create({
                key: 'player_body_attire', // name of the animation
                frames: this.anims.generateFrameNames(charAttireType, {
                    start: playerDetails.basicAttire,
                    end: playerDetails.basicAttire + 1
                }),
                frameRate: 8,     // how fast it animates
                // repeat: -1        // -1 means loop forever
            });
            const charAttireSprite = this.add.sprite(playerPosition.x, playerPosition.y, charAttireType).setScale(playerPosition.scale).play('player_body_attire');
            container.add(charAttireSprite);

            const armorResult = playerDetails.utilities.skills.find(skill => skill == 44);
            if (armorResult && !!playerDetails.armorName) {
                const armorKey = "player_body_armor";
                this.anims.create({
                    key: armorKey, // name of the animation
                    frames: this.anims.generateFrameNames(playerDetails.armorName, {
                        start: 0,
                        end: 1
                    }),
                    frameRate: 8,     // how fast it animates
                    // repeat: -1        // -1 means loop forever
                });
                const charArmorSprite = this.add.sprite(playerPosition.x, playerPosition.y, playerDetails.armorName).setScale(playerPosition.scale).play(armorKey);
                container.add(charArmorSprite);
            }

            if (playerDetails.hair.number !== 0 && playerDetails.hair.number !== null) {
                const charHair = "hair_".concat(playerDetails.gender, playerDetails.hair.number);
                this.anims.create({
                    key: 'player_body_hair', // name of the animation
                    frames: this.anims.generateFrameNames(charHair, {
                        start: playerDetails.hair.frame,
                        end: playerDetails.hair.frame + 1
                    }),
                    frameRate: 8,     // how fast it animates
                    // repeat: -1        // -1 means loop forever
                });
                const charHairSprite = this.add.sprite(playerPosition.x, playerPosition.y, charHair).setScale(playerPosition.scale).play('player_body_hair');
                container.add(charHairSprite);
            }

            // opponent
            const charType_opponent = "body_".concat(opponentDetails.gender);
            this.anims.create({
                key: 'opponent_body_pose', // name of the animation
                frames: this.anims.generateFrameNames(charType_opponent, {
                    start: opponentDetails.bodyFrame,
                    end: opponentDetails.bodyFrame + 1
                }),
                frameRate: 8,     // how fast it animates
                // repeat: -1        // -1 means loop forever
            });
            const charSprite_opponent = this.add.sprite(opponentPosition.x, opponentPosition.y, charType_opponent).setScale(opponentPosition.scale).play('opponent_body_pose').setFlipX(true);
            container.add(charSprite_opponent);

            const charAttireType_opponent = "body_basic_attire_".concat(opponentDetails.gender);
            this.anims.create({
                key: 'opponent_body_attire', // name of the animation
                frames: this.anims.generateFrameNames(charAttireType_opponent, {
                    start: opponentDetails.basicAttire,
                    end: opponentDetails.basicAttire + 1
                }),
                frameRate: 8,     // how fast it animates
                // repeat: -1        // -1 means loop forever
            });
            const charAttireSprite_opponent = this.add.sprite(opponentPosition.x, opponentPosition.y, charAttireType_opponent).setScale(opponentPosition.scale).play('opponent_body_attire').setFlipX(true);
            container.add(charAttireSprite_opponent);

            const armorResult_opponent = opponentDetails.utilities.skills.find(skill => skill == 44);
            if (armorResult_opponent && !!opponentDetails.armorName) {
                const armorKey_opponent = "opponent_body_armor";
                this.anims.create({
                    key: armorKey_opponent, // name of the animation
                    frames: this.anims.generateFrameNames(opponentDetails.armorName, {
                        start: 0,
                        end: 1
                    }),
                    frameRate: 8,     // how fast it animates
                    //         // repeat: -1        // -1 means loop forever
                });
                const charArmorSprite_opponent = this.add.sprite(opponentPosition.x, opponentPosition.y, opponentDetails.armorName).setScale(opponentPosition.scale).play(armorKey_opponent).setFlipX(true);
                container.add(charArmorSprite_opponent);
            }

            if (opponentDetails.hair.number !== 0 && opponentDetails.hair.number !== null) {
                const charHair_opponent = "hair_".concat(opponentDetails.gender, opponentDetails.hair.number);
                this.anims.create({
                    key: 'opponent_body_hair', // name of the animation
                    frames: this.anims.generateFrameNames(charHair_opponent, {
                        start: opponentDetails.hair.frame,
                        end: opponentDetails.hair.frame + 1
                    }),
                    frameRate: 8,     // how fast it animates
                    // repeat: -1        // -1 means loop forever
                });
                const charHairSprite_opponent = this.add.sprite(opponentPosition.x, opponentPosition.y, charHair_opponent).setScale(opponentPosition.scale).play('opponent_body_hair').setFlipX(true);
                container.add(charHairSprite_opponent);
            }
        }
        else {
            const isWithAction = isWithScript && script.action;
            const isMoved = isWithAction && script.action.type == CONSTANTS._actions.move;

        }
    }
}
