import * as countryFlagEmoji from 'country-flag-emoji';

export function escapeMkdnV2(text: string): string {
  const specialChars = [
    '.',
    '-',
    '_',
    '*',
    '[',
    ']',
    '(',
    ')',
    '~',
    '>',
    '#',
    '+',
    '=',
    '|',
    '{',
    '}',
    '!',
    "'",
  ];
  let escapedText = text;

  for (const char of specialChars) {
    escapedText = escapedText.replace(
      new RegExp(`\\${char}`, 'g'),
      `\\${char}`,
    );
  }

  return escapedText;
}

export function applyBold(text: string) {
  return `*${text}*`;
}

export function getCountryFlag(name: string) {
  const flagsMap = countryFlagEmoji.list;

  if (name.toLowerCase() === 'world') {
    return '🌍';
  }

  if (name.toLowerCase() === 'england') {
    name = 'United Kingdom';
  }

  if (name.toLowerCase() === 'usa') {
    name = 'United States';
  }

  const [flag] = flagsMap.filter((item) => {
    return item.name.toLowerCase().includes(name.toLowerCase());
  });

  return flag ? flag.emoji : '';
}
