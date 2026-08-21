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
    website: 'https://britannia.co.in'
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
    website: 'https://pidilite.com'
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
    website: 'https://nivea.in'
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
    website: 'https://swiggy.com'
  },
  {
    id: '5',
    name: 'Kotak811',
    slug: 'kotak811',
    industry: 'Finance & FinTech',
    budgetTier: 'Mid-Tier',
    description: 'Finance educators and young adult lifestyle creators to promote digital zero-balance savings and smart investing.',
    logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=120&h=120&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&h=300&fit=crop',
    campaignTypes: ['Explain Like I am 5 Reel', 'Finance Tip Post', 'App Walkthrough'],
    requirements: 'Clear financial literacy, strictly compliant with SEBI and RBI advertising guidelines.',
    isActive: true,
    contactEmail: 'kotak@schbang.com',
    website: 'https://kotak811.com'
  },
  {
    id: '6',
    name: 'Myntra',
    slug: 'myntra',
    industry: 'Fashion & E-commerce',
    budgetTier: 'Macro',
    description: 'End of Reason Sale (EORS) creators across Gen-Z street style, festive wear, and everyday drip.',
    logo: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=120&h=120&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=300&fit=crop',
    campaignTypes: ['Haul Video', 'Lookbook Reel', 'Affiliate Story Links'],
    requirements: 'Fashion forward creators with strong fashion tagging.',
    isActive: true,
    contactEmail: 'myntra-eors@schbang.com',
    website: 'https://myntra.com'
  }
];

export const INITIAL_APPLICATIONS: ApplicationItem[] = [
  {
    id: 'app-101',
    creatorName: 'Rohan Joshi',
    creatorEmail: 'rohan.creates@gmail.com',
    brandName: 'Britannia',
    brandId: '1',
    status: 'PENDING',
    date: '2026-08-20',
    proposal: 'I want to create a hilarious 60s Reel where three generations of my family fight over the last Jim Jam biscuit during a cricket match.',
    expectedRate: 45000,
    deliverables: ['1x Instagram Reel (Collaborator tag)', '2x Instagram Stories with sticker link'],
    metrics: {
      instagramHandle: '@rohan_joshicomics',
      instagramFollowers: 145000,
      instagramER: '5.8%',
      youtubeChannel: 'Rohan Comedy',
      youtubeSubscribers: 82000,
      facebookFollowers: 25000
    }
  },
  {
    id: 'app-102',
    creatorName: 'Aanya Sen',
    creatorEmail: 'aanya.beauty@gmail.com',
    brandName: 'NIVEA India',
    brandId: '3',
    status: 'UNDER_REVIEW',
    date: '2026-08-19',
    proposal: 'A 4k aesthetic "Morning Dew Skincare Routine" showcasing NIVEA Soft cream as the holy grail base before light sunscreen and makeup.',
    expectedRate: 35000,
    deliverables: ['1x High-Production Reel', '1x Static Carousel Post', 'High-Res RAW Assets'],
    metrics: {
      instagramHandle: '@aanyaskin',
      instagramFollowers: 68000,
      instagramER: '6.4%',
      youtubeChannel: 'Aanya Glow',
      youtubeSubscribers: 31000
    }
  },
  {
    id: 'app-103',
    creatorName: 'Kabir Verma',
    creatorEmail: 'kabir.vlogs@outlook.com',
    brandName: 'Swiggy',
    brandId: '4',
    status: 'SHORTLISTED',
    date: '2026-08-18',
    proposal: 'Midnight Food Challenge: Ordering the top 5 most viral street foods in Mumbai on Swiggy and rating them at 2 AM.',
    expectedRate: 60000,
    deliverables: ['1x Long-form YouTube Vlog (8-10 mins)', '1x Viral Shorts Cut', '1x Instagram Reel'],
    metrics: {
      instagramHandle: '@kabir_bites',
      instagramFollowers: 220000,
      instagramER: '4.9%',
      youtubeChannel: 'Kabir Eats India',
      youtubeSubscribers: 410000,
      facebookFollowers: 80000
    }
  }
];

export const MOCK_BRANDS = INITIAL_BRANDS;
export const MOCK_APPLICATIONS = INITIAL_APPLICATIONS;
