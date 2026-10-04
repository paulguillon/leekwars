const glagolitic: { [key: string]: number } = {
  "Ⰰ": 1,
  "Ⰱ": 2,
  "Ⰲ": 3,
  "Ⰳ": 4,
  "Ⰴ": 5,
  "Ⰵ": 6,
  "Ⰶ": 7,
  "Ⰷ": 8,
  "Ⰸ": 9,
  "Ⰹ": 10,
  "Ⰻ": 20,
  "Ⰼ": 30,
  "Ⰽ": 40,
  "Ⰾ": 50,
  "Ⰿ": 60,
  "Ⱀ": 70,
  "Ⱁ": 80,
  "Ⱂ": 90,
  "Ⱃ": 100,
  "Ⱄ": 200,
  "Ⱅ": 300,
  "Ⱆ": 400,
  "Ⱇ": 500,
  "Ⱈ": 600,
  "Ⱉ": 700,
  "Ⱋ": 800,
  "Ⱌ": 900,
}

function decodeGlagolitic(input: string): number {
  return input.split('').reduce((acc, char) => acc + (glagolitic[char] || 0), 0);
}

const listen: any[][] = Fight.listen().filter(([id, message]) => Entity.get(id).side === 1 && !message.includes("!"));

if (listen.length > 2) {
  console.log(listen);
  const codes = listen.map(([id, message]) => decodeGlagolitic(message));
  console.log(codes);

  const sorted = codes.slice(-3).sort((a, b) => a - b)

  Fight.me.say(getInvocationCell(sorted[0], sorted[1], sorted[2]))
}

function getInvocationCell(n1: number, n2: number, n3: number): number {

  const combinations = [
    +('' + n1 + n2 + n3),
    +('' + n1 + n3 + n2),
    +('' + n2 + n1 + n3),
    +('' + n2 + n3 + n1),
    +('' + n3 + n1 + n2),
    +('' + n3 + n2 + n1),
  ]

  let max = 0;
  for (let combination of combinations) {
    for (let i = 612; i > 0; i--) {
      if (combination % i === 0) {
        if (max < i) {
          max = i;
        }
        break;
      }
    }
  }

  return max;
}