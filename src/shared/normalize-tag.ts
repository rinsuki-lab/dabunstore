export function normalizeTag(input: string) {
    return input.normalize("NFKC").toLowerCase()
}
