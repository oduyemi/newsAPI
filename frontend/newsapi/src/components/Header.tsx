"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Button, useMediaQuery, useTheme } from "@mui/material";
import { FaBars, FaChevronDown, FaTimes } from "react-icons/fa";

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backdropFilter: "blur(10px)",
        backgroundColor: hasScrolled ? "rgba(0, 0, 0, 0.8)" : "black",
        boxShadow: hasScrolled ? 3 : 0,
        padding: isMobile ? "10px" : "20px",
        transition: "all 0.3s ease",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Logo */}
        <Link href="/" passHref>
          <Button sx={{ color: "white", fontWeight: "bold", fontSize: "1.5rem" }}>
            NewsList
          </Button>
        </Link>

        {/* Mobile Menu Button */}
        {isMobile && (
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={toggleMobileMenu}
            sx={{ fontSize: "2rem" }}
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </IconButton>
        )}

        {/* Desktop Navigation */}
        {!isMobile && (
          <div>
            <Button sx={{ color: "white", fontWeight: "medium", marginRight: "1rem" }}>
              <Link href="/news/single-news">Single News</Link>
            </Button>

            {/* Filters Dropdown */}
            <Button
              sx={{ color: "white", fontWeight: "medium", marginRight: "1rem" }}
              onClick={handleMenuOpen}
              endIcon={<FaChevronDown />}
            >
              Filters
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              MenuListProps={{ "aria-labelledby": "filters-menu-button" }}
            >
              <MenuItem onClick={handleMenuClose}>
                <Link href="/news/filter/tag" passHref>
                  Tags
                </Link>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <Link href="/news/filter/statistics" passHref>
                  Statistics
                </Link>
              </MenuItem>
            </Menu>

            {/* Login/Register */}
            <Button sx={{ color: "white", fontWeight: "medium", marginRight: "1rem" }}>
              <Link href="/login">Login</Link>
            </Button>
            <Button sx={{ color: "teal", fontWeight: "medium" }}>
              <Link href="/register">Register</Link>
            </Button>
          </div>
        )}
      </Toolbar>

      {/* Mobile Menu */}
      {isMobile && isMobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "75%",
            height: "100%",
            backgroundColor: "black",
            zIndex: 100,
            padding: "20px",
            boxShadow: "2px 0px 10px rgba(0,0,0,0.3)",
            transform: isMobileMenuOpen ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 0.3s ease-in-out",
          }}
        >
          <IconButton
            edge="end"
            color="inherit"
            aria-label="close menu"
            onClick={toggleMobileMenu}
            sx={{ fontSize: "2rem", marginBottom: "1rem" }}
          >
            <FaTimes />
          </IconButton>

          <div>
            <Button sx={{ color: "white", fontWeight: "medium", marginBottom: "1rem" }}>
              <Link href="/news/single-news">Single News</Link>
            </Button>

            {/* Filters Dropdown */}
            <Button
              sx={{ color: "white", fontWeight: "medium", marginBottom: "1rem" }}
              onClick={handleMenuOpen}
              endIcon={<FaChevronDown />}
            >
              Filters
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              MenuListProps={{ "aria-labelledby": "filters-menu-button" }}
            >
              <MenuItem onClick={handleMenuClose}>
                <Link href="/news/filter/tag" passHref>
                  Tags
                </Link>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <Link href="/news/filter/statistics" passHref>
                  Statistics
                </Link>
              </MenuItem>
            </Menu>

            {/* Login/Register */}
            <Button sx={{ color: "white", fontWeight: "medium", marginBottom: "1rem" }}>
              <Link href="/login">Login</Link>
            </Button>
            <Button sx={{ color: "teal", fontWeight: "medium" }}>
              <Link href="/register">Register</Link>
            </Button>
          </div>
        </div>
      )}
    </AppBar>
  );
};
