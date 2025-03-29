# Infinite Tactics ❌⭕

Infinite Tactics is a MERN-based **4x4 Tic-Tac-Toe game** that enhances the classic experience with a unique **4x4 grid format**, making strategic play more engaging. It features both **online and offline gameplay modes**, player customization, and a competitive leaderboard.

## Features

### 🎮 Game Modes

- **Offline Mode**: Two players can take turns locally on the same device.
- **Online Mode**: Uses **WebSockets** to match two logged-in players in real-time.

### 🛠️ Gameplay Mechanics

#### 🏠 Offline Mode

- Two players take turns on the same device.
- Players can **change names, reset the game, track wins/draws, and switch signs** during the match.
- **A turn timer** is in place—run out of time, and you lose.

#### 🌍 Online Mode

- Players are **matchmade via WebSockets** for real-time play.
- **Game logic and timer are handled on the backend** to ensure fairness.
- **Automatic winner declaration** if an opponent disconnects.
- **Ensures only one game instance per user** to prevent multiple logins.
- **Leaderboard** to track top players and encourage competition.

## 🏗️ Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express, WebSockets
- **Database**: MongoDB
- **Authentication**: Google OAuth & JWT
- **Real-time communication**: WebSockets (socket.io)

## 🎯 Roadmap

- **AI Opponent**: Implement a computer-controlled AI for single-player mode.
- **Custom Rooms**: Allow players to create and join private game rooms.
- **Sound Effects**: Add background music and in-game sound effects.
- **Random Fun Rules**: Introduce optional random game modifiers for a unique experience.
- **Improved Matchmaking**: Enhance the online matchmaking system for better player pairing.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## 📩 Contact

For any questions or suggestions, feel free to reach out via GitHub issues.

---

### 🌟 Connect with Me

- **GitHub**: [My GitHub Profile](https://github.com/tejash-exe)  
- **LinkedIn**: [My LinkedIn Profile](https://www.linkedin.com/in/aditya-choudhary-31137b291/)  

Made with ❤️ by [Aditya](https://github.com/tejash-exe)

---

Enjoy playing **Infinite Tactics**! 🏆