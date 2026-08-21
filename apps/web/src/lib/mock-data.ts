export interface BrandItem {
  id: string;
  name: string;
  slug: string;
  industry: string;
  budgetTier: 'Nano' | 'Micro' | 'Mid-Tier' | 'Macro' | 'Mega';
  description: string;
  logo: string;
  coverImage: string;
  campaignTypes: string[];
  requirements: string;
  isActive: boolean;
  contactEmail?: string;
  website?: string;
  likesCount: number; // Total creators who expressed interest/liked this brief
}

export interface CreatorCollaboration {
  brandName: string;
  brandLogo: string;
  campaignTitle: string;
  viewsDelivered: string;
  engagementRate: string;
  completedAt: string;
  deliverableType: string;
}

export interface CreatorItem {
  id: string;
  name: string;
  handle: string;
  email: string;
  avatar: string;
  niche: string[];
  location: string;
  bio: string;
  tier: 'Nano' | 'Micro' | 'Mid-Tier' | 'Macro' | 'Mega';
  // Social Platforms
  igFollowers: number;
  igEngagementRate: number;
  igHandle: string;
  ytSubscribers?: number;
  ytAvgViews?: string;
  fbFollowers?: number;
  // Performance Analytics & Track Record
  performance: {
    totalCampaigns: number;
    totalReach: string; // e.g. "2.4M Views"
    avgEngagementRate: string; // e.g. "5.8%"
    reliabilityScore: number; // e.g. 4.9 out of 5.0
    onTimeDelivery: string; // e.g. "98%"
  };
  // Past Brand Collaborations
  brandCollaborations: CreatorCollaboration[];
  // Audience Demographics
  audienceDemographics: {
    topCity: string;
    topAgeBracket: string;
    genderRatio: string; // e.g. "45% Male / 55% Female"
  };
  likedBrandIds: string[];
}

export interface ApplicationItem {
  id: string;
  creatorName: string;
  creatorEmail: string;
  brandName: string;
  brandId: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'SHORTLISTED' | 'APPROVED' | 'REJECTED';
  date: string;
  proposal: string;
  expectedRate: number;
  deliverables: string[];
  metrics: {
    instagramHandle?: string;
    instagramFollowers?: number;
    instagramER?: string;
    youtubeChannel?: string;
    youtubeSubscribers?: number;
    facebookFollowers?: number;
  };
  adminNotes?: string;
}

export const INITIAL_BRANDS: BrandItem[] = [
  {
    id: '1',
    name: 'Britannia',
    slug: 'britannia',
    industry: 'Food & FMCG',
    budgetTier: 'Macro',
    description: 'Looking for food, lifestyle, and comedy creators for the Good Day & Jim Jam social remix campaign.',
    logo: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=120&h=120&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=300&fit=crop',
    campaignTypes: ['Instagram Reel', 'YouTube Short', 'Family Challenge'],
    requirements: 'Min 100k followers, >4.5% engagement rate, family/comedy niche.',
    isActive: true,
    contactEmail: 'britannia-campaigns@schbang.com',
    website: 'https://britannia.co.in',
    likesCount: 38,
  },
  {
    id: '2',
    name: 'Fevicol',
    slug: 'fevicol',
    industry: 'Lifestyle & DIY',
    budgetTier: 'Mega',
    description: 'The iconic adhesive brand is seeking quirky creators for the #FevicolKaJod cultural conversation series.',
    logo: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=120&h=120&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&h=300&fit=crop',
    campaignTypes: ['Witty Reel', 'DIY Craft Post', 'Memetic Content'],
    requirements: 'High creativity score, humor/DIY creators with strong audience retention.',
    isActive: true,
    contactEmail: 'fevicol-briefs@schbang.com',
    website: 'https://pidilite.com',
    likesCount: 54,
  },
  {
    id: '3',
    name: 'NIVEA India',
    slug: 'nivea',
    industry: 'Beauty & Skincare',
    budgetTier: 'Mid-Tier',
    description: 'Skincare and beauty creators needed to showcase daily hydration routines with NIVEA Soft cream.',
    logo: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=120&h=120&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=300&fit=crop',
    campaignTypes: ['GRWM Reel', 'Skincare Routine', 'Product Review'],
    requirements: 'Clean aesthetic, 25k+ followers, verified beauty enthusiast audience.',
    isActive: true,
    contactEmail: 'nivea@schbang.com',
    website: 'https://nivea.in',
    likesCount: 29,
  },
  {
    id: '4',
    name: 'Swiggy',
    slug: 'swiggy',
    industry: 'Food Delivery & Tech',
    budgetTier: 'Mega',
    description: 'Food vloggers and city explorers needed for the late-night cravings and IPL match day feasts.',
    logo: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=120&h=120&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=300&fit=crop',
    campaignTypes: ['Food Hunt Reel', 'Story Swipe-Up', 'Matchday Snack Review'],
    requirements: 'Food lovers with hyper-local Tier 1/2 metro audience.',
    isActive: true,
    contactEmail: 'swiggy-partners@schbang.com',
    website: 'https://swiggy.com',
    likesCount: 67,
  },
  {
    id: '5',
    name: 'Kotak811',
    slug: 'kotak811',
    industry: 'Finance & FinTech',
    budgetTier: 'Macro',
    description: 'Finance educators and young adult lifestyle creators to promote digital zero-balance savings and smart investing.',
    logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=120&h=120&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=300&fit=crop',
    campaignTypes: ['Explainer Reel', 'Money Management Post', 'App Feature Tour'],
    requirements: 'Credible voice, 18-35 age group skew, transparent disclaimers.',
    isActive: true,
    contactEmail: 'kotak-collabs@schbang.com',
    website: 'https://kotak811.com',
    likesCount: 21,
  },
  {
    id: '6',
    name: 'Myntra',
    slug: 'myntra',
    industry: 'Fashion & E-Commerce',
    budgetTier: 'Macro',
    description: 'End of Reason Sale (EORS) creators across Gen-Z street style, festive wear, and everyday drip.',
    logo: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=120&h=120&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=300&fit=crop',
    campaignTypes: ['OOTD Reel', 'Styling Lookbook', 'Try-On Haul'],
    requirements: 'Trend-forward, high visual aesthetics, active fashion community.',
    isActive: true,
    contactEmail: 'myntra-influencers@schbang.com',
    website: 'https://myntra.com',
    likesCount: 45,
  }
];

export const MOCK_BRANDS = INITIAL_BRANDS;

export const INITIAL_CREATORS: CreatorItem[] = [
  {
    id: 'c1',
    name: 'Rohan Joshi',
    handle: '@rohan_joshicomics',
    email: 'rohan.creates@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
    niche: ['Comedy', 'Food & FMCG', 'Lifestyle'],
    location: 'Mumbai, India',
    bio: 'Stand-up comedian & storyteller creating relatable humorous sketches around everyday Indian family moments.',
    tier: 'Mid-Tier',
    igFollowers: 145000,
    igEngagementRate: 6.8,
    igHandle: '@rohan_joshicomics',
    ytSubscribers: 85000,
    ytAvgViews: '42k',
    fbFollowers: 12000,
    performance: {
      totalCampaigns: 4,
      totalReach: '2.4M Views',
      avgEngagementRate: '6.8%',
      reliabilityScore: 4.9,
      onTimeDelivery: '100%',
    },
    brandCollaborations: [
      {
        brandName: 'Britannia',
        brandLogo: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=60&h=60&fit=crop',
        campaignTitle: 'Jim Jam Family Remix',
        viewsDelivered: '820K',
        engagementRate: '7.4%',
        completedAt: 'Dec 2025',
        deliverableType: 'Comedy Reel',
      },
      {
        brandName: 'Swiggy',
        brandLogo: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=60&h=60&fit=crop',
        campaignTitle: 'Midnight Cravings Hunt',
        viewsDelivered: '690K',
        engagementRate: '6.5%',
        completedAt: 'Oct 2025',
        deliverableType: 'Reel + Story',
      },
      {
        brandName: 'Kotak811',
        brandLogo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=60&h=60&fit=crop',
        campaignTitle: 'Adulting & Zero Balance',
        viewsDelivered: '510K',
        engagementRate: '5.9%',
        completedAt: 'Aug 2025',
        deliverableType: 'Explainer Reel',
      },
      {
        brandName: 'Fevicol',
        brandLogo: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=60&h=60&fit=crop',
        campaignTitle: 'Fevicol Ka Unbreakable Bond',
        viewsDelivered: '380K',
        engagementRate: '7.1%',
        completedAt: 'May 2025',
        deliverableType: 'Witty Sketch',
      }
    ],
    audienceDemographics: {
      topCity: 'Mumbai & Pune (48%)',
      topAgeBracket: '18–24 (54%), 25–34 (38%)',
      genderRatio: '58% Male / 42% Female',
    },
    likedBrandIds: ['1', '2', '4'],
  },
  {
    id: 'c2',
    name: 'Aanya Sen',
    handle: '@aanya.beauty',
    email: 'aanya.beauty@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    niche: ['Beauty & Skincare', 'Lifestyle', 'Fashion'],
    location: 'Bangalore, India',
    bio: 'Dermatologist-approved skincare enthusiast & clean makeup content creator sharing science-backed morning routines.',
    tier: 'Micro',
    igFollowers: 68000,
    igEngagementRate: 7.9,
    igHandle: '@aanya.beauty',
    ytSubscribers: 34000,
    ytAvgViews: '28k',
    performance: {
      totalCampaigns: 3,
      totalReach: '1.1M Views',
      avgEngagementRate: '7.9%',
      reliabilityScore: 5.0,
      onTimeDelivery: '100%',
    },
    brandCollaborations: [
      {
        brandName: 'NIVEA India',
        brandLogo: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=60&h=60&fit=crop',
        campaignTitle: 'Morning Dew Skincare Routine',
        viewsDelivered: '490K',
        engagementRate: '8.4%',
        completedAt: 'Jan 2026',
        deliverableType: 'GRWM Reel',
      },
      {
        brandName: 'Myntra',
        brandLogo: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=60&h=60&fit=crop',
        campaignTitle: 'Festive Skincare Prep',
        viewsDelivered: '340K',
        engagementRate: '7.2%',
        completedAt: 'Nov 2025',
        deliverableType: 'Lookbook Reel',
      },
      {
        brandName: 'Britannia',
        brandLogo: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=60&h=60&fit=crop',
        campaignTitle: 'Healthy Snack Breaks',
        viewsDelivered: '270K',
        engagementRate: '8.1%',
        completedAt: 'Jul 2025',
        deliverableType: 'Story Series',
      }
    ],
    audienceDemographics: {
      topCity: 'Bangalore & Delhi (56%)',
      topAgeBracket: '18–24 (62%), 25–34 (32%)',
      genderRatio: '22% Male / 78% Female',
    },
    likedBrandIds: ['3', '6'],
  },
  {
    id: 'c3',
    name: 'Siddharth Verma',
    handle: '@siddharth_tech',
    email: 'sid.verma@techmail.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    niche: ['Tech & Gadgets', 'Finance & FinTech', 'Productivity'],
    location: 'Gurgaon, India',
    bio: 'Software engineer breaking down fintech apps, consumer tech, and everyday productivity gear with high-spec 4K visuals.',
    tier: 'Macro',
    igFollowers: 320000,
    igEngagementRate: 5.2,
    igHandle: '@siddharth_tech',
    ytSubscribers: 410000,
    ytAvgViews: '115k',
    performance: {
      totalCampaigns: 5,
      totalReach: '4.8M Views',
      avgEngagementRate: '5.2%',
      reliabilityScore: 4.8,
      onTimeDelivery: '96%',
    },
    brandCollaborations: [
      {
        brandName: 'Kotak811',
        brandLogo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=60&h=60&fit=crop',
        campaignTitle: 'Fast Digital Account Setup in 3 Mins',
        viewsDelivered: '1.4M',
        engagementRate: '5.8%',
        completedAt: 'Jan 2026',
        deliverableType: 'YouTube Deep Dive',
      },
      {
        brandName: 'Swiggy',
        brandLogo: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=60&h=60&fit=crop',
        campaignTitle: 'Late Night Tech Work Sesh Feast',
        viewsDelivered: '890K',
        engagementRate: '4.9%',
        completedAt: 'Nov 2025',
        deliverableType: 'Reel',
      }
    ],
    audienceDemographics: {
      topCity: 'Delhi NCR, Mumbai, Hyderabad (64%)',
      topAgeBracket: '21–34 (78%)',
      genderRatio: '74% Male / 26% Female',
    },
    likedBrandIds: ['5', '4'],
  },
  {
    id: 'c4',
    name: 'Natasha Rao',
    handle: '@natasharao_fits',
    email: 'natasha.rao@fits.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
    niche: ['Fashion & Apparel', 'Lifestyle', 'Streetwear'],
    location: 'Mumbai, India',
    bio: 'Stylist & Gen-Z fashion curator exploring street drip, thrift finds, and luxury Indian fusion fits.',
    tier: 'Mid-Tier',
    igFollowers: 112000,
    igEngagementRate: 6.4,
    igHandle: '@natasharao_fits',
    ytSubscribers: 48000,
    ytAvgViews: '35k',
    performance: {
      totalCampaigns: 3,
      totalReach: '1.6M Views',
      avgEngagementRate: '6.4%',
      reliabilityScore: 4.9,
      onTimeDelivery: '100%',
    },
    brandCollaborations: [
      {
        brandName: 'Myntra',
        brandLogo: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=60&h=60&fit=crop',
        campaignTitle: 'EORS 7-Day Streetwear Challenge',
        viewsDelivered: '920K',
        engagementRate: '6.8%',
        completedAt: 'Dec 2025',
        deliverableType: 'Lookbook Reel',
      },
      {
        brandName: 'Fevicol',
        brandLogo: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=60&h=60&fit=crop',
        campaignTitle: 'Upcycled Denim Custom Jacket',
        viewsDelivered: '410K',
        engagementRate: '5.9%',
        completedAt: 'Sep 2025',
        deliverableType: 'DIY Reel',
      }
    ],
    audienceDemographics: {
      topCity: 'Mumbai, Delhi, Pune (52%)',
      topAgeBracket: '18–24 (70%)',
      genderRatio: '35% Male / 65% Female',
    },
    likedBrandIds: ['6', '2'],
  },
  {
    id: 'c5',
    name: 'Kabir Seth',
    handle: '@kabir_explores',
    email: 'kabir.eats@explores.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    niche: ['Food & FMCG', 'Travel', 'Street Food'],
    location: 'Delhi, India',
    bio: 'Traveling across 100 Indian cities to find legendary culinary secrets, midnight street stalls, and iconic brands.',
    tier: 'Macro',
    igFollowers: 285000,
    igEngagementRate: 8.2,
    igHandle: '@kabir_explores',
    ytSubscribers: 590000,
    ytAvgViews: '180k',
    performance: {
      totalCampaigns: 4,
      totalReach: '3.9M Views',
      avgEngagementRate: '8.2%',
      reliabilityScore: 5.0,
      onTimeDelivery: '100%',
    },
    brandCollaborations: [
      {
        brandName: 'Swiggy',
        brandLogo: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=60&h=60&fit=crop',
        campaignTitle: 'Delhi 3 AM Food Map',
        viewsDelivered: '1.8M',
        engagementRate: '9.1%',
        completedAt: 'Jan 2026',
        deliverableType: 'YouTube Episode',
      },
      {
        brandName: 'Britannia',
        brandLogo: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=60&h=60&fit=crop',
        campaignTitle: 'Good Day Tea Stall Conversations',
        viewsDelivered: '1.1M',
        engagementRate: '8.4%',
        completedAt: 'Oct 2025',
        deliverableType: 'Short-doc Reel',
      }
    ],
    audienceDemographics: {
      topCity: 'Delhi, Lucknow, Chandigarh (58%)',
      topAgeBracket: '18–34 (82%)',
      genderRatio: '62% Male / 38% Female',
    },
    likedBrandIds: ['4', '1'],
  }
];

export const INITIAL_APPLICATIONS: ApplicationItem[] = [
  {
    id: 'app_1',
    creatorName: 'Rohan Joshi',
    creatorEmail: 'rohan.creates@gmail.com',
    brandName: 'Britannia',
    brandId: '1',
    status: 'PENDING',
    date: '2026-02-18',
    proposal: 'I want to create a hilarious 60s Reel where three generations of my family fight over the last Jim Jam biscuit during a cricket match.',
    expectedRate: 45000,
    deliverables: ['1x Instagram Reel', '2x Story Slides'],
    metrics: {
      instagramHandle: '@rohan_joshicomics',
      instagramFollowers: 145000,
      instagramER: '6.8%',
      youtubeChannel: 'Rohan Joshi Official',
      youtubeSubscribers: 85000,
    },
    adminNotes: 'Great comedic pitch. Matches Jim Jam target tone.',
  },
  {
    id: 'app_2',
    creatorName: 'Aanya Sen',
    creatorEmail: 'aanya.beauty@gmail.com',
    brandName: 'NIVEA India',
    brandId: '3',
    status: 'SHORTLISTED',
    date: '2026-02-17',
    proposal: 'A 4k aesthetic "Morning Dew Skincare Routine" showcasing NIVEA Soft cream as the holy grail base before light sunscreen and makeup.',
    expectedRate: 35000,
    deliverables: ['1x GRWM Reel (4K)', '1x Product Flatlay Photo'],
    metrics: {
      instagramHandle: '@aanya.beauty',
      instagramFollowers: 68000,
      instagramER: '7.9%',
      youtubeSubscribers: 34000,
    },
    adminNotes: 'High ER (7.9%). Approved for creative script phase.',
  },
  {
    id: 'app_3',
    creatorName: 'Siddharth Verma',
    creatorEmail: 'sid.verma@techmail.com',
    brandName: 'Kotak811',
    brandId: '5',
    status: 'APPROVED',
    date: '2026-02-15',
    proposal: 'A sleek tech-desk explainer breaking down the zero-balance account setup in under 3 minutes with UI screen recordings and cashback breakdown.',
    expectedRate: 80000,
    deliverables: ['1x Dedicated YouTube Video', '1x Repurposed IG Reel'],
    metrics: {
      instagramHandle: '@siddharth_tech',
      instagramFollowers: 320000,
      instagramER: '5.2%',
      youtubeChannel: 'Sid Tech Talks',
      youtubeSubscribers: 410000,
    },
    adminNotes: 'Contract sent. Target upload: March 1st.',
  }
];

export const MOCK_APPLICATIONS = INITIAL_APPLICATIONS;
