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

const policySections = [
  {
    number: '01',
    title: 'THE INFORMATION WE COLLECT',
    intro:
      'When you use DripKart, we may collect information that helps us operate the store and support your experience.',
    bullets: [
      ['Information you provide', ' such as your name, email address, phone number, delivery address, and details you submit when creating an account or contacting support.'],
      ['Order information', ' such as items purchased, order history, delivery details, and return or support requests.'],
      ['Technical information', ' such as browser type, device information, pages visited, and basic usage data that may be collected through logs or similar technologies.'],
    ],
  },
  {
    number: '02',
    title: 'HOW WE USE YOUR INFORMATION',
    intro: 'We use information for legitimate store and customer-service purposes, including to:',
    bullets: [
      ['Process orders', ' and help manage payments, delivery, returns, and customer requests.'],
      ['Maintain your account', ' and provide features such as order history, saved preferences, or a wishlist where available.'],
      ['Improve the experience', ' by understanding how the site is used, troubleshooting issues, and improving our products and services.'],
      ['Communicate with you', ' about orders, service updates, and other messages you request or that are necessary to provide the service.'],
      ['Protect the store', ' by detecting suspicious activity, preventing misuse, and maintaining site security.'],
    ],
  },
  {
    number: '03',
    title: 'COOKIES & SIMILAR TECHNOLOGIES',
    intro:
      'DripKart may use cookies or similar technologies to remember preferences, support essential site functionality, understand site performance, and improve your experience. You can manage cookies through your browser settings; disabling some cookies may affect how parts of the site work.',
    bullets: [],
  },
  {
    number: '04',
    title: 'WHEN INFORMATION MAY BE SHARED',
    intro:
      'We do not sell your personal information. We may share limited information when needed to run the store, provide a service you request, or meet a legal obligation.',
    bullets: [
      ['Service providers', ' such as hosting, payment, analytics, customer-support, and delivery providers, where those services are used.'],
      ['Legal and safety reasons', ' when disclosure is required by law or reasonably necessary to protect rights, users, or the security of DripKart.'],
      ['Business changes', ' if a merger, restructuring, or transfer of business assets takes place, subject to appropriate safeguards.'],
    ],
  },
  {
    number: '05',
    title: 'DATA SECURITY & RETENTION',
    intro:
      'We use reasonable safeguards designed to protect information against unauthorised access, loss, misuse, or alteration. No website or electronic storage method can be guaranteed to be completely secure. We retain information only for as long as it is reasonably needed for the purposes described here, including order support, recordkeeping, dispute resolution, and legal requirements.',
    bullets: [],
  },
  {
    number: '06',
    title: 'YOUR CHOICES & RIGHTS',
    intro:
      'Depending on your location and applicable law, you may be able to request access to, correction of, or deletion of personal information, or object to certain uses of it. You can also update account details where those controls are available and manage browser cookies through your device settings.',
    bullets: [],
  },
  {
    number: '07',
    title: 'CHILDREN’S PRIVACY',
    intro:
      'DripKart is not intended for children who are not legally able to use online shopping services in their jurisdiction. We do not knowingly collect personal information from children in violation of applicable law. If you believe a child has provided us with personal information, contact us so we can review the request.',
    bullets: [],
  },
  {
    number: '08',
    title: 'THIRD-PARTY LINKS',
    intro:
      'Our website may link to third-party websites or services. Those sites have their own privacy practices, and we are not responsible for their content or policies. Please review their privacy notices before sharing information with them.',
    bullets: [],
  },
  {
    number: '09',
    title: 'CHANGES TO THIS POLICY',
    intro:
      'We may update this Privacy Policy from time to time to reflect changes in our services or practices. When we do, we will update the date shown at the top of this page. Please review this page periodically for the latest version.',
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

function PolicySection({ section }) {
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

export default function PrivacyPolicyPage() {
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
            DRIPKART / YOUR PRIVACY MATTERS
          </Typography>
          <Typography
            className={display.className}
            sx={{
              fontSize: { xs: 58, sm: 78, md: 108 },
              lineHeight: 0.82,
              maxWidth: 900,
            }}
          >
            YOUR DATA.
            <br />
            YOUR RULES.
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
            We believe shopping should feel personal, not intrusive. Here’s how
            information is handled when you visit or shop with DripKart.
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
              THE IMPORTANT STUFF
            </Typography>
            <Typography
              className={display.className}
              sx={{ fontSize: { xs: 42, md: 56 }, lineHeight: 0.95, maxWidth: 400 }}
            >
              TRANSPARENCY LOOKS GOOD ON EVERYONE.
            </Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography
              className={body.className}
              sx={{ color: '#4A463E', fontSize: 15, lineHeight: 1.95, mb: 2 }}
            >
              This Privacy Policy explains the types of information DripKart may
              collect, how it may be used, and the choices you may have. It applies
              when you visit our website, create an account, place an order, or
              contact our team.
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
                {policySections.map((section) => (
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
                {policySections.map((section) => (
                  <PolicySection section={section} key={section.number} />
                ))}
                <Box id="contact" sx={{ py: { xs: 3, md: 4 }, scrollMarginTop: 100 }}>
                  <Typography
                    className={mono.className}
                    sx={{ color: accent, fontSize: 11, letterSpacing: '.1em', mb: 1.5 }}
                  >
                    10 / QUESTIONS?
                  </Typography>
                  <Typography
                    className={display.className}
                    sx={{ fontSize: { xs: 28, md: 36 }, lineHeight: 1, mb: 1.5 }}
                  >
                    WE’RE HERE TO HELP.
                  </Typography>
                  <Typography
                    className={body.className}
                    sx={{ color: '#4A463E', fontSize: 14, lineHeight: 1.9, mb: 2.5 }}
                  >
                    If you have questions about this policy or want to make a privacy
                    request, get in touch with our team.
                  </Typography>
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
            SHOP WITH CONFIDENCE.
          </Typography>
          <Typography
            className={body.className}
            sx={{ color: '#DAD5C9', fontSize: 14, lineHeight: 1.8, maxWidth: 500, mx: 'auto', mb: 3 }}
          >
            Your trust matters to us. If anything here is unclear, our support
            team is only an email away.
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}
