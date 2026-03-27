import {
  courses,
  faqItems,
  galleryImages,
  playStoreLink,
  resources,
  socialLinks,
  stats,
  testimonials,
} from "./siteData";

export const defaultContent = {
  meta: {
    brandName: "Civil World",
  },
  home: {
    typedWords: ["clarity", "strategy", "confidence", "high scores"],
    updates: [
      "New Batch Starts Monday",
      "Special Mentorship for B.Tech Students in Haryana",
      "Live Doubt Solving Every Saturday",
      "Free Political Theory Workshop This Week",
      "34K+ YouTube Learning Community",
      "Board + Competitive Exam Strategy Sessions",
    ],
    eyebrow: "Haryana's Trusted Mentor for School and B.Tech Learners",
    titleTemplate:
      "Master Political Science and all B.Tech subjects with {word}.",
    subtitle:
      "Visual learning systems, live mentoring, and exam-ready training for school, competitive, and B.Tech students across all major subjects in Haryana.",
    heroBadges: [
      "Answer Writing Mastery",
      "Live Mentorship",
      "Hindi + English Support",
      "All B.Tech Subjects",
    ],
    quickJourney: [
      "Watch Demo",
      "Pick Program",
      "Join Mentorship",
      "Track Progress",
    ],
    visualPrograms: [
      { title: "School Excellence", badge: "Class 11-12", glow: "sky" },
      { title: "B.Tech Support", badge: "Haryana Focus", glow: "rose" },
      { title: "Exam Accelerator", badge: "Crash Mode", glow: "mint" },
    ],
    pageCards: [
      { title: "Mentor Story", to: "/about" },
      { title: "Courses", to: "/courses" },
      { title: "Resources", to: "/resources" },
      { title: "Gallery", to: "/gallery" },
      { title: "Contact", to: "/contact" },
    ],
    channelBand: [
      "Live Classes",
      "Premium Notes",
      "Rapid Revision",
      "Test Series",
      "Mentor Feedback",
      "Career Guidance",
    ],
    testimonialsTitle: "Result snapshots",
    faqTitle: "Quick answers",
    mosaic: {
      title: "Dashboard Style Mentorship",
      text: "Track attendance, tests, and improvement in one place.",
    },
    newsletter: {
      eyebrow: "Weekly Updates",
      title: "Get class alerts and notes.",
    },
    cta: {
      title: "Ready to level up your Political Science preparation?",
      text: "Professional learning tracks for school and B.Tech outcomes.",
    },
  },
  about: {
    eyebrow: "Mentor Story",
    title: "Professional teaching with modern visual methods",
    subtitle:
      "A focused mentorship model for school, competitive, and B.Tech students in Haryana.",
    profileHighlights: [
      { title: "8+ Years", subtitle: "Mentorship" },
      { title: "34K+", subtitle: "YouTube Learners" },
      { title: "Haryana", subtitle: "School + B.Tech Focus" },
    ],
    visualCards: [
      "Concept Studio",
      "Answer Writing Lab",
      "Current Affairs Board",
    ],
  },
  coursesPage: {
    eyebrow: "Programs",
    title: "Choose your visual learning track",
    subtitle:
      "Concise, professional programs for school, competitive, and B.Tech students in Haryana.",
    courseOutcomes: [
      "Concept Clarity",
      "Exam Writing",
      "Weekly Tests",
      "Mentor Review",
    ],
  },
  resourcesPage: {
    eyebrow: "Resources",
    title: "Visual resource library",
    subtitle: "Filter quickly and open what you need right now.",
    topics: [
      "all",
      "theory",
      "constitution",
      "relations",
      "practice",
      "current",
    ],
  },
  galleryPage: {
    eyebrow: "Gallery",
    title: "Visual learning moments",
    subtitle: "Tap any card to view full size.",
  },
  contactPage: {
    eyebrow: "Contact",
    title: "Advanced admission enquiry",
    subtitle: "Share your profile and get a tailored course plan.",
    topStrip: [
      { title: "Fast Response", subtitle: "Within 12-24 hours" },
      {
        title: "Professional Guidance",
        subtitle: "School + B.Tech in Haryana",
      },
      { title: "Mode Flexibility", subtitle: "Online live and hybrid" },
    ],
    studentTypes: ["School Student", "B.Tech Student", "Competitive Aspirant"],
    programTypes: [
      "Foundation Batch",
      "B.Tech Support",
      "Crash Course",
      "Test Series",
    ],
    learningModes: ["Online Live", "Recorded + Live", "Weekend Intensive"],
    mailTo: "civilworld.edu@example.com",
    mailSubject: "Civil World - School and B.Tech Course Enquiry",
  },
  notFound: {
    title: "404",
    subtitle: "Page not found",
  },
  footer: {
    description:
      "Haryana based Political Science teaching platform for school and B.Tech students, with clear concepts, strategy, and exam-ready mentorship.",
  },
  data: {
    socialLinks,
    playStoreLink,
    stats,
    testimonials,
    faqItems,
    courses,
    resources,
    galleryImages,
  },
};
