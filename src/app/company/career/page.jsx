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

const JOBS = [
  {
    title: 'Frontend Developer',
    location: 'Remote / India',
    type: 'Full Time'
  },
  {
    title: 'UI/UX Designer',
    location: 'Bangalore',
    type: 'Full Time'
  },
  {
    title: 'Backend Developer',
    location: 'Remote',
    type: 'Full Time'
  },
  {
    title: 'Marketing Executive',
    location: 'Delhi',
    type: 'Part Time'
  }
]

export default function CareersPage() {
  return (
    <Box>

      {/* 🔥 HERO */}
      <Box
        sx={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(to right, #f5f5f5, #ffffff)',
          py: 8
        }}
      >
        <Container>
          <Grid container spacing={4} alignItems="center">

            <Grid item xs={12} md={6}>
              <Typography variant="h3" fontWeight="bold">
                Join the DripKart Team
              </Typography>
              <Typography mt={2} color="text.secondary">
                Build the future of fashion with us. We’re always looking for passionate creators.
              </Typography>
              <Button variant="contained" sx={{ mt: 3 }}>
                View Open Roles
              </Button>
            </Grid>

            <Grid item xs={12} md={6}>
              <img
                src="/images/careers-hero.jpg"
                alt="careers"
                style={{ width: '100%', borderRadius: '12px' }}
              />
            </Grid>

          </Grid>
        </Container>
      </Box>

      {/* 🧑‍🤝‍🧑 CULTURE */}
      <Container sx={{ py: 10 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Our Culture
        </Typography>

        <Typography color="text.secondary" maxWidth="700px">
          At DripKart, we foster creativity, innovation, and collaboration. 
          We believe in empowering individuals to express themselves and grow.
        </Typography>
      </Container>

      {/* ⭐ WHY WORK WITH US */}
      <Box sx={{ background: '#fafafa', py: 10 }}>
        <Container>
          <Typography variant="h4" fontWeight="bold" textAlign="center">
            Why Work With Us
          </Typography>

          <Grid container spacing={4} mt={4}>
            {[
              'Creative Freedom',
              'Flexible Work Culture',
              'Growth Opportunities',
              'Competitive Salary'
            ].map((item, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Card>
                  <CardContent>
                    <Typography fontWeight="bold">{item}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 💼 JOB LISTINGS */}
      <Container sx={{ py: 10 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Open Positions
        </Typography>

        <Grid container spacing={4}>
          {JOBS.map((job, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {job.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {job.location} • {job.type}
                  </Typography>

                  <Button variant="outlined" sx={{ mt: 2 }}>
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* 🔄 HIRING PROCESS */}
      <Box sx={{ background: '#000', color: '#fff', py: 10 }}>
        <Container>
          <Typography variant="h4" fontWeight="bold" textAlign="center">
            Hiring Process
          </Typography>

          <Grid container spacing={4} mt={4} textAlign="center">
            {[
              'Apply',
              'Interview',
              'Assessment',
              'Offer'
            ].map((step, i) => (
              <Grid item xs={6} md={3} key={i}>
                <Typography variant="h6">{step}</Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 🚀 CTA */}
      <Box sx={{ py: 10, textAlign: 'center' }}>
        <Container>
          <Typography variant="h4" fontWeight="bold">
            Ready to Join Us?
          </Typography>
          <Button variant="contained" sx={{ mt: 3 }}>
            Apply Now
          </Button>
        </Container>
      </Box>

    </Box>
  )
}