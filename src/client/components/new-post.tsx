import { useState } from "react";

export const NewPost: React.FC = () => {
  const [text, setText] = useState("");

  return (
    <form onSubmit={e => {
        e.preventDefault();
        // TODO: submit the post
        setText(""); // STUB: clear the textarea after submission
    }}>
      <textarea
        placeholder="Tell your world"
        value={text}
        onInput={(e) => setText(e.currentTarget.value)}
        onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                // Submit the form
                e.currentTarget.form?.requestSubmit();
            }
        }}
      />
      <input type="submit" />
    </form>
  );
};
