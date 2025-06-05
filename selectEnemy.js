class PlayerSelect extends Phaser.Scene {
    constructor() {
        super({ key: "playerSelect" });

        this.isLock = false; // flag to lock unlock creating character

        this.flags = {
            isLock: false, // flag to lock unlock creating character
            isSaving: false // flag to lock naming while entering password
        }

        // this.availableUtils = {
        //     pets: CONSTANTS._petsAll,
        //     weapons: CONSTANTS._weaponsAvailable,
        //     skills: CONSTANTS._skills
        // };
        this.binKey = "67d9878c8a456b7966787549";
        this.masterKey = "$2a$10$Mya1QQvt8foHg2AaLxkgaeZ2mRJ4HnwVKlD4ElQkL3TvUl94sJtau";
    }

    create() {

        localStorage.removeItem("opponent");
        const loadIsLogin = this.loadCharacter("recentLogin");
        if (loadIsLogin) {
            this.createToast(generateRandomKeys(), CONSTANTS._successMessages.loginSuccess, true);
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
        const loadedOpponent = this.loadCharacter("opponent");
        if (loadedOpponent) {
            this.scene.start('playerFight');
        }

        this.centerX = this.sys.game.config.width / 2;
        this.centerY = this.sys.game.config.height / 2;

        this.mainContainer = this.add.container(0, 0);
        this.mainContainer.setSize(CONSTANTS._gameWidth, CONSTANTS._gameHeight);

        this.background = this.add.image(0, 0, "bg-blank").setOrigin(0);
        this.background.displayWidth = CONSTANTS._gameWidth;
        this.background.displayHeight = CONSTANTS._gameHeight;
        this.mainContainer.add(this.background);

        this.characterContainer = this.add.container(0, 0);
        this.characterContainer.setSize(CONSTANTS._gameWidth, CONSTANTS._gameHeight);

        this.buttonContainer = this.add.container(0, 0);
        this.buttonContainer.setSize(CONSTANTS._gameWidth, CONSTANTS._gameHeight);

        this.charNameContainer = this.add.container(0, 0);
        this.charNameContainer.setSize(CONSTANTS._gameWidth, CONSTANTS._gameHeight);

        this.renderCreateCharacter();
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
        this.createName();
        let rand_chars = this.renderRandomCharacter(this.currentCharDetails.level.current);
        // console.log({ rand_chars: rand_chars });

        // this.calculateLevelUp();
        let startX = 110;
        let gap = 100;
        let rowLimit = 7;
        let nextRow_X = startX;

        for (let i = 0; i < rand_chars.length; i++) {
            const randCharDetails = rand_chars[i];

            // Check if we need to reset for the next row
            if (i % rowLimit === 0 && i !== 0) {
                nextRow_X = startX; // Reset x position for new row
            }

            const xSpacing = nextRow_X;
            const ySpacing = 220;
            const useSpacing_y = i < rowLimit
                ? (this.characterContainer.height / 2) - CONSTANTS._charPostionY
                : (this.characterContainer.height / 2) - CONSTANTS._charPostionY + ySpacing;

            let currentCharDetails = {
                gender: randCharDetails.gender,
                bodyFrame: randCharDetails.bodyFrame,
                hair: {
                    number: randCharDetails.hair.number,
                    frame: randCharDetails.hair.frame
                },
                basicAttire: randCharDetails.basicAttire
            };

            let charDetails = {
                x: xSpacing,
                y: useSpacing_y,
                frame: 0,
                scale: 3,
                origin: 0.5
            };

            this.renderSprite(this.characterContainer, currentCharDetails, charDetails, randCharDetails);

            let selectTxtOpponent = this.add.text(charDetails.x - 50, charDetails.y + 100, rand_chars[i].name, {
                fontSize: '20px',
                fill: '#000000',
                fontStyle: 'bold',
                stroke: '#ffffff', // Border color
                strokeThickness: 2 // Border thickness
            });
            selectTxtOpponent.setInteractive();
            this.characterContainer.add(selectTxtOpponent);

            selectTxtOpponent.on("pointerdown", () => {
                // this.scene.start('playerHome');
                // to do create a fight scene simulation
                saveToLocalStorage("opponent", rand_chars[i]);
                this.scene.start('playerFight');
            });

            nextRow_X += gap; // Move to the next position in row
        }
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
            const randomSkin = randomArrayIndex([1, 2, 3, 4, 5]);
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

    changeGender() {
        this.currentCharDetails.gender = this.currentCharDetails.gender == CONSTANTS._genders[1] ? CONSTANTS._genders[0] : CONSTANTS._genders[1];
        this.renderCreateCharacter();
    }

    changeColor() {
        this.currentCharDetails.hair.frame = CONSTANTS._hairFrames[randomizer(CONSTANTS._hairFrames.length - 1)];
        this.currentCharDetails.bodyFrame = CONSTANTS._bodyFrames[randomizer(CONSTANTS._bodyFrames.length - 1)];
        this.currentCharDetails.basicAttire = CONSTANTS._basicAttireFrames[randomizer(CONSTANTS._bodyFrames.length - 1)];
        this.renderCreateCharacter();
    }

    changeRandom() {

        this.currentCharDetails.gender = CONSTANTS._genders[randomizer(CONSTANTS._genders.length - 1)];

        const hairGenderValue = this.currentCharDetails.gender == CONSTANTS._genders[1] ? CONSTANTS._hairSpriteCount.male : CONSTANTS._hairSpriteCount.female;
        this.currentCharDetails.hair.number = randomizer(hairGenderValue);
        this.currentCharDetails.hair.frame = CONSTANTS._hairFrames[randomizer(CONSTANTS._hairFrames.length - 1)];
        this.currentCharDetails.basicAttire = CONSTANTS._basicAttireFrames[randomizer(CONSTANTS._bodyFrames.length - 1)];

        this.renderCreateCharacter();
    }

    createName() {
        // Clear the container first
        this.charNameContainer.removeAll(true);

        // to do - change to logout sprite
        const logoutTxt = this.add.sprite(this.scale.width - 110, 0, "logoutTxt").setFrame(1).setOrigin(0, 0);
        logoutTxt.setInteractive();
        this.charNameContainer.add(logoutTxt);

        logoutTxt.on("pointerdown", () => {
            var isLogout = this.currentCharDetails.psd ? true : false;
            if (!this.currentCharDetails.psd) {
                isLogout = confirm("Progress won't be save! Do you like to proceed?");
            }

            if (isLogout) {
                localStorage.removeItem(CONSTANTS._charUserKey);
                localStorage.removeItem(CONSTANTS._charDetailsKey);
                localStorage.setItem(CONSTANTS._logout, 'true');
                this.scene.start('playGame');
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
                passwordInput.style.display = 'block';
                buttonContainer.style.display = 'block';
                passwordInput.focus();
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
                    this.setLoading(true);
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
                            this.setLoading(false);
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

        let opponentTxt = this.add.text(40, 60, "Select your Opponent", {
            fontSize: '30px',
            fill: '#000000',
            fontStyle: 'bold',
            stroke: '#ffffff', // Border color
            strokeThickness: 2 // Border thickness
        });
        this.charNameContainer.add(opponentTxt);

        let backTxt = this.add.text(30, 565, "Back", {
            fontSize: '20px',
            fill: '#000000',
            fontStyle: 'bold',
            stroke: '#ffffff', // Border color
            strokeThickness: 2 // Border thickness
        });
        backTxt.setInteractive();
        this.charNameContainer.add(backTxt);

        backTxt.on("pointerdown", () => {
            this.scene.start('playerHome');
        });
    }

    loadCharacter(key) {
        const encryptedData = localStorage.getItem(key);

        if (encryptedData) {
            try {
                return decryptData(key);
            } catch (error) {
                console.error(CONSTANTS._errorMessages.failedDecrypt, error);
                return null;
            }
        }

        return null;
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
     * Calculates character level-up and assigns new utilities.
     * @returns {void}
     */
    calculateLevelUp(charData) {
        let availUtils = {
            pets: CONSTANTS._petsAll,
            weapons: CONSTANTS._weaponsAvailable,
            skills: CONSTANTS._skills
        };
        availUtils = this.validateAvailableUtils(charData, availUtils);

        if (!charData.attributes) { // set to default attributes
            charData.attributes = {
                life: 60,
                damage: 1,
                agile: 1,
                speed: 1,
                armor: 0
            };
        }

        if (charData.level.points > 0) {
            var gainedUtils = [];
            for (let i = 1; i <= charData.level.points; i++) {

                let utilResults = "";
                let randomUtils = {};
                let utils = "";

                // checker for empty utilities
                const zero_avail_Skills = availUtils.skills.length == 0 ? {} : { "name": "skills", "chance": 30 };
                const zero_avail_Weapons = availUtils.weapons.length == 0 ? {} : { "name": "weapons", "chance": 45 };
                const zero_avail_Pets = availUtils.pets.length == 0 ? {} : { "name": "pets", "chance": 20 };
                const avail_stats = { "name": "stats", "chance": 5 };
                const toRender = [];

                // checker for animal lover skill that can support multiple pets
                const currentUserPetCount = charData.utilities.pets.length;
                const isAnimalLover = charData.utilities.skills.filter(skill => skill == 24);

                toRender.push(avail_stats);

                if (availUtils.skills.length > 0) toRender.push(zero_avail_Skills);
                if (availUtils.weapons.length > 0) toRender.push(zero_avail_Weapons);
                if (availUtils.pets.length > 0) {
                    if (currentUserPetCount == 0) {
                        toRender.push(zero_avail_Pets);
                    } else if (currentUserPetCount > 0 && isAnimalLover.length > 0) {
                        toRender.push(zero_avail_Pets);
                    } else {
                        // do nothing -> dont add pets
                    }
                }

                randomUtils = this.getRandom_UtilsItem(toRender);
                // randomUtils.name = "pets" // for manual testing overwrite

                switch (randomUtils.name) {
                    case "skills":
                        utils = this.getRandomItem(charData, availUtils.skills);
                        break;
                    case "weapons":
                        utils = this.getRandomWeapons(charData, availUtils.weapons);
                        break;
                    case "pets":
                        utils = this.getRandomPets(charData, availUtils.pets);
                        break;
                    case "stats":
                        const armors = [51, 46, 44, 38, 17, 9];
                        let witharmor = false;

                        for (let armor of armors) {
                            if (charData.utilities.skills.includes(armor)) {
                                witharmor = true;
                                break;
                            }
                        }
                        const randomStatsNumber = witharmor ? 4 : 3;
                        const randomStatsNumberResult = randomizer(randomStatsNumber);
                        let keyName = "";
                        if (randomStatsNumberResult == 0) {
                            charData.attributes.life += 8;
                            keyName = "Life stats";
                        } else if (randomStatsNumberResult == 1) {
                            charData.attributes.damage += 2;
                            keyName = "Damage stats";
                        } else if (randomStatsNumberResult == 2) {
                            charData.attributes.agile += 2;
                            keyName = "Agile stats";
                        } else if (randomStatsNumberResult == 3) {
                            charData.attributes.speed += 2;
                            keyName = "Speed stats";
                        } else if (randomStatsNumberResult == 3) {
                            charData.attributes.armor += 2;
                            keyName = "armor stats";
                        }
                        utils = { key: "stats", name: keyName }
                        break;
                    default:
                        console.log(CONSTANTS._errorMessages.noUtilitiesFound);
                }

                utilResults = utils ? { key: randomUtils.name, value: utils } : { key: "", value: "" };

                charData.level.current++;

                availUtils = this.validateAvailableUtils(charData, availUtils);
                charData = this.validateNewUtils(charData, utilResults);
            }

            charData.level.points = 0;
        }
        return charData;
    }

    // GET random skill, weapon, pet, etc.
    getRandom_UtilsItem(items) {

        // Calculate the total chance
        const totalChance = items.reduce((acc, item) => acc + item.chance, 0);
        // Generate a random number between 0 and the total chance
        const randomNum = Math.random() * totalChance;

        // Determine which item is selected based on the random number
        let cumulativeChance = 0;
        for (const item of items) {
            cumulativeChance += item.chance;
            if (randomNum < cumulativeChance) {
                return item;
            }
        }
    }

    getRandomWeapons(charData, availUtils) {
        if (availUtils.length == 0) return { name: null };

        let totalChance = availUtils.reduce((sum, item) => sum + item.chance, 0);
        let randomNum = Math.random() * totalChance;
        let cumulativeChance = 0;

        for (let item of availUtils) {
            cumulativeChance += item.chance;
            if (randomNum <= cumulativeChance) {
                charData.utilities.weapons.push(item.number);
                return item;
            }
        }
    }

    getRandomItem(charData, items) {

        if (items.length == 0) return { name: null };

        let itemsToUse = [];

        for (let item of items) {
            // Skip the items that need required utils to acquire
            if (item.require) {
                var withRequiredItem = !!charData.utilities.skills.find(skill => skill == item.require);
                if (!withRequiredItem) continue; // Skip this item instead of returning
            }

            itemsToUse.push(item);
        }

        let totalChance = itemsToUse.reduce((sum, item) => sum + item.chance, 0);
        let randomNum = Math.random() * totalChance;
        let cumulativeChance = 0;

        for (let item of itemsToUse) {
            cumulativeChance += item.chance;
            if (randomNum <= cumulativeChance) {
                charData.utilities.skills.push(item.number);
                return item;
            }
        }
    }

    getRandomPets(charData, availPets) {

        if (charData.utilities.pets.length > 0) {
            charData.utilities.pets[0].level++;
            return charData.utilities.pets[0];
        }
        else {
            if (availPets.length == 0) return { name: null };

            const charOwnedPets = charData.utilities.pets;
            const availablePets = availPets;
            const newSetofPet = CONSTANTS._petsNew;

            // group owned pets and count 
            const groupedPets = charOwnedPets.reduce((acc, pet) => {
                if (!acc[pet.name]) {
                    acc[pet.name] = { name: pet.name, count: 0 }; // Initialize with pet data and count
                }
                acc[pet.name].count++; // Increment count
                return acc;
            }, {});

            const results = Object.values(groupedPets);
            const maxPets = results.filter(maxPet => maxPet.count >= 4);

            // remove the max pets in the possible options
            maxPets.forEach(maxPet => {
                const petIndex = newSetofPet.findIndex(pet => ((pet.name == maxPet.name) && (pet.types == maxPet.types)));

                if (petIndex !== -1) {
                    newSetofPet.splice(petIndex, 1);
                }
            });

            let totalChance = newSetofPet.reduce((sum, pet) => sum + pet.chance, 0);
            let randomNum = Math.random() * totalChance;
            let cumulativeChance = 0;

            for (let item of newSetofPet) {
                if (item.skip) continue;
                cumulativeChance += item.chance;
                if (randomNum <= cumulativeChance) {

                    const petToSave = availablePets.filter(pets => pets.name == item.name);

                    if (petToSave.length > 0){
                        charData.utilities.pets.push(petToSave[0])
                    };

                    return petToSave.length > 0 ? petToSave[0] : { name: null };
                }
            }
        }
    }

    /**
     * Validate new utilities achieved and set stats base on the utilities.
     * @param {Object} utils - The new utilities achieved.
     * @returns {string} - The result of the new utilities message.
     */
    validateNewUtils(charData, utils) {
        var result = `Increase <b>"{stats}"</b>`;
        var statsKey = "";
        const randomStatsNumber = randomizer(3);

        switch (randomStatsNumber) {
            case 0: // life
                charData.attributes.life += 5;
                const additionalLife = !!charData.utilities.skills.find(skill => skill == 52);
                const additionalLifeImmortality = !!charData.utilities.skills.find(skill => skill == 51);
                if (additionalLifeImmortality) charData.attributes.life += 20;
                if (additionalLife) charData.attributes.life += 5;
                if (utils.value.name == null) charData.attributes.life += 5;
                statsKey = "life";
                break;
            case 1: // damage
                charData.attributes.damage++;
                const additionalDamage = !!charData.utilities.skills.find(skill => skill == 55);
                const additionalDamage_GOD = !!charData.utilities.skills.find(skill => skill == 10);
                if (additionalDamage_GOD) charData.attributes.damage += 2;
                if (additionalDamage) charData.attributes.damage++;
                if (utils.value.name == null) charData.attributes.damage++;
                statsKey = "damage";
                break;
            case 2: // agile
                charData.attributes.agile++;
                const additionalAgile = !!charData.utilities.skills.find(skill => skill == 54);
                const additionalAgile_GOD = !!charData.utilities.skills.find(skill => skill == 8);
                if (additionalAgile_GOD) charData.attributes.agile += 2;
                if (additionalAgile) charData.attributes.agile++;
                if (utils.value.name == null) charData.attributes.agile++;
                statsKey = "agile";
                break;
            case 3: // speed
                charData.attributes.speed++;
                const additionalSpeed = !!charData.utilities.skills.find(skill => skill == 53);
                const additionalSpeed_GOD = !!charData.utilities.skills.find(skill => skill == 29);
                if (additionalSpeed_GOD) charData.attributes.speed += 2;
                if (additionalSpeed) charData.attributes.speed++;
                if (utils.value.name == null) charData.attributes.speed++;
                statsKey = "speed";
                break;
            default:
                console.log("No stats found.");
                break;
        }
        // const maxUtilsMessage = utils.value.name == null ? `x2 in ${utils.key}` : "";
        // result = result.replace("{stats}", statsKey).concat(" ", maxUtilsMessage);

        const utilitiesKey = utils.key;
        switch (utilitiesKey) {
            case "skills":
                charData = this.validatePlusStats_Skills(charData, utils.value);
                break;
            case "weapons":
                // do nothing
                break;
            case "pets":
                if (!!utils.value.name) charData = this.validatePlusStats_Pets(charData, utils.value);
                break;
            default:
                // do nothing for stats
                break;
        }
        return charData;
    }

    /**
     * Validate new pets and adjust life stats base on the pets.
     * @param {Object} pets - The new pets achieved.
     * @returns {void}
     */
    validatePlusStats_Pets(charData, pets) {
        const petName = pets.name.toLowerCase();
        const isSurgeOfLife = !!charData.utilities.skills.find(skill => skill.number == 52);
        const isImmortality = !!charData.utilities.skills.find(skill => skill.number == 51);
        const petsDeductions = {
            bear: [25, 35, 50],
            dog: [6, 9, 15],
            cat: [5, 8, 14],
            snake: [3, 5, 9],
            bird: [2, 4, 8],
            rat: [1, 2, 4]
        };
        const deductionValue = isSurgeOfLife && isImmortality ? 2 : isSurgeOfLife ? 1 : 0;
        const currentLife = charData.attributes.life - petsDeductions[petName][deductionValue];
        charData.attributes.life = currentLife <= 0 ? 1 : currentLife;
        return charData;
    }

    /**
     * Validate new skills and adjust stats base on the skills passive.
     * @param {Object} skills - The new skill achieved.
     * @returns {void}
     */
    validatePlusStats_Skills(charData, skill) {
        switch (skill.number) {
            case 52: // surge of life
                const currentLife = charData.attributes.life;
                const addedLife = currentLife + 10;
                const resultLife = Math.ceil((addedLife / 2)) + addedLife;
                charData.attributes.life = resultLife;
                break;
            case 53: // surge of speed
                const currentSpeed = charData.attributes.speed;
                const addedSpeed = currentSpeed + 4;
                const resultSpeed = Math.ceil((addedSpeed / 2)) + addedSpeed;
                charData.attributes.speed = resultSpeed;
                break;
            case 54: // surge of agile
                const currentAgile = charData.attributes.agile;
                const addedAgile = currentAgile + 4;
                const resultAgile = Math.ceil((addedAgile / 2)) + addedAgile;
                charData.attributes.agile = resultAgile;
                break;
            case 55: // surge of strength
                const currentDamage = charData.attributes.damage;
                const addedDamage = currentDamage + 4;
                const resultDamage = Math.ceil((addedDamage / 2)) + addedDamage;
                charData.attributes.damage = resultDamage;
                break;
            case 51: // God Immortality
                const currentImmortality_god = charData.attributes.life;
                const addedImmortality_god = Math.ceil(currentImmortality_god * 2.5);
                charData.attributes.life = addedImmortality_god;
                break;
            case 8: // God Of Agility Scurry
                const currentAgile_god = charData.attributes.agile;
                const addedAgile_god = Math.ceil(currentAgile_god * 2.5);
                charData.attributes.agile = addedAgile_god;
                break;
            case 10: // God Of Strength
                const currentDamage_god = charData.attributes.damage;
                const addedDamage_god = Math.ceil(currentDamage_god * 2.5);
                charData.attributes.damage = addedDamage_god;
                break;
            case 29: // Flash step
                const currentSpeed_god = charData.attributes.speed;
                const addedSpeed_god = Math.ceil(currentSpeed_god * 2.5);
                charData.attributes.speed = addedSpeed_god;
                break;
            case 44: // Champion skin
                const currentSpeed_SKIN = charData.attributes.speed;
                const subtractedSpeed = currentSpeed_SKIN - Math.ceil(currentSpeed_SKIN * 0.1);
                charData.attributes.speed = subtractedSpeed <= 0 ? 1 : subtractedSpeed;
                break;
            default:
                break;
        }

        return charData;
    }

    /**
     * Create reusable modal with table component to display message
     * @param {string} key - use as button id
     * @param {string} message - modal message, must contain table row and data elements
     * @returns {void}
     */
    createModalTable(key, message) {
        const modal = document.createElement("div");
        modal.innerHTML = `
            <div class="modal fade show d-block" tabindex="-1" role="dialog">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-header bg-success">
                            <h5 class="modal-title text-light">Level Up!</h5>
                        </div>
                        <div class="modal-body" style="height: 200px; overflow-y: auto;">
                            <table class="table table-bordered">
                                <tbody>
                                    ${message}
                                </tbody>
                            </table>
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

    createCursorTooltip() {
        // Create tooltip element
        const tooltip = document.createElement("div");
        tooltip.id = "cursor-tooltip";
        tooltip.className = "position-absolute bg-dark text-white border rounded p-2";
        tooltip.style.position = "absolute";
        tooltip.style.zIndex = "1000";
        tooltip.style.pointerEvents = "none"; // Prevents interference with other elements
        tooltip.style.fontSize = "14px";
        tooltip.style.border = "1px solid white";
        tooltip.style.borderRadius = "5px";
        tooltip.style.padding = "5px";
        tooltip.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.2)";

        document.body.appendChild(tooltip);

        // Update tooltip position on mouse move
        document.addEventListener("mousemove", (event) => {
            tooltip.style.left = `${event.pageX + 10}px`; // Offset to prevent overlap
            tooltip.style.top = `${event.pageY + 10}px`;
            tooltip.innerHTML = `X: ${event.pageX}, Y: ${event.pageY}`;
        });

        // Hide on mouse out
        document.addEventListener("mouseleave", () => {
            tooltip.style.display = "none";
        });

        document.addEventListener("mouseenter", () => {
            tooltip.style.display = "block";
        });
    }

    validateAvailableUtils(charData, availUtils) {

        if (charData.utilities.weapons.length != 0) {
            availUtils.weapons = availUtils.weapons.filter(item => !charData.utilities.weapons.includes(item.number));
        }

        if (charData.utilities.skills.length != 0) {
            availUtils.skills = availUtils.skills.filter(item => !charData.utilities.skills.includes(item.number));
        }

        if (charData.utilities.pets.length != 0) {
            availUtils.pets = availUtils.pets.filter(item => !charData.utilities.pets.includes(item.name) && !charData.utilities.pets.includes(item.types));
        }

        return availUtils;
    }

    creteBars(container) {

        const barWidth = 80; // Total width of the bar
        const barHeight = 15; // Height of each segment
        const maxSegments = 10; // Always 10 segments per bar
        const segmentWidth = barWidth / maxSegments; // Width of each segment

        for (let i = 1; i <= CONSTANTS._colors.length - 1; i++) {
            const color = CONSTANTS._colors[i]; // Use the pre-determined colors
            const borderThickness = 1; // Thickness of the border
            const borderColor = color[i] == CONSTANTS._colors[13] ? 0xffffff : 0x000000;
            // Create the outer rectangle (border)
            const outerSegment = this.add.rectangle(
                i * segmentWidth, // Position segments horizontally with spacing
                0, // Align vertically
                segmentWidth, // Outer rectangle includes the border
                barHeight, // Outer rectangle includes the border
                borderColor // Border color (black)
            );
            outerSegment.setOrigin(0); // Align to the top-left
            container.add(outerSegment);

            // Create the inner rectangle (fill)
            const innerSegment = this.add.rectangle(
                i * segmentWidth + borderThickness, // Adjust for border thickness
                borderThickness, // Adjust for border thickness
                segmentWidth - 2, // Adjust for border thickness
                barHeight - 2, // Adjust for border thickness
                Phaser.Display.Color.HexStringToColor(color).color // Set color based on filled/unfilled segments
            );
            innerSegment.setOrigin(0); // Align to the top-left
            container.add(innerSegment);
        }
    }

    createModalTable2(title, message, key) {
        const modal = document.createElement("div");
        modal.innerHTML = `
            <div class="modal fade show d-block" tabindex="-1" role="dialog">
                <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-header bg-success">
                            <h5 class="modal-title text-light">${title}</h5>
                        </div>
                        <div class="modal-body" style="height: 500px; overflow-y: auto;">
                            <table class="table table-bordered">
                                <tbody>
                                    ${message}
                                </tbody>
                            </table>
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

    setLoading(withLoading) {
        const loadingScreen = document.getElementById("loading-screen");
        if (loadingScreen) {
            loadingScreen.style.display = withLoading ? "flex" : "none";
        } else {
            console.warn("Loading screen element not found!");
        }
    }

    renderRandomCharacter(lvlPoints) {

        const maxRandomChar = 14;
        let randomChars = [];

        for (let i = 1; i <= maxRandomChar; i++) {
            const rand_Gender = CONSTANTS._genders[randomizer(CONSTANTS._genders.length - 1)];
            const rand_hairGenderValue = rand_Gender == CONSTANTS._genders[1] ? CONSTANTS._hairSpriteCount.male : CONSTANTS._hairSpriteCount.female;
            const rand_hairNumber = randomizer(rand_hairGenderValue);
            const rand_hairFrame = CONSTANTS._hairFrames[randomizer(CONSTANTS._hairFrames.length - 1)];
            const rand_basicAttire = CONSTANTS._basicAttireFrames[randomizer(CONSTANTS._bodyFrames.length - 1)];
            const rand_bodyFrame = CONSTANTS._bodyFrames[randomizer(CONSTANTS._bodyFrames.length - 1)];

            let randomChar = {
                level: {
                    current: 0,
                    experience: 0,
                    points: lvlPoints || 1
                },
                name: "Bot" + randomizer(9999),
                gender: rand_Gender,
                bodyFrame: rand_bodyFrame,
                hair: {
                    number: rand_hairNumber,
                    frame: rand_hairFrame
                },
                basicAttire: rand_basicAttire,
                utilities: {
                    skills: [],
                    weapons: [],
                    pets: []
                }
            }

            randomChar = this.calculateLevelUp(randomChar);
            randomChars.push(randomChar);
        }

        return randomChars;
    }
}

