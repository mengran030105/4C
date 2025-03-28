export function loadJSON(json: unknown) {
  return JSON.parse(JSON.stringify(json))
}