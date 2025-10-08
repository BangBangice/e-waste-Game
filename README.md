# E-Waste Recycling Game

A Next.js web application that teaches users about e-waste recycling in Melbourne through interactive games, virtual pet care, and educational content.

## Features

### 🔍 QR Code Scanner
- Camera-based QR code scanning
- File upload for QR code images
- Educational information about e-waste disposal
- Melbourne-specific recycling guidelines

### 🐕 Virtual Pet
- Interactive digital pet with drag-and-drop functionality
- Pet stats: Life, Happiness, Energy, and Level
- Care actions: Feed, Play, and Rest
- Persistent pet data using localStorage
- Smooth animations with Framer Motion

### 🎮 Recycling Games
- **E-Waste Sorting Game**: Sort electronic items into correct recycling categories
- **Recycling Quiz**: Test knowledge about e-waste recycling in Melbourne
- Multiple rounds with scoring system
- Educational explanations for each answer
- Progress tracking and completion rewards

### 📚 Learning Center
- Comprehensive e-waste recycling information for Melbourne
- Categorized content: Overview, Locations, Items, Preparation, Impact, Future
- Interactive tips and quick guides
- Modal-based detailed content viewing
- Melbourne-specific collection points and schedules

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **QR Scanning**: @zxing/library
- **Drag & Drop**: react-dnd
- **Data Storage**: localStorage (client-side)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles and animations
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main page with tab navigation
└── components/
    ├── ScanTab.tsx          # QR code scanning functionality
    ├── PetTab.tsx           # Virtual pet with animations
    ├── GamesTab.tsx         # Recycling games
    └── LearningTab.tsx      # Educational content
```

## Features in Detail

### Virtual Pet System
- **Stats Management**: Life, happiness, energy, and level tracking
- **Interactive Care**: Feed, play, and rest actions affect pet stats
- **Drag & Drop**: Moveable pet character with smooth animations
- **Persistent Data**: Pet state saved in browser localStorage
- **Visual Feedback**: Animated responses and temporary messages

### Game Mechanics
- **Multi-Round System**: 3 rounds per game with multiple questions
- **Scoring System**: Points awarded for correct answers
- **Educational Content**: Detailed explanations for each question
- **Progress Tracking**: Visual progress bars and completion rewards
- **Melbourne Focus**: Location-specific recycling information

### Learning Center
- **Categorized Content**: Organized by topic (Overview, Locations, etc.)
- **Interactive Tips**: Expandable quick tips for each topic
- **Modal System**: Detailed content viewing with smooth animations
- **Melbourne Specific**: Local recycling information and collection points

## Customization

The app is designed to be easily customizable:

- **Content**: Update learning materials in `LearningTab.tsx`
- **Questions**: Modify game questions in `GamesTab.tsx`
- **Pet Behavior**: Adjust pet stats and animations in `PetTab.tsx`
- **Styling**: Customize colors and layout with Tailwind CSS

## Browser Support

- Modern browsers with ES6+ support
- Camera access for QR scanning (HTTPS required for production)
- localStorage support for pet data persistence
- Drag and drop API support for pet interaction

## Future Enhancements

- Backend integration for user accounts and progress tracking
- Real QR code scanning with camera API
- Additional game types and difficulty levels
- Social features and leaderboards
- Mobile app version with React Native