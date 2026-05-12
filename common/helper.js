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
