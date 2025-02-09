# EnyzelleLibrary

## Description

EnyzelleLibrary is a comprehensive utility library for BetterDiscord plugins, offering core utilities, Discord API helpers, DOM manipulation tools, storage utilities, and more.

## Installation

1. Ensure you have BetterDiscord installed. If not, you can download it from [BetterDiscord](https://betterdiscord.app/).
2. Download EnyzelleLibrary:
   - [EnyzelleLibrary.plugin.js](https://raw.githubusercontent.com/Enyzelle/EnyzelleLibrary/main/EnyzelleLibrary.plugin.js)
3. Place the downloaded file into your BetterDiscord plugins folder:
   - Windows: `%appdata%/BetterDiscord/plugins`
   - Linux: `~/.config/BetterDiscord/plugins`
   - Mac: `~/Library/Application Support/BetterDiscord/plugins`

## Usage

To use EnyzelleLibrary in your plugins, follow these steps:

```javascript
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
        // Initialization logic here
    }
};
```
## Features
- **Core Utilities:** Includes versioning, initialization check, configuration handling, and more.
- **Discord API Utilities:** Simplifies interaction with Discord's API for current user, channels, and guilds.
- **DOM Manipulation:** Provides functions for easy HTML DOM manipulation.
- **Storage Utilities:** Offers methods to store and retrieve plugin data using BetterDiscord's storage API.

## Changelog
### Version 1.0.0

- **Initial Release**
  - First release of EnyzelleLibrary
  - Added core utilities, Discord API utilities, DOM manipulation utilities, storage utilities
 
## Support

For issues or suggestions, please open an issue on [GitHub](https://github.com/Enyzelle/EnyzelleLibrary/issues).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

- **Enyzelle**
  - GitHub: [@Enyzelle](https://github.com/Enyzelle)
  - Discord: Enyzelle#0000

## Disclaimer
> This plugin is not affiliated with Discord. Use at your own risk.
