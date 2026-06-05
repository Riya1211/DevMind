import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",    // unique key in Redux store
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api", // your backend URL
  }),

  endpoints: (builder) => ({
    // REGISTER endpoint
    register: builder.mutation({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,   // { name, email, password }
      }),
    }),

    // LOGIN endpoint
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,  // { email, password }
      }),
    }),
  }),
});

// RTK Query auto-generates these hooks from your endpoints
export const { useRegisterMutation, useLoginMutation } = authApi;