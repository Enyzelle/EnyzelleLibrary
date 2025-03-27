/**
 * @name EnyzelleLibrary
 * @description A comprehensive utility library for BetterDiscord plugin development
 * @version 1.0.0
 * @author Enyzelle
 * @authorId 
 * @website https://github.com/Enyzelle
 * @source https://github.com/Enyzelle/EnyzelleLibrary
 * @updateUrl https://raw.githubusercontent.com/Enyzelle/EnyzelleLibrary/main/EnyzelleLibrary.plugin.js
 */

// Configuration
const config = {
    info: {
        name: "Enyzelle Library",
        id: "EnyzelleLibrary",
        description: "A comprehensive utility library for BetterDiscord plugin development",
        version: "1.0.0",
        author: "Enyzelle",
        github: "https://github.com/Enyzelle",
        github_raw: "https://raw.githubusercontent.com/Enyzelle/EnyzelleLibrary/main/EnyzelleLibrary.plugin.js"
    },
    changelog: [
        {
            title: "Initial Release",
            items: ["First release with core utilities"]
        }
    ]
};

// Library Class
const Library = {};

// Module System
Library.Modules = {};

// DOM Utilities
Library.DOMTools = {
    /**
     * Creates an element with the given properties
     * @param {string} tagName - HTML Tag to create
     * @param {object} options - Element properties to assign
     * @returns {Element} - The created element
     */
    createElement: function(tagName, options = {}) {
        const element = document.createElement(tagName);
        for (const key in options) {
            if (key === "style") Object.assign(element.style, options[key]);
            else if (key === "className") element.className = options[key];
            else if (key === "innerHTML") element.innerHTML = options[key];
            else if (key === "textContent") element.textContent = options[key];
            else if (key === "events") {
                for (const event in options[key]) {
                    element.addEventListener(event, options[key][event]);
                }
            } else element[key] = options[key];
        }
        return element;
    },

    /**
     * Query selector with optional context
     * @param {string} selector - Query selector
     * @param {Element} [context=document] - Context to search in
     * @returns {Element|null} - Found element or null
     */
    query: function(selector, context = document) {
        return context.querySelector(selector);
    },

    /**
     * Query selector all with optional context
     * @param {string} selector - Query selector
     * @param {Element} [context=document] - Context to search in
     * @returns {NodeList} - Found elements
     */
    queryAll: function(selector, context = document) {
        return context.querySelectorAll(selector);
    }
};

// Logger
Library.Logger = {
    /**
     * Logs a message to console with the library prefix
     * @param {string} message - Message to log
     * @param {string} [type="log"] - Log type (log, info, warn, error)
     */
    log: function(message, type = "log") {
        console[type](`%c[EnyzelleLibrary]%c ${message}`, "color: #3a71c1; font-weight: 700;", "");
    },
    info: function(message) { this.log(message, "info"); },
    warn: function(message) { this.log(message, "warn"); },
    error: function(message) { this.log(message, "error"); }
};

// Settings Panel Builder
Library.Settings = {
    /**
     * Creates a settings panel
     * @param {object} settings - Settings configuration
     * @param {Function} saveCallback - Callback when settings are saved
     * @returns {Element} - Settings panel element
     */
    createPanel: function(settings, saveCallback) {
        const panel = Library.DOMTools.createElement("div", {className: "enyzelle-settings-panel"});
        const settingsItems = [];
        
        // Create settings elements based on type
        for (const key in settings) {
            const setting = settings[key];
            const settingItem = Library.DOMTools.createElement("div", {className: "enyzelle-setting-item"});
            
            // Setting label
            settingItem.appendChild(Library.DOMTools.createElement("label", {textContent: setting.name}));
            
            // Setting input based on type
            let input;
            switch (setting.type) {
                case "switch":
                    input = Library.DOMTools.createElement("input", {
                        type: "checkbox",
                        checked: setting.value,
                        events: {
                            change: (e) => { setting.value = e.target.checked; }
                        }
                    });
                    break;
                case "text":
                    input = Library.DOMTools.createElement("input", {
                        type: "text",
                        value: setting.value,
                        events: {
                            input: (e) => { setting.value = e.target.value; }
                        }
                    });
                    break;
                case "number":
                    input = Library.DOMTools.createElement("input", {
                        type: "number",
                        value: setting.value,
                        min: setting.min,
                        max: setting.max,
                        events: {
                            input: (e) => { setting.value = parseInt(e.target.value); }
                        }
                    });
                    break;
                case "slider":
                    input = Library.DOMTools.createElement("input", {
                        type: "range",
                        value: setting.value,
                        min: setting.min,
                        max: setting.max,
                        step: setting.step || 1,
                        events: {
                            input: (e) => { setting.value = parseFloat(e.target.value); }
                        }
                    });
                    break;
                case "select":
                    input = Library.DOMTools.createElement("select", {
                        events: {
                            change: (e) => { setting.value = e.target.value; }
                        }
                    });
                    for (const option of setting.options) {
                        input.appendChild(Library.DOMTools.createElement("option", {
                            value: option.value,
                            textContent: option.label,
                            selected: option.value === setting.value
                        }));
                    }
                    break;
            }
            
            settingItem.appendChild(input);
            
            // Note
            if (setting.note) {
                settingItem.appendChild(Library.DOMTools.createElement("div", {
                    className: "enyzelle-setting-note", 
                    textContent: setting.note
                }));
            }
            
            panel.appendChild(settingItem);
            settingsItems.push({key, setting, input});
        }
        
        // Save button
        const saveButton = Library.DOMTools.createElement("button", {
            textContent: "Save Settings",
            events: {
                click: () => {
                    const newSettings = {};
                    for (const {key, setting} of settingsItems) {
                        newSettings[key] = setting.value;
                    }
                    saveCallback(newSettings);
                }
            }
        });
        panel.appendChild(saveButton);
        
        return panel;
    }
};

// Discord Utility Functions
Library.DiscordUtils = {
    /**
     * Gets the current user ID
     * @returns {string|null} - User ID or null if not found
     */
    getCurrentUserId: function() {
        try {
            return BdApi.findModuleByProps("getCurrentUser").getCurrentUser().id;
        } catch (err) {
            Library.Logger.error("Failed to get current user ID: " + err);
            return null;
        }
    },
    
    /**
     * Gets the current guild ID
     * @returns {string|null} - Guild ID or null if not found
     */
    getCurrentGuildId: function() {
        try {
            return BdApi.findModuleByProps("getGuildId").getGuildId();
        } catch (err) {
            Library.Logger.error("Failed to get current guild ID: " + err);
            return null;
        }
    },
    
    /**
     * Gets the current channel ID
     * @returns {string|null} - Channel ID or null if not found
     */
    getCurrentChannelId: function() {
        try {
            return BdApi.findModuleByProps("getChannelId").getChannelId();
        } catch (err) {
            Library.Logger.error("Failed to get current channel ID: " + err);
            return null;
        }
    }
};

// HTTP Requests
Library.Request = {
    /**
     * Performs a HTTP GET request
     * @param {string} url - URL to request
     * @param {object} [options={}] - Request options
     * @returns {Promise<any>} - Response data
     */
    get: function(url, options = {}) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            
            // Set headers
            if (options.headers) {
                for (const header in options.headers) {
                    xhr.setRequestHeader(header, options.headers[header]);
                }
            }
            
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const response = options.raw ? xhr.responseText : JSON.parse(xhr.responseText);
                        resolve(response);
                    } catch (err) {
                        resolve(xhr.responseText);
                    }
                } else {
                    reject(new Error(`Request failed with status ${xhr.status}`));
                }
            };
            
            xhr.onerror = () => reject(new Error("Network error"));
            xhr.send();
        });
    },
    
    /**
     * Performs a HTTP POST request
     * @param {string} url - URL to request
     * @param {object} data - Data to send
     * @param {object} [options={}] - Request options
     * @returns {Promise<any>} - Response data
     */
    post: function(url, data, options = {}) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", url, true);
            
            // Set headers
            xhr.setRequestHeader("Content-Type", "application/json");
            if (options.headers) {
                for (const header in options.headers) {
                    xhr.setRequestHeader(header, options.headers[header]);
                }
            }
            
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const response = options.raw ? xhr.responseText : JSON.parse(xhr.responseText);
                        resolve(response);
                    } catch (err) {
                        resolve(xhr.responseText);
                    }
                } else {
                    reject(new Error(`Request failed with status ${xhr.status}`));
                }
            };
            
            xhr.onerror = () => reject(new Error("Network error"));
            xhr.send(JSON.stringify(data));
        });
    }
};

// UI Components
Library.Components = {
    /**
     * Creates a modal
     * @param {string} title - Modal title
     * @param {string|Element} content - Modal content
     * @returns {object} - Object with show and hide methods
     */
    createModal: function(title, content) {
        let modalElement = null;
        
        return {
            show: function() {
                if (modalElement) return;
                
                modalElement = Library.DOMTools.createElement("div", {
                    className: "enyzelle-modal-container",
                    style: {
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        zIndex: 9999,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }
                });
                
                const modal = Library.DOMTools.createElement("div", {
                    className: "enyzelle-modal",
                    style: {
                        backgroundColor: "#36393f",
                        borderRadius: "5px",
                        padding: "20px",
                        maxWidth: "80%",
                        maxHeight: "80%",
                        overflow: "auto"
                    }
                });
                
                const header = Library.DOMTools.createElement("div", {
                    className: "enyzelle-modal-header",
                    style: {
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "15px"
                    }
                });
                
                header.appendChild(Library.DOMTools.createElement("h4", {
                    textContent: title,
                    style: {
                        margin: 0,
                        color: "#fff"
                    }
                }));
                
                const closeButton = Library.DOMTools.createElement("button", {
                    textContent: "×",
                    style: {
                        background: "none",
                        border: "none",
                        fontSize: "24px",
                        cursor: "pointer",
                        color: "#b9bbbe"
                    },
                    events: {
                        click: () => this.hide()
                    }
                });
                
                header.appendChild(closeButton);
                modal.appendChild(header);
                
                const contentContainer = Library.DOMTools.createElement("div", {
                    className: "enyzelle-modal-content"
                });
                
                if (typeof content === "string") {
                    contentContainer.innerHTML = content;
                } else {
                    contentContainer.appendChild(content);
                }
                
                modal.appendChild(contentContainer);
                modalElement.appendChild(modal);
                document.body.appendChild(modalElement);
                
                // Close when clicking outside the modal
                modalElement.addEventListener("click", (e) => {
                    if (e.target === modalElement) this.hide();
                });
            },
            
            hide: function() {
                if (!modalElement) return;
                
                document.body.removeChild(modalElement);
                modalElement = null;
            }
        };
    },
    
    /**
     * Creates a toast notification
     * @param {string} message - Toast message
     * @param {object} [options={}] - Toast options
     * @returns {object} - Object with show method
     */
    createToast: function(message, options = {}) {
        const defaultOptions = {
            type: "info", // info, success, warning, error
            duration: 3000
        };
        
        const mergedOptions = Object.assign({}, defaultOptions, options);
        
        return {
            show: function() {
                const toast = Library.DOMTools.createElement("div", {
                    className: `enyzelle-toast enyzelle-toast-${mergedOptions.type}`,
                    textContent: message,
                    style: {
                        position: "fixed",
                        bottom: "20px",
                        right: "20px",
                        backgroundColor: (() => {
                            switch (mergedOptions.type) {
                                case "success": return "#43b581";
                                case "warning": return "#faa61a";
                                case "error": return "#f04747";
                                default: return "#7289da";
                            }
                        })(),
                        color: "#fff",
                        padding: "10px 20px",
                        borderRadius: "5px",
                        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
                        zIndex: 9999,
                        opacity: 0,
                        transition: "opacity 0.3s ease"
                    }
                });
                
                document.body.appendChild(toast);
                
                // Animate in
                setTimeout(() => {
                    toast.style.opacity = "1";
                }, 10);
                
                // Remove after duration
                setTimeout(() => {
                    toast.style.opacity = "0";
                    setTimeout(() => {
                        if (toast.parentNode) document.body.removeChild(toast);
                    }, 300);
                }, mergedOptions.duration);
            }
        };
    }
};

// Utility Functions
Library.Utilities = {
    /**
     * Debounces a function
     * @param {Function} func - Function to debounce
     * @param {number} wait - Debounce wait time in ms
     * @returns {Function} - Debounced function
     */
    debounce: function(func, wait) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    },
    
    /**
     * Throttles a function
     * @param {Function} func - Function to throttle
     * @param {number} limit - Throttle limit in ms
     * @returns {Function} - Throttled function
     */
    throttle: function(func, limit) {
        let inThrottle;
        return function(...args) {
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    /**
     * Deep clones an object
     * @param {object} obj - Object to clone
     * @returns {object} - Cloned object
     */
    deepClone: function(obj) {
        if (obj === null || typeof obj !== "object") return obj;
        
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        if (obj instanceof Object) {
            const copy = {};
            Object.keys(obj).forEach(key => {
                copy[key] = this.deepClone(obj[key]);
            });
            return copy;
        }
        
        return obj;
    },
    
    /**
     * Generates a random string
     * @param {number} [length=10] - Length of the string
     * @returns {string} - Random string
     */
    randomString: function(length = 10) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
};

// CSS Injector
Library.CSS = {
    /**
     * Injects CSS into the document
     * @param {string} id - Unique identifier for the CSS
     * @param {string} css - CSS string
     * @returns {Element|null} - Style element or null if already exists
     */
    inject: function(id, css) {
        if (document.getElementById(id)) return null;
        
        const style = document.createElement("style");
        style.id = id;
        style.textContent = css;
        document.head.appendChild(style);
        return style;
    },
    
    /**
     * Removes injected CSS
     * @param {string} id - Unique identifier for the CSS
     * @returns {boolean} - Whether the CSS was removed
     */
    remove: function(id) {
        const style = document.getElementById(id);
        if (!style) return false;
        
        document.head.removeChild(style);
        return true;
    }
};

// Export the library
class EnyzelleLibrary {
    getName() { return config.info.name; }
    getAuthor() { return config.info.author; }
    getVersion() { return config.info.version; }
    getDescription() { return config.info.description; }
    
    load() {
        Library.Logger.log("Loading library...");
        
        // Make the library available globally early
        window.EnyzelleLib = Library;
    }
    
    start() {
        Library.Logger.log("Library started");
        
        // Inject default CSS
        Library.CSS.inject("enyzelle-library-css", `
            .enyzelle-modal-container {
                font-family: Whitney, "Helvetica Neue", Helvetica, Arial, sans-serif;
            }
            
            .enyzelle-toast {
                font-family: Whitney, "Helvetica Neue", Helvetica, Arial, sans-serif;
                font-size: 14px;
            }
            
            .enyzelle-settings-panel {
                padding: 15px;
            }
            
            .enyzelle-setting-item {
                margin-bottom: 15px;
            }
            
            .enyzelle-setting-note {
                font-size: 12px;
                color: #b9bbbe;
                margin-top: 5px;
            }
        `);
        
        // Make sure the library is available globally
        if (!window.EnyzelleLib) {
            window.EnyzelleLib = Library;
        }
        
        // Show a toast notification
        Library.Components.createToast("Enyzelle Library has been loaded", {
            type: "success",
            duration: 4000
        }).show();
        
        // Notify any plugins that might be waiting for the library
        document.dispatchEvent(new CustomEvent("EnyzelleLibraryLoaded"));
    }
    
    stop() {
        Library.Logger.log("Library stopped");
        
        // Remove CSS
        Library.CSS.remove("enyzelle-library-css");
        
        // Keep a reference to the library even when disabled, just mark it as inactive
        if (window.EnyzelleLib) {
            window.EnyzelleLib.isActive = false;
        }
    }
    
    getSettingsPanel() {
        // Example settings panel
        const demoSettings = {
            enableFeature1: {
                name: "Enable Feature 1",
                type: "switch",
                value: true,
                note: "Example toggle option"
            },
            textOption: {
                name: "Text Option",
                type: "text",
                value: "Example text",
                note: "Example text option"
            },
            numberOption: {
                name: "Number Option",
                type: "number",
                value: 5,
                min: 0,
                max: 10,
                note: "Example number option"
            },
            selectOption: {
                name: "Select Option",
                type: "select",
                value: "option1",
                options: [
                    { label: "Option 1", value: "option1" },
                    { label: "Option 2", value: "option2" },
                    { label: "Option 3", value: "option3" }
                ],
                note: "Example select option"
            }
        };
        
        return Library.Settings.createPanel(demoSettings, (newSettings) => {
            Library.Logger.log("Settings saved", newSettings);
            Library.Components.createToast("Settings saved", { type: "success" }).show();
        });
    }
}

// Mark the library as active
Library.isActive = true;

// Set up global initialization for other plugins to check
if (!window.EnyzelleLib) {
    window.EnyzelleLib = Library;
}

// Export the class
module.exports = EnyzelleLibrary; 
