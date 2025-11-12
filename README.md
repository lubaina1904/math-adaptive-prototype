# Math Adventures - Adaptive Learning Prototype

An AI-powered adaptive math learning system that dynamically adjusts difficulty based on student performance in real-time.

## Project Overview

This prototype demonstrates how adaptive learning systems can personalize educational experiences for children aged 5-10 practicing basic math operations.

## Features

- **3 Difficulty Levels:** Easy, Medium, and Hard
- **Real-time Adaptation:** Automatically adjusts difficulty
- **Performance Tracking:** Monitors accuracy, response time, and streaks
- **Visual Feedback:** Immediate feedback on answers
- **Progress Analytics:** Detailed session summaries

## Adaptive Logic

Rule-based engine considering:
1. **Recent Accuracy** - Last 3 problems
2. **Response Time** - Speed indicates confidence

### Rules:
- 3 correct + fast (< 8s) → Harder
- 2+ correct + moderate (< 15s) → Stay
- ≤ 1 correct → Easier

## Setup
```bash
npm install
npm run dev
```

Visit `http://localhost:5173`

## 🛠️ Tech Stack

React 18 • Vite • Tailwind CSS • Lucide React

