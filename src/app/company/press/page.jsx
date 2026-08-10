'use client'

import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button
} from '@mui/material'

const PRESS_DATA = [
  {
    title: 'DripKart Revolutionizing Online Fashion',
    source: 'Fashion Times',
    date: 'July 2026'
  },
  {
    title: 'Top 10 Emerging E-commerce Brands',
    source: 'Startup Daily',
    date: 'June 2026'
  },
  {
    title: 'How DripKart is Empowering Style',
    source: 'Style Magazine',
    date: 'May 2026'
  }
]

export default function PressPage() {
  return (
    <Box>

      {/* 🔥 HERO */}
      <Box
        sx={{
          minHeight: '50vh',
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(to right, #f5f5f5, #ffffff)',
          py: 8
        }}
      >
        <Container>
          <Typography variant="h3" fontWeight="bold">
            Press & Media
          </Typography>
          <Typography mt={2} color="text.secondary">
            See what the world is saying about DripKart.
          </Typography>
        </Container>
      </Box>

      {/* 📰 PRESS ARTICLES */}
      <Container sx={{ py: 10 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Latest Coverage
        </Typography>

        <Grid container spacing={4}>
          {PRESS_DATA.map((item, i) => (
            <Grid item xs={12} md={4} key={i}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {item.title}
                  </Typography>
                  <Typography color="text.secondary" mt={1}>
                    {item.source} • {item.date}
                  </Typography>

                  <Button variant="outlined" sx={{ mt: 2 }}>
                    Read Article
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* 🏆 FEATURED IN */}
      <Box sx={{ background: '#fafafa', py: 10 }}>
        <Container>
          <Typography variant="h4" fontWeight="bold" textAlign="center">
            Featured In
          </Typography>

          <Grid container spacing={4} mt={4} textAlign="center">
            {['Vogue', 'Forbes', 'Elle', 'GQ'].map((brand, i) => (
              <Grid item xs={6} md={3} key={i}>
                <Typography variant="h6">{brand}</Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 📦 MEDIA KIT */}
      <Container sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight="bold">
          Media Kit
        </Typography>
        <Typography color="text.secondary" mt={2}>
          Download our logos, brand assets, and press resources.
        </Typography>

        <Button variant="contained" sx={{ mt: 3 }}>
          Download Media Kit
        </Button>
      </Container>

      {/* 📧 CONTACT */}
      <Box sx={{ background: '#000', color: '#fff', py: 10, textAlign: 'center' }}>
        <Container>
          <Typography variant="h4" fontWeight="bold">
            Press Inquiries
          </Typography>
          <Typography mt={2}>
            media@dripkart.com
          </Typography>

          <Button variant="outlined" sx={{ mt: 3, color: '#fff', borderColor: '#fff' }}>
            Contact Us
          </Button>
        </Container>
      </Box>

    </Box>
  )
}