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
    return (partNum / wholeNum ) * 100;
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
