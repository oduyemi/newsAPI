"use client";
import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, CardMedia, Typography, Button } from "@mui/material";
import axios from "axios";

interface NewsPostProps {
  title: string;
  img: string;
  excerpt: string;
  link: string;
}

const NewsPost: React.FC<NewsPostProps> = ({ title, img, excerpt, link }) => {
  return (
    <Card sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, boxShadow: 3 }}>
      {/* Image */}
      <CardMedia
        component="img"
        sx={{
          width: { xs: "100%", md: 250 },
          height: { xs: 200, md: "auto" },
          objectFit: "cover",
        }}
        image={img}
        alt={title}
      />
      
      {/* Content */}
      <Box sx={{ flex: 1, padding: 2 }}>
        <CardContent>
          <Typography variant="h6" component="h2" sx={{ fontWeight: "bold", marginBottom: 1 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
            {excerpt}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            href={link}
            sx={{
              textTransform: "none",
              fontWeight: "medium",
              "&:hover": { backgroundColor: "#02848b" },
            }}
          >
            Read More →
          </Button>
        </CardContent>
      </Box>
    </Card>
  );
};

const RandomNewsPost = () => {
  const [randomPost, setRandomPost] = useState<any>(null);

  useEffect(() => {
    const fetchRandomNews = async () => {
      try {
        // Fetch news data (for page 1, 3 news items)
        const response = await axios.get("https://newslist-bice.vercel.app/api/v1/news", { params: { page: 1 } });
        const news = response.data.data;

        // Randomly select a news item
        const randomIndex = Math.floor(Math.random() * news.length);
        setRandomPost(news[randomIndex]);
      } catch (error) {
        console.error("Error fetching random news post:", error);
      }
    };

    fetchRandomNews();
  }, []);

  if (!randomPost) return <Typography variant="body2">Loading...</Typography>;

  return (
    <NewsPost
      title={randomPost.title}
      img={randomPost.image[0]}
      excerpt={randomPost.excerpt || randomPost.text.slice(0, 150)}
      link={`/news/${randomPost._id}`}
    />
  );
};

export default RandomNewsPost;
