# Deployment Guide for Render.com

## 🚀 Quick Deployment Steps

### 1. **Prepare Your Repository**
- Ensure all files are committed to your Git repository
- Make sure `package.json` has the correct start script

### 2. **Deploy to Render.com**
1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `chat-with-me` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid for better performance)

### 3. **Environment Variables**
Set these in Render dashboard:
- `NODE_ENV`: `production`
- `PORT`: `10000` (Render will override this)

## 🔧 **Important Configuration Notes**

### **HTTPS Requirement**
- ✅ Render.com automatically provides HTTPS
- ✅ WebRTC requires HTTPS in production
- ✅ Your app will work on `https://your-app.onrender.com`

### **STUN Servers**
The app now includes multiple STUN servers for better connectivity:
- Google STUN servers (primary)
- Multiple backup STUN servers
- Increased ICE candidate pool size

### **CORS Configuration**
- Added CORS support for cross-origin requests
- Configured for production deployment

## 🐛 **Troubleshooting**

### **Connection Issues**
1. **Check HTTPS**: Ensure you're accessing via `https://`
2. **Browser Console**: Check for WebRTC errors
3. **Network**: Some corporate networks block WebRTC

### **Common Issues**
- **"WebRTC not supported"**: Use a modern browser (Chrome, Firefox, Safari)
- **"Camera permission denied"**: Allow camera/microphone access
- **"Connection failed"**: Check network connectivity and firewall settings

### **Debug Steps**
1. Open browser DevTools (F12)
2. Check Console tab for error messages
3. Look for the status indicator in top-right corner
4. Verify both users are on HTTPS

## 📱 **Testing**

### **Local Testing**
```bash
npm start
# Open http://localhost:3000 in two browser tabs
```

### **Production Testing**
1. Deploy to Render.com
2. Open `https://your-app.onrender.com` in two different devices/browsers
3. Test video calling between devices

## 🔒 **Security Notes**

- WebRTC connections are peer-to-peer (no server relay)
- Media streams are encrypted end-to-end
- No video/audio data is stored on the server
- Only signaling data passes through the server

## 📊 **Performance**

### **Free Tier Limitations**
- Render free tier has sleep mode (app sleeps after 15 minutes of inactivity)
- First request after sleep may be slow
- Consider paid tier for production use

### **Optimization Tips**
- Use modern browsers for best performance
- Ensure stable internet connection
- Close other bandwidth-intensive applications

## 🆘 **Support**

If you encounter issues:
1. Check the browser console for errors
2. Verify HTTPS is working
3. Test with different browsers
4. Check network connectivity
5. Ensure camera/microphone permissions are granted

---

**Happy Video Calling! 🎥✨**
