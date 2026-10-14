'use client'

import { Box, Container, Typography, Grid, Button, Chip } from '@mui/material'
import { Bebas_Neue, Inter, JetBrains_Mono } from 'next/font/google'

/* ---------- Type system ---------- */
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

/* ---------- Tokens ---------- */
const ink = '#14120F'
const paper = '#FAF7F2'
const line = '#DAD5C9'
const dripBlue = '#8e4440'
const dripOrange = '#FF5B2E'

/* ---------- Signature element: the drip edge ----------
   A repeating paint-drip silhouette used as the seam between
   every section — the one motif this page is built around. */
function DripEdge({ color = dripBlue, background = paper, flip = false }) {
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

/* Swing-tag shaped card — used for Mission / Vision */
function SwingTag({ label, title, text, rotate = 0 }) {
  return (
    <Box
      sx={{
        position: 'relative',
        bgcolor: paper,
        border: `2px solid ${ink}`,
        borderRadius: '4px',
        p: { xs: 3, md: 4 },
        pt: 5,
        transform: `rotate(${rotate}deg)`,
        transition: 'transform .25s ease',
        '&:hover': { transform: `rotate(0deg) translateY(-4px)` },
      }}
    >
      {/* die-cut hole + string, like an actual garment tag */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          left: 20,
          width: 14,
          height: 14,
          borderRadius: '50%',
          border: `2px solid ${ink}`,
          bgcolor: paper,
        }}
      />
      <Typography
        className={mono.className}
        sx={{
          position: 'absolute',
          top: 18,
          right: 20,
          fontSize: 11,
          letterSpacing: '0.12em',
          color: dripBlue,
        }}
      >
        {label}
      </Typography>
      <Typography
        className={display.className}
        sx={{ fontSize: { xs: 28, md: 34 }, lineHeight: 1, mb: 1.5 }}
      >
        {title}
      </Typography>
      <Typography className={body.className} sx={{ color: '#4A463E' }}>
        {text}
      </Typography>
    </Box>
  )
}

/* Patch / stamp badge — used for Why Choose Us */
function Patch({ n, title, desc, rotate = 0 }) {
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
      <Typography className={display.className} sx={{ fontSize: 22, letterSpacing: '0.02em', mb: 1 }}>
        {title}
      </Typography>
      <Typography className={body.className} variant="body2" sx={{ opacity: 0.85 }}>
        {desc}
      </Typography>
    </Box>
  )
}

export default function AboutPage() {
  return (
    <Box
      className={`${display.variable} ${body.variable} ${mono.variable}`}
      sx={{ bgcolor: paper, fontFamily: 'var(--font-body)' }}
    >
      {/* ---------------- HERO ---------------- */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: '70vh', md: '86vh' },
          display: 'flex',
          alignItems: 'flex-end',
          overflow: 'hidden',
        }}
      >
        <Box
          src="https://media.istockphoto.com/id/1402604850/photo/the-word-about-us-on-wooden-cubes-business-communication-and-information.jpg"
          alt="DripKart pieces styled on the street"
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(180deg, rgba(20,18,15,0.15) 0%, rgba(20,18,15,0.85) 78%)`,
          }}
        />
        <Container sx={{ position: 'relative', pb: { xs: 6, md: 10 }, color: paper }}>
          <Chip
            label="EST. 2019 — INDEPENDENT STREETWEAR"
            className={mono.className}
            sx={{
              bgcolor: 'transparent',
              color: dripBlue,
              border: `1px solid ${dripBlue}`,
              borderRadius: '2px',
              fontSize: 11,
              letterSpacing: '0.1em',
              mb: 3,
            }}
          />
          <Typography
            className={display.className}
            sx={{
              fontSize: { xs: 56, sm: 80, md: 128 },
              lineHeight: 0.9,
              letterSpacing: '0.01em',
            }}
          >
            OWN YOUR DRIP
          </Typography>
          <Typography
            className={body.className}
            sx={{ maxWidth: 480, mt: 3, fontSize: 18, color: '#E9E5DB' }}
          >
            DripKart is fashion built for the way you actually move — curated
            pieces that let confidence do the talking.
          </Typography>
        </Container>
      </Box>
      <DripEdge color={dripBlue} background={paper} />

      {/* ---------------- STORY ---------------- */}
      <Container sx={{ py: { xs: 8, md: 12 } }}>
        <Grid container spacing={{ xs: 5, md: 8 }} alignItems="center">
          <Grid item xs={12} md={5}>
            <Box sx={{ position: 'relative' }}>
              <Box
                component="img"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTt2Ei7mIKwyUv2Li1kDTjJ1JuC2GG9X5uE29v0dknmw4jt0VuH2I3YxNzp&s=10"
                alt="First DripKart collection in production"
                sx={{ width: '100%', borderRadius: '4px', display: 'block' }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -18,
                  left: -18,
                  bgcolor: dripOrange,
                  color: ink,
                  px: 2,
                  py: 1,
                  borderRadius: '2px',
                  transform: 'rotate(-4deg)',
                }}
              >
                <Typography className={mono.className} sx={{ fontSize: 12, letterSpacing: '0.08em' }}>
                  FIRST DROP · 2019
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={7}>
            <Typography className={mono.className} sx={{ fontSize: 13, color: dripBlue, letterSpacing: '0.12em', mb: 2 }}>
              OUR STORY
            </Typography>
            <Typography
              className={display.className}
              sx={{ fontSize: { xs: 32, md: 44 }, lineHeight: 1.05, mb: 3, color: ink }}
            >
              Started with one hoodie and a stubborn belief that clothes should say something.
            </Typography>
            <Typography className={body.className} sx={{ color: '#4A463E', fontSize: 16, lineHeight: 1.8 }}>
              We printed our first run in a garage, sold it out of a backpack,
              and never stopped chasing that feeling. Today DripKart works with
              independent makers to bring quality, trend-driven pieces to
              anyone who wants their outfit to feel like them.
            </Typography>
          </Grid>
        </Grid>
      </Container>

      {/* ---------------- MISSION / VISION ---------------- */}
      <Box sx={{ bgcolor: '#F1ECE1', py: { xs: 8, md: 12 } }}>
        <Container>
          <Grid container spacing={5}>
            <Grid item xs={12} md={6}>
              <SwingTag
                label="MISSION"
                title="Fashion that fits how you actually live."
                text="High-quality pieces, a shopping experience with zero friction, and collections that move as fast as the culture does."
                rotate={-2}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <SwingTag
                label="VISION"
                title="A closet full of confidence, worldwide."
                text="We're building toward a global label people trust — one that inspires people to dress like themselves, not like an algorithm."
                rotate={2}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ---------------- WHY CHOOSE US ---------------- */}
      <Container sx={{ py: { xs: 8, md: 12 } }}>
        <Typography className={mono.className} sx={{ fontSize: 13, color: dripBlue, letterSpacing: '0.12em', mb: 1, textAlign: 'center' }}>
          THE FINE PRINT
        </Typography>
        <Typography
          className={display.className}
          sx={{ fontSize: { xs: 34, md: 46 }, textAlign: 'center', mb: 6, color: ink }}
        >
          Why shop with us
        </Typography>

        <Grid container spacing={3}>
          {[
            { title: 'Premium Quality', desc: 'Every piece is tested before it ever ships.' },
            { title: 'Fair Prices', desc: 'Fashion that respects your budget, not just your feed.' },
            { title: 'Fast Delivery', desc: 'Quick, tracked shipping — no guessing games.' },
            { title: 'Easy Returns', desc: "Didn't land right? Send it back, no hassle." },
          ].map((item, i) => (
            <Grid item xs={12} sm={6} md={3} key={item.title}>
              <Patch
                n={`0${i + 1}`}
                title={item.title}
                desc={item.desc}
                rotate={i % 2 === 0 ? -1.5 : 1.5}
              />
            </Grid>
          ))}
        </Grid>
      </Container>

      <DripEdge color={ink} background={paper} flip />

      {/* ---------------- STATS ---------------- */}
      <Box sx={{ bgcolor: ink, color: paper, py: { xs: 8, md: 10 } }}>
        <Container>
          <Grid container spacing={4} textAlign="center">
            {[
              { number: '10K+', label: 'HAPPY CUSTOMERS' },
              { number: '500+', label: 'PRODUCTS LISTED' },
              { number: '50+', label: 'PARTNER BRANDS' },
              { number: '4.8', label: 'AVG. RATING / 5' },
            ].map((stat, i) => (
              <Grid
                item
                xs={6}
                md={3}
                key={stat.label}
                sx={{
                  borderRight: { md: i < 3 ? `1px solid ${line}22` : 'none' },
                }}
              >
                <Typography className={display.className} sx={{ fontSize: { xs: 40, md: 56 }, color: dripBlue }}>
                  {stat.number}
                </Typography>
                <Typography className={mono.className} sx={{ fontSize: 12, letterSpacing: '0.1em', opacity: 0.75, mt: 1 }}>
                  {stat.label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ---------------- CTA ---------------- */}
      <Box sx={{ py: { xs: 10, md: 14 }, textAlign: 'center' }}>
        <Container>
          <Typography
            className={display.className}
            sx={{ fontSize: { xs: 40, md: 64 }, color: ink, lineHeight: 1, mb: 3 }}
          >
            READY TO REP THE DRIP?
          </Typography>
          <Button
            variant="contained"
            size="large"
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
            SHOP THE COLLECTION
          </Button>
        </Container>
      </Box>
    </Box>
  )
}