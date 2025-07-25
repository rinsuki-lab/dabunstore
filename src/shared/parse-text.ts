import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import remarkGfm from "remark-gfm"
import remarkBreaks from "remark-breaks"
import { findAndReplace } from "mdast-util-find-and-replace"
import rehypeRaw from "rehype-raw"
import type { Nodes } from "mdast"

const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkBreaks)
    .use(() => (tree: Nodes) => findAndReplace(tree, [
        [
            /(?<=(?:^|[\n\s]))@([a-zA-Z0-9\.]+)/g,
            (text, name) => {
                return {
                    type: "link",
                    url: `/inbox/${name}`,
                    children: [
                        { type: "text", value: text }
                    ]
                }
            },
        ],
        [
            /(?<=(?:^|[\n\s]+))#([\S]+)/g,
            (text, tag) => {
                return {
                    type: "link",
                    url: "/tag/" + encodeURIComponent(tag),
                    children: [{
                        type: "text",
                        value: text,
                    }]
                }
            }
        ]
    ]))
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)

export function parseText(input: string) {
    return processor.runSync(processor.parse(input))
}