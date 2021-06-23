interface Square {
  letter: string;
  premium: string;
  moving: boolean;
  playable: boolean;
  error: boolean;
  score: number;
}

export function initialize(): Array<Square> {
  let board = [];

  for (let x = 0; x < 225; x++) {
    board.push({
      letter: '',
      premium: '',
      moving: false,
      playable: false,
      error: false,
      score: 0,
    });
  }

  // Star
  board[112].premium = 'STAR';

  // TL
  board[20].premium = 'TL';
  board[24].premium = 'TL';
  board[76].premium = 'TL';
  board[80].premium = 'TL';
  board[84].premium = 'TL';
  board[88].premium = 'TL';
  board[136].premium = 'TL';
  board[140].premium = 'TL';
  board[144].premium = 'TL';
  board[148].premium = 'TL';
  board[200].premium = 'TL';
  board[204].premium = 'TL';

  // TW
  board[0].premium = 'TW';
  board[7].premium = 'TW';
  board[14].premium = 'TW';
  board[105].premium = 'TW';
  board[119].premium = 'TW';
  board[210].premium = 'TW';
  board[217].premium = 'TW';
  board[224].premium = 'TW';

  //DL
  board[3].premium = 'DL';
  board[11].premium = 'DL';
  board[36].premium = 'DL';
  board[38].premium = 'DL';
  board[45].premium = 'DL';
  board[52].premium = 'DL';
  board[59].premium = 'DL';
  board[92].premium = 'DL';
  board[96].premium = 'DL';
  board[98].premium = 'DL';
  board[102].premium = 'DL';
  board[108].premium = 'DL';
  board[116].premium = 'DL';
  board[122].premium = 'DL';
  board[126].premium = 'DL';
  board[128].premium = 'DL';
  board[132].premium = 'DL';
  board[165].premium = 'DL';
  board[172].premium = 'DL';
  board[179].premium = 'DL';
  board[186].premium = 'DL';
  board[188].premium = 'DL';
  board[213].premium = 'DL';
  board[221].premium = 'DL';

  // DW
  board[16].premium = 'DW';
  board[28].premium = 'DW';
  board[32].premium = 'DW';
  board[42].premium = 'DW';
  board[48].premium = 'DW';
  board[56].premium = 'DW';
  board[64].premium = 'DW';
  board[70].premium = 'DW';
  board[154].premium = 'DW';
  board[160].premium = 'DW';
  board[168].premium = 'DW';
  board[176].premium = 'DW';
  board[182].premium = 'DW';
  board[192].premium = 'DW';
  board[196].premium = 'DW';
  board[208].premium = 'DW';

  return board;
}
