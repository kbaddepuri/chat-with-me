# Chat With Me 🚀

A real-time chat application with video calling capabilities built with Node.js, Express, Socket.IO, and WebRTC.

## Features

### 💬 Real-time Chat
- Instant messaging between users
- Clean, modern chat interface
- Message history in current session
- Responsive design for all devices

### 🎥 Video Calling
- Peer-to-peer video calls using WebRTC
- High-quality video streaming
- Audio/video controls (mute, zoom)
- Full-screen video viewing
- Real-time connection status indicators

### 🎨 Modern UI/UX
- Beautiful gradient backgrounds
- Smooth animations and transitions
- Responsive design
- Intuitive controls
- Professional styling

## Tech Stack

- **Backend**: Node.js, Express
- **Real-time Communication**: Socket.IO
- **Video Calling**: WebRTC
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Styling**: Modern CSS with gradients and animations

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Modern web browser with WebRTC support

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd chat-with-me
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## Usage

### Chat Features
1. Open the application in multiple browser tabs/windows to simulate multiple users
2. Type messages in the chat input field
3. Messages appear instantly for all connected users
4. Each user's messages are color-coded (blue for your messages, gray for others)

### Video Calling
1. Click "Start Video Call" to begin
2. Allow camera and microphone permissions when prompted
3. Share the room URL with another user
4. Both users will see each other's video streams
5. Use the control buttons to:
   - Mute/unmute audio
   - Zoom in on video streams
   - View full-screen video

## Project Structure

```
chat-with-me/
├── index.html          # Main application file with UI and client-side logic
├── server.js           # Express server with Socket.IO setup
├── package.json        # Project dependencies and scripts
└── README.md          # This file
```

## Key Components

### Server (server.js)
- Express server serving static files
- Socket.IO for real-time communication
- WebRTC signaling for video calls
- Handles chat messages, offers, answers, and ICE candidates

### Client (index.html)
- Chat interface with message display
- Video calling interface with WebRTC
- Real-time updates via Socket.IO
- Responsive design with modern styling

## WebRTC Features

- **Peer-to-peer connection**: Direct video/audio streaming between users
- **Signaling server**: Uses Socket.IO for WebRTC signaling
- **Media controls**: Mute, zoom, and full-screen functionality
- **Connection management**: Automatic handling of offers, answers, and ICE candidates

## Browser Compatibility

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

**Note**: WebRTC requires HTTPS in production environments.

## Development

To run in development mode:

```bash
npm start
```

The server will start on port 3000 by default. You can change this by setting the `PORT` environment variable.

## Deployment

For production deployment:

1. Set up HTTPS (required for WebRTC)
2. Update the server configuration as needed
3. Deploy to your preferred hosting platform (Heroku, Vercel, etc.)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Future Enhancements

- [ ] User authentication
- [ ] Chat rooms/channels
- [ ] File sharing
- [ ] Screen sharing
- [ ] Mobile app
- [ ] Message persistence
- [ ] User presence indicators
- [ ] Emoji reactions

## Support

If you encounter any issues or have questions, please open an issue on the GitHub repository.

---

**Enjoy chatting and video calling! 🎉**
