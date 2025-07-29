import type { Root, RootContent } from "hast"

export const TreeRenderer: React.FC<{tree: Root | RootContent}> = (props) => {
    switch (props.tree.type) {
    case "comment":
    case "doctype":
    case "raw":
        return null
    case "text":
        return props.tree.value
    }
    const child = props.tree.children.map((child, i) => {
        return <TreeRenderer tree={child} key={i}/>
    })


    switch (props.tree.type) {
    case "root":
        return <div className="tree-root">{child}</div>
    case "element":
        switch (props.tree.tagName) {
        case "a": {
            const hrefRaw = props.tree.properties.href
            const href = typeof hrefRaw === "string" ? hrefRaw : undefined // TODO: validate href (e.g. javascript:)
            return <a href={href}>{child}</a>
        }
        case "p":
            return <p>{child}</p>
        case "ul":
            return <ul>{child}</ul>
        case "li":
            return <li>{child}</li>
        case "code":
            return <code>{child}</code>
        case "br":
            return <br />
        default:
            return <div><strong>UNKNOWN TAG: {props.tree.tagName}</strong>{child}</div>
        }
    }
}