'use client'

import { Box, Container, Typography, Grid, Button, Chip } from '@mui/material'
import { Bebas_Neue, Inter, JetBrains_Mono } from 'next/font/google'

/* ---------- Type system (shared with /about) ---------- */
const display = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
})
const body = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
})
const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
})

/* ---------- Tokens (shared with /about) ---------- */
const ink = '#14120F'
const paper = '#FAF7F2'
const line = '#DAD5C9'
const dripBlue = '#2A4DFF'
const dripOrange = '#FF5B2E'

const JOBS = [
  { title: 'Frontend Developer', location: 'Remote / India', type: 'FULL-TIME', dept: 'ENGINEERING' },
  { title: 'UI/UX Designer', location: 'Bangalore', type: 'FULL-TIME', dept: 'DESIGN' },
  { title: 'Backend Developer', location: 'Remote', type: 'FULL-TIME', dept: 'ENGINEERING' },
  { title: 'Marketing Executive', location: 'Delhi', type: 'PART-TIME', dept: 'GROWTH' },
]

/* Signature element, reused from /about: the drip edge seam */
function DripEdge({ color = dripBlue, flip = false }) {
  return (
    <Box
      component="svg"
      viewBox="0 0 400 40"
      preserveAspectRatio="none"
      sx={{
        display: 'block',
        width: '100%',
        height: { xs: 20, md: 32 },
        transform: flip ? 'scaleY(-1)' : 'none',
      }}
    >
      <path
        d="M0,0 H400 V14
           C 385,14 380,34 365,34 C 350,34 348,16 335,16
           C 322,16 318,30 305,30 C 292,30 290,12 277,12
           C 264,12 262,38 249,38 C 236,38 233,18 220,18
           C 207,18 205,26 192,26 C 179,26 177,10 164,10
           C 151,10 148,32 135,32 C 122,32 120,15 107,15
           C 94,15 92,28 79,28 C 66,28 64,13 51,13
           C 38,13 35,24 22,24 C 12,24 6,14 0,14 Z"
        fill={color}
      />
    </Box>
  )
}

/* Patch / stamp badge, reused from /about — for Why Work With Us */
function Patch({ n, title, rotate = 0 }) {
  return (
    <Box
      sx={{
        bgcolor: ink,
        color: paper,
        borderRadius: '4px',
        p: 3,
        height: '100%',
        transform: `rotate(${rotate}deg)`,
        transition: 'transform .25s ease',
        '&:hover': { transform: 'rotate(0deg)', bgcolor: dripBlue },
      }}
    >
      <Typography className={mono.className} sx={{ fontSize: 12, opacity: 0.6, mb: 1 }}>
        {n}
      </Typography>
      <Typography className={display.className} sx={{ fontSize: 22, letterSpacing: '0.02em' }}>
        {title}
      </Typography>
    </Box>
  )
}

/* Job req styled as a ticket stub — a torn perforation
   separates the role from the "tear here to apply" action. */
function JobTicket({ job }) {
  return (
    <Box
      sx={{
        position: 'relative',
        border: `2px solid ${ink}`,
        borderRadius: '6px',
        bgcolor: paper,
        overflow: 'hidden',
        display: 'flex',
        transition: 'box-shadow .2s ease, transform .2s ease',
        '&:hover': { boxShadow: `6px 6px 0px ${dripBlue}`, transform: 'translate(-3px,-3px)' },
      }}
    >
      {/* ticket notches */}
      <Box sx={{ position: 'absolute', left: { xs: '68%', sm: 168 }, top: -10, width: 20, height: 20, borderRadius: '50%', bgcolor: paper, border: `2px solid ${ink}` }} />
      <Box sx={{ position: 'absolute', left: { xs: '68%', sm: 168 }, bottom: -10, width: 20, height: 20, borderRadius: '50%', bgcolor: paper, border: `2px solid ${ink}` }} />

      <Box sx={{ flex: 1, p: 3 }}>
        <Typography className={mono.className} sx={{ fontSize: 11, letterSpacing: '0.1em', color: dripBlue, mb: 1 }}>
          {job.dept}
        </Typography>
        <Typography className={display.className} sx={{ fontSize: 26, lineHeight: 1, mb: 1 }}>
          {job.title}
        </Typography>
        <Typography className={body.className} variant="body2" sx={{ color: '#4A463E' }}>
          {job.location}
        </Typography>
      </Box>

      <Box
        sx={{
          width: { xs: 96, sm: 140 },
          borderLeft: `2px dashed ${ink}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1.5,
          px: 1.5,
          textAlign: 'center',
        }}
      >
        <Typography className={mono.className} sx={{ fontSize: 10, letterSpacing: '0.08em', color: '#4A463E' }}>
          {job.type}
        </Typography>
        <Button
          size="small"
          sx={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.06em',
            color: ink,
            border: `1px solid ${ink}`,
            borderRadius: '2px',
            px: 1.5,
            '&:hover': { bgcolor: ink, color: paper },
          }}
        >
          APPLY →
        </Button>
      </Box>
    </Box>
  )
}

export default function CareersPage() {
  const steps = [
    { n: '01', title: 'Apply', desc: 'Send your portfolio or resume our way.' },
    { n: '02', title: 'Interview', desc: 'A real conversation, not a script.' },
    { n: '03', title: 'Assessment', desc: 'Show us how you think and build.' },
    { n: '04', title: 'Offer', desc: 'Welcome to the team — let’s ship.' },
  ]

  return (
    <Box
      className={`${display.variable} ${body.variable} ${mono.variable}`}
      sx={{ bgcolor: paper, fontFamily: 'var(--font-body)' }}
    >
      {/* ---------------- HERO ---------------- */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: '60vh', md: '78vh' },
          display: 'flex',
          alignItems: 'flex-end',
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src="/images/careers-hero.jpg"
          alt="The DripKart team at work"
          sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(20,18,15,0.15) 0%, rgba(20,18,15,0.85) 80%)',
          }}
        />
        <Container sx={{ position: 'relative', pb: { xs: 6, md: 9 }, color: paper }}>
          <Chip
            label="WE'RE HIRING"
            className={mono.className}
            sx={{
              bgcolor: 'transparent',
              color: dripOrange,
              border: `1px solid ${dripOrange}`,
              borderRadius: '2px',
              fontSize: 11,
              letterSpacing: '0.1em',
              mb: 3,
            }}
          />
          <Typography className={display.className} sx={{ fontSize: { xs: 48, sm: 72, md: 108 }, lineHeight: 0.9 }}>
            BUILD THE DRIP WITH US
          </Typography>
          <Typography className={body.className} sx={{ maxWidth: 480, mt: 3, fontSize: 18, color: '#E9E5DB' }}>
            We're a small crew making a big fashion label move fast. If you'd
            rather build than watch, there's a seat for you.
          </Typography>
          <Button
            href="#open-positions"
            variant="contained"
            sx={{
              mt: 4,
              bgcolor: dripBlue,
              color: paper,
              borderRadius: '2px',
              px: 4,
              py: 1.4,
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              letterSpacing: '0.08em',
              boxShadow: 'none',
              '&:hover': { bgcolor: paper, color: ink },
            }}
          >
            VIEW OPEN ROLES
          </Button>
        </Container>
      </Box>
      <DripEdge color={dripBlue} />

      {/* ---------------- CULTURE ---------------- */}
      <Container sx={{ py: { xs: 8, md: 12 } }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Typography className={mono.className} sx={{ fontSize: 13, color: dripBlue, letterSpacing: '0.12em', mb: 2 }}>
              OUR CULTURE
            </Typography>
            <Typography className={display.className} sx={{ fontSize: { xs: 30, md: 40 }, lineHeight: 1.05, color: ink }}>
              Creative freedom, held to a high bar.
            </Typography>
          </Grid>
          <Grid item xs={12} md={7}>
            <Typography className={body.className} sx={{ color: '#4A463E', fontSize: 16, lineHeight: 1.8 }}>
              We build fast, argue about details, and ship things we're
              genuinely proud to wear. Everyone here has a say in what
              DripKart looks and feels like next — we're just getting
              started, and we want people who want to leave a mark on it.
            </Typography>
          </Grid>
        </Grid>
      </Container>

      {/* ---------------- WHY WORK WITH US ---------------- */}
      <Box sx={{ bgcolor: '#F1ECE1', py: { xs: 8, md: 12 } }}>
        <Container>
          <Typography
            className={display.className}
            sx={{ fontSize: { xs: 32, md: 44 }, textAlign: 'center', mb: 6, color: ink }}
          >
            Why work with us
          </Typography>
          <Grid container spacing={3}>
            {[
              'Creative Freedom',
              'Flexible Culture',
              'Real Growth',
              'Fair Pay',
            ].map((item, i) => (
              <Grid item xs={12} sm={6} md={3} key={item}>
                <Patch n={`0${i + 1}`} title={item} rotate={i % 2 === 0 ? -1.5 : 1.5} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ---------------- OPEN POSITIONS ---------------- */}
      <Container id="open-positions" sx={{ py: { xs: 8, md: 12 } }}>
        <Typography className={mono.className} sx={{ fontSize: 13, color: dripBlue, letterSpacing: '0.12em', mb: 1 }}>
          {JOBS.length} OPEN ROLES
        </Typography>
        <Typography className={display.className} sx={{ fontSize: { xs: 32, md: 44 }, mb: 6, color: ink }}>
          Open positions
        </Typography>

        <Grid container spacing={4}>
          {JOBS.map((job) => (
            <Grid item xs={12} md={6} key={job.title}>
              <JobTicket job={job} />
            </Grid>
          ))}
        </Grid>
      </Container>

      <DripEdge color={ink} flip />

      {/* ---------------- HIRING PROCESS ---------------- */}
      <Box sx={{ bgcolor: ink, color: paper, py: { xs: 8, md: 11 } }}>
        <Container>
          <Typography className={display.className} sx={{ fontSize: { xs: 32, md: 44 }, textAlign: 'center', mb: 7 }}>
            Hiring process
          </Typography>

          <Box sx={{ position: 'relative' }}>
            <Box
              sx={{
                display: { xs: 'none', md: 'block' },
                position: 'absolute',
                top: 14,
                left: '12.5%',
                right: '12.5%',
                height: '1px',
                bgcolor: `${line}33`,
              }}
            />
            <Grid container spacing={5} textAlign="center">
              {steps.map((step) => (
                <Grid item xs={6} md={3} key={step.n}>
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      bgcolor: dripBlue,
                      mx: 'auto',
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      className: mono.className,
                      fontSize: 11,
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    <Typography className={mono.className} sx={{ fontSize: 11, color: paper }}>
                      {step.n}
                    </Typography>
                  </Box>
                  <Typography className={display.className} sx={{ fontSize: 22, mb: 0.5 }}>
                    {step.title}
                  </Typography>
                  <Typography className={body.className} variant="body2" sx={{ opacity: 0.7 }}>
                    {step.desc}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* ---------------- CTA ---------------- */}
      <Box sx={{ py: { xs: 10, md: 14 }, textAlign: 'center' }}>
        <Container>
          <Typography className={display.className} sx={{ fontSize: { xs: 38, md: 60 }, color: ink, lineHeight: 1, mb: 3 }}>
            READY TO JOIN US?
          </Typography>
          <Button
            href="#open-positions"
            variant="contained"
            sx={{
              bgcolor: dripBlue,
              color: paper,
              borderRadius: '2px',
              px: 5,
              py: 1.6,
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.08em',
              fontSize: 14,
              boxShadow: 'none',
              '&:hover': { bgcolor: ink, boxShadow: 'none' },
            }}
          >
            SEE OPEN ROLES
          </Button>
        </Container>
      </Box>
    </Box>
  )
}