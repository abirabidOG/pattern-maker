import type { MotifDefinition } from '../types';

/**
 * 35 Original Flat-Vector Motifs
 * All normalized to 100x100 viewBox centered around (50, 50)
 */
export const MOTIFS: MotifDefinition[] = [
  // 1. Flower
  {
    id: 'flower',
    name: 'Flower',
    category: 'nature',
    keywords: ['flower', 'flowers', 'blossom', 'petal', 'bloom'],
    paths: [
      {
        d: 'M50 20 C56 20 60 26 60 32 C60 37 57 41 53 43 C58 40 65 42 68 47 C72 53 70 60 65 64 C61 67 56 66 52 64 C55 69 53 76 48 80 C42 83 35 81 32 75 C30 71 31 66 33 63 C28 66 21 64 18 58 C15 52 17 45 23 42 C27 40 32 41 35 44 C33 39 36 32 41 29 C44 27 47 20 50 20 Z',
      },
      {
        d: 'M50 58 A8 8 0 1 0 50 42 A8 8 0 1 0 50 58 Z',
      },
    ],
  },

  // 2. Tulip
  {
    id: 'tulip',
    name: 'Tulip',
    category: 'nature',
    keywords: ['tulip', 'tulips'],
    paths: [
      {
        d: 'M50 18 C58 26 65 38 65 52 C65 68 57 78 50 82 C43 78 35 68 35 52 C35 38 42 26 50 18 Z',
      },
      {
        d: 'M35 35 C38 45 42 55 50 60 C42 60 34 50 30 40 C28 35 31 32 35 35 Z',
      },
      {
        d: 'M65 35 C62 45 58 55 50 60 C58 60 66 50 70 40 C72 35 69 32 65 35 Z',
      },
      {
        d: 'M47 80 L47 95 L53 95 L53 80 Z',
      },
    ],
  },

  // 3. Daisy
  {
    id: 'daisy',
    name: 'Daisy',
    category: 'nature',
    keywords: ['daisy', 'daisies', 'chamomile'],
    paths: [
      {
        d: 'M50 15 C53 15 55 24 54 32 C54 35 52 38 50 38 C48 38 46 35 46 32 C45 24 47 15 50 15 Z' +
           'M75 25 C77 27 72 35 66 40 C63 42 60 41 59 39 C58 37 60 34 62 32 C68 27 73 23 75 25 Z' +
           'M85 50 C85 53 76 55 68 54 C65 54 62 52 62 50 C62 48 65 46 68 46 C76 45 85 47 85 50 Z' +
           'M75 75 C73 77 65 72 60 66 C58 63 59 60 61 59 C63 58 66 60 68 62 C73 68 77 73 75 75 Z' +
           'M50 85 C47 85 45 76 46 68 C46 65 48 62 50 62 C52 62 54 65 54 68 C55 76 53 85 50 85 Z' +
           'M25 75 C23 73 28 65 34 60 C37 58 40 59 41 61 C42 63 40 66 38 68 C32 73 27 77 25 75 Z' +
           'M15 50 C15 47 24 45 32 46 C35 46 38 48 38 50 C38 52 35 54 32 54 C24 55 15 53 15 50 Z' +
           'M25 25 C27 23 35 28 40 34 C42 37 41 40 39 41 C37 42 34 40 32 38 C27 32 23 27 25 25 Z',
      },
      {
        d: 'M50 61 A11 11 0 1 0 50 39 A11 11 0 1 0 50 61 Z',
      },
    ],
  },

  // 4. Leaf
  {
    id: 'leaf',
    name: 'Leaf',
    category: 'nature',
    keywords: ['leaf', 'leaves', 'foliage', 'greenery'],
    paths: [
      {
        d: 'M25 75 C25 45 45 25 75 25 C75 55 55 75 25 75 Z',
      },
      {
        d: 'M25 75 Q48 52 75 25',
        strokeOnly: true,
        strokeWidth: 3,
      },
    ],
  },

  // 5. Palm leaf
  {
    id: 'palm',
    name: 'Palm leaf',
    category: 'nature',
    keywords: ['palm', 'tropical', 'monstera', 'jungle'],
    paths: [
      {
        d: 'M50 15 C55 28 75 35 85 45 C75 48 65 46 58 43 C70 52 78 62 80 72 C70 70 62 65 56 58 C62 70 65 80 62 88 C55 82 52 72 50 65 C48 72 45 82 38 88 C35 80 38 70 44 58 C38 65 30 70 20 72 C22 62 30 52 42 43 C35 46 25 48 15 45 C25 35 45 28 50 15 Z',
      },
      {
        d: 'M50 15 L50 92',
        strokeOnly: true,
        strokeWidth: 3,
      },
    ],
  },

  // 6. Star
  {
    id: 'star',
    name: 'Star',
    category: 'shapes',
    keywords: ['star', 'stars', 'sparkle', 'night'],
    paths: [
      {
        d: 'M50 15 L61 37 L85 41 L67 58 L71 82 L50 71 L29 82 L33 58 L15 41 L39 37 Z',
      },
    ],
  },

  // 7. Heart
  {
    id: 'heart',
    name: 'Heart',
    category: 'shapes',
    keywords: ['heart', 'hearts', 'love', 'valentines'],
    paths: [
      {
        d: 'M50 82 C50 82 20 62 20 40 C20 27 30 18 42 18 C48 18 52 22 50 25 C48 22 52 18 58 18 C70 18 80 27 80 40 C80 62 50 82 50 82 Z',
      },
    ],
  },

  // 8. Cat
  {
    id: 'cat',
    name: 'Cat',
    category: 'cute',
    keywords: ['cat', 'cats', 'kitten', 'kitty', 'feline'],
    paths: [
      {
        // Cat head & ears
        d: 'M25 32 L35 48 C40 46 45 45 50 45 C55 45 60 46 65 48 L75 32 L73 53 C78 58 80 64 80 70 C80 82 67 90 50 90 C33 90 20 82 20 70 C20 64 22 58 27 53 Z',
      },
      {
        // Eyes
        d: 'M38 65 A3 3 0 1 0 38 59 A3 3 0 1 0 38 65 Z M62 65 A3 3 0 1 0 62 59 A3 3 0 1 0 62 65 Z',
      },
    ],
  },

  // 9. Dog
  {
    id: 'dog',
    name: 'Dog',
    category: 'cute',
    keywords: ['dog', 'dogs', 'puppy', 'pup', 'canine'],
    paths: [
      {
        // Floppy ear left
        d: 'M28 38 C20 42 18 58 22 68 C24 73 28 73 30 68 C32 60 32 48 35 42 Z',
      },
      {
        // Floppy ear right
        d: 'M72 38 C80 42 82 58 78 68 C76 73 72 73 70 68 C68 60 68 48 65 42 Z',
      },
      {
        // Head & snout
        d: 'M32 44 C35 36 42 32 50 32 C58 32 65 36 68 44 C72 52 72 65 70 74 C68 82 60 86 50 86 C40 86 32 82 30 74 C28 65 28 52 32 44 Z',
      },
      {
        // Nose
        d: 'M50 68 C46 68 45 62 50 62 C55 62 54 68 50 68 Z',
      },
    ],
  },

  // 10. Lemon
  {
    id: 'lemon',
    name: 'Lemon',
    category: 'nature',
    keywords: ['lemon', 'lemons', 'citrus'],
    paths: [
      {
        d: 'M22 35 C16 45 20 62 35 73 C50 84 68 85 78 75 C88 65 85 48 74 34 C63 20 45 16 35 22 L22 35 Z',
      },
      {
        // Lemon tip nip
        d: 'M20 32 C17 35 18 38 22 37 Z M80 77 C83 74 82 71 78 72 Z',
      },
    ],
  },

  // 11. Coffee bean
  {
    id: 'coffee',
    name: 'Coffee bean',
    category: 'objects',
    keywords: ['coffee', 'bean', 'beans', 'espresso'],
    paths: [
      {
        d: 'M30 30 C15 45 15 65 30 80 C45 95 65 95 80 80 C95 65 95 45 80 30 C65 15 45 15 30 30 Z',
      },
      {
        d: 'M35 32 Q52 48 48 60 Q44 72 65 80',
        strokeOnly: true,
        strokeWidth: 4,
      },
    ],
  },

  // 12. Sun
  {
    id: 'sun',
    name: 'Sun',
    category: 'nature',
    keywords: ['sun', 'suns', 'sunny', 'sunshine', 'solar'],
    paths: [
      {
        // Sun center
        d: 'M50 65 A15 15 0 1 0 50 35 A15 15 0 1 0 50 65 Z',
      },
      {
        // 8 radiating rays
        d: 'M50 18 L50 28 M50 72 L50 82 M18 50 L28 50 M72 50 L82 50 M27 27 L34 34 M66 66 L73 73 M27 73 L34 66 M66 34 L73 27',
        strokeOnly: true,
        strokeWidth: 4,
      },
    ],
  },

  // 13. Cloud
  {
    id: 'cloud',
    name: 'Cloud',
    category: 'nature',
    keywords: ['cloud', 'clouds', 'sky', 'weather'],
    paths: [
      {
        d: 'M30 68 L70 68 C78 68 84 62 84 54 C84 47 79 41 72 40 C70 30 61 24 50 24 C41 24 33 29 30 37 C22 38 16 45 16 53 C16 61 22 68 30 68 Z',
      },
    ],
  },

  // 14. Fruit
  {
    id: 'fruit',
    name: 'Fruit',
    category: 'nature',
    keywords: ['fruit', 'fruits', 'apple', 'peach'],
    paths: [
      {
        // Apple / round fruit body
        d: 'M50 34 C42 26 24 28 22 46 C20 66 38 82 50 84 C62 82 80 66 78 46 C76 28 58 26 50 34 Z',
      },
      {
        // Stem and leaf
        d: 'M50 34 Q52 22 58 18',
        strokeOnly: true,
        strokeWidth: 3,
      },
      {
        d: 'M54 26 C62 24 66 28 66 28 C66 28 62 34 54 32 Z',
      },
    ],
  },

  // 15. Wave line
  {
    id: 'wave',
    name: 'Wave line',
    category: 'shapes',
    keywords: ['wave', 'waves', 'ocean', 'ripple', 'sea'],
    paths: [
      {
        d: 'M15 42 Q32 26 50 42 T85 42 M15 58 Q32 42 50 58 T85 58',
        strokeOnly: true,
        strokeWidth: 5,
      },
    ],
  },

  // 16. Circle
  {
    id: 'circle',
    name: 'Circle',
    category: 'shapes',
    keywords: ['circle', 'circles', 'round', 'disc'],
    paths: [
      {
        d: 'M50 80 A30 30 0 1 0 50 20 A30 30 0 1 0 50 80 Z',
      },
    ],
  },

  // 17. Dot cluster
  {
    id: 'dot',
    name: 'Dot cluster',
    category: 'shapes',
    keywords: ['dot', 'dots', 'speckles', 'polka', 'cluster'],
    paths: [
      {
        d: 'M50 35 A7 7 0 1 0 50 21 A7 7 0 1 0 50 35 Z' +
           'M32 58 A6 6 0 1 0 32 46 A6 6 0 1 0 32 58 Z' +
           'M68 56 A6 6 0 1 0 68 44 A6 6 0 1 0 68 56 Z' +
           'M44 76 A5 5 0 1 0 44 66 A5 5 0 1 0 44 76 Z' +
           'M62 74 A4 4 0 1 0 62 66 A4 4 0 1 0 62 74 Z',
      },
    ],
  },

  // 18. Diamond
  {
    id: 'diamond',
    name: 'Diamond',
    category: 'shapes',
    keywords: ['diamond', 'diamonds', 'rhombus', 'gem'],
    paths: [
      {
        d: 'M50 18 L80 50 L50 82 L20 50 Z',
      },
    ],
  },

  // 19. Triangle
  {
    id: 'triangle',
    name: 'Triangle',
    category: 'shapes',
    keywords: ['triangle', 'triangles', 'pyramid'],
    paths: [
      {
        d: 'M50 20 L82 78 L18 78 Z',
      },
    ],
  },

  // 20. Hexagon
  {
    id: 'hexagon',
    name: 'Hexagon',
    category: 'shapes',
    keywords: ['hexagon', 'hexagons', 'honeycomb', 'polygon'],
    paths: [
      {
        d: 'M50 18 L78 34 L78 66 L50 82 L22 66 L22 34 Z',
      },
    ],
  },

  // 21. Crescent
  {
    id: 'crescent',
    name: 'Crescent',
    category: 'shapes',
    keywords: ['crescent', 'crescents', 'moon', 'lunar'],
    paths: [
      {
        d: 'M45 20 C62 20 76 34 76 50 C76 66 62 80 45 80 C36 80 28 76 22 70 C36 72 56 62 56 50 C56 38 36 28 22 30 C28 24 36 20 45 20 Z',
      },
    ],
  },

  // 22. Ring
  {
    id: 'ring',
    name: 'Ring',
    category: 'shapes',
    keywords: ['ring', 'rings', 'torus', 'hoop'],
    paths: [
      {
        d: 'M50 80 A30 30 0 1 0 50 20 A30 30 0 1 0 50 80 Z M50 66 A16 16 0 1 1 50 34 A16 16 0 1 1 50 66 Z',
        fillRule: 'evenodd',
      },
    ],
  },

  // 23. Square
  {
    id: 'square',
    name: 'Square',
    category: 'shapes',
    keywords: ['square', 'squares', 'cube', 'box'],
    paths: [
      {
        d: 'M24 24 L76 24 L76 76 L24 76 Z',
      },
    ],
  },

  // 24. Rose
  {
    id: 'rose',
    name: 'Rose',
    category: 'nature',
    keywords: ['rose', 'roses'],
    paths: [
      {
        d: 'M50 24 C58 24 68 30 68 40 C68 46 64 52 58 55 C65 57 72 63 72 70 C72 78 62 84 50 84 C38 84 28 78 28 70 C28 63 35 57 42 55 C36 52 32 46 32 40 C32 30 42 24 50 24 Z M50 36 C45 36 40 40 40 45 C40 50 45 54 50 54 C55 54 60 50 60 45 C60 40 55 36 50 36 Z',
      },
    ],
  },

  // 25. Sunflower
  {
    id: 'sunflower',
    name: 'Sunflower',
    category: 'nature',
    keywords: ['sunflower', 'sunflowers'],
    paths: [
      {
        // Big center disc
        d: 'M50 66 A16 16 0 1 0 50 34 A16 16 0 1 0 50 66 Z',
      },
      {
        // 12 pointed radiant petals
        d: 'M50 16 L53 32 L47 32 Z M74 22 L63 35 L58 31 Z M84 50 L68 53 L68 47 Z M74 78 L58 69 L63 65 Z M50 84 L47 68 L53 68 Z M26 78 L37 65 L42 69 Z M16 50 L32 47 L32 53 Z M26 22 L42 31 L37 35 Z',
      },
    ],
  },

  // 26. Lavender
  {
    id: 'lavender',
    name: 'Lavender',
    category: 'nature',
    keywords: ['lavender'],
    paths: [
      {
        d: 'M50 88 L50 20',
        strokeOnly: true,
        strokeWidth: 3,
      },
      {
        // Flower buds clustered along stem
        d: 'M50 20 C46 16 54 16 50 20 Z' +
           'M43 28 C37 26 40 34 46 32 Z M57 28 C63 26 60 34 54 32 Z' +
           'M42 40 C35 38 38 46 45 44 Z M58 40 C65 38 62 46 55 44 Z' +
           'M41 52 C34 50 37 58 45 56 Z M59 52 C66 50 63 58 55 56 Z' +
           'M40 64 C33 62 36 70 44 68 Z M60 64 C67 62 64 70 56 68 Z',
      },
    ],
  },

  // 27. Teddy bear
  {
    id: 'bear',
    name: 'Teddy bear',
    category: 'cute',
    keywords: ['bear', 'teddy', 'teddy bear', 'cub'],
    paths: [
      {
        // Ears
        d: 'M25 34 A9 9 0 1 0 25 16 A9 9 0 1 0 25 34 Z M75 34 A9 9 0 1 0 75 16 A9 9 0 1 0 75 34 Z',
      },
      {
        // Head
        d: 'M50 74 C65 74 76 64 76 48 C76 34 64 26 50 26 C36 26 24 34 24 48 C24 64 35 74 50 74 Z',
      },
      {
        // Snout
        d: 'M50 64 A10 7 0 1 0 50 50 A10 7 0 1 0 50 64 Z',
      },
      {
        // Eyes
        d: 'M40 44 A2.5 2.5 0 1 0 40 39 A2.5 2.5 0 1 0 40 44 Z M60 44 A2.5 2.5 0 1 0 60 39 A2.5 2.5 0 1 0 60 44 Z',
      },
    ],
  },

  // 28. Whale
  {
    id: 'whale',
    name: 'Whale',
    category: 'cute',
    keywords: ['whale', 'whales', 'ocean', 'marine'],
    paths: [
      {
        // Body and tail
        d: 'M18 52 C18 36 34 28 58 30 C76 32 84 46 84 56 C74 58 66 68 56 68 C40 68 32 64 18 52 Z M84 54 C88 48 94 44 94 44 L92 56 L94 66 C88 62 84 56 84 54 Z',
      },
      {
        // Flipper
        d: 'M44 56 C42 62 46 66 50 64 C52 60 50 54 46 54 Z',
      },
      {
        // Water spout
        d: 'M48 26 Q46 16 40 18 M52 26 Q54 14 62 16',
        strokeOnly: true,
        strokeWidth: 3,
      },
    ],
  },

  // 29. Rainbow
  {
    id: 'rainbow',
    name: 'Rainbow',
    category: 'nature',
    keywords: ['rainbow', 'rainbows'],
    paths: [
      {
        d: 'M20 72 A30 30 0 0 1 80 72',
        strokeOnly: true,
        strokeWidth: 6,
      },
      {
        d: 'M28 72 A22 22 0 0 1 72 72',
        strokeOnly: true,
        strokeWidth: 6,
      },
      {
        d: 'M36 72 A14 14 0 0 1 64 72',
        strokeOnly: true,
        strokeWidth: 6,
      },
    ],
  },

  // 30. Strawberry
  {
    id: 'strawberry',
    name: 'Strawberry',
    category: 'nature',
    keywords: ['strawberry', 'strawberries', 'berry'],
    paths: [
      {
        // Heart-like berry body
        d: 'M50 82 C42 80 24 64 24 45 C24 35 34 32 50 35 C66 32 76 35 76 45 C76 64 58 80 50 82 Z',
      },
      {
        // Calyx / leaves at top
        d: 'M50 36 L40 26 L46 34 L32 30 L44 38 L50 36 L56 38 L68 30 L54 34 L60 26 Z',
      },
      {
        // Seeds
        d: 'M42 48 A1.5 1.5 0 1 0 42 45 A1.5 1.5 0 1 0 42 48 Z' +
           'M58 48 A1.5 1.5 0 1 0 58 45 A1.5 1.5 0 1 0 58 48 Z' +
           'M50 58 A1.5 1.5 0 1 0 50 55 A1.5 1.5 0 1 0 50 58 Z' +
           'M40 64 A1.5 1.5 0 1 0 40 61 A1.5 1.5 0 1 0 40 64 Z' +
           'M60 64 A1.5 1.5 0 1 0 60 61 A1.5 1.5 0 1 0 60 64 Z',
      },
    ],
  },

  // 31. Pineapple
  {
    id: 'pineapple',
    name: 'Pineapple',
    category: 'nature',
    keywords: ['pineapple', 'pineapples', 'tropical'],
    paths: [
      {
        // Pineapple body
        d: 'M32 46 C32 38 40 36 50 36 C60 36 68 38 68 46 C68 64 64 80 50 80 C36 80 32 64 32 46 Z',
      },
      {
        // Crosshatch lattice lines
        d: 'M36 50 L64 70 M36 70 L64 50 M40 40 L60 60 M40 60 L60 40',
        strokeOnly: true,
        strokeWidth: 2.5,
      },
      {
        // Spiky crown leaves
        d: 'M50 36 L42 20 L48 30 L50 16 L52 30 L58 20 Z',
      },
    ],
  },

  // 32. Cherry
  {
    id: 'cherry',
    name: 'Cherry',
    category: 'nature',
    keywords: ['cherry', 'cherries'],
    paths: [
      {
        // Left cherry
        d: 'M34 76 A14 14 0 1 0 34 48 A14 14 0 1 0 34 76 Z',
      },
      {
        // Right cherry
        d: 'M66 76 A14 14 0 1 0 66 48 A14 14 0 1 0 66 76 Z',
      },
      {
        // Stems joining at top leaf
        d: 'M34 50 Q42 32 54 22 M66 50 Q56 32 54 22',
        strokeOnly: true,
        strokeWidth: 3,
      },
      {
        d: 'M54 22 C64 16 70 20 70 20 C70 20 64 28 54 22 Z',
      },
    ],
  },

  // 33. Coffee cup
  {
    id: 'cup',
    name: 'Coffee cup',
    category: 'objects',
    keywords: ['cup', 'coffee cup', 'mug', 'tea'],
    paths: [
      {
        // Cup body
        d: 'M25 38 L28 72 C28 78 34 82 42 82 L58 82 C66 82 72 78 72 72 L75 38 Z',
      },
      {
        // Handle
        d: 'M73 44 C82 44 84 52 84 56 C84 62 80 66 72 66',
        strokeOnly: true,
        strokeWidth: 4,
      },
      {
        // Steam wisps
        d: 'M40 28 Q44 22 40 16 M50 30 Q54 24 50 18 M60 28 Q64 22 60 16',
        strokeOnly: true,
        strokeWidth: 2.5,
      },
    ],
  },

  // 34. Paisley
  {
    id: 'paisley',
    name: 'Paisley',
    category: 'shapes',
    keywords: ['paisley', 'boteh', 'teardrop'],
    paths: [
      {
        d: 'M50 82 C34 82 22 70 22 54 C22 36 38 24 50 16 C58 24 78 36 78 52 C78 62 70 68 62 66 C56 64 54 58 56 52 C58 46 66 46 66 40 C66 36 60 32 54 36 C44 42 38 52 40 62 C42 72 50 76 56 76 Z',
      },
    ],
  },

  // 35. Butterfly
  {
    id: 'butterfly',
    name: 'Butterfly',
    category: 'nature',
    keywords: ['butterfly', 'butterflies', 'moth'],
    paths: [
      {
        // Body & antenna
        d: 'M50 35 L50 72',
        strokeOnly: true,
        strokeWidth: 4,
      },
      {
        d: 'M48 35 Q44 26 38 24 M52 35 Q56 26 62 24',
        strokeOnly: true,
        strokeWidth: 2,
      },
      {
        // Top wings
        d: 'M48 42 C38 24 16 32 20 50 C22 56 34 60 48 54 Z M52 42 C62 24 84 32 80 50 C78 56 66 60 52 54 Z',
      },
      {
        // Bottom wings
        d: 'M48 54 C36 56 26 66 32 76 C38 80 46 72 48 64 Z M52 54 C64 56 74 66 68 76 C62 80 54 72 52 64 Z',
      },
    ],
  },
];

export const MOTIF_MAP = new Map<string, MotifDefinition>(
  MOTIFS.map((m) => [m.id, m])
);
