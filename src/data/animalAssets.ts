/**
 * Real WebP animations for a handful of creatures, keyed by the emoji already used to
 * identify them everywhere in the app's data (englishData, alphabetData, motionQuizData).
 * AnimatedCreature swaps in the real asset when the emoji matches; every other creature
 * keeps the emoji + Animated-API motion. Drop in a new file and add one line here to
 * upgrade another creature later — no screen-level code needs to change.
 *
 * The dog (🐶) is handled separately in AnimatedCreature via a real video (DogAnimation),
 * not a WebP, so it isn't listed here.
 */
export const ANIMAL_ASSETS: Record<string, number> = {
  '🐱': require('../assets/animals/pisik_yeriyir.webp'),
  '🐝': require('../assets/animals/ari_ucur.webp'),
  '🐟': require('../assets/animals/baliq_uzur.webp'),
  '🐸': require('../assets/animals/qurbaga_tullanir.webp'),
};
