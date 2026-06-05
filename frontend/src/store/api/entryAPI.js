import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const entryApi = createApi({
  reducerPath: "entryApi",
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

  tagTypes: ["Entries"],

  endpoints: (builder) => ({
    getEntries: builder.query({
      query: () => "/entries",
      providesTags: ["Entries"],
    }),

    getSingleEntry: builder.query({
      query: (id) => `/entries/${id}`,
      providesTags: (result, error, id) => [{ type: "Entries", id }],
    }),
    getStats: builder.query({
      query: () => ({
        url: "/entries/stats",
        method: "GET",
      }),
    }),

    createEntry: builder.mutation({
      query: (data) => ({
        url: "/entries",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Entries"],
    }),

    updateEntry: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/entries/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Entries",
        { type: "Entries", id },
      ],
    }),
  }),
});

export const {
  useGetEntriesQuery,
  useGetSingleEntryQuery,
  useGetStatsQuery,
  useCreateEntryMutation,
  useUpdateEntryMutation,
} = entryApi;
