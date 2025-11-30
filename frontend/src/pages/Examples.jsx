import React, { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Paper,
  Tabs,
  Tab,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
  Divider,
  Alert
} from '@mui/material';
import {
  Devices as DevicesIcon,
  Visibility as VisibilityIcon,
  Recycling as RecyclingIcon,
  Timeline as TimelineIcon,
  CheckCircle as CheckCircleIcon,
  QrCode as QrCodeIcon,
  AccountBalanceWallet as WalletIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';

const Examples = () => {
  const [activeTab, setActiveTab] = useState(0);

  const examples = [
    {
      role: 'Manufacturer',
      icon: <DevicesIcon sx={{ fontSize: 60 }} />,
      color: '#667eea',
      scenario: 'Samsung Manufacturing Galaxy S24 Phones',
      description: 'Samsung wants to register 10,000 Galaxy S24 phones on the blockchain for tracking throughout their lifecycle.',
      steps: [
        {
          label: 'Connect MetaMask Wallet',
          detail: 'Samsung IT admin connects company wallet: 0x1234...5678',
          blockchain: 'Wallet verification on Ethereum network',
          visual: 'Wallet icon turns green, shows connected status'
        },
        {
          label: 'Register Device Batch',
          detail: 'Enter details: Model: Galaxy S24, Quantity: 10,000 units, Manufacturing Date: Jan 2024, Serial Range: S24001-S34000',
          blockchain: 'Transaction pending on blockchain',
          visual: 'Form with device specifications'
        },
        {
          label: 'Mint NFTs on Blockchain',
          detail: 'System creates 10,000 unique NFT tokens on Ethereum blockchain',
          blockchain: 'Gas fee: 0.5 ETH, Transaction Hash: 0xabc...def, Block #: 18,234,567',
          visual: '10,000 NFTs created, each with unique token ID'
        },
        {
          label: 'Generate QR Codes',
          detail: 'System generates 10,000 unique QR codes linking to blockchain records',
          blockchain: 'QR codes encode: Token ID + Contract Address + Device Serial',
          visual: 'PDF with printable QR stickers downloaded'
        },
        {
          label: 'Attach & Ship',
          detail: 'QR stickers attached to each phone packaging, shipped to retailers',
          blockchain: 'Status updated to "Shipped to Retail"',
          visual: 'Dashboard shows 10,000 devices in "Active" status'
        }
      ],
      outcome: {
        devices: '10,000 Galaxy S24 phones',
        nfts: '10,000 unique NFT tokens',
        cost: '0.5 ETH in gas fees',
        time: '15 minutes total',
        benefit: 'Full lifecycle tracking enabled, counterfeit prevention, compliance reporting ready'
      }
    },
    {
      role: 'Consumer',
      icon: <VisibilityIcon sx={{ fontSize: 60 }} />,
      color: '#764ba2',
      scenario: 'John Buying and Using a Galaxy S24',
      description: 'John purchases a Galaxy S24 from Best Buy, wants to verify authenticity and eventually recycle it properly.',
      steps: [
        {
          label: 'Purchase & Scan QR',
          detail: 'John buys phone at Best Buy for $899, scans QR code on packaging using our mobile app',
          blockchain: 'App queries blockchain: Token ID #5,432 verified',
          visual: 'Green checkmark: "Authentic Samsung Product Verified"'
        },
        {
          label: 'Verify Authenticity',
          detail: 'Blockchain shows: Manufacturer: Samsung, Model: Galaxy S24, Manufactured: Jan 15, 2024, Original: Yes',
          blockchain: 'Smart contract confirms no previous ownership transfer',
          visual: 'Device history timeline displayed in app'
        },
        {
          label: 'Transfer Ownership',
          detail: 'John connects his MetaMask wallet, accepts ownership transfer',
          blockchain: 'NFT transferred from Samsung wallet to John\'s wallet: 0x9876...4321',
          visual: 'Ownership certificate generated with timestamp'
        },
        {
          label: 'Use Device (2 years)',
          detail: 'John uses phone normally for 2 years, blockchain tracks ownership',
          blockchain: 'Device status: "Active - Consumer Owned"',
          visual: 'Dashboard shows device usage period'
        },
        {
          label: 'Initiate Recycling',
          detail: 'Phone is old, John requests recycling pickup through app',
          blockchain: 'Status updated to "Pending Recycling", RecycleCo notified',
          visual: 'Recycling request submitted, pickup scheduled'
        }
      ],
      outcome: {
        assurance: 'Verified authentic product',
        ownership: 'Blockchain-recorded ownership proof',
        warranty: 'Digital warranty linked to NFT',
        recycling: 'Easy eco-friendly disposal',
        benefit: 'Peace of mind, verified product history, responsible recycling'
      }
    },
    {
      role: 'Recycler',
      icon: <RecyclingIcon sx={{ fontSize: 60 }} />,
      color: '#f093fb',
      scenario: 'RecycleCo Processing 100 Devices',
      description: 'RecycleCo, a certified e-waste recycler, receives 100 devices including John\'s Galaxy S24 for processing.',
      steps: [
        {
          label: 'Receive Devices',
          detail: 'RecycleCo receives 100 devices from various consumers for recycling',
          blockchain: 'Scan each QR code, verify ownership transfer authorization',
          visual: 'Intake dashboard: 100 devices scanned and logged'
        },
        {
          label: 'Verify & Accept',
          detail: 'Each device verified on blockchain, ownership transfer accepted to RecycleCo wallet',
          blockchain: '100 NFTs transferred to RecycleCo: 0xabcd...ef01',
          visual: 'All devices show "In Recycling Process"'
        },
        {
          label: 'Process & Extract Materials',
          detail: 'Devices dismantled: Extract 50g gold, 2kg copper, 500g rare earth metals, 5kg plastics',
          blockchain: 'Material recovery data recorded on blockchain',
          visual: 'Material extraction report generated'
        },
        {
          label: 'Record Material Data',
          detail: 'All extracted materials logged: Gold: 50g ($3,200), Copper: 2kg ($18), Rare Earth: 500g ($450)',
          blockchain: 'Smart contract updates material recovery metrics',
          visual: 'Environmental impact calculated: 100kg CO2 saved'
        },
        {
          label: 'Issue Certificates',
          detail: 'Generate blockchain recycling certificates for all 100 consumers',
          blockchain: '100 Recycling Certificate NFTs minted and sent to consumer wallets',
          visual: 'John receives: "Galaxy S24 #5432 Recycled - 0.5kg CO2 saved"'
        }
      ],
      outcome: {
        processed: '100 devices completely recycled',
        materials: '50g gold, 2kg copper, 500g rare earth, 5kg plastic',
        certificates: '100 blockchain certificates issued',
        revenue: '$3,668 in recovered materials',
        benefit: 'Transparent recycling proof, certified process, environmental impact tracked'
      }
    },
    {
      role: 'Regulator',
      icon: <TimelineIcon sx={{ fontSize: 60 }} />,
      color: '#4facfe',
      scenario: 'EPA Monitoring Compliance (Q1 2024)',
      description: 'Environmental Protection Agency monitors e-waste recycling compliance for electronics manufacturers.',
      steps: [
        {
          label: 'Access Regulatory Dashboard',
          detail: 'EPA agent logs in, connects government wallet to access all blockchain data',
          blockchain: 'Read-only access to all device NFTs and transactions',
          visual: 'Dashboard showing 1,000,000+ tracked devices'
        },
        {
          label: 'Monitor Activity',
          detail: 'Track Q1 2024: 1,250,000 devices registered, 320,000 recycled',
          blockchain: 'Smart contracts queried for statistics',
          visual: 'Real-time charts: 25.6% recycling rate'
        },
        {
          label: 'Generate Compliance Report',
          detail: 'Filter by manufacturer: Samsung recycling rate 78%, Apple 82%, LG 65%',
          blockchain: 'Blockchain audit trail ensures data integrity',
          visual: 'Automated PDF report with verified blockchain data'
        },
        {
          label: 'Identify Non-Compliance',
          detail: 'Flag: LG below 70% target, BrandX failed to register 50,000 devices',
          blockchain: 'Immutable proof of violations',
          visual: 'Red alerts for non-compliant manufacturers'
        },
        {
          label: 'Enforce Standards',
          detail: 'Issue warnings to LG and BrandX, require improvement plans',
          blockchain: 'Compliance actions recorded on blockchain',
          visual: 'Official notices sent, improvement tracked monthly'
        }
      ],
      outcome: {
        monitored: '1,250,000 devices tracked in Q1',
        compliance: '25.6% overall recycling rate',
        violations: '2 manufacturers flagged',
        transparency: '100% auditable data',
        benefit: 'Real-time compliance monitoring, tamper-proof records, automated reporting'
      }
    }
  ];

  const currentExample = examples[activeTab];

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box textAlign="center" mb={6}>
          <Typography variant="h2" fontWeight="bold" gutterBottom>
            Real-World Examples
          </Typography>
          <Typography variant="h5" color="text.secondary">
            See how different stakeholders use the e-waste tracking system
          </Typography>
        </Box>

        {/* Role Selector Tabs */}
        <Paper elevation={3} sx={{ mb: 4 }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                py: 3,
                fontSize: '1.1rem',
                fontWeight: 'bold'
              }
            }}
          >
            <Tab
              label="Manufacturer"
              icon={<DevicesIcon />}
              iconPosition="start"
            />
            <Tab
              label="Consumer"
              icon={<VisibilityIcon />}
              iconPosition="start"
            />
            <Tab
              label="Recycler"
              icon={<RecyclingIcon />}
              iconPosition="start"
            />
            <Tab
              label="Regulator"
              icon={<TimelineIcon />}
              iconPosition="start"
            />
          </Tabs>
        </Paper>

        {/* Example Content */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            background: `linear-gradient(135deg, ${currentExample.color}08 0%, ${currentExample.color}18 100%)`,
            border: `3px solid ${currentExample.color}40`
          }}
        >
          {/* Scenario Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                bgcolor: currentExample.color,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 3
              }}
            >
              {currentExample.icon}
            </Box>
            <Box>
              <Chip
                label={currentExample.role}
                sx={{
                  bgcolor: currentExample.color,
                  color: 'white',
                  fontWeight: 'bold',
                  mb: 1
                }}
              />
              <Typography variant="h3" fontWeight="bold">
                {currentExample.scenario}
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
                {currentExample.description}
              </Typography>
            </Box>
          </Box>

          {/* Workflow Steps */}
          <Stepper orientation="vertical" sx={{ mt: 4 }}>
            {currentExample.steps.map((step, index) => (
              <Step key={index} active={true} completed={true}>
                <StepLabel
                  StepIconProps={{
                    sx: {
                      color: currentExample.color + ' !important',
                      '& .MuiStepIcon-text': { fill: 'white' }
                    }
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    {step.label}
                  </Typography>
                </StepLabel>
                <StepContent>
                  <Card elevation={2} sx={{ mb: 2, bgcolor: 'white' }}>
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: 'flex', alignItems: 'start', mb: 2 }}>
                            <DescriptionIcon sx={{ mr: 1, color: currentExample.color }} />
                            <Box>
                              <Typography variant="subtitle2" fontWeight="bold" color={currentExample.color}>
                                Action Details:
                              </Typography>
                              <Typography variant="body2">{step.detail}</Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: 'flex', alignItems: 'start', mb: 2 }}>
                            <WalletIcon sx={{ mr: 1, color: currentExample.color }} />
                            <Box>
                              <Typography variant="subtitle2" fontWeight="bold" color={currentExample.color}>
                                Blockchain Activity:
                              </Typography>
                              <Typography variant="body2">{step.blockchain}</Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <Alert
                            icon={<CheckCircleIcon />}
                            severity="success"
                            sx={{ bgcolor: currentExample.color + '15' }}
                          >
                            <Typography variant="body2" fontWeight="medium">
                              <strong>Result:</strong> {step.visual}
                            </Typography>
                          </Alert>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </StepContent>
              </Step>
            ))}
          </Stepper>

          {/* Final Outcome */}
          <Paper
            elevation={3}
            sx={{
              mt: 4,
              p: 4,
              background: `linear-gradient(135deg, ${currentExample.color} 0%, ${currentExample.color}dd 100%)`,
              color: 'white'
            }}
          >
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <CheckCircleIcon sx={{ mr: 2, fontSize: 40 }} />
              Final Outcome
            </Typography>
            <Divider sx={{ bgcolor: 'white', opacity: 0.3, my: 2 }} />
            <Grid container spacing={2}>
              {Object.entries(currentExample.outcome).map(([key, value], index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.95)' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                      {key}
                    </Typography>
                    <Typography variant="body1" fontWeight="bold" color="text.primary">
                      {value}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Paper>

        {/* Key Takeaways */}
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Key Benefits of Blockchain Tracking
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {[
              { title: 'Transparency', desc: 'Every transaction visible on blockchain', icon: <VisibilityIcon /> },
              { title: 'Immutability', desc: 'Records cannot be altered or deleted', icon: <CheckCircleIcon /> },
              { title: 'Traceability', desc: 'Complete device lifecycle tracking', icon: <QrCodeIcon /> },
              { title: 'Accountability', desc: 'All stakeholders verified and auditable', icon: <TimelineIcon /> }
            ].map((benefit, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card elevation={2} sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                  <Box sx={{ color: '#667eea', mb: 2 }}>{benefit.icon}</Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {benefit.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {benefit.desc}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Examples;
