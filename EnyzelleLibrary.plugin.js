/**
 * @name EnyzelleLibrary
 * @version 1.0.0
 * @description A comprehensive utility library for BetterDiscord plugins
 * @author Enyzelle
 * @source https://github.com/Enyzelle/EnyzelleLibrary
 * @updateUrl https://raw.githubusercontent.com/Enyzelle/EnyzelleLibrary/main/EnyzelleLibrary.plugin.js
 */

const config = {
    info: {
        name: "EnyzelleLibrary",
        version: "1.0.0",
        description: "A comprehensive utility library for BetterDiscord plugins",
        author: "Enyzelle",
        github: "https://github.com/Enyzelle/EnyzelleLibrary",
        github_raw: "https://raw.githubusercontent.com/Enyzelle/EnyzelleLibrary/main/EnyzelleLibrary.plugin.js"
    },
    changelog: [
        {
            title: "Initial Release",
            items: [
                "First release",
                "Added core utilities",
                "Added Discord API utilities",
                "Added DOM manipulation utilities",
                "Added storage utilities"
            ]
        }
    ]
};

module.exports = class EnyzelleLibrary {
    constructor() {
        this.initialized = false;
        this._config = config;
    }

    getName() { return config.info.name; }
    getDescription() { return config.info.description; }
    getVersion() { return config.info.version; }
    getAuthor() { return config.info.author; }

    start() {
        if (this.initialized) return;
        this.initialize();
        BdApi.showToast("EnyzelleLibrary has been loaded!", { type: "success" });
    }

    stop() {
        this.initialized = false;
        delete window.EnyLib;
    }

    initialize() {
        this.initialized = true;
        
        // Add library to global scope with shorter alias
        window.EnyLib = {
            // Core Utilities
            core: {
                version: config.info.version,
                isInitialized: () => this.initialized,
                reload: () => {
                    this.stop();
                    this.start();
                },
                getConfig: () => this._config,
                getChangelog: () => config.changelog
            },

            // Discord API Utilities
            discord: {
                getCurrentUser: () => {
                    return BdApi.findModuleByProps("getCurrentUser").getCurrentUser();
                },
                getChannel: () => {
                    return BdApi.findModuleByProps("getChannel", "getDMFromUserId").getChannel(
                        BdApi.findModuleByProps("getChannelId").getChannelId()
                    );
                },
                getGuild: () => {
                    const getGuild = BdApi.findModuleByProps("getGuild").getGuild;
                    const guildId = BdApi.findModuleByProps("getGuildId").getGuildId();
                    return getGuild(guildId);
                }
            },

            // DOM Manipulation
            dom: {
                getElement: (selector) => document.querySelector(selector),
                getAllElements: (selector) => document.querySelectorAll(selector),
                createElement: (tag, options = {}) => {
                    const element = document.createElement(tag);
                    Object.assign(element, options);
                    return element;
                }
            },

            // Styling Utilities
            styles: {
                inject: (id, css) => {
                    BdApi.injectCSS(id, css);
                },
                remove: (id) => {
                    BdApi.clearCSS(id);
                }
            },

            // Data Storage
            storage: {
                get: (pluginName, key, defaultValue = null) => {
                    const data = BdApi.getData(pluginName, key);
                    return data !== undefined ? data : defaultValue;
                },
                set: (pluginName, key, value) => {
                    BdApi.setData(pluginName, key, value);
                },
                delete: (pluginName, key) => {
                    BdApi.deleteData(pluginName, key);
                }
            },

            // UI Components
            ui: {
                showToast: (content, options = {}) => {
                    BdApi.showToast(content, {
                        type: options.type || "info",
                        timeout: options.timeout || 3000
                    });
                },
                showNotice: (content, options = {}) => {
                    BdApi.showNotice(content, {
                        type: options.type || "info",
                        buttons: options.buttons || []
                    });
                }
            },

            // Plugin Management
            plugins: {
                get: (pluginName) => {
                    return BdApi.Plugins.get(pluginName);
                },
                isEnabled: (pluginName) => {
                    return BdApi.Plugins.isEnabled(pluginName);
                }
            },

            // Event Handling
            events: {
                on: (element, event, callback) => {
                    element.addEventListener(event, callback);
                    return () => element.removeEventListener(event, callback);
                },
                off: (element, event, callback) => {
                    element.removeEventListener(event, callback);
                }
            },

            // Discord Module Finder
            modules: {
                find: (filter) => {
                    return BdApi.findModule(filter);
                },
                findByProps: (...props) => {
                    return BdApi.findModuleByProps(...props);
                },
                findAll: (filter) => {
                    return BdApi.findAllModules(filter);
                }
            }
        };
    }
} 