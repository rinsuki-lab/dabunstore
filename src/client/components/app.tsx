import { NewPost } from "./new-post.js"
import { Timeline } from "./timeline.js"

import "./app.css"

export const App: React.FC = () => {
    return <div id="app">
        <Timeline />
        <NewPost />
    </div>
}