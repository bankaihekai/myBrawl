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

function validateNewUtils(utils, characterDetails) {

    const petLength = characterDetails.utilities.pets.length;
    const utilitiesKey = utils.key;
    const armors = [51, 46, 44, 38, 17, 9];
    let statsKey = "";
    let petLevel = false;
    let randStatsPet = null;
    let petAdditional = 0;
    let charStatsKey = null;
    let witharmor = false;

    for (let armor of armors) {
        if (characterDetails.utilities.skills.includes(armor)) {
            witharmor = true;
            break;
        }
    }
    const randomStatsNumber = witharmor ? randomizer(4) : randomizer(3);

    switch (randomStatsNumber) {
        case 0: // life
            characterDetails.attributes.life += 5;
            const additionalLife = !!characterDetails.utilities.skills.find(skill => skill == 52);
            const additionalLifeImmortality = !!characterDetails.utilities.skills.find(skill => skill == 51);
            if (additionalLifeImmortality) characterDetails.attributes.life += 20;
            if (additionalLife) characterDetails.attributes.life += 5;
            if (utils.value.name == null) characterDetails.attributes.life += 5;
            charStatsKey = "Life";
            break;
        case 1: // damage
            characterDetails.attributes.damage++;
            const additionalDamage = !!characterDetails.utilities.skills.find(skill => skill == 55);
            const additionalDamage_GOD = !!characterDetails.utilities.skills.find(skill => skill == 10);
            if (additionalDamage_GOD) characterDetails.attributes.damage += 2;
            if (additionalDamage) characterDetails.attributes.damage++;
            if (utils.value.name == null) characterDetails.attributes.damage++;
            charStatsKey = "Damage";
            break;
        case 2: // agile
            characterDetails.attributes.agile++;
            const additionalAgile = !!characterDetails.utilities.skills.find(skill => skill == 54);
            const additionalAgile_GOD = !!characterDetails.utilities.skills.find(skill => skill == 8);
            if (additionalAgile_GOD) characterDetails.attributes.agile += 2;
            if (additionalAgile) characterDetails.attributes.agile++;
            if (utils.value.name == null) characterDetails.attributes.agile++;
            charStatsKey = "Agile";
            break;
        case 3: // speed
            characterDetails.attributes.speed++;
            const additionalSpeed = !!characterDetails.utilities.skills.find(skill => skill == 53);
            const additionalSpeed_GOD = !!characterDetails.utilities.skills.find(skill => skill == 29);
            if (additionalSpeed_GOD) characterDetails.attributes.speed += 2;
            if (additionalSpeed) characterDetails.attributes.speed++;
            if (utils.value.name == null) characterDetails.attributes.speed++;
            charStatsKey = "Speed";
            break;
        case 4: // armor
            characterDetails.attributes.armor += 1;
            if (utils.value.name == null) characterDetails.attributes.armor += 1;
            charStatsKey = "Armor";
            break;
        default:
            console.log("No stats found.");
            break;
    }

    switch (utilitiesKey) {
        case "skills":
            const validatePlusStats_SkillsResult = validatePlusStats_Skills(utils.value, characterDetails);
            characterDetails = validatePlusStats_SkillsResult;
            break;
        case "weapons":
            // do nothing
            break;
        case "pets":
            const petDetails = structuredClone(characterDetails.utilities.pets[0]);
            if (!!utils.value.name && petLength == 1 && petDetails.level == 1 && utils.action == "") {
                const validatePlusStats_PetsResponse = validatePlusStats_Pets(utils.value, characterDetails);
                characterDetails = validatePlusStats_PetsResponse;
                break;
            }

            if (petLength == 1 && utils.action == "petLvlUp") {
                characterDetails.utilities.pets[0].level++;
                if (characterDetails.utilities.pets[0].level > 1) {

                    let choices = ["Accuracy", "Damage", "Agile", "Armor", "Life"];

                    if (petDetails.accuracy >= petDetails.maxAccuracy) {
                        choices = ["Damage", "Agile", "Armor", "Life"];
                    }

                    const randomStats = randomizer(4);
                    randStatsPet = choices[randomStats];

                    if (randStatsPet == "Accuracy" && petDetails.accuracy < petDetails.maxAccuracy) {

                        const petAdditionalAccuracy = randomizerMinMax(2, 5);
                        const petAccuracyValue = petDetails.accuracy + petAdditionalAccuracy;
                        const isPetMaxAccuracy = petAccuracyValue >= petDetails.maxAccuracy;

                        if (isPetMaxAccuracy) {
                            characterDetails.utilities.pets[0].accuracy = petDetails.maxAccuracy;
                        } else {
                            characterDetails.utilities.pets[0].accuracy += petAdditionalAccuracy;
                            petAdditional += petAdditionalAccuracy;
                        }
                    } else {
                        petAdditional += randomizerMinMax(2, 5);
                        characterDetails.utilities.pets[0][randStatsPet] += petAdditional;
                    }
                }
            }

            break;
        default:
            // do nothing for stats
            break;
    }

    const withPet = petLength == 1 && utils.action == "petLvlUp";

    return {
        characterDetails: characterDetails,
        addedStats: {
            maxUtils: utils.value.name == null ? utilitiesKey : null, // for max utils, multiply stats
            character: {
                stats: charStatsKey,
            },
            pet: {
                level: withPet ? characterDetails.utilities.pets[0].level : null,
                additional: randStatsPet
            }
        }
    };
}

function validatePlusStats_Skills(skill, characterDetails) {
    switch (skill.number) {
        case 52: // surge of life
            const currentLife = characterDetails.attributes.life;
            const addedLife = currentLife + 10;
            const resultLife = Math.ceil((addedLife / 2)) + addedLife;
            characterDetails.attributes.life = resultLife;
            break;
        case 53: // surge of speed
            const currentSpeed = characterDetails.attributes.speed;
            const addedSpeed = currentSpeed + 4;
            const resultSpeed = Math.ceil((addedSpeed / 2)) + addedSpeed;
            characterDetails.attributes.speed = resultSpeed;
            break;
        case 54: // surge of agile
            const currentAgile = characterDetails.attributes.agile;
            const addedAgile = currentAgile + 4;
            const resultAgile = Math.ceil((addedAgile / 2)) + addedAgile;
            characterDetails.attributes.agile = resultAgile;
            break;
        case 55: // surge of strength
            const currentDamage = characterDetails.attributes.damage;
            const addedDamage = currentDamage + 4;
            const resultDamage = Math.ceil((addedDamage / 2)) + addedDamage;
            characterDetails.attributes.damage = resultDamage;
            break;
        case 51: // God Immortality
            const currentImmortality_god = characterDetails.attributes.life;
            const addedImmortality_god = Math.ceil(currentImmortality_god * 2.5);
            characterDetails.attributes.life = addedImmortality_god;
            break;
        case 8: // God Of Agility Scurry
            const currentAgile_god = characterDetails.attributes.agile;
            const addedAgile_god = Math.ceil(currentAgile_god * 2.5);
            characterDetails.attributes.agile = addedAgile_god;
            break;
        case 10: // God Of Strength
            const currentDamage_god = characterDetails.attributes.damage;
            const addedDamage_god = Math.ceil(currentDamage_god * 2.5);
            characterDetails.attributes.damage = addedDamage_god;
            break;
        case 29: // Flash step
            const currentSpeed_god = characterDetails.attributes.speed;
            const addedSpeed_god = Math.ceil(currentSpeed_god * 2.5);
            characterDetails.attributes.speed = addedSpeed_god;
            break;
        case 44: // Champion skin
            const currentSpeed_SKIN = characterDetails.attributes.speed;
            const subtractedSpeed = currentSpeed_SKIN - Math.ceil(currentSpeed_SKIN * 0.1);
            characterDetails.attributes.armor += 10;
            characterDetails.attributes.speed = subtractedSpeed <= 0 ? 1 : subtractedSpeed;

            const randomSkin = randomArrayIndex([1, 2, 3, 4, 5]);
            const charArmor = characterDetails.gender.concat("_armor", randomSkin); // set to 1 because no other skill yet added

            characterDetails.armorName = charArmor;
            break;
        case 46: // surge of armor
            characterDetails.attributes.armor += 9;
            break;
        case 9: // body armor
            characterDetails.attributes.armor += 4;
            break;
        case 9: // leviathan armor
            characterDetails.attributes.armor += 6;
            break;
        case 17: // aura 
            characterDetails.attributes.armor += 1;
            break;
        case 11: // pet master 
            characterDetails.utilities.pets[0].accuracy = Math.min(characterDetails.utilities.pets[0].maxAccuracy, characterDetails.utilities.pets[0].accuracy + 10);
            break;
        case 21: // strong bite
            characterDetails.utilities.pets[0].damage += Math.floor((characterDetails.utilities.pets[0].damage * 0.5) + 5);
            break;
        default:
            break;
    }

    return characterDetails;
}

function validatePlusStats_Pets(pets, characterDetails) {
    const petName = pets.name.toLowerCase();
    const isSurgeOfLife = !!characterDetails.utilities.skills.find(skill => skill.number == 52);
    const isImmortality = !!characterDetails.utilities.skills.find(skill => skill.number == 51);
    const petsDeductions = {
        bear: [25, 35, 50],
        dog: [6, 9, 15],
        cat: [5, 8, 14],
        snake: [3, 5, 9],
        bird: [2, 4, 8],
        rat: [1, 2, 4]
    };
    const deductionValue = isSurgeOfLife && isImmortality ? 2 : isSurgeOfLife ? 1 : 0;
    const currentLife = characterDetails.attributes.life - petsDeductions[petName][deductionValue];
    characterDetails.attributes.life = Math.max(1, currentLife);
    characterDetails.utilities.skills.push(101);

    return characterDetails;
}

function validatePetFrame(pet) {
    let frames = [];

    switch (pet.name) {
        case "Dog":
            if (pet.types === "A") {
                frames = Array.from({ length: 20 }, (_, i) => i); // 0–19
            } else if (pet.types === "B") {
                frames = Array.from({ length: 20 }, (_, i) => i + 20); // 20–39
            }
            break;
        case "Cat":
            if (pet.types === "A") {
                frames = Array.from({ length: 20 }, (_, i) => i + 40); // 40–59
            } else if (pet.types === "B") {
                frames = Array.from({ length: 20 }, (_, i) => i + 60); // 60–79
            }
            break;
        case "Rat":
            if (pet.types === "A") {
                frames = Array.from({ length: 20 }, (_, i) => i + 80); // 80–99
            } else if (pet.types === "B") {
                frames = Array.from({ length: 20 }, (_, i) => i + 100); // 100–119
            }
            break;
        case "Bird":
            if (pet.types === "A") {
                frames = Array.from({ length: 20 }, (_, i) => i + 120); // 120–139
            } else if (pet.types === "B") {
                frames = Array.from({ length: 20 }, (_, i) => i + 140); // 140–159
            }
            break;
        case "Snake":
            if (pet.types === "A") {
                frames = Array.from({ length: 20 }, (_, i) => i + 160); // 160–179
            } else if (pet.types === "B") {
                frames = Array.from({ length: 20 }, (_, i) => i + 180); // 180–199
            }
            break;
        case "Bear":
            if (pet.types === "A") {
                frames = Array.from({ length: 20 }, (_, i) => i + 200); // 200–219
            } else if (pet.types === "B") {
                frames = Array.from({ length: 20 }, (_, i) => i + 220); // 220–239
            } else if (pet.types === "C") {
                frames = Array.from({ length: 20 }, (_, i) => i + 240); // 240–259
            }
            break;
        default:
            console.log("Pet not found!");
    }
    return frames;
}