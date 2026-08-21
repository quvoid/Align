import { PrismaClient, Role, AuthProvider, ApplicationStatus, Industry, BudgetTier, CampaignType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding started...');

  // 1. Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@schbang.com' },
    update: {},
    create: {
      email: 'admin@schbang.com',
      name: 'Super Admin',
      role: Role.SUPER_ADMIN,
      provider: AuthProvider.CREDENTIALS,
      passwordHash: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyui2sUjP93lY/.wFzBqj2N3GqT1Kz8q', // placeholder for 'password'
    }
  });

  // 2. Test Creators
  const creator1 = await prisma.user.upsert({
    where: { email: 'creator1@example.com' },
    update: {},
    create: {
      email: 'creator1@example.com',
      name: 'John Doe',
      role: Role.CREATOR,
      provider: AuthProvider.CREDENTIALS,
      passwordHash: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyui2sUjP93lY/.wFzBqj2N3GqT1Kz8q',
      creatorProfile: {
        create: {
          igHandle: 'johndoe_ig',
          igFollowers: 150000,
          igEngagementRate: 4.5,
          igAvgLikes: 6000,
          igAvgComments: 200,
          ytChannel: 'JohnDoeVlogs',
          ytSubscribers: 500000,
          ytAvgViews: 120000,
          ytEngagementRate: 8.2,
          niche: ['LIFESTYLE', 'TRAVEL'],
          location: 'Mumbai, India',
          languages: ['English', 'Hindi'],
          bio: 'Travel and lifestyle creator exploring the world.',
        }
      }
    }
  });

  const creator2 = await prisma.user.upsert({
    where: { email: 'creator2@example.com' },
    update: {},
    create: {
      email: 'creator2@example.com',
      name: 'Jane Smith',
      role: Role.CREATOR,
      provider: AuthProvider.CREDENTIALS,
      passwordHash: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyui2sUjP93lY/.wFzBqj2N3GqT1Kz8q',
      creatorProfile: {
        create: {
          igHandle: 'janesmith_beauty',
          igFollowers: 80000,
          igEngagementRate: 6.1,
          igAvgLikes: 4500,
          igAvgComments: 350,
          niche: ['BEAUTY', 'FASHION'],
          location: 'Delhi, India',
          languages: ['English', 'Hindi', 'Punjabi'],
          bio: 'Makeup tutorials, skincare reviews, and fashion hauls.',
        }
      }
    }
  });

  // 3. Brands
  const brandsData = [
    {
      name: 'Britannia',
      slug: 'britannia',
      logo: '/brands/britannia.svg',
      description: 'Britannia Industries is one of India\'s leading food companies with a 100-year legacy.',
      industry: Industry.FOOD,
      campaignTypes: [CampaignType.INSTAGRAM_REEL, CampaignType.YOUTUBE_VIDEO],
      budgetTier: BudgetTier.MEGA,
      requirements: { min_followers: 500000, min_engagement_rate: 3.0, content_requirements: 'Must feature the product in a family setting' },
    },
    {
      name: 'Fevicol',
      slug: 'fevicol',
      logo: '/brands/fevicol.svg',
      description: 'The largest selling brand of adhesives in India.',
      industry: Industry.OTHER,
      campaignTypes: [CampaignType.INSTAGRAM_REEL, CampaignType.YOUTUBE_SHORT],
      budgetTier: BudgetTier.MACRO,
      requirements: { min_followers: 100000, min_engagement_rate: 5.0, content_requirements: 'Humorous take on unbreakable bonds' },
    },
    {
      name: 'NIVEA',
      slug: 'nivea',
      logo: '/brands/nivea.svg',
      description: 'Global skin and body-care brand.',
      industry: Industry.BEAUTY,
      campaignTypes: [CampaignType.INSTAGRAM_POST, CampaignType.INSTAGRAM_REEL],
      budgetTier: BudgetTier.MACRO,
      requirements: { min_followers: 50000, min_engagement_rate: 4.0, content_requirements: 'Morning skincare routine' },
    },
    {
      name: 'Myntra',
      slug: 'myntra',
      logo: '/brands/myntra.svg',
      description: 'India\'s largest e-commerce store for fashion and lifestyle products.',
      industry: Industry.FASHION,
      campaignTypes: [CampaignType.INSTAGRAM_REEL, CampaignType.YOUTUBE_VIDEO],
      budgetTier: BudgetTier.MEGA,
      requirements: { min_followers: 200000, min_engagement_rate: 3.5, content_requirements: 'OOTD and fashion haul videos' },
    },
    {
      name: 'Swiggy',
      slug: 'swiggy',
      logo: '/brands/swiggy.svg',
      description: 'India\'s largest online food ordering and delivery platform.',
      industry: Industry.FOOD,
      campaignTypes: [CampaignType.INSTAGRAM_STORY, CampaignType.X_POST],
      budgetTier: BudgetTier.MID_TIER,
      requirements: { min_followers: 10000, min_engagement_rate: 5.0, content_requirements: 'Late night cravings food order' },
    },
    {
      name: 'Kotak811',
      slug: 'kotak811',
      logo: '/brands/kotak811.svg',
      description: 'A zero balance digital bank account by Kotak Mahindra Bank.',
      industry: Industry.FINANCE,
      campaignTypes: [CampaignType.YOUTUBE_VIDEO, CampaignType.INSTAGRAM_REEL],
      budgetTier: BudgetTier.MACRO,
      requirements: { min_followers: 100000, min_engagement_rate: 2.5, content_requirements: 'Financial independence and savings tips' },
    },
    {
      name: 'Baskin Robbins',
      slug: 'baskin-robbins',
      logo: '/brands/baskin-robbins.svg',
      description: 'World\'s largest chain of ice cream specialty shops.',
      industry: Industry.FOOD,
      campaignTypes: [CampaignType.INSTAGRAM_POST, CampaignType.FACEBOOK_POST],
      budgetTier: BudgetTier.MICRO,
      requirements: { min_followers: 5000, min_engagement_rate: 4.0, content_requirements: 'Trying out the new summer flavors' },
    },
    {
      name: 'Mahindra Auto',
      slug: 'mahindra-auto',
      logo: '/brands/mahindra-auto.svg',
      description: 'Multinational automotive manufacturing corporation.',
      industry: Industry.AUTOMOTIVE,
      campaignTypes: [CampaignType.YOUTUBE_VIDEO, CampaignType.INSTAGRAM_REEL],
      budgetTier: BudgetTier.MEGA,
      requirements: { min_followers: 500000, min_engagement_rate: 3.0, content_requirements: 'Off-roading adventure vlog' },
    },
    {
      name: 'Johnson & Johnson',
      slug: 'johnson-and-johnson',
      logo: '/brands/johnson-and-johnson.svg',
      description: 'Multinational corporation developing medical devices, pharmaceuticals, and consumer packaged goods.',
      industry: Industry.HEALTH,
      campaignTypes: [CampaignType.INSTAGRAM_POST, CampaignType.BLOG_POST],
      budgetTier: BudgetTier.MACRO,
      requirements: { min_followers: 100000, min_engagement_rate: 4.0, content_requirements: 'Baby care essentials' },
    },
    {
      name: 'H&M India',
      slug: 'hm-india',
      logo: '/brands/hm.svg',
      description: 'Multinational clothing company.',
      industry: Industry.FASHION,
      campaignTypes: [CampaignType.INSTAGRAM_REEL, CampaignType.YOUTUBE_SHORT],
      budgetTier: BudgetTier.MACRO,
      requirements: { min_followers: 150000, min_engagement_rate: 3.5, content_requirements: 'Sustainable fashion choices' },
    },
    {
      name: 'Domino\'s India',
      slug: 'dominos-india',
      logo: '/brands/dominos.svg',
      description: 'Multinational pizza restaurant chain.',
      industry: Industry.FOOD,
      campaignTypes: [CampaignType.INSTAGRAM_STORY, CampaignType.INSTAGRAM_REEL],
      budgetTier: BudgetTier.MID_TIER,
      requirements: { min_followers: 50000, min_engagement_rate: 4.0, content_requirements: 'Match day pizza party' },
    },
    {
      name: 'Finolex Pipes',
      slug: 'finolex-pipes',
      logo: '/brands/finolex.svg',
      description: 'India\'s largest and only backward integrated manufacturer of PVC Pipes and Fittings.',
      industry: Industry.OTHER,
      campaignTypes: [CampaignType.YOUTUBE_VIDEO, CampaignType.FACEBOOK_POST],
      budgetTier: BudgetTier.MID_TIER,
      requirements: { min_followers: 20000, min_engagement_rate: 3.0, content_requirements: 'Home renovation and plumbing solutions' },
    }
  ];

  const brands = await Promise.all(
    brandsData.map(data => 
      prisma.brand.upsert({
        where: { slug: data.slug },
        update: {},
        create: data,
      })
    )
  );

  // 4. Sample Applications
  await prisma.application.upsert({
    where: {
      creatorId_brandId: {
        creatorId: creator1.id,
        brandId: brands[0].id,
      }
    },
    update: {},
    create: {
      creatorId: creator1.id,
      brandId: brands[0].id,
      status: ApplicationStatus.UNDER_REVIEW,
      proposal: 'I would love to feature Britannia products in my upcoming family road trip vlog series. My audience loves family-centric travel content.',
      expectedRate: 50000.00,
      deliverables: { instagram_reel: 1, youtube_video: 1 },
      metricsSnapshot: { followers: 150000, engagement: 4.5 },
    }
  });

  await prisma.application.upsert({
    where: {
      creatorId_brandId: {
        creatorId: creator2.id,
        brandId: brands[2].id,
      }
    },
    update: {},
    create: {
      creatorId: creator2.id,
      brandId: brands[2].id,
      status: ApplicationStatus.APPROVED,
      proposal: 'My morning skincare routine is highly requested by my followers. NIVEA fits perfectly into this aesthetic.',
      expectedRate: 35000.00,
      deliverables: { instagram_reel: 1, instagram_story: 2 },
      metricsSnapshot: { followers: 80000, engagement: 6.1 },
      adminNotes: 'Great fit for the campaign.',
      reviewedBy: admin.id,
      reviewedAt: new Date(),
    }
  });

  await prisma.application.upsert({
    where: {
      creatorId_brandId: {
        creatorId: creator1.id,
        brandId: brands[3].id,
      }
    },
    update: {},
    create: {
      creatorId: creator1.id,
      brandId: brands[3].id,
      status: ApplicationStatus.PENDING,
      proposal: 'Excited to try out Myntra\'s new summer collection for my travel videos.',
      expectedRate: 60000.00,
      deliverables: { instagram_reel: 2 },
      metricsSnapshot: { followers: 150000, engagement: 4.5 },
    }
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
