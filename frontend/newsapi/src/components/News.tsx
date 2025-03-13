"use client"
import { useEffect, useState } from "react";
import Image from "next/image";
import { Box, Card, CardContent, Typography, Button, Grid, Chip, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import axios from "axios";

const tags = ["Technology", "Travel", "Food"];

export const News = () => {
  const [newsArticles, setNewsArticles] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [currentNews, setCurrentNews] = useState<any>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get("https://newslist-bice.vercel.app/api/v1/news", { params: { page: 1 } });
        setNewsArticles(response.data.data);
      } catch (error) {
        console.error("Error fetching news articles:", error);
      }
    };

    fetchNews();
  }, []);

  const handleOpenModal = async (id: string) => {
    try {
      const response = await axios.get(`https://newslist-bice.vercel.app/api/v1/news/${id}`);
      setCurrentNews(response.data.data);
      setOpenModal(true);
    } catch (error) {
      console.error("Error fetching article:", error);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentNews(null);
  };

  return (
    <main>
      <Box sx={{ maxWidth: "1200px", margin: "0 auto", padding: 2 }}>
        <Grid container spacing={4}>
          {/* News Articles */}
          <Grid item xs={12} md={8}>
            {newsArticles.map((news) => (
              <Card key={news._id} sx={{ marginBottom: 3, boxShadow: 3, borderRadius: 2 }}>
                <img
                  src={news.image[0]}
                  alt={news.title}
                  width={800}
                  height={450}
                  style={{
                    width: "100%",
                    height: "auto",
                    borderTopLeftRadius: "8px",
                    borderTopRightRadius: "8px",
                  }}
                />
                <CardContent>
                  <Typography variant="h6" component="h2" sx={{ fontWeight: "bold", color: "text.primary" }}>
                    {news.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", marginTop: 2 }}>
                    {news.excerpt || news.text.slice(0, 150)}
                  </Typography>
                  <Button
                    onClick={() => handleOpenModal(news._id)}
                    sx={{
                      marginTop: 2,
                      color: "primary.main",
                      textTransform: "none",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    Read More →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Card sx={{ padding: 2, boxShadow: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
                Tags
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {tags.map((tag, idx) => (
                  <Chip
                    key={idx}
                    label={tag}
                    variant="outlined"
                    sx={{
                      padding: "6px 12px",
                      backgroundColor: "background.paper",
                      cursor: "pointer",
                      "&:hover": { backgroundColor: "primary.light" },
                    }}
                  />
                ))}
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Modal to Display Full Article */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="lg" fullWidth>
        <DialogTitle>{currentNews?.title}</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ color: "text.primary" }}>
            {currentNews?.text}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </main>
  );
};
