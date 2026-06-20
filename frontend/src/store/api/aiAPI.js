import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const aiApi = createApi({
  reducerPath: "aiApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    //AI Summary endpoint
    summariseEntry: builder.mutation({
      query: (entryId) => ({
        url: "/ai/summarise",
        method: "POST",
        body: { entryId },
      }),
    }),
    //Tag Entry
    tagEntry: builder.mutation({
      query: (data) => ({
        url: "/ai/tagEntry",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useSummariseEntryMutation, useTagEntryMutation } = aiApi;
