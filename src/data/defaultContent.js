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
      "Special Mentorship for Polytechnic and B.Tech Students in Haryana",
      "Live Doubt Solving Every Saturday",
      "Free Engineering Workshop This Week",
      "34K+ YouTube Learning Community",
      "Diploma + Engineering Exam Strategy Sessions",
    ],
    eyebrow: "Haryana's Trusted Mentor for Polytechnic and B.Tech Learners",
    titleTemplate: "Master Polytechnic and B.Tech subjects with {word}.",
    subtitle:
      "Visual learning systems, live mentoring, and exam-ready training for Polytechnic and B.Tech students across major engineering subjects in Haryana.",
    heroBadges: [
      "Answer Writing Mastery",
      "Live Mentorship",
      "Hindi + English Support",
      "Polytechnic + B.Tech Subjects",
    ],
    quickJourney: [
      "Watch Demo",
      "Pick Program",
      "Join Mentorship",
      "Track Progress",
    ],
    visualPrograms: [
      {
        title: "Polytechnic Excellence",
        badge: "Diploma Semesters",
        glow: "sky",
      },
      { title: "B.Tech Support", badge: "Engineering Focus", glow: "rose" },
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
    freeResources: {
      heading: "Free Resources",
      subtitle:
        "Download practical notes, question banks, and revision sheets for Polytechnic and B.Tech.",
      categories: ["B.Tech", "Diploma", "Programming", "Others"],
      items: [
        {
          id: "free-res-1",
          title: "Engineering Maths Formula Sheet",
          url: "https://drive.google.com/file/d/your-file-id/view",
          category: "B.Tech",
        },
      ],
      youtubeLinks: [
        {
          id: "yt-res-1",
          url: "https://youtu.be/E-qCrzcvPbM?si=83_mb2JBMlSsWTIe",
        },
        {
          id: "yt-res-2",
          url: "https://youtu.be/ZCypdX6wf-I?si=hZgn51MfJIfvM3nq",
        },
      ],
    },
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
      title: "Ready to level up your Polytechnic and B.Tech preparation?",
      text: "Professional learning tracks for Polytechnic and B.Tech outcomes.",
    },
  },
  about: {
    eyebrow: "Mentor Story",
    title: "Professional teaching with modern visual methods",
    subtitle:
      "A focused mentorship model for Polytechnic and B.Tech students in Haryana.",
    profileHighlights: [
      { title: "8+ Years", subtitle: "Mentorship" },
      { title: "34K+", subtitle: "YouTube Learners" },
      { title: "Haryana", subtitle: "Polytechnic + B.Tech Focus" },
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
      "Concise, professional programs for Polytechnic and B.Tech students in Haryana.",
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
        subtitle: "Polytechnic + B.Tech in Haryana",
      },
      { title: "Mode Flexibility", subtitle: "Online live and hybrid" },
    ],
    studentTypes: [
      "Polytechnic Student",
      "B.Tech Student",
      "Lateral Entry Aspirant",
    ],
    programTypes: [
      "Foundation Batch",
      "Polytechnic Support",
      "B.Tech Support",
      "Crash Course",
      "Test Series",
    ],
    learningModes: ["Online Live", "Recorded + Live", "Weekend Intensive"],
    mailTo: "civilworld.edu@example.com",
    mailSubject: "Civil World - Polytechnic and B.Tech Course Enquiry",
  },
  notFound: {
    title: "404",
    subtitle: "Page not found",
  },
  footer: {
    description:
      "Haryana based teaching platform for Polytechnic and B.Tech students, with clear concepts, strategy, and exam-ready mentorship.",
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
