'use client'

import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
} from '@mui/material'

export default function AboutPage() {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(to right, #f5f5f5, #ffffff)',
          py: 8,
        }}
      >
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                About DripKart
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Confidence starts with style. We bring you curated fashion that
                defines who you are.
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <img
                src="/images/about-hero.jpg"
                alt="About DripKart"
                style={{ width: '100%', borderRadius: '12px' }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Story Section */}
      <Container sx={{ py: 10 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <img
              src="/images/about-story.jpg"
              alt="Our story"
              style={{ width: '100%', borderRadius: '12px' }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Our Story
            </Typography>
            <Typography color="text.secondary">
              DripKart was born from a passion for fashion and individuality. We
              believe clothing is more than just fabric — it's identity,
              confidence, and expression. Our goal is to bring high-quality,
              trendy, and affordable fashion to everyone.
            </Typography>
          </Grid>
        </Grid>
      </Container>

      {/* Mission & Vision */}
      <Box sx={{ bgcolor: '#fafafa', py: 10 }}>
        <Container>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h5" fontWeight="bold">
                    Our Mission
                  </Typography>
                  <Typography color="text.secondary" mt={2}>
                    To empower individuals through fashion by delivering
                    high-quality products, seamless shopping experience, and
                    trend-driven collections.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h5" fontWeight="bold">
                    Our Vision
                  </Typography>
                  <Typography color="text.secondary" mt={2}>
                    To become a globally trusted fashion brand that inspires
                    confidence and creativity in every customer.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Why Choose Us */}
      <Container sx={{ py: 10 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          gutterBottom
        >
          Why Choose Us
        </Typography>

        <Grid container spacing={4} mt={2}>
          {[
            {
              title: 'Premium Quality',
              desc: 'Carefully curated and tested products',
            },
            { title: 'Affordable Prices', desc: 'Fashion that fits your budget' },
            { title: 'Fast Delivery', desc: 'Quick and reliable shipping' },
            { title: 'Easy Returns', desc: 'Hassle-free return policy' },
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardContent>
                  <Typography fontWeight="bold">{item.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Stats */}
      <Box sx={{ bgcolor: '#000', color: '#fff', py: 8 }}>
        <Container>
          <Grid container spacing={4} textAlign="center">
            {[
              { number: '10K+', label: 'Happy Customers' },
              { number: '500+', label: 'Products' },
              { number: '50+', label: 'Brands' },
              { number: '4.8★', label: 'Average Rating' },
            ].map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Typography variant="h4" fontWeight="bold">
                  {stat.number}
                </Typography>
                <Typography>{stat.label}</Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box sx={{ py: 10, textAlign: 'center' }}>
        <Container>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Start Your Fashion Journey Today
          </Typography>
          <Button variant="contained" size="large">
            Shop Now
          </Button>
        </Container>
      </Box>
    </Box>
  )
}