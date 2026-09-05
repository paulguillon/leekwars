function listerNombresPremiers(limite: number): number[] {
  if (limite < 2) return [];

  const estPremier: boolean[] = new Array(limite + 1).fill(true);
  estPremier[0] = false;
  estPremier[1] = false;

  const racine: number = Math.floor(Math.sqrt(limite));

  for (let i = 2; i <= racine; i++) {
    if (estPremier[i]) {
      for (let j = i * i; j <= limite; j += i) {
        estPremier[j] = false;
      }
    }
  }

  const premiers: number[] = [];
  for (let i = 2; i <= limite; i++) {
    if (estPremier[i]) {
      premiers.push(i);
    }
  }

  return premiers;
}

const premiers = listerNombresPremiers(306);

const glagolitic: { [key: string]: number } = {
  "ⰰ": 1,
  "ⰱ": 2,
  "ⰲ": 3,
  "ⰳ": 4,
  "ⰴ": 5,
  "ⰵ": 6,
  "ⰶ": 7,
  "ⰷ": 8,
  "ⰸ": 9,
  "ⰹ": 10,
  "ⰻ": 20,
  "ⰼ": 30,
  "ⰽ": 40,
  "ⰾ": 50,
  "ⰿ": 60,
  "ⱀ": 70,
  "ⱁ": 80,
  "ⱂ": 90,
  "ⱃ": 100,
  "ⱄ": 200,
  "ⱅ": 300,
  "ⱆ": 400,
  "ⱇ": 500,
  "ⱈ": 600,
  "ⱉ": 700,
  "ⱋ": 800,
  "ⱌ": 900,
}

function decodeGlagolitic(input: string): number {
  return input.split('').reduce((acc, char) => acc + (glagolitic[char] || 0), 0);
}

function turn(): void {
  const listen: any[][] = Fight.listen().filter(([id, message]) => Entity.get(id).side === 1 && !message.includes("!"));
  let codes: number[] = [];
  if (listen.length > 2) {
    console.log(listen);
    codes = listen.map(([id, message]) => decodeGlagolitic(message));
    console.log(codes);
  }
  const facteurs: number[] = []
  const sorted = codes.sort((a, b) => a - b)
  const stringified = sorted.join("")
  const code = parseInt(stringified)
  premiers.forEach(premier => {
    const result = code % premier
    if (result === 0) {
      facteurs.push(premier)
    }
  })
  console.log(facteurs)
}