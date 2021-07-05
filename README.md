# Scrabble

## About

Interpretation of the classic word game scrabble. Using the HTML Drag and Drop API, a dictionary API and Server Sent Events (SSE) to play multiplayer.

- [x] Game board + rack
- [x] Drag and Drop
- [x] Check words against dictionary
- [x] Check invalid placements of letters
- [x] Calculate score of word
- [x] Calculate premium scores
- [x] Handle and display scores
- [x] Randomly distribute tiles to racks
- [x] SSE - turn based
- [x] SSE - allow more than 2 users
- [x] User can create their own rooms
- [x] Handle user disconnected
- [ ] User can skip a turn
- [ ] User can swap out letters
- [ ] Handle end of game
- [ ] Handle only one player left after user(s) disconnected

## Installation

```bash
npm install
```

Open two terminals to run both frontend and backend.

Frontend:

```bash
npm run dev
```

Backend:

```bash
npm run server
```
