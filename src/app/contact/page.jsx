'use client'

import React, { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Chip,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material'
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
})

const ink = '#14120F'
const paper = '#FAF7F2'
const line = '#DAD5C9'
const accent = '#8e4440'
const dripOrange = '#FF5B2E'

const contactOptions = [
  {
    number: '01',
    label: 'CUSTOMER SUPPORT',
    title: 'Need a hand?',
    description: 'Questions about an order, delivery, return, or size? We’re here to help.',
    detail: 'support@dripkart.com',
    href: 'mailto:support@dripkart.com',
  },
  {
    number: '02',
    label: 'COLLABORATIONS',
    title: 'Make something together.',
    description: 'Have a creative idea, partnership, or brand collaboration in mind?',
    detail: 'collab@dripkart.com',
    href: 'mailto:collab@dripkart.com',
  },
  {
    number: '03',
    label: 'PRESS & MEDIA',
    title: 'Let’s talk stories.',
    description: 'For press requests, interviews, features, and media enquiries.',
    detail: 'press@dripkart.com',
    href: 'mailto:press@dripkart.com',
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

function ContactCard({ item }) {
  return (
    <Box
      sx={{
        height: '100%',
        p: { xs: 3, md: 4 },
        border: `1px solid ${line}`,
        bgcolor: paper,
        transition: 'transform .2s ease, box-shadow .2s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: `6px 6px 0 ${accent}`,
        },
      }}
    >
      <Typography
        className={mono.className}
        sx={{ color: accent, fontSize: 11, letterSpacing: '.1em', mb: 3 }}
      >
        {item.number} / {item.label}
      </Typography>
      <Typography
        className={display.className}
        sx={{ color: ink, fontSize: { xs: 27, md: 32 }, lineHeight: 1, mb: 2 }}
      >
        {item.title}
      </Typography>
      <Typography
        className={body.className}
        sx={{ color: '#4A463E', fontSize: 14, lineHeight: 1.8, mb: 3, minHeight: 76 }}
      >
        {item.description}
      </Typography>
      <Box
        component="a"
        href={item.href}
        sx={{
          color: ink,
          textDecorationColor: accent,
          textUnderlineOffset: 5,
          fontFamily: 'var(--font-mono)',
          fontSize: { xs: 11, sm: 12 },
          overflowWrap: 'anywhere',
          '&:hover': { color: accent },
        }}
      >
        {item.detail} ↗
      </Box>
    </Box>
  )
}

const initialForm = {
  name: '',
  email: '',
  topic: 'Order & delivery',
  orderNumber: '',
  message: '',
}

export default function ContactUsPage() {
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [noticeOpen, setNoticeOpen] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const subject = encodeURIComponent(`DripKart enquiry: ${form.topic}`)
    const message = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nTopic: ${form.topic}\nOrder number: ${form.orderNumber || 'Not provided'}\n\nMessage:\n${form.message}`
    )

    setError('')
    window.location.href = `mailto:support@dripkart.com?subject=${subject}&body=${message}`
    setNoticeOpen(true)
  }

  return (
    <Box
      className={`${display.variable} ${body.variable}`}
      sx={{ bgcolor: paper, color: ink, fontFamily: 'var(--font-body)', overflow: 'hidden' }}
    >
      {/* HERO */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: '55vh', md: '68vh' },
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
            opacity: 0.62,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(20,18,15,.08) 0%, rgba(20,18,15,.92) 100%)',
          }}
        />
        <Container sx={{ position: 'relative', pb: { xs: 6, md: 9 }, color: paper }}>
          
          <Typography
            className={display.className}
            sx={{ fontSize: { xs: 54, sm: 76, md: 100 }, lineHeight: 0.77, maxWidth: 900 }}
          >
            LET’S TALK
            <br />
            ABOUT YOUR DRIP.
          </Typography>
          <Typography
            className={body.className}
            sx={{ maxWidth: 510, mt: 3, fontSize: { xs: 15, md: 18 }, lineHeight: 1.8, color: '#E9E5DB' }}
          >
            Questions, ideas, feedback — whatever’s on your mind, we’d love to hear from you.
          </Typography>
          {/* <Button
            href="#contact-form"
            variant="contained"
            sx={{
              mt: 4,
              bgcolor: accent,
              color: paper,
              borderRadius: '2px',
              px: 4,
              py: 1.5,
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              letterSpacing: '.07em',
              boxShadow: 'none',
              '&:hover': { bgcolor: paper, color: ink, boxShadow: 'none' },
            }}
          >
            SEND US A MESSAGE ↘
          </Button> */}
        </Container>
      </Box>
      <DripEdge color={accent} />

      {/* INTRO */}
      <Container sx={{ py: { xs: 7, md: 10 } }}>
        <Grid container spacing={4} alignItems="flex-start">
          <Grid item xs={12} md={5}>
            <Typography
              className={mono.className}
              sx={{ color: accent, fontSize: 12, letterSpacing: '.12em', mb: 2 }}
            >
              THE INBOX IS OPEN
            </Typography>
            <Typography
              className={display.className}
              sx={{ fontSize: { xs: 38, md: 54 }, lineHeight: 0.98, maxWidth: 440 }}
            >
              GOOD STYLE.
              <br />
              GOOD CONVERSATIONS.
            </Typography>
          </Grid>
          <Grid item xs={12} md={7}>
            <Typography
              className={body.className}
              sx={{ color: '#4A463E', fontSize: 16, lineHeight: 1.9 }}
            >
              At DripKart, the conversation doesn’t stop at checkout. Whether you need help with
              an order, want to work with us, or simply have something to share, choose the
              department that fits and drop us a line.
            </Typography>
            <Typography
              className={mono.className}
              sx={{ mt: 3, color: accent, fontSize: 11, letterSpacing: '.04em' }}
            >
              MONDAY – SATURDAY / 10:00 AM – 6:00 PM IST
            </Typography>
          </Grid>
        </Grid>
      </Container>


      {/* FORM */}
     

      {/* CLOSING CTA */}
      <DripEdge color={ink} flip />
      <Box sx={{ bgcolor: ink, color: paper, py: { xs: 8, md: 11 }, textAlign: 'center' }}>
        <Container>
          <Typography
            className={mono.className}
            sx={{ color: dripOrange, fontSize: 11, letterSpacing: '.12em', mb: 2 }}
          >
            GOOD THINGS START WITH A HELLO
          </Typography>
          <Typography
            className={display.className}
            sx={{ fontSize: { xs: 42, md: 68 }, lineHeight: 0.95, mb: 3 }}
          >
            WE’RE JUST AN EMAIL AWAY.
          </Typography>
          <Typography className={body.className} sx={{ color: '#DAD5C9', fontSize: 14, mb: 3 }}>
            Prefer email? We’ve got you.
          </Typography>
          <Button
            component="a"
            href="mailto:support@dripkart.com"
            variant="outlined"
            sx={{
              color: paper,
              borderColor: '#8e4440',
              borderRadius: '2px',
              px: 4,
              py: 1.3,
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              letterSpacing: '.06em',
              '&:hover': { borderColor: dripOrange, bgcolor: '#ffffff0d' },
            }}
          >
            EMAIL DRIPKART ↗
          </Button>
        </Container>
      </Box>

       {/* CONTACT OPTIONS */}
      <Box sx={{ bgcolor: '#F1ECE1', py: { xs: 7, md: 10 } }}>
        <Container>
          <Typography
            className={mono.className}
            sx={{ color: accent, fontSize: 12, letterSpacing: '.12em', textAlign: 'center', mb: 1 }}
          >
            PICK YOUR LANE
          </Typography>
          <Typography
            className={display.className}
            sx={{ fontSize: { xs: 38, md: 52 }, textAlign: 'center', mb: 5 }}
          >
            HOW CAN WE HELP?
          </Typography>
          <Grid container spacing={3}>
            {contactOptions.map((item) => (
              <Grid item xs={12} md={4} key={item.number}>
                <ContactCard item={item} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

       {/* <Container id="contact-form" sx={{ py: { xs: 8, md: 12 }, scrollMarginTop: 24 }}>
        <Grid container spacing={{ xs: 5, md: 9 }}>
          <Grid item xs={12} md={5}>
            <Typography
              className={mono.className}
              sx={{ color: accent, fontSize: 12, letterSpacing: '.12em', mb: 2 }}
            >
              04 / YOUR TURN
            </Typography>
            <Typography
              className={display.className}
              sx={{ fontSize: { xs: 42, md: 62 }, lineHeight: 0.92, mb: 3 }}
            >
              DROP US
              <br />
              A MESSAGE.
            </Typography>
            <Typography
              className={body.className}
              sx={{ color: '#4A463E', fontSize: 15, lineHeight: 1.9, maxWidth: 400 }}
            >
              Fill in the details and tell us what you need. The more you share, the easier it is
              for our team to point you in the right direction.
            </Typography>
            <Box sx={{ mt: 4, p: 3, borderLeft: `3px solid ${accent}`, bgcolor: '#F1ECE1' }}>
              <Typography className={mono.className} sx={{ fontSize: 11, color: accent, mb: 1 }}>
                QUICK NOTE
              </Typography>
              <Typography className={body.className} sx={{ fontSize: 13, color: '#4A463E', lineHeight: 1.8 }}>
                For order-related questions, include your order number so we can help you faster.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container> */}

      <Snackbar
        open={noticeOpen}
        autoHideDuration={5000}
        onClose={() => setNoticeOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="info" onClose={() => setNoticeOpen(false)} sx={{ width: '100%' }}>
          Your email app should open with the message prepared.
        </Alert>
      </Snackbar>
    </Box>
  )
}

const fieldStyles = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '2px',
    bgcolor: '#FAF7F2',
    fontFamily: 'var(--font-body)',
    fontSize: 13,
    '& fieldset': { borderColor: '#DAD5C9' },
    '&:hover fieldset': { borderColor: '#8e4440' },
    '&.Mui-focused fieldset': { borderColor: '#8e4440', borderWidth: 1 },
  },
  '& .MuiInputBase-input': { py: 1.5 },
}
