export function verifyObjectKeysAreDefined(obj: Record<string, any>): boolean {
  for (const key in obj) {
    if (obj[key] === undefined) {
      return false;
    }
  }
  return true;
}
