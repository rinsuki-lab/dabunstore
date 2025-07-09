import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "./client.js";

export const useCreateNewPost = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (data: { content: string }) => {
            const response = await client.v1.posts.$post({
                json: data,
            });
            if (!response.ok) {
                throw new Error("Failed to create new post");
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        }
    });
}
