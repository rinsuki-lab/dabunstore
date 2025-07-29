import { useEffect, useState, useRef } from "react";
import { useCreateNewPost } from "../api/use-create-new-post.js";
import { parseText } from "../../shared/parse-text.js"
import { TreeRenderer } from "./tree-renderer.js";
import { extractTags } from "../../shared/extract-tags.js";

import "./new-post.css"

export const NewPost: React.FC = () => {
  const [text, setText] = useState("");
  const createNewPost = useCreateNewPost();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (createNewPost.isSuccess) {
      // Extract hashtags from the current text before clearing
      const ast = parseText(text);
      const { hashtags } = extractTags(ast);
      
      // Set new text with only hashtags
      const hashtagText = hashtags.map(tag => `#${tag.original}`).join(" ");
      setText(hashtagText ? hashtagText + " " : "");
      
      createNewPost.reset();
    }
  }, [createNewPost.isSuccess]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'n' && e.target === document.body) {
        e.preventDefault();
        textareaRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const adjustHeight = () => {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    };

    adjustHeight();
  }, [text]);

  return (
    <form
      className="new-post"
      onSubmit={(e) => {
        e.preventDefault();
        if (createNewPost.isPending) return;
        if (text.trim() === "") return;
        createNewPost.mutate({ content: text });
      }}
    >
      {/* TODO: show error */}
      <textarea
        ref={textareaRef}
        placeholder="Tell your world"
        value={text}
        onInput={(e) => setText(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            // Submit the form
            e.currentTarget.form?.requestSubmit();
          }
        }}
      />
      <input type="submit" disabled={createNewPost.isPending} />
    </form>
  );
};
