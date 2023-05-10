export function matchRegexAndReplace(
  text: string,
  regexString: string,
  replaceString: string
) {
  const pattern = new RegExp(regexString, 'g');
  return text.replace(pattern, replaceString);
}
