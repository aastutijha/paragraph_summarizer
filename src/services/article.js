import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const articleApi = createApi({
  reducerPath: "articleApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://paragraphsummariser.onrender.com/",
  }),
  endpoints: (builder) => ({
    getSummary: builder.query({
      query: (text) => ({
        url: `/summarize/`,
        method: "POST",
        body: { text },
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
  }),
});

export const { useGetSummaryQuery } = articleApi;

