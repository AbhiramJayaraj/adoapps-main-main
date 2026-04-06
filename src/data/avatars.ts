export interface AnimalAvatar {
  id: string;
  emoji: string;
  name: string;
  category: string;
}

export const animalAvatars: AnimalAvatar[] = [
  // Predators
  { id: "wolf", emoji: "🐺", name: "Alpha Wolf", category: "Predators" },
  { id: "lion", emoji: "🦁", name: "King Lion", category: "Predators" },
  { id: "tiger", emoji: "🐅", name: "Bengal Tiger", category: "Predators" },
  { id: "panther", emoji: "🐆", name: "Black Panther", category: "Predators" },
  { id: "shark", emoji: "🦈", name: "Great White", category: "Predators" },
  { id: "crocodile", emoji: "🐊", name: "Iron Croc", category: "Predators" },
  { id: "snake", emoji: "🐍", name: "King Cobra", category: "Predators" },
  { id: "scorpion", emoji: "🦂", name: "Death Sting", category: "Predators" },

  // Power
  { id: "gorilla", emoji: "🦍", name: "Silverback", category: "Power" },
  { id: "bear", emoji: "🐻", name: "Grizzly Bear", category: "Power" },
  { id: "bull", emoji: "🐂", name: "Raging Bull", category: "Power" },
  { id: "rhino", emoji: "🦏", name: "Iron Rhino", category: "Power" },
  { id: "elephant", emoji: "🐘", name: "Titan", category: "Power" },
  { id: "hippo", emoji: "🦛", name: "Tank", category: "Power" },
  { id: "bison", emoji: "🦬", name: "Bison King", category: "Power" },
  { id: "mammoth", emoji: "🦣", name: "Mammoth", category: "Power" },

  // Speed & Agility
  { id: "eagle", emoji: "🦅", name: "War Eagle", category: "Speed" },
  { id: "hawk", emoji: "🪶", name: "Night Hawk", category: "Speed" },
  { id: "falcon", emoji: "🐦‍⬛", name: "Peregrine", category: "Speed" },
  { id: "cheetah", emoji: "🐈", name: "Flash Cat", category: "Speed" },
  { id: "horse", emoji: "🐎", name: "Stallion", category: "Speed" },
  { id: "deer", emoji: "🦌", name: "Swift Stag", category: "Speed" },
  { id: "rabbit", emoji: "🐇", name: "Speed Demon", category: "Speed" },
  { id: "fox", emoji: "🦊", name: "Sly Fox", category: "Speed" },

  // Mythical
  { id: "dragon", emoji: "🐉", name: "Fire Dragon", category: "Mythical" },
  { id: "unicorn", emoji: "🦄", name: "Unicorn", category: "Mythical" },
  { id: "phoenix", emoji: "🔥", name: "Phoenix", category: "Mythical" },
  { id: "kraken", emoji: "🐙", name: "Kraken", category: "Mythical" },
  { id: "bat", emoji: "🦇", name: "Dark Wing", category: "Mythical" },
  { id: "spider", emoji: "🕷️", name: "Venom", category: "Mythical" },
  { id: "owl", emoji: "🦉", name: "Wise Owl", category: "Mythical" },
  { id: "turtle", emoji: "🐢", name: "Iron Shell", category: "Mythical" },
];

export const avatarCategories = ["Predators", "Power", "Speed", "Mythical"] as const;
