export const heroGazeCalibration = {
  note:
    'Manual hero gaze calibration. Pose names use viewer/screen direction. Transitions contain only kept runtime frames.',
  anchors: {
    UP_LEFT: 54,
    UP: 12,
    UP_RIGHT: 17,
    LEFT: 48, // v3: was 49 — frame 49 has downcast/closed-eye expression; 48 is cleaner
    CENTER: 'center',
    RIGHT: 22,
    DOWN_LEFT: 41,
    DOWN: 34,
    DOWN_RIGHT: 32,
  },
  transitions: {
    UP_TO_UP_RIGHT: [12, 13, 14, 15, 16, 17],
    UP_RIGHT_TO_RIGHT: [17, 18, 19, 20, 21, 22],
    RIGHT_TO_DOWN_RIGHT: [22, 28, 29, 30, 31, 32],
    DOWN_RIGHT_TO_DOWN: [32, 33, 34],
    DOWN_TO_DOWN_LEFT: [34, 35, 36, 37, 38, 39, 40, 41],
    // v3: restored 45,46,47 as genuine intermediates; ends at new LEFT anchor (48)
    // to revert to original: DOWN_LEFT_TO_LEFT: [41, 42, 43, 44, 45, 46, 47, 48, 49],
    DOWN_LEFT_TO_LEFT: [41, 42, 43, 44, 45, 46, 47, 48],
    // v3: starts at new LEFT anchor (48); 49 skipped — downcast eye causes expression dip
    LEFT_TO_UP_LEFT: [48, 50, 51, 52, 53, 54],
    UP_LEFT_TO_UP: [54, 55, 56, 6, 7, 8, 9, 10, 11, 12],
  },
  skippedFrames: [0, 1, 2, 3, 4, 5, 23, 24, 25, 26, 27, 57, 58, 59, 60, 61, 62, 63],
  transitionMembership: {
    UP_TO_UP_RIGHT: [12, 13, 14, 15, 16, 17],
    UP_RIGHT_TO_RIGHT: [17, 18, 19, 20, 21, 22],
    RIGHT_TO_DOWN_RIGHT: [22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32],
    DOWN_RIGHT_TO_DOWN: [32, 33, 34],
    DOWN_TO_DOWN_LEFT: [34, 35, 36, 37, 38, 39, 40, 41],
    DOWN_LEFT_TO_LEFT: [41, 42, 43, 44, 45, 46, 47, 48, 49],
    LEFT_TO_UP_LEFT: [48, 49, 50, 51, 52, 53, 54],
    UP_LEFT_TO_UP: [
      54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
      10, 11, 12,
    ],
  },
  transitionSkips: {
    UP_TO_UP_RIGHT: [],
    RIGHT_TO_DOWN_RIGHT: ['23', '24', '25', '26', '27'],
    LEFT_TO_UP_LEFT: ['49'], // v3: downcast-eye frame; 48→50 is visually smooth
    UP_LEFT_TO_UP: ['00', '01', '02', '03', '04', '05', '57', '58', '59', '60', '61', '62', '63'],
  },
  // Cursor angles (°) at which each frame looks most accurate, derived from
  // automated right-eye centroid analysis of frames 41–48 combined with visual
  // inspection. Frames are NOT evenly spaced in gaze angle — the early frames
  // (41→43) cover less visual angle than the later frames (44→48).
  // Used by Hero.tsx instead of linear interpolation for this transition.
  //
  // to revert: remove this field and the nonUniformAngles branch in Hero.tsx.
  nonUniformAt: {
    // Frames:              [41,  42,  43,  44,  45,  46,  47,  48]
    // Anchors 41 (135°) and 48 (180°) are fixed by the sector definition.
    DOWN_LEFT_TO_LEFT: [135, 145, 152, 162, 169, 173, 176, 180],
  },
} as const;

export type HeroGazeTransitionKey = keyof typeof heroGazeCalibration.transitions;
