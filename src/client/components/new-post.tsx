import { useEffect, useState, useRef } from "react";
import { useCreateNewPost } from "../api/use-create-new-post.js";

export const NewPost: React.FC = () => {
  const [text, setText] = useState("");
  const createNewPost = useCreateNewPost();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (createNewPost.isSuccess) {
      setText("");
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

  return (
    <form
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
          if (e.key === "Enter" && !e.shiftKey) {
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
