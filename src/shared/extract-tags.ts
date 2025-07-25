import { visit } from "unist-util-visit"
import type { Nodes } from "hast"
import { normalizeTag } from "./normalize-tag.js";

export interface ExtractedTags {
    mentions: string[]
    hashtags: Array<{ normalized: string; original: string }>
}

export function extractTags(ast: Nodes): ExtractedTags {
    const mentions: string[] = []
    const hashtags: Array<{ normalized: string; original: string }> = []
    const seenHashtags = new Set<string>()

    visit(ast, "element", (node) => {
        if (node.tagName === "a" && node.properties?.href && typeof node.properties.href === "string") {
            const href = node.properties.href
            
            if (href.startsWith("/inbox/")) {
                const mention = href.slice("/inbox/".length)
                mentions.push(mention)
            } else if (href.startsWith("/tag/")) {
                const encodedTag = href.slice("/tag/".length)
                const tag = decodeURIComponent(encodedTag)
                const normalized = normalizeTag(tag)
                
                if (!seenHashtags.has(normalized)) {
                    seenHashtags.add(normalized)
                    hashtags.push({ normalized, original: tag })
                }
            }
        }
    })

    return { mentions, hashtags }
}