'use client'

import React from 'react'
import { Box, Container, Grid, Typography, Button } from '@mui/material'
import { Bebas_Neue, Inter, JetBrains_Mono } from 'next/font/google'

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

const ink = '#14120F'
const paper = '#FAF7F2'
const line = '#DAD5C9'
const accent = '#8e4440'
const dripOrange = '#FF5B2E'

const termsSections = [
  {
    number: '01',
    title: 'ACCEPTING THESE TERMS',
    intro:
      'These Terms of Service govern your access to and use of the DripKart website and related shopping features. By visiting the website, creating an account, or placing an order, you agree to these Terms. If you do not agree, please do not use the service.',
    bullets: [],
  },
  {
    number: '02',
    title: 'ELIGIBILITY & YOUR ACCOUNT',
    intro:
      'You must be legally able to enter into a binding agreement under the laws that apply to you. If you create an account, you agree to provide accurate information, keep your login credentials secure, and tell us if you suspect unauthorised access. You are responsible for activity carried out through your account, subject to applicable law.',
    bullets: [],
  },
  {
    number: '03',
    title: 'PRODUCTS, PRICING & AVAILABILITY',
    intro:
      'We aim to display product descriptions, images, sizes, colours, prices, and availability as accurately as possible. Display colours may vary by screen, and product details or availability may change. We may correct errors, update listings, or limit quantities where permitted by law. If a material error affects an order, we will take reasonable steps to contact you and explain the available options.',
    bullets: [],
  },
  {
    number: '04',
    title: 'ORDERS & PAYMENT',
    intro:
      'Submitting an order is a request to purchase the selected products. An order may be subject to verification, stock availability, payment authorisation, and confirmation. We reserve the right to cancel or refuse an order where permitted by law, including where information is inaccurate or fraud is suspected. Payment methods and any applicable charges will be shown during checkout.',
    bullets: [],
  },
  {
    number: '05',
    title: 'SHIPPING, RETURNS & REFUNDS',
    intro:
      'Estimated delivery dates are provided for guidance and may be affected by circumstances outside our control. Any shipping, cancellation, return, exchange, and refund conditions shown on the website or communicated for your order form part of the applicable purchase terms. Please review those conditions before placing an order. Nothing in these Terms limits rights that cannot lawfully be excluded.',
    bullets: [],
  },
  {
    number: '06',
    title: 'ACCEPTABLE USE',
    intro: 'You agree not to misuse the website or interfere with its operation. In particular, you must not:',
    bullets: [
      ['Break the law', ' or use the website to engage in fraudulent, deceptive, or harmful activity.'],
      ['Attempt unauthorised access', ' to accounts, systems, data, or restricted areas.'],
      ['Disrupt the service', ' by introducing malicious code, automated abuse, or activity that damages or overloads the website.'],
      ['Misuse content', ' by copying, republishing, or exploiting website material except as permitted by law or with appropriate permission.'],
    ],
  },
  {
    number: '07',
    title: 'INTELLECTUAL PROPERTY',
    intro:
      'Unless otherwise stated, the DripKart website and its content—including branding, text, graphics, design, and site elements—are owned by or licensed to their respective rights holders. You may use the website for personal, lawful shopping purposes. These Terms do not transfer ownership of intellectual property to you.',
    bullets: [],
  },
  {
    number: '08',
    title: 'THIRD-PARTY SERVICES & WEBSITE AVAILABILITY',
    intro:
      'The website may link to or rely on third-party services, which may be governed by their own terms and policies. We do not control third-party services and are not responsible for their independent content or practices. We aim to keep DripKart available and secure, but cannot guarantee uninterrupted, error-free access at all times.',
    bullets: [],
  },
  {
    number: '09',
    title: 'DISCLAIMERS, LIABILITY & CHANGES',
    intro:
      'To the extent permitted by applicable law, the website is provided on an “as available” basis, and we do not guarantee that every feature will always be uninterrupted or error-free. Nothing in these Terms excludes or limits liability or consumer rights that cannot lawfully be excluded or limited. We may update these Terms from time to time; the revised version will be posted on this page with an updated date. Continued use after changes take effect means you accept the revised Terms to the extent permitted by law.',
    bullets: [],
  },
]

function DripEdge({ color = accent, flip = false }) {
  return (
    <Box
      component="svg"
      viewBox="0 0 400 40"
      preserveAspectRatio="none"
      aria-hidden="true"
      sx={{
        display: 'block',
        width: '100%',
        height: { xs: 20, md: 32 },
        transform: flip ? 'scaleY(-1)' : 'none',
      }}
    >
      <path
        d="M0,0 H400 V14 C385,14 380,34 365,34 C350,34 348,16 335,16 C322,16 318,30 305,30 C292,30 290,12 277,12 C264,12 262,38 249,38 C236,38 233,18 220,18 C207,18 205,26 192,26 C179,26 177,10 164,10 C151,10 148,32 135,32 C122,32 120,15 107,15 C94,15 92,28 79,28 C66,28 64,13 51,13 C38,13 35,24 22,24 C12,24 6,14 0,14 Z"
        fill={color}
      />
    </Box>
  )
}

function TermsSection({ section }) {
  return (
    <Box
      id={`section-${section.number}`}
      sx={{
        py: { xs: 3, md: 4 },
        borderBottom: `1px solid ${line}`,
        scrollMarginTop: 100,
      }}
    >
      <Grid container spacing={{ xs: 2, md: 4 }}>
        <Grid item xs={12} sm={2} md={1.5}>
          <Typography
            className={mono.className}
            sx={{ color: accent, fontSize: 12, letterSpacing: '.08em' }}
          >
            {section.number} /
          </Typography>
        </Grid>
        <Grid item xs={12} sm={10} md={10.5}>
          <Typography
            className={display.className}
            sx={{
              color: ink,
              fontSize: { xs: 27, md: 36 },
              lineHeight: 1,
              mb: 2,
            }}
          >
            {section.title}
          </Typography>
          <Typography
            className={body.className}
            sx={{ color: '#4A463E', fontSize: 14, lineHeight: 1.9, mb: section.bullets.length ? 1.5 : 0 }}
          >
            {section.intro}
          </Typography>
          {section.bullets.length > 0 && (
            <Box component="ul" sx={{ pl: 2.5, my: 0, color: '#4A463E' }}>
              {section.bullets.map(([lead, detail]) => (
                <Box
                  component="li"
                  key={lead}
                  sx={{ pl: 0.5, mb: 1, fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.85 }}
                >
                  <Box component="span" sx={{ color: ink, fontWeight: 600 }}>
                    {lead}
                  </Box>
                  {detail}
                </Box>
              ))}
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  )
}

export default function TermsOfServicePage() {
  return (
    <Box
      className={`${display.variable} ${body.variable}`}
      sx={{
        bgcolor: paper,
        color: ink,
        fontFamily: 'var(--font-body)',
        overflow: 'hidden',
      }}
    >
      {/* HERO */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: '48vh', md: '58vh' },
          display: 'flex',
          alignItems: 'flex-end',
          bgcolor: ink,
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2000&q=85"
          alt="Clothing racks inside a contemporary fashion store"
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            opacity: 0.48,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(20,18,15,.12) 0%, rgba(20,18,15,.94) 100%)',
          }}
        />
        <Container sx={{ position: 'relative', pb: { xs: 6, md: 8 }, color: paper }}>
          <Typography
            className={mono.className}
            sx={{ color: dripOrange, fontSize: 11, letterSpacing: '.14em', mb: 3 }}
          >
            DRIPKART / THE GROUND RULES
          </Typography>
          <Typography
            className={display.className}
            sx={{
              fontSize: { xs: 58, sm: 78, md: 108 },
              lineHeight: 0.82,
              maxWidth: 900,
            }}
          >
            THE RULES.
            <br />
            YOUR DRIP.
          </Typography>
          <Typography
            className={body.className}
            sx={{
              maxWidth: 570,
              mt: 3,
              fontSize: { xs: 14, md: 17 },
              lineHeight: 1.85,
              color: '#E9E5DB',
            }}
          >
            Good style comes with clear expectations. These Terms explain the ground rules for browsing, shopping, and using DripKart.
          </Typography>
        </Container>
      </Box>
      <DripEdge color={accent} />

      {/* INTRO */}
      <Container sx={{ py: { xs: 6, md: 9 } }}>
        <Grid container spacing={{ xs: 3, md: 6 }} alignItems="flex-start">
          <Grid item xs={12} md={4}>
            <Typography
              className={mono.className}
              sx={{ color: accent, fontSize: 11, letterSpacing: '.12em', mb: 2 }}
            >
              BEFORE YOU CHECK OUT
            </Typography>
            <Typography
              className={display.className}
              sx={{ fontSize: { xs: 42, md: 56 }, lineHeight: 0.95, maxWidth: 400 }}
            >
              GOOD STYLE. CLEAR EXPECTATIONS.
            </Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography
              className={body.className}
              sx={{ color: '#4A463E', fontSize: 15, lineHeight: 1.95, mb: 2 }}
            >
              These Terms of Service explain the rules that apply when you browse DripKart, create an account, or purchase products through our website. Please read them before placing an order.
            </Typography>
            <Typography
              className={mono.className}
              sx={{ color: accent, fontSize: 10, letterSpacing: '.04em' }}
            >
              LAST UPDATED / OCTOBER 13, 2026
            </Typography>
          </Grid>
        </Grid>
      </Container>

      {/* CONTENT */}
      <Box sx={{ bgcolor: '#F1ECE1', py: { xs: 5, md: 8 } }}>
        <Container>
          <Grid container spacing={{ xs: 4, md: 7 }} alignItems="flex-start">
            <Grid item xs={12} md={3}>
              <Box
                sx={{
                  p: 3,
                  bgcolor: paper,
                  border: `1px solid ${line}`,
                  position: { md: 'sticky' },
                  top: 24,
                }}
              >
                <Typography
                  className={mono.className}
                  sx={{ color: accent, fontSize: 10, letterSpacing: '.12em', mb: 2 }}
                >
                  ON THIS PAGE
                </Typography>
                {termsSections.map((section) => (
                  <Box
                    component="a"
                    href={`#section-${section.number}`}
                    key={section.number}
                    sx={{
                      display: 'flex',
                      gap: 1.5,
                      py: 1.1,
                      color: '#4A463E',
                      textDecoration: 'none',
                      borderBottom: `1px solid ${line}`,
                      fontFamily: 'var(--font-body)',
                      fontSize: 12,
                      lineHeight: 1.5,
                      '&:hover': { color: accent },
                    }}
                  >
                    <Box component="span" sx={{ color: accent, fontFamily: 'var(--font-mono)' }}>
                      {section.number}
                    </Box>
                    {section.title}
                  </Box>
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} md={9}>
              <Box sx={{ bgcolor: paper, border: `1px solid ${line}`, px: { xs: 2.5, md: 5 }, py: 1 }}>
                {termsSections.map((section) => (
                  <TermsSection section={section} key={section.number} />
                ))}
                <Box id="contact" sx={{ py: { xs: 3, md: 4 }, scrollMarginTop: 100 }}>
                  <Typography
                    className={mono.className}
                    sx={{ color: accent, fontSize: 11, letterSpacing: '.1em', mb: 1.5 }}
                  >
                    10 / NEED A HAND?
                  </Typography>
                  <Typography
                    className={display.className}
                    sx={{ fontSize: { xs: 28, md: 36 }, lineHeight: 1, mb: 1.5 }}
                  >
                    LET’S CLEAR THINGS UP.
                  </Typography>
                  <Typography
                    className={body.className}
                    sx={{ color: '#4A463E', fontSize: 14, lineHeight: 1.9, mb: 2.5 }}
                  >
                    If you have questions about these Terms, an order, or a store policy, contact our support team.
                  </Typography>
                  <Button
                    component="a"
                    href="mailto:support@dripkart.com?subject=DripKart%20Terms%20Enquiry"
                    variant="outlined"
                    sx={{
                      color: ink,
                      borderColor: accent,
                      borderRadius: '2px',
                      px: 3,
                      py: 1.2,
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      letterSpacing: '.05em',
                      '&:hover': { borderColor: dripOrange, bgcolor: '#8e44400d' },
                    }}
                  >
                    CONTACT SUPPORT ↗
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CLOSING CTA */}
      <DripEdge color={ink} flip />
      <Box sx={{ bgcolor: ink, color: paper, py: { xs: 7, md: 10 }, textAlign: 'center' }}>
        <Container>
          <Typography
            className={mono.className}
            sx={{ color: dripOrange, fontSize: 10, letterSpacing: '.12em', mb: 2 }}
          >
            GOOD STYLE. CLEAR TERMS.
          </Typography>
          <Typography
            className={display.className}
            sx={{ fontSize: { xs: 42, md: 68 }, lineHeight: 0.95, mb: 2.5 }}
          >
            KNOW THE RULES. OWN THE LOOK.
          </Typography>
          <Typography
            className={body.className}
            sx={{ color: '#DAD5C9', fontSize: 14, lineHeight: 1.8, maxWidth: 500, mx: 'auto', mb: 3 }}
          >
            We want your shopping experience to feel straightforward. If anything here is unclear, our support team is only an email away.
          </Typography>
          <Button
            component="a"
            href="mailto:support@dripkart.com"
            variant="outlined"
            sx={{
              color: paper,
              borderColor: accent,
              borderRadius: '2px',
              px: 4,
              py: 1.3,
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              letterSpacing: '.06em',
              '&:hover': { borderColor: dripOrange, bgcolor: '#ffffff0d' },
            }}
          >
            EMAIL DRIPKART ↗
          </Button>
        </Container>
      </Box>
    </Box>
  )
}
