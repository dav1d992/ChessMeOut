export interface ChessOpening {
  name: string;
  category: string;
  moves: string[]; // SAN notation
  description: string;
}

export const OPENINGS: ChessOpening[] = [
  // Italian Game family
  {
    name: 'Italian Game',
    category: 'Open Games',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4'],
    description:
      'A classical opening aiming for rapid development and central control.',
  },
  {
    name: 'Giuoco Piano',
    category: 'Open Games',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5'],
    description:
      'The "quiet game" — both sides develop bishops to active squares.',
  },
  {
    name: 'Evans Gambit',
    category: 'Open Games',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'b4'],
    description:
      'An aggressive gambit sacrificing a pawn for rapid development and attack.',
  },
  {
    name: 'Fried Liver Attack',
    category: 'Open Games',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6', 'd4', 'exd4', 'O-O', 'Nxe4', 'Re1', 'd5', 'Bxd5', 'Qxd5', 'Nc3'],
    description:
      'A sharp sacrificial attack targeting f7 after the Two Knights Defense.',
  },

  // Ruy Lopez family
  {
    name: 'Ruy Lopez',
    category: 'Open Games',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5'],
    description:
      'One of the oldest and most classic openings, pressuring the knight defending e5.',
  },
  {
    name: 'Ruy Lopez — Berlin Defense',
    category: 'Open Games',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'Nf6'],
    description:
      'A solid defense nicknamed "the Berlin Wall" for its drawish reputation at top level.',
  },
  {
    name: 'Ruy Lopez — Marshall Attack',
    category: 'Open Games',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Ba4', 'Nf6', 'O-O', 'Be7', 'Re1', 'b5', 'Bb3', 'O-O', 'c3', 'd5'],
    description:
      'A famous gambit where Black sacrifices a pawn for a fierce kingside attack.',
  },

  // Sicilian family
  {
    name: 'Sicilian Defense',
    category: 'Semi-Open Games',
    moves: ['e4', 'c5'],
    description:
      'The most popular response to 1.e4, creating an asymmetric fight.',
  },
  {
    name: 'Sicilian — Najdorf Variation',
    category: 'Semi-Open Games',
    moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'a6'],
    description:
      'Bobby Fischer\'s favorite — flexible and combative.',
  },
  {
    name: 'Sicilian — Dragon Variation',
    category: 'Semi-Open Games',
    moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'g6'],
    description:
      'Black fianchettoes the bishop for a dragon-like pawn structure. Very sharp.',
  },

  // French & Caro-Kann
  {
    name: 'French Defense',
    category: 'Semi-Open Games',
    moves: ['e4', 'e6'],
    description:
      'A solid but slightly passive setup. Black aims to challenge the center with d5.',
  },
  {
    name: 'French — Winawer Variation',
    category: 'Semi-Open Games',
    moves: ['e4', 'e6', 'd4', 'd5', 'Nc3', 'Bb4'],
    description:
      'A provocative line pinning the knight and creating complex play.',
  },
  {
    name: 'Caro-Kann Defense',
    category: 'Semi-Open Games',
    moves: ['e4', 'c6'],
    description:
      'Solid and reliable — Black prepares d5 with pawn support.',
  },
  {
    name: 'Caro-Kann — Advance Variation',
    category: 'Semi-Open Games',
    moves: ['e4', 'c6', 'd4', 'd5', 'e5'],
    description:
      'White grabs space with e5, leading to a French-like pawn structure.',
  },
  {
    name: 'Caro-Kann — Fantasy Variation',
    category: 'Semi-Open Games',
    moves: ['e4', 'c6', 'd4', 'd5', 'f3'],
    description:
      'An aggressive surprise — White supports the e4 pawn and aims for a big center.',
  },
  {
    name: 'Caro-Kann — Classical Variation',
    category: 'Semi-Open Games',
    moves: ['e4', 'c6', 'd4', 'd5', 'Nc3', 'dxe4', 'Nxe4', 'Bf5'],
    description:
      'The main line. Black develops the light-squared bishop before playing e6.',
  },
  {
    name: 'Caro-Kann — Tartakower Variation',
    category: 'Semi-Open Games',
    moves: ['e4', 'c6', 'd4', 'd5', 'Nc3', 'dxe4', 'Nxe4', 'Nf6', 'Nxf6+', 'exf6'],
    description:
      'Black accepts doubled f-pawns for the open e-file and bishop pair.',
  },
  {
    name: 'Caro-Kann — Two Knights Variation',
    category: 'Semi-Open Games',
    moves: ['e4', 'c6', 'Nf3', 'd5', 'Nc3'],
    description:
      'A flexible setup avoiding the main lines, keeping options open.',
  },

  // French extras
  {
    name: 'French — Advance Variation',
    category: 'Semi-Open Games',
    moves: ['e4', 'e6', 'd4', 'd5', 'e5'],
    description:
      'White locks the center and gains space. A strategic battle over the dark squares.',
  },
  {
    name: 'French — Tarrasch Variation',
    category: 'Semi-Open Games',
    moves: ['e4', 'e6', 'd4', 'd5', 'Nd2'],
    description:
      'White avoids the Winawer pin and keeps a solid, flexible structure.',
  },
  {
    name: 'French — Exchange Variation',
    category: 'Semi-Open Games',
    moves: ['e4', 'e6', 'd4', 'd5', 'exd5', 'exd5'],
    description:
      'A symmetrical structure. Simple but can lead to pawn-majority endgames.',
  },

  // Scandinavian & Pirc/Modern
  {
    name: 'Scandinavian Defense',
    category: 'Semi-Open Games',
    moves: ['e4', 'd5'],
    description:
      'Black immediately challenges the e4 pawn. Simple and direct.',
  },
  {
    name: 'Pirc Defense',
    category: 'Semi-Open Games',
    moves: ['e4', 'd6', 'd4', 'Nf6', 'Nc3', 'g6'],
    description:
      'A hypermodern defense — Black lets White build a center and counterattacks later.',
  },
  {
    name: 'Alekhine Defense',
    category: 'Semi-Open Games',
    moves: ['e4', 'Nf6'],
    description:
      'Black provokes White\'s pawns forward, then attacks the overextended center.',
  },

  // Queen's Gambit family
  {
    name: "Queen's Gambit",
    category: 'Closed Games',
    moves: ['d4', 'd5', 'c4'],
    description:
      'White offers a pawn to gain central control. Not a true gambit — the pawn is easily recovered.',
  },
  {
    name: "Queen's Gambit Declined",
    category: 'Closed Games',
    moves: ['d4', 'd5', 'c4', 'e6'],
    description:
      'Black solidly declines the gambit and holds the center.',
  },
  {
    name: "Queen's Gambit Accepted",
    category: 'Closed Games',
    moves: ['d4', 'd5', 'c4', 'dxc4'],
    description:
      'Black takes the pawn, aiming to hold it or create counterplay.',
  },

  // Indian Defenses
  {
    name: "King's Indian Defense",
    category: 'Indian Defenses',
    moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7', 'e4', 'd6'],
    description:
      'A hypermodern defense letting White build a big center, then counterattacking.',
  },
  {
    name: 'Nimzo-Indian Defense',
    category: 'Indian Defenses',
    moves: ['d4', 'Nf6', 'c4', 'e6', 'Nc3', 'Bb4'],
    description:
      'One of the most respected defenses — Black pins the knight and fights for e4.',
  },
  {
    name: 'Grünfeld Defense',
    category: 'Indian Defenses',
    moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'd5'],
    description:
      'Black strikes at the center immediately, accepting a space disadvantage for activity.',
  },

  // English & Flank
  {
    name: 'English Opening',
    category: 'Flank Openings',
    moves: ['c4'],
    description:
      'A flexible flank opening that can transpose into many structures.',
  },
  {
    name: 'Réti Opening',
    category: 'Flank Openings',
    moves: ['Nf3', 'd5', 'c4'],
    description:
      'A hypermodern approach delaying central pawn play.',
  },

  // Gambits
  {
    name: "King's Gambit",
    category: 'Gambits',
    moves: ['e4', 'e5', 'f4'],
    description:
      'One of the oldest gambits — White sacrifices a pawn for a strong center and open f-file.',
  },
  {
    name: 'Danish Gambit',
    category: 'Gambits',
    moves: ['e4', 'e5', 'd4', 'exd4', 'c3'],
    description:
      'An aggressive gambit offering up to two pawns for rapid piece development.',
  },
  {
    name: 'Scotch Game',
    category: 'Open Games',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'd4'],
    description:
      'White immediately opens the center. A favorite of Kasparov.',
  },
  {
    name: 'Vienna Game',
    category: 'Open Games',
    moves: ['e4', 'e5', 'Nc3'],
    description:
      'A flexible alternative to 2.Nf3, keeping options open for f4.',
  },

  // London & Systems
  {
    name: 'London System',
    category: 'Closed Games',
    moves: ['d4', 'd5', 'Bf4'],
    description:
      'A solid system where White develops the dark-squared bishop early.',
  },

  // Unusual & Offbeat
  {
    name: 'Grob Attack',
    category: 'Unusual Openings',
    moves: ['g4'],
    description:
      'A provocative first move weakening the kingside. Surprise value is its main weapon.',
  },
  {
    name: 'Borg Defense (Grob Counter)',
    category: 'Unusual Openings',
    moves: ['e4', 'g5'],
    description:
      'The mirror of the Grob — Black weakens the kingside immediately. Dubious but fun.',
  },
  {
    name: "Bird's Opening",
    category: 'Unusual Openings',
    moves: ['f4'],
    description:
      'A flank opening aiming for kingside play and a reversed Dutch structure.',
  },
  {
    name: 'From Gambit',
    category: 'Unusual Openings',
    moves: ['f4', 'e5'],
    description:
      "A sharp gambit against Bird's Opening. Black sacrifices a pawn for open lines.",
  },
  {
    name: 'Polish Opening (Sokolsky)',
    category: 'Unusual Openings',
    moves: ['b4'],
    description:
      'A rare flank opening grabbing queenside space. Unorthodox but tricky.',
  },
  {
    name: 'Hippopotamus Defense',
    category: 'Unusual Openings',
    moves: ['e4', 'g6', 'd4', 'b6'],
    description:
      'Black hides behind pawns on the 6th rank, waiting to counterattack. Very passive but flexible.',
  },
  {
    name: 'Orangutan / Polish Gambit',
    category: 'Unusual Openings',
    moves: ['b4', 'e5', 'Bb2'],
    description:
      'White fianchettoes after 1.b4, aiming for long diagonal pressure.',
  },
  {
    name: "King's Fianchetto Opening",
    category: 'Unusual Openings',
    moves: ['g3'],
    description:
      'A quiet, hypermodern start. White fianchettoes the bishop and plays flexibly.',
  },
  {
    name: 'Sodium Attack',
    category: 'Unusual Openings',
    moves: ['Na3'],
    description:
      'Named after its algebraic notation (Na3 = sodium). A bizarre but legal first move.',
  },
  {
    name: 'Clemenz Opening',
    category: 'Unusual Openings',
    moves: ['h3'],
    description:
      'A waiting move that avoids all theory. Transposes into other openings later.',
  },

  // Weird Gambits
  {
    name: 'Halloween Gambit',
    category: 'Wild Gambits',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Nxe5'],
    description:
      'White sacrifices a knight on move 3 for a massive center. Terrifying if unprepared.',
  },
  {
    name: 'Stafford Gambit',
    category: 'Wild Gambits',
    moves: ['e4', 'e5', 'Nf3', 'Nf6', 'Nxe5', 'Nc6'],
    description:
      'Black offers a pawn for vicious traps. Extremely popular in online blitz.',
  },
  {
    name: 'Latvian Gambit',
    category: 'Wild Gambits',
    moves: ['e4', 'e5', 'Nf3', 'f5'],
    description:
      'Black plays f5 immediately — a wild counter-gambit with many traps for both sides.',
  },
  {
    name: 'Elephant Gambit',
    category: 'Wild Gambits',
    moves: ['e4', 'e5', 'Nf3', 'd5'],
    description:
      'Black counter-attacks the center immediately. Objectively dubious but full of tricks.',
  },
  {
    name: 'Englund Gambit',
    category: 'Wild Gambits',
    moves: ['d4', 'e5'],
    description:
      'Black sacrifices a pawn against 1.d4 hoping for tactical complications.',
  },
  {
    name: 'Budapest Gambit',
    category: 'Wild Gambits',
    moves: ['d4', 'Nf6', 'c4', 'e5'],
    description:
      'A surprising counter-gambit against the Queen\'s Pawn. The knight can jump to g4.',
  },
  {
    name: 'Blackmar-Diemer Gambit',
    category: 'Wild Gambits',
    moves: ['d4', 'd5', 'e4', 'dxe4', 'Nc3'],
    description:
      'White gambits a pawn for rapid development and attacking chances. A cult favorite.',
  },
  {
    name: 'Smith-Morra Gambit',
    category: 'Wild Gambits',
    moves: ['e4', 'c5', 'd4', 'cxd4', 'c3'],
    description:
      'A gambit vs the Sicilian — White gives up a pawn for open lines and fast development.',
  },
  {
    name: 'Wing Gambit (vs Sicilian)',
    category: 'Wild Gambits',
    moves: ['e4', 'c5', 'b4'],
    description:
      'A rare gambit offering the b-pawn to deflect the c5 pawn and seize the center.',
  },
  {
    name: 'Philidor Counter Gambit',
    category: 'Wild Gambits',
    moves: ['e4', 'e5', 'Nf3', 'd6', 'd4', 'f5'],
    description:
      'An aggressive twist on the Philidor where Black pushes f5 early.',
  },
  {
    name: 'Benko Gambit',
    category: 'Wild Gambits',
    moves: ['d4', 'Nf6', 'c4', 'c5', 'd5', 'b5'],
    description:
      'Black sacrifices a queenside pawn for lasting pressure on the a and b files.',
  },
  {
    name: 'Tennison Gambit',
    category: 'Wild Gambits',
    moves: ['Nf3', 'd5', 'e4'],
    description:
      'A sneaky gambit transposing into sharp play. Internet-famous for its traps.',
  },
];
