export function getNested(source, path) {
  if (!path) return undefined;

  const segments = path.split(".");
  let current = source;

  for (const segment of segments) {
    if (current == null) return undefined;
    current = current[segment];
  }

  return current;
}
