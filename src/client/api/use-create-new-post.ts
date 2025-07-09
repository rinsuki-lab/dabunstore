import { useMutation } from "@tanstack/react-query";
import { client } from "./client.js";

export const useCreateNewPost = () => useMutation({
    mutationFn: async (data: { content: string }) => {
        const response = await client.v1.posts.$post(data);
        if (!response.ok) {
            throw new Error("Failed to create new post");
        }
    },
    onSuccess: () => {
        // TODO: remove posts timeline cache
    }
})
