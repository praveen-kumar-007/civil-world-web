import {
  courses,
  faqItems,
  galleryImages,
  playStoreLink,
  resources,
  socialLinks,
  stats,
  testimonials,
} from "./siteData.js";

export const defaultContent = {
  meta: {
    brandName: "Civil World Academy",
    brandTagline: "Polytechnic and B.Tech Mentorship Studio",
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
    eyebrow: "Haryana's Trusted Polytechnic and B.Tech Mentor",
    titleTemplate: "Master Polytechnic and B.Tech subjects with {word}.",
    subtitle:
      "Concept-first teaching, live mentoring, and structured exam systems for Polytechnic and B.Tech students across Haryana.",
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
      youtubeHeading: "YouTube Learning Videos",
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
    hsbteResultPortal: {
      heading: "Haryana Polytechnic Results",
      title: "HSBTE Result Portal",
      description:
        "Check Haryana State Board of Technical Education semester results directly from the official portal.",
      ctaLabel: "Check HSBTE Result",
      url: "https://hsbte.org.in/",
      logo: "/images/hsbte-logo.png",
      details: [
        "Open the official HSBTE portal",
        "Select result section",
        "Enter your roll number and semester",
      ],
    },
    testimonialsTitle: "Result snapshots",
    faqTitle: "Quick answers",
    mosaic: {
      title: "Dashboard Style Mentorship",
      text: "Track attendance, tests, and improvement in one place.",
    },
    featureSection: {
      eyebrow: "Why Civil World",
      title: "Engineered for modern learners who want real outcomes",
    },
    featureHighlights: [
      {
        title: "Topic-to-Answer Workflow",
        text: "Every concept is mapped to exam questions so you know exactly how to write scoring answers.",
      },
      {
        title: "Weekly Performance Analytics",
        text: "Track strengths, weaknesses, and improvement areas through structured tests and insights.",
      },
      {
        title: "Site and Lab Integration",
        text: "Core civil topics are taught with site-based examples, lab context, and practical interpretation.",
      },
      {
        title: "Community-Based Learning",
        text: "Join discussions, mentor support, and peer learning challenges for consistent progress.",
      },
    ],
    newsletter: {
      eyebrow: "Weekly Updates",
      title: "Get class alerts and notes.",
    },
    cta: {
      title: "Ready to level up your Polytechnic and B.Tech preparation?",
      text: "Join an outcome-focused mentorship model with clear direction, test discipline, and personal guidance.",
    },
  },
  about: {
    eyebrow: "Mentor Story",
    title: "Professional teaching with practical engineering context",
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
      "Civil Drawing Board",
    ],
    aboutCards: [
      {
        title: "Concept Clarity First",
        text: "Every topic starts with relatable examples, then moves into exam language and frameworks.",
      },
      {
        title: "Answer Writing Method",
        text: "Students learn intros, body structure, and conclusion templates for faster scoring answers.",
      },
      {
        title: "Civil Application Approach",
        text: "Every chapter is connected to civil labs, site tasks, and practical semester requirements.",
      },
    ],
  },
  coursesPage: {
    eyebrow: "Programs",
    title: "Choose your high-impact learning track",
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
    title: "Resource command center",
    subtitle: "Filter quickly and open what you need right now.",
    topics: ["all", "survey", "design", "materials", "practice", "lab"],
  },
  galleryPage: {
    eyebrow: "Gallery",
    title: "Learning moments and milestone wins",
    subtitle: "Tap any card to view full size.",
  },
  contactPage: {
    eyebrow: "Contact",
    title: "Admission and mentorship consultation",
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
      "Civil World Academy is a Haryana-based mentorship platform for Polytechnic and B.Tech learners focused on concept clarity, consistent practice, and exam-ready performance.",
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
