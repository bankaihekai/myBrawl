//#region encrypt & decrypt

function encryptedData(key, data) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), key.concat("1")).toString();
}

function decryptData(key) {
    const encryptedData = localStorage.getItem(key);
    const bytes = CryptoJS.AES.decrypt(encryptedData, key.concat("1"));
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

function saveToLocalStorage(key, data) {
    const encryptedData = this.encryptedData(key, data);
    localStorage.setItem(key, encryptedData);
};

function loadCharacter(key) {
    const userData = localStorage.getItem(key);

    if (userData) {
        try {
            return decryptData(key);
        } catch (error) {
            console.error(CONSTANTS._errorMessages.failedDecrypt, error);
        }
    }

    return null;
}

function generateRandomKeys() {
    return Math.random().toString(36).substring(2, 7);
}

//#endregion

//#region value/number

function randomizer(max) {
    return Phaser.Math.Between(0, max);
}

function randomizerMinMax(min, max) {
    return Phaser.Math.Between(min, max);
}

function getMaxExpForLevel(level) {
    return Math.round(level * 1.5);
}

function randomArrayIndex(data) {
    const randomIndex = Math.floor(Math.random() * data.length);
    return data[randomIndex];
}

function calculateChance(chance) {
    if (chance < 0) return false;
    if (chance > 100) return true;

    const randomValue = Math.random() * 100; // Generates a random number between 0 and 100
    return randomValue <= chance; // Returns true if item is achieved, false otherwise
}

function calculatePercentage(partNum, wholeNum) {
    return (partNum / wholeNum) * 100;
}

function calculatePetCombo(withAnimalsLover, petDetails) {
    let combo = 1; // Attack 1 always happens
    const { name } = petDetails;

    switch (name) {
        case "Bear": {
            const bearMaxCombo = withAnimalsLover ? 2 : 1;
            if (withAnimalsLover) {
                const bearSecondAttack = calculateChance(20) ? 1 : 0; // 20% accuracy
                combo = Math.min(combo + bearSecondAttack, bearMaxCombo);
            }
            break;
        }
        case "Dog": {
            const dogMaxCombo = withAnimalsLover ? 2 : 1;
            if (withAnimalsLover) {
                const dogSecondAttack = calculateChance(40) ? 1 : 0; // 40% accuracy
                combo = Math.min(combo + dogSecondAttack, dogMaxCombo);
            }
            break;
        }
        case "Snake": {
            const snakeMaxCombo = withAnimalsLover ? 2 : 1;
            if (withAnimalsLover) {
                const snakeSecondAttack = calculateChance(30) ? 1 : 0; // 30% accuracy
                combo = Math.min(combo + snakeSecondAttack, snakeMaxCombo);
            }
            break;
        }
        case "Rat": {
            const ratMaxCombo = withAnimalsLover ? 3 : 1;
            if (withAnimalsLover) {
                const ratSecondAttack = calculateChance(60) ? 1 : 0; // 60% accuracy
                const ratThirdAttack = calculateChance(60) ? 1 : 0; // 60% accuracy
                combo = Math.min(combo + ratSecondAttack + ratThirdAttack, ratMaxCombo);
            }
            break;
        }
        case "Cat": {
            const catMaxCombo = withAnimalsLover ? 2 : 1;
            if (withAnimalsLover) {
                const catSecondAttack = calculateChance(50) ? 1 : 0; // 50% accuracy
                combo = Math.min(combo + catSecondAttack, catMaxCombo);
            }
            break;
        }
        case "Bird": {
            const birdMaxCombo = withAnimalsLover ? 2 : 1;
            if (withAnimalsLover) {
                const birdSecondAttack = calculateChance(40) ? 1 : 0; // 40% accuracy
                combo = Math.min(combo + birdSecondAttack, birdMaxCombo);
            }
            break;
        }
        default:
            break;
    }

    return combo;
}

//#endregion

//#region HTML Display

function setLoading(withLoading) {
    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) {
        loadingScreen.style.display = withLoading ? "flex" : "none";
    } else {
        console.warn("Loading screen element not found!");
    }
}

//#endregion


//#region Fight helpers

function getRandom_UtilsItem(items) {

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

function getRandomItem(items, characterDetails) {

    if (items.length == 0) return { name: null };

    let itemsToUse = [];

    for (let item of items) {
        // Skip the items that need required utils to acquire
        if (item.require) {
            let withRequiredItem = !!characterDetails.utilities.skills.find(skill => skill == item.require);
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
            characterDetails.utilities.skills.push(item.number);
            return {
                characterDetails: characterDetails,
                item: item
            };
        }
    }
}

function getRandomPets(availPets, characterDetails) {

    if (characterDetails.utilities.pets.length > 0) {
        return {
            characterDetails: characterDetails,
            item: [characterDetails.utilities.pets[0], "petLvlUp"]
        }
    }
    else {
        if (availPets.length == 0) return { name: null };

        const charOwnedPets = characterDetails.utilities.pets;
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

                if (petToSave.length > 0) characterDetails.utilities.pets.push(petToSave[0]);
                return {
                    characterDetails: characterDetails,
                    item: petToSave.length > 0 ? [petToSave[0], ""] : [{ name: null }, ""]
                };
            }
        }
    }
}

function getRandomWeapons(availableUtilsWeapons, currentCharDetails) {
    if (availableUtilsWeapons.length == 0) return { name: null };

    let totalChance = availableUtilsWeapons.reduce((sum, item) => sum + item.chance, 0);
    let randomNum = Math.random() * totalChance;
    let cumulativeChance = 0;

    for (let item of availableUtilsWeapons) {
        cumulativeChance += item.chance;
        if (randomNum <= cumulativeChance) {
            currentCharDetails.utilities.weapons.push(item.number);

            return {
                characterDetails: currentCharDetails,
                item: item
            };
        }
    }
}

function validateAvailableUtils(currentCharDetails, availableUtils) {

    if (currentCharDetails.utilities.weapons.length != 0) {
        availableUtils.weapons = availableUtils.weapons.filter(item => !currentCharDetails.utilities.weapons.includes(item.number));
    }

    if (currentCharDetails.utilities.skills.length != 0) {
        availableUtils.skills = availableUtils.skills.filter(item => !currentCharDetails.utilities.skills.includes(item.number));
    }

    if (currentCharDetails.utilities.pets.length != 0) {
        availableUtils.pets = availableUtils.pets.filter(item => !currentCharDetails.utilities.pets.includes(item.name) && !currentCharDetails.utilities.pets.includes(item.types));
    }

    return availableUtils;
}

// function calculateLevelUp123(characterDetails, availUtils) {

//     let availUtilsDetails = {
//         pets: CONSTANTS._petsAll,
//         weapons: CONSTANTS._weapons,
//         skills: CONSTANTS._skills
//     };
//     let availableUtils = availUtils ? availUtils : availUtilsDetails;

//     // characterDetails.level.points = 100; ////

//     if (!characterDetails.attributes) { // set to default attributes
//         characterDetails.attributes = CONSTANTS._defaultAttributes;
//     }

//     availableUtils = this.validateAvailableUtils(characterDetails, availableUtils);

//     if (characterDetails.level.points > 0) {

//         let gainedUtils = [];

//         for (let i = 1; i <= characterDetails.level.points; i++) {

//             let utilResults = "";
//             let randomUtils = {};
//             let utils = "";

//             const toRender = [];
//             const isWithLevel = characterDetails.level.current > 1;
//             const skillChance = isWithLevel ? 30 : 45;
//             const weaponChance = isWithLevel ? 35 : 45;
//             const petChance = isWithLevel ? 20 : 10;
//             const avail_stats = { "name": "stats", "chance": 15 };
//             const zero_avail_Skills = availableUtils.skills.length == 0 ? {} : { "name": "skills", "chance": skillChance };
//             const zero_avail_Weapons = availableUtils.weapons.length == 0 ? {} : { "name": "weapons", "chance": weaponChance };
//             const zero_avail_Pets = availableUtils.pets.length == 0 ? {} : { "name": "pets", "chance": petChance };

//             // checker for empty utilities
//             if (characterDetails.level.current > 1) {
//                 toRender.push(avail_stats);
//             }

//             // checker for animal lover skill that can support multiple pets

//             if (availableUtils.skills.length > 0) toRender.push(zero_avail_Skills);
//             if (availableUtils.weapons.length > 0) toRender.push(zero_avail_Weapons);
//             if (availableUtils.pets.length > 0) {
//                 if (characterDetails.utilities.pets.length >= 0) {
//                     toRender.push(zero_avail_Pets);
//                 }
//                 else {
//                     // do nothing -> dont add pets
//                 }
//             }

//             randomUtils = getRandom_UtilsItem(toRender);
//             // randomUtils.name = "pets" // for manual testing overwrite ////
//             let actionToDO = "";

//             switch (randomUtils.name) {
//                 case "skills":
//                     const getRandomItemResult = getRandomItem(availableUtils.skills, characterDetails);
//                     characterDetails = getRandomItemResult.characterDetails;
//                     utils = getRandomItemResult.item;
//                     break;
//                 case "weapons":
//                     const getRandomWeaponsResult = getRandomWeapons(availableUtils.weapons, characterDetails);
//                     characterDetails = getRandomWeaponsResult.characterDetails;
//                     utils = getRandomWeaponsResult.item;
//                     break;
//                 case "pets":
//                     const resultPet = this.getRandomPets(characterDetails, availableUtils.pets);
//                     utils = resultPet[0];
//                     actionToDO = resultPet[1];
//                     break;
//                 case "stats":
//                     const armors = [51, 46, 44, 38, 17, 9];
//                     let witharmor = false;

//                     for (let armor of armors) {
//                         if (characterDetails.utilities.skills.includes(armor)) {
//                             witharmor = true;
//                             break;
//                         }
//                     }

//                     const randomStatsNumber = witharmor ? randomizer(4) : randomizer(3);
//                     let keyName = "";
//                     switch (randomStatsNumber) {
//                         case 0: // life
//                             characterDetails.attributes.life += 8;
//                             const additionalLife = !!characterDetails.utilities.skills.find(skill => skill == 52);
//                             const additionalLifeImmortality = !!characterDetails.utilities.skills.find(skill => skill == 51);
//                             if (additionalLifeImmortality) characterDetails.attributes.life += 20;
//                             if (additionalLife) characterDetails.attributes.life += 5;
//                             keyName = "Life";
//                             break;
//                         case 1: // damage
//                             characterDetails.attributes.damage += 2;
//                             const additionalDamage = !!characterDetails.utilities.skills.find(skill => skill == 55);
//                             const additionalDamage_GOD = !!characterDetails.utilities.skills.find(skill => skill == 10);
//                             if (additionalDamage_GOD) characterDetails.attributes.damage += 2;
//                             if (additionalDamage) characterDetails.attributes.damage++;
//                             keyName = "Damage";
//                             break;
//                         case 2: // agile
//                             characterDetails.attributes.agile += 2;
//                             const additionalAgile = !!characterDetails.utilities.skills.find(skill => skill == 54);
//                             const additionalAgile_GOD = !!characterDetails.utilities.skills.find(skill => skill == 8);
//                             if (additionalAgile_GOD) characterDetails.attributes.agile += 2;
//                             if (additionalAgile) characterDetails.attributes.agile++;
//                             keyName = "Agile";
//                             break;
//                         case 3: // speed
//                             characterDetails.attributes.speed += 2;
//                             const additionalSpeed = !!characterDetails.utilities.skills.find(skill => skill == 53);
//                             const additionalSpeed_GOD = !!characterDetails.utilities.skills.find(skill => skill == 29);
//                             if (additionalSpeed_GOD) characterDetails.attributes.speed += 2;
//                             if (additionalSpeed) characterDetails.attributes.speed++;
//                             keyName = "Speed";
//                             break;
//                         case 4: // armor
//                             const armorPlus = witharmor ? 2 : 1;
//                             characterDetails.attributes.armor += armorPlus;
//                             keyName = "Armor";
//                             break;
//                         default:
//                             console.log("No stats found.");
//                             break;
//                     }
//                     utils = { key: "stats", name: keyName }
//                     break;
//                 default:
//                     console.log(CONSTANTS._errorMessages.noUtilitiesFound);
//             }

//             utilResults = utils ? { key: randomUtils.name, value: utils, action: actionToDO } : { key: "", value: "" };

//             characterDetails.level.current++;

//             this.validateAvailableUtils(characterDetails, availableUtils);

//             let addedStats = this.validateNewUtils(characterDetails, utilResults);
//             const charAttributes = characterDetails.attributes;
//             const charStatsPlus = !!addedStats[2].charStats ? addedStats[2].charStats : "";
//             let newStats = `<br><b>Character</b> -> ${charStatsPlus} Life: ${charAttributes.life}, Damage: ${charAttributes.damage}, Agile: ${charAttributes.agile}, Speed: ${charAttributes.speed}, Armor: ${charAttributes.armor}`;
//             let acquiredMessage = utilResults.value.name ? `Acquired <b>"${utilResults.value.name}"</b> and ` : "";
//             const userPet = characterDetails.utilities.pets;
//             let additionalStatsTxt = "";

//             if (utilResults.value.name && utilResults.value.name == "pets" && userPet.length > 0 && addedStats[1]) {
//                 additionalStatsTxt = `<br>Life: ${userPet[0].life}, Damage: ${userPet[0].damage}, Agile: ${userPet[0].agile}, Speed: ${userPet[0].speed}, Armor: ${userPet[0].armor}`;
//                 acquiredMessage = `<b>Pet</b> -> lvl up to <b>"${userPet[0].level} "</b>`;
//             }

//             gainedUtils.push(acquiredMessage.concat(addedStats[0], additionalStatsTxt, newStats));

//         }
//         const message = gainedUtils.map((util, index) => `<tr><td>${index + 1}</td><td>${util}</td></tr>`).join("");
//         const dateAcquired = new Date().toLocaleDateString('en-US');
//         const message2 = gainedUtils.map((util) => `
//                     <tr>
//                         <td>${characterDetails.level.current}</td>
//                         <td>${util}</td>
//                         <td>${dateAcquired}</td>
//                     </tr>
//                 `).join("");
//         characterDetails.logs.utility.push(message2);
//         this.createModalTable('LevelUp', message);

//         characterDetails.level.points = 0;
//         saveToLocalStorage(CONSTANTS._charUserKey, characterDetails.name); // character user key
//         saveToLocalStorage(CONSTANTS._charDetailsKey, characterDetails); // character data

//         // console.log({ currentCharDetails: characterDetails.utilities.weapons });
//         // console.log({ availableUtils: availableUtils.weapons });
//         // console.log({ currentCharDetails: characterDetails });
//     }

//     // select -> return charData

//     return levelUpDetails;
// }


//#endregion