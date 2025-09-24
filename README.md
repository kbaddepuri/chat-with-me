# Ephemeral Chat 💬

A real-time chat application built with Node.js, Express, and Socket.IO featuring WhatsApp-style messaging with ephemeral messages, typing indicators, and read receipts.

## Features

- **Real-time messaging** - Instant message delivery using WebSockets
- **Ephemeral chat** - Messages don't persist between sessions
- **User aliases** - Set custom display names
- **Typing indicators** - See when others are typing
- **Read receipts** - Check marks show message delivery and read status
- **WhatsApp-style UI** - Clean, modern interface with message bubbles
- **Responsive design** - Works on desktop and mobile devices

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the server**
   ```bash
   npm start
   ```

3. **Open in browser**
   ```
   http://localhost:3000
   ```

## Usage

- Set your alias using the input field in the header
- Type messages in the bottom input field
- Messages appear instantly for all connected users
- Single checkmark (✔) = message delivered
- Double checkmark (✔✔) = message read
- Typing indicators show when someone is typing

## Tech Stack

- **Backend**: Node.js, Express.js, Socket.IO
- **Frontend**: Vanilla JavaScript, CSS3
- **Real-time**: WebSocket connections via Socket.IO

## Project Structure

```
chat-with-me/
├── server.js          # Express server with Socket.IO
├── index.html         # Chat interface
├── package.json       # Dependencies and scripts
└── DEPLOYMENT.md      # Deployment instructions
```

## Environment Variables

- `PORT` - Server port (default: 3000)
- `HOST` - Server host (default: 0.0.0.0)

## Development

The application uses ES modules. To modify:

1. **Server logic**: Edit `server.js`
2. **Client interface**: Edit `index.html`
3. **Styling**: CSS is embedded in `index.html`

## Deployment

See `DEPLOYMENT.md` for deployment instructions to various platforms.