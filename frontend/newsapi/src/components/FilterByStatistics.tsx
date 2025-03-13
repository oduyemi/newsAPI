"use client";
import { useState, useEffect } from "react";
import { Button, TextField, Typography, Grid, Card, CardContent } from "@mui/material";

const NEWS_API_URL = "https://newslist-bice.vercel.app/api/v1/news";

interface NewsItem {
  _id: any;
  title: string;
  views: number;
  text: string;
  image: string[];
}


export const FilterByStatistics = () => {
  const [newsArticles, setNewsArticles] = useState<NewsItem[]>([]);
  const [minViews, setMinViews] = useState(0);
  const [page, setPage] = useState(1);
  const [totalNews, setTotalNews] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNews(page);
  }, [page]);

  const fetchNews = async (pageNumber:number) => {
    setLoading(true);
    try {
      const response = await fetch(`${NEWS_API_URL}?page=${pageNumber}`);
      const data = await response.json();
      if (data.success) {
        setNewsArticles((prevNews) => [...prevNews, ...data.data]);
        setTotalNews(data.total);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (newsArticles.length < totalNews) {
      setPage(page + 1);
    }
  };

  const filteredNews = newsArticles
    .filter((news) => news.views >= minViews)
    .sort((a, b) => b.views - a.views);

  return (
    <main className="container mx-auto mt-8 px-4">
      {/* Filter Section */}
      <div style={{ padding: '1.5rem', textAlign: 'center', borderRadius: '8px', backgroundColor: '#1f1f1f' }}>
        <Typography variant="h5" sx={{ color: 'white', marginBottom: 2 }}>
          Filter News by View Counts
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
          <Typography variant="body1" sx={{ color: 'gray' }}>
            Minimum Views:
          </Typography>
          <TextField
            type="number"
            value={minViews}
            onChange={(e) => setMinViews(Number(e.target.value))}
            variant="outlined"
            sx={{ width: '6rem', textAlign: 'center' }}
          />
          <Button onClick={() => setMinViews(0)} variant="contained" sx={{ backgroundColor: '#00695c' }}>
            Reset
          </Button>
        </div>
      </div>

      {/* News List */}
      <Grid container spacing={3} sx={{ marginTop: 3 }}>
        {filteredNews.map((news) => (
          <Grid item xs={12} sm={6} md={4} key={news._id}>
            <Card>
            <img 
              src={news.image.length > 0 ? news.image[0] : "/placeholder.jpg"} 
              alt={news.title} 
              width={400} 
              height={250} 
            />
              <CardContent>
                <Typography variant="h6">{news.title}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {news.text.substring(0, 100)}...
                </Typography>
                <Typography variant="caption">Views: {news.views}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Load More Button */}
      {newsArticles.length < totalNews && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Button onClick={loadMore} variant="contained" disabled={loading}>
            {loading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </main>
  );
};
