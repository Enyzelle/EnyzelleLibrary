/**
 * @name ListenAlong
 * @author Enyzelle
 * @description Enable Spotify listen along without premium
 * @version 1.1.1
 * @website https://github.com/Enyzelle/ListenAlong
 * @source https://raw.githubusercontent.com/Enyzelle/ListenAlong/main/ListenAlong.plugin.js
 */

const config = {
    info: {
        name: "ListenAlong",
        authors: [{
            name: "Enyzelle",
            discord_id: "1317482100290752604",
        }],
        version: "1.1.1",
        description: "Enable Spotify listen along without premium"
    }
};

module.exports = class ListenAlong {
    constructor() {
        this.initialized = false;
    }

    start() {
        try {
            this.initialize();
            BdApi.showToast("ListenAlong has started!", {type: "success"});
        } catch (err) {
            BdApi.showToast("Failed to start ListenAlong", {type: "error"});
            console.error("ListenAlong: Failed to start -", err);
        }
    }

    stop() {
        try {
            BdApi.Patcher.unpatchAll("ListenAlong");
            this.initialized = false;
            BdApi.showToast("ListenAlong has stopped!", {type: "success"});
        } catch (err) {
            console.error("ListenAlong: Failed to stop -", err);
        }
    }

    initialize() {
        if (this.initialized) return;
        
        // Get the Spotify device store module
        const DeviceStore = BdApi.Webpack.getModule(m => m?.getActiveSocketAndDevice);
        
        // Get the listening along store module
        const ListenStore = BdApi.Webpack.getModule(m => m?.isListeningAlong || m?.getListeningAlongStatus);
        
        if (DeviceStore?.getActiveSocketAndDevice) {
            // Patch the device store to always return premium status
            BdApi.Patcher.after("ListenAlong", DeviceStore, "getActiveSocketAndDevice", 
                (_, args, ret) => {
                    if (ret?.socket) {
                        ret.socket.isPremium = true;
                    }
                    return ret;
                }
            );
            console.log("Successfully patched Spotify device store");
        } else {
            throw new Error("Could not find Spotify device store module");
        }

        // Patch the listening along status
        if (ListenStore) {
            // Patch isListeningAlong check
            if (typeof ListenStore.isListeningAlong === 'function') {
                BdApi.Patcher.after("ListenAlong", ListenStore, "isListeningAlong",
                    (_, args, ret) => {
                        return true; // Always show as listening along
                    }
                );
            }

            // Patch getListeningAlongStatus
            if (typeof ListenStore.getListeningAlongStatus === 'function') {
                BdApi.Patcher.after("ListenAlong", ListenStore, "getListeningAlongStatus",
                    (_, args, ret) => {
                        return { isListeningAlong: true }; // Force listening along status
                    }
                );
            }

            console.log("Successfully patched listening along status");
        }

        this.initialized = true;
    }
};

module.exports.config = config; 
