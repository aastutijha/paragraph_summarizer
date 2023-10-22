import React, { useState, useEffect } from "react";
import { copy, linkIcon, loader, tick } from "../assets";
import { useGetSummaryQuery } from "../services/article"; // Import the new query

const Demo = () => {
  const [article, setArticle] = useState({
    url: "",
    summary: "",
  });
  const [allArticles, setAllArticles] = useState([]);
  const [copied, setCopied] = useState("");

  const { data, error, isLoading } = useGetSummaryQuery(article.url); // Use the new query

  // Load data from localStorage on mount
  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(
      localStorage.getItem("articles")
    );

    if (articlesFromLocalStorage) {
      setAllArticles(articlesFromLocalStorage);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const existingArticle = allArticles.find((item) => item.url === article.url);

    if (existingArticle) {
      setArticle(existingArticle);
    } else {
      // Make the API call to summarize the text
      try {
        const response = await fetch("https://paragraphsummariser.onrender.com/summarize/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: article.url }),
        });

        if (response.ok) {
          const result = await response.json();
          const newArticle = { url: article.url, summary: result.summary };
          setArticle(newArticle);
          const updatedAllArticles = [newArticle, ...allArticles];
          setAllArticles(updatedAllArticles);
          localStorage.setItem("articles", JSON.stringify(updatedAllArticles));
        } else {
          console.error("API request failed:", response.status, response.statusText);
        }
      } catch (error) {
        console.error("API request failed:", error);
      }
    }
  };

  const handleCopy = (copyUrl) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleSubmit(e);
    }
  };

  return (
    <section className="mt-16 w-full max-w-xl">
      {/* Search */}
      <div className="flex flex-col w-full gap-2">
        <form
          className="relative flex justify-center items-center"
          onSubmit={handleSubmit}
        >
          <img
            src={linkIcon}
            alt="link-icon"
            className="absolute left-0 my-2 ml-3 w-5"
          />

          <input
            placeholder="Paste the paragraph to Summarize"
            value={article.url}
            onChange={(e) => setArticle({ url: e.target.value, summary: "" })} // Clear summary on input change
            onKeyDown={handleKeyDown}
            required
            className="url_input peer"
          />
          <button
            type="submit"
            className="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700"
          >
            <p>↵</p>
          </button>
        </form>

        {/* Browse History */}
        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
          {allArticles.reverse().map((item, index) => (
            <div
              key={`link-${index}`}
              onClick={() => setArticle(item)}
              className="link_card"
            >
              <div
                className="copy_btn"
                onClick={() => handleCopy(item.url)}
              >
                <img
                  src={copied === item.url ? tick : copy}
                  alt={copied === item.url ? "tick_icon" : "copy_icon"}
                  className="w-[40%] h-[40%] object-contain"
                />
              </div>
              <p className="flex-1 font-satoshi text-blue-700 font-medium text-sm truncate">
                {item.url}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Display Result */}
      <div className="my-10 max-w-full flex justify-center items-center">
        {isLoading ? (
          <img
            src={loader}
            alt="loader"
            className="w-20 h-20 object-contain"
          />
        ) : error ? (
          <p className="font-inter font-bold text-black text-center">
            Well, that wasn't supposed to happen...
            <br />
            <span className="font-satoshi font-normal text-gray-700">
              {error.message}
            </span>
          </p>
        ) : (
          article.summary && (
            <div className="flex flex-col gap-3">
              <h2 className="font-satoshi font-bold text-gray-600 text-xl">
                Article <span className="blue_gradient">Summary</span>
              </h2>
              <div className="summary_box">
                <p className="font-inter font-medium text-sm text-gray-700">
                  {article.summary}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default Demo;
