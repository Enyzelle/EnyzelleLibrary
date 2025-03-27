# Enyzelle Library

A comprehensive utility library for BetterDiscord plugin development.

## Features

- **DOM Utilities**: Create and manipulate DOM elements easily
- **Logger**: Consistent logging with prefix and styling
- **Settings Panel Builder**: Create settings panels with various input types
- **Discord Utility Functions**: Access Discord data easily
- **HTTP Requests**: Simple Promise-based API for HTTP requests
- **UI Components**: Ready-to-use modals and toast notifications
- **Utility Functions**: Common utilities like debounce, throttle, and more
- **CSS Injector**: Safely inject and remove CSS

## Installation

1. Download the [latest release](https://github.com/Enyzelle/EnyzelleLibrary/releases/latest)
2. Place the file in your BetterDiscord plugins folder
3. Enable the plugin in BetterDiscord settings

## Usage

Once enabled, the library is available globally as `window.EnyzelleLib`. You can use it in your plugins like this:

```js
// Create a toast notification
EnyzelleLib.Components.createToast("Hello World!", {
  type: "success", // info, success, warning, error
  duration: 3000
}).show();

// Create a modal
const modal = EnyzelleLib.Components.createModal(
  "My Modal Title", 
  "This is the modal content"
);
modal.show();

// Make an HTTP request
EnyzelleLib.Request.get("https://api.example.com/data")
  .then(data => console.log(data))
  .catch(err => console.error(err));

// Use utility functions
const debouncedFunction = EnyzelleLib.Utilities.debounce(() => {
  console.log("This function is debounced");
}, 300);
```

## API Documentation

### DOM Utilities

- `createElement(tagName, options)`: Create a DOM element with the given properties
- `query(selector, context)`: Query selector with optional context
- `queryAll(selector, context)`: Query selector all with optional context

### Logger

- `log(message, type)`: Log a message with the library prefix
- `info(message)`: Log an info message
- `warn(message)`: Log a warning message
- `error(message)`: Log an error message

### Settings Panel Builder

- `createPanel(settings, saveCallback)`: Create a settings panel with various input types

### Discord Utility Functions

- `getCurrentUserId()`: Get the current user ID
- `getCurrentGuildId()`: Get the current guild ID
- `getCurrentChannelId()`: Get the current channel ID

### HTTP Requests

- `get(url, options)`: Perform a GET request
- `post(url, data, options)`: Perform a POST request

### UI Components

- `createModal(title, content)`: Create a modal dialog
- `createToast(message, options)`: Create a toast notification

### Utility Functions

- `debounce(func, wait)`: Debounce a function
- `throttle(func, limit)`: Throttle a function
- `deepClone(obj)`: Deep clone an object
- `randomString(length)`: Generate a random string

### CSS Injector

- `inject(id, css)`: Inject CSS into the document
- `remove(id)`: Remove injected CSS

## License

MIT License

## Author

- [Enyzelle](https://github.com/Enyzelle) 
