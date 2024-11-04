'use client'
import { LandingCTA } from '@/designSystem/landing/LandingCTA'
import { LandingContainer } from '@/designSystem/landing/LandingContainer'
import LandingFAQ from '@/designSystem/landing/LandingFAQ'
import { LandingFeatures } from '@/designSystem/landing/LandingFeatures'
import { LandingHero } from '@/designSystem/landing/LandingHero'
import { LandingHowItWorks } from '@/designSystem/landing/LandingHowItWorks'
import { LandingPainPoints } from '@/designSystem/landing/LandingPainPoints'
import { LandingPricing } from '@/designSystem/landing/LandingPricing'
import { LandingSocialProof } from '@/designSystem/landing/LandingSocialProof'
import { LandingSocialRating } from '@/designSystem/landing/LandingSocialRating'
import { LandingTestimonials } from '@/designSystem/landing/LandingTestimonials'
import {
  HeartOutlined,
  SafetyOutlined,
  TeamOutlined,
  ShopOutlined,
  TrophyOutlined,
  GiftOutlined,
} from '@ant-design/icons'

export default function LandingPage() {
  const features = [
    {
      heading: `Connect with Fellow Owl Lovers`,
      description: `Join a vibrant community of owl enthusiasts, share experiences, and build lasting friendships with people who share your passion.`,
      icon: <TeamOutlined />,
    },
    {
      heading: `Secure Marketplace`,
      description: `Buy and sell owls with confidence through our verified marketplace with built-in fraud protection and secure payment processing.`,
      icon: <SafetyOutlined />,
    },
    {
      heading: `Share Your Journey`,
      description: `Create stunning profiles for your owls, share their stories, and connect with admirers worldwide.`,
      icon: <HeartOutlined />,
    },
    {
      heading: `Exclusive Merchandise`,
      description: `Turn your beloved owls into custom merchandise and earn passive income from your passion.`,
      icon: <ShopOutlined />,
    },
    {
      heading: `Expert Knowledge`,
      description: `Access verified owl care tips, breeding guides, and expert advice from seasoned professionals.`,
      icon: <TrophyOutlined />,
    },
    {
      heading: `Special Perks`,
      description: `Enjoy member-only discounts on owl supplies, early access to rare listings, and exclusive community events.`,
      icon: <GiftOutlined />,
    },
  ]

  const testimonials = [
    {
      name: `Sarah Mitchell`,
      designation: `Professional Owl Breeder`,
      content: `OwlConnect transformed my breeding business. The verified marketplace gives my buyers confidence, and I've connected with amazing fellow breeders.`,
      avatar: 'https://randomuser.me/api/portraits/women/6.jpg',
    },
    {
      name: `James Wilson`,
      designation: `Owl Enthusiast`,
      content: `Finally, a platform that understands owl lovers! I've made incredible friends and learned so much from the community.`,
      avatar: 'https://randomuser.me/api/portraits/men/7.jpg',
    },
    {
      name: `Emma Thompson`,
      designation: `Merchandise Creator`,
      content: `My owl merchandise store has taken off thanks to OwlConnect. It's amazing to share my passion and earn from it too!`,
      avatar: 'https://randomuser.me/api/portraits/women/27.jpg',
    },
  ]

  const navItems = [
    {
      title: `Features`,
      link: `#features`,
    },
    {
      title: `Pricing`,
      link: `#pricing`,
    },
    {
      title: `FAQ`,
      link: `#faq`,
    },
  ]

  const packages = [
    {
      title: `Owl Enthusiast`,
      description: `Perfect for casual owl lovers`,
      monthly: 9,
      yearly: 89,
      features: [
        `Basic profile creation`,
        `Community access`,
        `Marketplace browsing`,
      ],
    },
    {
      title: `Professional Breeder`,
      description: `Ideal for serious owl breeders`,
      monthly: 29,
      yearly: 290,
      features: [
        `Verified seller badge`,
        `Priority listings`,
        `Advanced analytics`,
        `Custom merchandise store`,
      ],
      highlight: true,
    },
    {
      title: `Sanctuary`,
      description: `For owl sanctuaries and organizations`,
      monthly: 49,
      yearly: 490,
      features: [
        `Multiple handler accounts`,
        `Donation processing`,
        `Event management`,
        `API access`,
      ],
    },
  ]

  const questionAnswers = [
    {
      question: `How do you ensure marketplace safety?`,
      answer: `We verify all sellers, implement secure payment processing, and provide buyer protection for all transactions.`,
    },
    {
      question: `Can I sell merchandise of my owls?`,
      answer: `Yes! Our platform allows you to create and sell custom merchandise featuring your owls, with automated fulfillment.`,
    },
    {
      question: `What support do you offer breeders?`,
      answer: `Professional breeders get verified badges, priority listings, advanced analytics, and dedicated customer support.`,
    },
    {
      question: `Is the platform available worldwide?`,
      answer: `Yes, OwlConnect is available globally, with local communities and region-specific marketplace features.`,
    },
  ]

  const steps = [
    {
      heading: `Create Your Profile`,
      description: `Sign up and create stunning profiles for you and your owls`,
    },
    {
      heading: `Join the Community`,
      description: `Connect with fellow enthusiasts, share experiences, and learn from experts`,
    },
    {
      heading: `Explore the Marketplace`,
      description: `Browse verified listings, shop for supplies, or list your owls`,
    },
    {
      heading: `Grow Your Presence`,
      description: `Create merchandise, build your following, and earn from your passion`,
    },
  ]

  const painPoints = [
    {
      emoji: `😔`,
      title: `Feeling isolated in your owl passion`,
    },
    {
      emoji: `😟`,
      title: `Worried about marketplace scams`,
    },
    {
      emoji: `😤`,
      title: `Struggling to monetize your expertise`,
    },
  ]

  return (
    <LandingContainer navItems={navItems}>
      <LandingHero
        title={`Connect, Share, and Thrive in the World's Largest Owl Community`}
        subtitle={`Join over 150,000 owl enthusiasts in a safe, specialized platform where passion meets opportunity`}
        buttonText={`Join the Community`}
        pictureUrl={`https://marblism-dashboard-api--production-public.s3.us-west-1.amazonaws.com/efPL3F-owlhub-aT4C`}
        socialProof={
          <LandingSocialRating
            avatarItems={[
              { src: 'https://randomuser.me/api/portraits/men/51.jpg' },
              { src: 'https://randomuser.me/api/portraits/women/9.jpg' },
              { src: 'https://randomuser.me/api/portraits/women/52.jpg' },
              { src: 'https://randomuser.me/api/portraits/men/5.jpg' },
              { src: 'https://randomuser.me/api/portraits/men/4.jpg' },
            ]}
            numberOfUsers={150000}
            suffixText={`happy owl enthusiasts`}
          />
        }
      />
      <LandingPainPoints
        title={`72% of owl owners struggle to find dedicated spaces for their passion`}
        painPoints={painPoints}
      />
      <LandingHowItWorks
        title={`Your Journey to a Thriving Owl Community`}
        steps={steps}
      />
      <LandingFeatures
        id="features"
        title={`Everything You Need to Succeed in the Owl World`}
        subtitle={`Purpose-built features to help you connect, protect, and prosper`}
        features={features}
      />
      <LandingTestimonials
        title={`Join Thousands of Successful Owl Enthusiasts`}
        subtitle={`See how OwlConnect has transformed their passion into prosperity`}
        testimonials={testimonials}
      />
      <LandingPricing
        id="pricing"
        title={`Choose Your Path to Success`}
        subtitle={`Flexible plans for every stage of your owl journey`}
        packages={packages}
      />
      <LandingFAQ
        id="faq"
        title={`Common Questions About OwlConnect`}
        subtitle={`Everything you need to know about joining our community`}
        questionAnswers={questionAnswers}
      />
      <LandingCTA
        title={`Start Your Owl Journey Today`}
        subtitle={`Join the world's largest owl community and turn your passion into opportunity`}
        buttonText={`Get Started Now`}
        buttonLink={`/register`}
      />
    </LandingContainer>
  )
}
