import { DiscussionService } from "@/services";
import { useQuery } from "@tanstack/react-query";

// React Query hook to fetch discussions
export const useFetchDiscussionsByCommonId = (commonId: string) => {
    return useQuery(
      ["allDiscussion", commonId], // queryKey based on commonId
      () => DiscussionService.getDiscussionsByCommonId(commonId), // Query function that calls Firestore
      {
        cacheTime: 5 * 60 * 1000, // Cache time set to 5 minutes (300,000 milliseconds)
      }
    );
  };