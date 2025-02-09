/**
 * @name ListenAlong
 * @author Enyzelle
 * @description Enable Spotify listen along without premium
 * @version 1.1.0
 * @website https://github.com/Enyzelle/ListenAlong
 * @source https://raw.githubusercontent.com/Enyzelle/ListenAlong/main/ListenAlong.plugin.js
 */



const config = {
    info: {
        name: "ListenAlongWithoutPremium",
        authors: [{
            name: "Claude",
            discord_id: "000000000000000000",
        }],
        version: "1.1.0",
        description: "Enable Spotify listen along without premium",
        github: "https://github.com/YourUsername/ListenAlongWithoutPremium",
        github_raw: "https://raw.githubusercontent.com/YourUsername/ListenAlongWithoutPremium/main/ListenAlongWithoutPremium.plugin.js"
    },
    changelog: [
        {
            title: "Improvements",
            items: [
                "Added better error handling",
                "Improved module structure",
                "Added status messages"
            ]
        }
    ]
};

module.exports = class ListenAlongWithoutPremium {
    constructor() {
        this.initialized = false;
    }

    // Required function. Called when the plugin is enabled
    start() {
        try {
            this.initialize();
            BdApi.showToast("ListenAlongWithoutPremium has started!", {type: "success"});
        } catch (err) {
            BdApi.showToast("Failed to start ListenAlongWithoutPremium", {type: "error"});
            console.error("ListenAlongWithoutPremium: Failed to start -", err);
        }
    }

    // Required function. Called when the plugin is disabled
    stop() {
        try {
            BdApi.Patcher.unpatchAll("ListenAlongWithoutPremium");
            this.initialized = false;
            BdApi.showToast("ListenAlongWithoutPremium has stopped!", {type: "success"});
        } catch (err) {
            console.error("ListenAlongWithoutPremium: Failed to stop -", err);
        }
    }

    // Initialize the plugin
    initialize() {
        if (this.initialized) return;
        this.patchSpotifyModule();
        this.patchListenAlongButton();
        this.initialized = true;
    }

    // Patch Spotify premium check
    patchSpotifyModule() {
        const SpotifyProtocol = BdApi.Webpack.getModule(m => m?.getActivity && m?.isSpotifyProtocol);
        
        if (!SpotifyProtocol) {
            throw new Error("Could not find Spotify module!");
        }

        BdApi.Patcher.instead("ListenAlongWithoutPremium", SpotifyProtocol, "isPremium", () => {
            return true;
        });
    }

    // Patch Listen Along button visibility
    patchListenAlongButton() {
        const ListenAlongStore = BdApi.Webpack.getModule(m => m?.isListeningAlong);
        
        if (!ListenAlongStore) {
            throw new Error("Could not find ListenAlong module!");
        }

        BdApi.Patcher.instead("ListenAlongWithoutPremium", ListenAlongStore, "canListenAlong", () => {
            return true;
        });
    }

    // Required function. Called to get info about the plugin
    getSettingsPanel() {
        return null; // This plugin has no settings
    }
};

module.exports.config = config; 
