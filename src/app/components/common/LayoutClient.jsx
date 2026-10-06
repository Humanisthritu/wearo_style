
"use client";

import { useCallback, useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import { getSession } from "@/utils/auth";
import Footer from "../layout/Footer";



const DynamicComponentTopbar = dynamic(
  () => import("../layout/Navbar"),
  {
    ssr: false,
  }
);

const DynamicComponentFooter = dynamic(
  () => import("../layout/Footer"),
  {
    ssr: false,
  }
);

const LayoutClient = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const [hideSidebarMenu, setHideSidebarMenu] = useState(false);
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const login = localStorage.getItem('dripkart_session')
    if (!login) {
      router.push('/login')
    }
    setIsLoading(false);
  }, [])


  const pathname = usePathname();

  const checkAuth = useCallback(() => {
    try {
      const session = getSession();

      setIsLoggedIn(!!session);
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    checkAuth();
  }, [pathname, checkAuth]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "dripkart_session") {
        checkAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [checkAuth]);


  const showNavigation = isLoggedIn 

  // Loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <>

      <div style={{ boxSizing: "border-box" }}>
        {/* TOPBAR */}
          {showNavigation && (
            <DynamicComponentTopbar
              hideSidebarMenu={hideSidebarMenu}
              toggle={toggle}
              setToggle={setToggle}
            />
          )}

        <div
          className="app"
          style={{
            display: "flex",
            position: "relative",
            paddingTop: showNavigation ? "4rem" : "0rem",
          }}
        >

          {/* PAGE CONTENT */}
          <Box
            sx={{
              width: "100%",
              marginLeft: {
                xs: "0px",
                md: showNavigation ? "20px" : "0rem",
              },
              overflowY: showNavigation ? "auto" : "hidden",
            }}
          >
            {children}
          </Box>
        </div>
          {showNavigation && (
            <DynamicComponentFooter
              hideSidebarMenu={hideSidebarMenu}
              toggle={toggle}
              setToggle={setToggle}
            />
          )}

      </div>
    </>
  );
};

export default LayoutClient;

