export function calculateScore(letter: string): number {
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
}

/*
2 blank tiles (scoring 0 points)
1 point: E ×12, A ×9, I ×9, O ×8, N ×6, R ×6, T ×6, L ×4, S ×4, U ×4
2 points: D ×4, G ×3
3 points: B ×2, C ×2, M ×2, P ×2
4 points: F ×2, H ×2, V ×2, W ×2, Y ×2
5 points: K ×1
8 points: J ×1, X ×1
10 points: Q ×1, Z ×1
*/
