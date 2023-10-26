import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const articleApi = createApi({
  reducerPath: "articleApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://paragraphsummariser-pcpu.onrender.com/",
  }),
  endpoints: (builder) => ({
    getSummary: builder.query({
      query: (text) => ({
        url: `/summarize/`,
        method: "POST",
        body: new URLSearchParams({ text }).toString(), // Convert to x-www-form-urlencoded
        headers: {
          "Content-Type": "application/x-www-form-urlencoded", // Set the content type
        },
      }),
    }),
  }),
});


export const { useGetSummaryQuery } = articleApi;

