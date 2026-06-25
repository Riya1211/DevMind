import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const quizApi = createApi({
  reducerPath: "quizApi",
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
    generateQuiz: builder.mutation({
      query: (data) => ({
        url: "/quiz/generate",
        method: "POST",
        body: data,
      }),
    }),

    saveQuiz: builder.mutation({
      query: (data) => ({
        url: "/quiz/save",
        method: "POST",
        body: data,
      }),
    }),

    getQuizHistory: builder.query({
      query: () => "/quiz/history",
    }),
  }),
});

export const { useGenerateQuizMutation, useSaveQuizMutation, useGetQuizHistoryQuery } = quizApi;
