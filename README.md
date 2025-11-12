# Math Adventures - Adaptive Learning Prototype

An AI-powered adaptive math learning system that adjusts difficulty based on student performance.

## Features
- 3 difficulty levels (Easy, Medium, Hard)
- Real-time adaptive difficulty adjustment
- Performance tracking and analytics
- Visual progress summaries

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open http://localhost:5173 in your browser

## Adaptive Logic

The system uses rule-based adaptation that considers:
- Recent accuracy (last 3 problems)
- Response time (speed indicates confidence)

**Adaptation Rules:**
- 3 correct + fast (< 8s) → increase difficulty
- 2+ correct + moderate speed → maintain level
- ≤ 1 correct → decrease difficulty

## Tech Stack
- React 18
- Vite
- Tailwind CSS
- Lucide React Icons
```

**7. `.gitignore`**
```
node_modules/
dist/
.env
.DS_Store
*.log