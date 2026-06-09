// Small/fast LLMs occasionally emit Cyrillic homoglyphs — characters that look
// identical to Latin/Polish letters (e.g. Cyrillic "о" U+043E vs Latin "o")
// but corrupt otherwise-correct Polish text and break downstream string
// matching. Polish is written in the Latin alphabet (+ ąćęłńóśźż), so any
// Cyrillic character in Polish output is an error and can be safely mapped back
// to its visual Latin twin.

// Cyrillic -> Latin visual lookalikes (Unicode "confusables").
const CYRILLIC_TO_LATIN: Record<string, string> = {
  // lowercase
  а: "a", в: "b", е: "e", к: "k", м: "m", н: "h", о: "o", р: "p",
  с: "c", т: "t", у: "y", х: "x", і: "i", ј: "j", ѕ: "s", ԁ: "d",
  ԛ: "q", ԝ: "w", ё: "e",
  // uppercase
  А: "A", В: "B", Е: "E", З: "3", К: "K", М: "M", Н: "H", О: "O",
  Р: "P", С: "C", Т: "T", У: "Y", Х: "X", І: "I", Ј: "J", Ѕ: "S",
  Ԛ: "Q", Ԝ: "W", Ё: "E",
}

/**
 * Replace Cyrillic homoglyphs with their Latin equivalents so accidental
 * mixed-script output reads as clean Polish. Characters without a Latin
 * lookalike (e.g. ж, ш, я) are left untouched.
 */
export const sanitizeCyrillic = (text: string): string =>
  text.replace(/[Ѐ-ӿԀ-ԯ]/g, (ch) => CYRILLIC_TO_LATIN[ch] ?? ch)

/** True if the string contains any Cyrillic character. */
export const hasCyrillic = (text: string): boolean =>
  /[Ѐ-ӿԀ-ԯ]/.test(text)
