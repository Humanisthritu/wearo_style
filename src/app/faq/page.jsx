
'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Container,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material'
import {
  Add,
  Search,
  ArrowOutward,
} from '@mui/icons-material'

const FAQ_CATEGORIES = [
  'ALL QUESTIONS',
  'ORDERS',
  'SHIPPING',
  'RETURNS',
  'PAYMENTS',
  'ACCOUNT',
]

const FAQ_DATA = [
  {
    category: 'ORDERS',
    question: 'How can I place an order?',
    answer:
      'Browse our collection, select your preferred product, choose the available size and colour, and add it to your bag. Proceed to checkout, enter your delivery address, select a payment method, and confirm your order.',
  },
  {
    category: 'ORDERS',
    question: 'Can I modify or cancel my order?',
    answer:
      'Order changes and cancellations depend on the order status. Please contact our support team as soon as possible with your order details so we can check the available options.',
  },
  {
    category: 'ORDERS',
    question: 'Where can I find my order details?',
    answer:
      'Sign in to your DripKart account and open your orders section to review your available order information and status.',
  },
  {
    category: 'SHIPPING',
    question: 'How long does delivery take?',
    answer:
      'Delivery time depends on your location and product availability. Check the delivery information shown during checkout for the estimated delivery window.',
  },
  {
    category: 'SHIPPING',
    question: 'How can I track my order?',
    answer:
      'Open your account and check your order details for the latest available status. If you need further assistance, contact our support team with your order number.',
  },
  {
    category: 'SHIPPING',
    question: 'Do you deliver across India?',
    answer:
      'Delivery availability depends on the serviceable PIN code. Enter your delivery PIN code during checkout to check whether delivery is available for your location.',
  },
  {
    category: 'RETURNS',
    question: 'How do I return a product?',
    answer:
      'Contact our support team with your order number and the product details. Our team can guide you through the applicable return process and eligibility requirements.',
  },
  {
    category: 'RETURNS',
    question: 'When will I receive my refund?',
    answer:
      'Refund timelines depend on the return status and the original payment method. Our support team can help you check the status of your refund.',
  },
  {
    category: 'RETURNS',
    question: 'Can I exchange an item for another size?',
    answer:
      'Exchange availability depends on the product and stock. Contact our support team to check the available options for your order.',
  },
  {
    category: 'PAYMENTS',
    question: 'Which payment methods can I use?',
    answer:
      'Available payment methods are displayed during checkout. Choose one of the options shown to complete your purchase.',
  },
  {
    category: 'PAYMENTS',
    question: 'What should I do if my payment fails?',
    answer:
      'First, check your payment status before trying again. If money was deducted but your order was not confirmed, keep your transaction details and contact support for assistance.',
  },
  {
    category: 'ACCOUNT',
    question: 'How do I create a DripKart account?',
    answer:
      'Open the account or login section of DripKart and follow the registration steps displayed on the page.',
  },
  {
    category: 'ACCOUNT',
    question: 'I forgot my password. What should I do?',
    answer:
      'Use the Forgot Password option on the login page, if available, and follow the instructions to reset your password.',
  },
]

const FAQPage = () => {
  const [activeCategory, setActiveCategory] = useState('ALL QUESTIONS')
  const [searchTerm, setSearchTerm] = useState('')
  const [expanded, setExpanded] = useState(false)

  const filteredFAQs = useMemo(() => {
    const search = searchTerm.trim().toLowerCase()

    return FAQ_DATA.filter((faq) => {
      const matchesCategory =
        activeCategory === 'ALL QUESTIONS' ||
        faq.category === activeCategory

      const matchesSearch =
        !search ||
        faq.question.toLowerCase().includes(search) ||
        faq.answer.toLowerCase().includes(search) ||
        faq.category.toLowerCase().includes(search)

      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchTerm])

  const handleCategoryChange = (category) => {
    setActiveCategory(category)
    setExpanded(false)
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#FAF7F2',
        color: '#14120F',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* HERO */}
      <Box
        sx={{
          borderBottom: '1px solid #DAD5C9',
          pt: { xs: 8, md: 12 },
          pb: { xs: 7, md: 10 },
        }}
      >
        <Container maxWidth="lg">
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.2em',
              color: '#8e4440',
              mb: 3,
            }}
          >
            DRIPKART / HELP CENTRE
          </Typography>

          <Typography
            component="h1"
            sx={{
              fontFamily: 'Bebas Neue, Impact, sans-serif',
              fontSize: { xs: '4rem', sm: '5.5rem', md: '7.5rem' },
              lineHeight: 0.9,
              letterSpacing: '-0.025em',
              maxWidth: 850,
              textTransform: 'uppercase',
            }}
          >
            GOOD QUESTIONS.
            <Box component="span" sx={{ color: '#8e4440', display: 'block' }}>
              CLEAR ANSWERS.
            </Box>
          </Typography>

          <Typography
            sx={{
              mt: 3,
              maxWidth: 540,
              fontSize: { xs: 14, md: 16 },
              lineHeight: 1.8,
              color: '#686258',
            }}
          >
            Everything you need to know about your orders, delivery,
            returns, payments, and your DripKart account.
          </Typography>

          {/* SEARCH */}
          <TextField
            fullWidth
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value)
              setExpanded(false)
            }}
            placeholder="Search for an answer..."
            variant="outlined"
            sx={{
              mt: 5,
              maxWidth: 600,
              '& .MuiOutlinedInput-root': {
                bgcolor: '#FFFFFF',
                borderRadius: 0,
                fontSize: 14,
                '& fieldset': {
                  borderColor: '#DAD5C9',
                },
                '&:hover fieldset': {
                  borderColor: '#14120F',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#8e4440',
                },
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: '#8e4440' }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Container>
      </Box>

      {/* FAQ CONTENT */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 9 } }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '250px 1fr' },
            gap: { xs: 5, md: 9 },
            alignItems: 'start',
          }}
        >
          {/* CATEGORY FILTERS */}
          <Box>
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.16em',
                mb: 2.5,
              }}
            >
              BROWSE BY TOPIC
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'row', md: 'column' },
                flexWrap: { xs: 'wrap', md: 'nowrap' },
                gap: 1,
              }}
            >
              {FAQ_CATEGORIES.map((category) => {
                const isActive = activeCategory === category

                return (
                  <Button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    sx={{
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      px: 2,
                      py: 1.5,
                      minWidth: 0,
                      borderRadius: 0,
                      border: '1px solid',
                      borderColor: isActive ? '#14120F' : 'transparent',
                      bgcolor: isActive ? '#14120F' : 'transparent',
                      color: isActive ? '#FAF7F2' : '#686258',
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      '&:hover': {
                        bgcolor: isActive ? '#14120F' : '#F0EBE2',
                        borderColor: '#14120F',
                      },
                    }}
                  >
                    {category}
                    {isActive && (
                      <ArrowOutward sx={{ fontSize: 15, ml: 1 }} />
                    )}
                  </Button>
                )
              })}
            </Box>

            <Box
              sx={{
                mt: 5,
                p: 3,
                border: '1px solid #DAD5C9',
                display: { xs: 'none', md: 'block' },
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'Bebas Neue, Impact, sans-serif',
                  fontSize: 27,
                  lineHeight: 1,
                }}
              >
                STILL NEED HELP?
              </Typography>

              <Typography
                sx={{
                  mt: 1.5,
                  mb: 2.5,
                  fontSize: 13,
                  lineHeight: 1.7,
                  color: '#686258',
                }}
              >
                Can't find the answer you're looking for? Our team is here
                to help.
              </Typography>

              <Button
                component={Link}
                href="/contact"
                endIcon={<ArrowOutward />}
                sx={{
                  p: 0,
                  color: '#8e4440',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  '&:hover': {
                    bgcolor: 'transparent',
                    color: '#14120F',
                  },
                }}
              >
                CONTACT OUR TEAM
              </Button>
            </Box>
          </Box>

          {/* QUESTIONS */}
          <Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2,
                mb: 2,
                pb: 2,
                borderBottom: '1px solid #14120F',
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'Bebas Neue, Impact, sans-serif',
                  fontSize: { xs: 27, md: 34 },
                  lineHeight: 1,
                }}
              >
                {activeCategory === 'ALL QUESTIONS'
                  ? 'FREQUENTLY ASKED QUESTIONS'
                  : activeCategory}
              </Typography>

              <Chip
                label={String(filteredFAQs.length).padStart(2, '0')}
                size="small"
                sx={{
                  bgcolor: '#EDE6DC',
                  color: '#8e4440',
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  borderRadius: 0,
                }}
              />
            </Box>

            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq, index) => (
                <Accordion
                  key={faq.question}
                  expanded={expanded === faq.question}
                  onChange={(_, isExpanded) =>
                    setExpanded(isExpanded ? faq.question : false)
                  }
                  disableGutters
                  elevation={0}
                  square
                  sx={{
                    bgcolor: 'transparent',
                    borderBottom: '1px solid #DAD5C9',
                    '&::before': { display: 'none' },
                  }}
                >
                  <AccordionSummary
                    expandIcon={
                      <Add
                        sx={{
                          color:
                            expanded === faq.question ? '#8e4440' : '#14120F',
                          fontSize: 21,
                        }}
                      />
                    }
                    sx={{
                      px: { xs: 1, md: 2 },
                      py: 1.5,
                      minHeight: 72,
                      '& .MuiAccordionSummary-content': {
                        alignItems: 'center',
                        gap: 2,
                        my: 1,
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        minWidth: 26,
                        color: '#8e4440',
                        fontSize: 11,
                        fontFamily: 'monospace',
                      }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </Typography>

                    <Box>
                      <Typography
                        sx={{
                          fontSize: { xs: 13, md: 15 },
                          fontWeight: 600,
                          lineHeight: 1.6,
                        }}
                      >
                        {faq.question}
                      </Typography>

                      <Typography
                        sx={{
                          mt: 0.5,
                          fontSize: 9,
                          fontWeight: 700,
                          letterSpacing: '0.12em',
                          color: '#8e4440',
                        }}
                      >
                        {faq.category}
                      </Typography>
                    </Box>
                  </AccordionSummary>

                  <AccordionDetails
                    sx={{
                      pl: { xs: 5, md: 7 },
                      pr: { xs: 2, md: 8 },
                      pb: 3,
                      pt: 0,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 13,
                        lineHeight: 1.9,
                        color: '#686258',
                        maxWidth: 650,
                      }}
                    >
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))
            ) : (
              <Box
                sx={{
                  py: 8,
                  textAlign: 'center',
                  borderBottom: '1px solid #DAD5C9',
                }}
              >
                <Search sx={{ fontSize: 34, color: '#8e4440', mb: 1 }} />

                <Typography
                  sx={{
                    fontFamily: 'Bebas Neue, Impact, sans-serif',
                    fontSize: 30,
                  }}
                >
                  NO ANSWERS FOUND
                </Typography>

                <Typography
                  sx={{ mt: 1, fontSize: 13, color: '#686258' }}
                >
                  Try a different search term or browse another topic.
                </Typography>

                <Button
                  onClick={() => {
                    setSearchTerm('')
                    setActiveCategory('ALL QUESTIONS')
                  }}
                  sx={{
                    mt: 2,
                    color: '#8e4440',
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  CLEAR FILTERS
                </Button>
              </Box>
            )}

            {/* MOBILE CONTACT CTA */}
            <Box
              sx={{
                display: { xs: 'block', md: 'none' },
                mt: 5,
                p: 3,
                border: '1px solid #DAD5C9',
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'Bebas Neue, Impact, sans-serif',
                  fontSize: 28,
                }}
              >
                STILL NEED HELP?
              </Typography>

              <Typography
                sx={{
                  mt: 1,
                  fontSize: 13,
                  lineHeight: 1.7,
                  color: '#686258',
                }}
              >
                Our team can help with anything you couldn't find here.
              </Typography>

              <Button
                component={Link}
                href="/contact"
                endIcon={<ArrowOutward />}
                sx={{
                  mt: 2,
                  px: 0,
                  color: '#8e4440',
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                CONTACT OUR TEAM
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>

      {/* BOTTOM CTA */}
      <Box
        sx={{
          bgcolor: '#14120F',
          color: '#FAF7F2',
          py: { xs: 7, md: 10 },
        }}
      >
        <Container maxWidth="lg">
          <Typography
            sx={{
              color: '#FF5B2E',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.2em',
              mb: 2,
            }}
          >
            WE'RE HERE FOR YOU
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'flex-start', md: 'flex-end' },
              justifyContent: 'space-between',
              gap: 4,
            }}
          >
            <Typography
              sx={{
                fontFamily: 'Bebas Neue, Impact, sans-serif',
                fontSize: { xs: 46, sm: 60, md: 76 },
                lineHeight: 0.95,
                maxWidth: 650,
              }}
            >
              YOUR NEXT QUESTION?
              <Box component="span" sx={{ color: '#FF5B2E' }}>
                {' '}WE'RE ALL EARS.
              </Box>
            </Typography>

            <Button
              component={Link}
              href="/contact"
              variant="contained"
              endIcon={<ArrowOutward />}
              sx={{
                bgcolor: '#FF5B2E',
                color: '#14120F',
                borderRadius: 0,
                px: 3,
                py: 1.8,
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: '0.08em',
                whiteSpace: 'nowrap',
                '&:hover': {
                  bgcolor: '#FAF7F2',
                },
              }}
            >
              GET IN TOUCH
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default FAQPage
