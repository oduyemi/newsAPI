"use client";
import { useState } from "react";
import Image from "next/image";
import { Button, Chip, Container, Grid, Typography, Paper, CircularProgress } from "@mui/material";

const tags = ["Technology", "Travel", "Food"];

export const TagFilter = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showNews, setShowNews] = useState(false);
  const [newsArticles, setNewsArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle tag selection (multi-select)
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const tagMapping: Record<string, string> = {
    technology: "67d31859d1af548fbd7599c9", 
    travel: "67d318a1d1af548fbd7599ca",
    food: "67d318b2d1af548fbd7599cb",
  };
  

  // Fetch news by selected tag
  const fetchNews = async () => {
    if (selectedTags.length === 0) return;
  
    setLoading(true);
    setError("");
    setNewsArticles([]);
  
    try {
      const responses = await Promise.all(
        selectedTags.map((tag) =>
          fetch(`https://newslist-bice.vercel.app/api/v1/news/tag/${tagMapping[tag.toLowerCase()]}`)
            .then((res) => res.json())
        )
      );
  
      console.log("API Responses:", responses); 
  
      const newsData = responses
        .filter((res) => res.success)
        .flatMap((res) => res.data || []);
  
      setNewsArticles(newsData);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load news. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ mt: 8, px: 4 }}>
      {/* Tag Selection */}
      {!showNews && (
        <Paper sx={{ p: 4, textAlign: "center", backgroundColor: "#f5f5f5" }}>
          <Typography variant="h6" sx={{ mb: 4 }}>
            Select Tags to View News
          </Typography>
          <div>
            {tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onClick={() => toggleTag(tag)}
                clickable
                color={selectedTags.includes(tag) ? "primary" : "default"}
                sx={{ margin: "0.5rem" }}
              />
            ))}
          </div>
          <Button
            variant="contained"
            sx={{ mt: 4 }}
            onClick={() => {
              setShowNews(true);
              fetchNews();
            }}
            disabled={selectedTags.length === 0}
          >
            View News
          </Button>
        </Paper>
      )}

      {/* News List */}
      {showNews && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
            <Typography variant="h5">News from Selected Tags</Typography>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                setSelectedTags([]);
                setShowNews(false);
              }}
            >
              Clear Selection
            </Button>
          </div>

          {loading ? (
            <CircularProgress sx={{ display: "block", margin: "2rem auto" }} />
          ) : error ? (
            <Typography color="error" textAlign="center">{error}</Typography>
          ) : (
            <Grid container spacing={4}>
              {newsArticles.length > 0 ? (
                newsArticles.map((news) => (
                  <Grid item xs={12} md={6} lg={4} key={news._id}>
                    <Paper sx={{ p: 4, boxShadow: 3 }}>
                      <Image
                        src={news.image || "/images/default-news.jpg"}
                        alt={news.title}
                        width={800}
                        height={450}
                        style={{
                          width: "100%",
                          height: "auto",
                          borderRadius: "8px",
                          transition: "transform 0.3s",
                        }}
                      />
                      <Typography variant="h6" sx={{ mt: 2 }}>
                        {news.title}
                      </Typography>
                      <Typography sx={{ mt: 1, color: "text.secondary" }}>
                        {news.excerpt || "No excerpt available."}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
                        Tag: {news.tagId?.name || "Unknown"}
                      </Typography>
                    </Paper>
                  </Grid>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", width: "100%" }}>
                  No news found.
                </Typography>
              )}
            </Grid>
          )}
        </div>
      )}
    </Container>
  );
};
