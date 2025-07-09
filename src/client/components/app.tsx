import { NewPost } from "./new-post.js"
import { Timeline } from "./Timeline.js"

export const App: React.FC = () => {
    return <div>
        <NewPost />
        <Timeline />
    </div>
}