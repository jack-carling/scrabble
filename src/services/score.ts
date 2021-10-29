import { store } from '../store';

export function calculateScore(letter: string): number {
  const lang = store.state.language;
  if (lang === 'en') {
    // Handle English
    switch (letter) {
      case 'A':
        return 1;
      case 'B':
        return 3;
      case 'C':
        return 3;
      case 'D':
        return 2;
      case 'E':
        return 1;
      case 'F':
        return 4;
      case 'G':
        return 2;
      case 'H':
        return 4;
      case 'I':
        return 1;
      case 'J':
        return 8;
      case 'K':
        return 5;
      case 'L':
        return 1;
      case 'M':
        return 3;
      case 'N':
        return 1;
      case 'O':
        return 1;
      case 'P':
        return 3;
      case 'Q':
        return 10;
      case 'R':
        return 1;
      case 'S':
        return 1;
      case 'T':
        return 1;
      case 'U':
        return 1;
      case 'V':
        return 4;
      case 'W':
        return 4;
      case 'X':
        return 8;
      case 'Y':
        return 4;
      case 'Z':
        return 10;
      default:
        return 0;
    }
  } else {
    // Handle Swedish
    switch (letter) {
      case 'A':
        return 1;
      case 'B':
        return 4;
      case 'C':
        return 8;
      case 'D':
        return 1;
      case 'E':
        return 1;
      case 'F':
        return 4;
      case 'G':
        return 2;
      case 'H':
        return 3;
      case 'I':
        return 1;
      case 'J':
        return 8;
      case 'K':
        return 3;
      case 'L':
        return 1;
      case 'M':
        return 3;
      case 'N':
        return 1;
      case 'O':
        return 2;
      case 'P':
        return 3;
      case 'Q':
        return 10;
      case 'R':
        return 1;
      case 'S':
        return 1;
      case 'T':
        return 1;
      case 'U':
        return 3;
      case 'V':
        return 4;
      case 'X':
        return 10;
      case 'Y':
        return 8;
      case 'Z':
        return 10;
      case 'Å':
        return 4;
      case 'Ä':
        return 4;
      case 'Ö':
        return 4;
      default:
        return 0;
    }
  }
}
