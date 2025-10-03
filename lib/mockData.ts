// Mock data for the frontend-only application

// About page interfaces
export interface PersonalInfo {
  name: string
  title: string
  location: string
  phone: string
  email: string
  birthDate: string
  hobbies: string[]
  profileImage: string
  story: string[]
}

export interface Experience {
  role: string
  type: string
  company: string
  period: string
  location: string
  skills: string[]
}

export interface Education {
  degree: string
  school: string
  period: string
  location: string
  description: string
}

export interface AboutData {
  personalInfo: PersonalInfo
  skills: string[]
  experiences: Experience[]
  education: Education[]
}

export interface User {
  id: string
  username: string
  email: string
  avatar: string | null
  createdAt: string
  updatedAt: string
}

export interface Post {
  id: string
  title: string
  content: string
  slug: string
  createdAt: string
  updatedAt: string
  authorId: string
}

export interface PostWithAuthor extends Post {
  author: User
  _count: {
    likes: number
    comments: number
  }
}

// Mock users
export const mockUsers: User[] = [
  {
    id: '1',
    username: 'Makara Roth',
    email: 'chhuonmakara@gmail.com',
    avatar: '/avatars/roth.png',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    username: 'Jane Smith',
    email: 'jane.smith@example.com',
    avatar: '/avatars/jane.png',
    createdAt: '2024-01-10T08:30:00Z',
    updatedAt: '2024-01-10T08:30:00Z'
  },
  {
    id: '3',
    username: 'Alex Chen',
    email: 'alex.chen@example.com',
    avatar: null,
    createdAt: '2024-01-05T14:20:00Z',
    updatedAt: '2024-01-05T14:20:00Z'
  }
]

// Mock posts
export const mockPosts: PostWithAuthor[] = [
  {
    id: '1',
    title: 'Getting Started with Next.js 14 and TypeScript',
    content: 'Next.js 14 brings exciting new features including the stable App Router, improved performance, and better developer experience. In this comprehensive guide, we\'ll explore how to set up a new project with TypeScript, configure essential tools, and build a modern web application. We\'ll cover server components, client components, routing, and best practices for building scalable applications.',
    slug: 'getting-started-nextjs-14-typescript',
    createdAt: '2024-01-20T09:00:00Z',
    updatedAt: '2024-01-20T09:00:00Z',
    authorId: '1',
    author: mockUsers[0],
    _count: {
      likes: 42,
      comments: 8
    }
  },
  {
    id: '2',
    title: 'Building Responsive UIs with Tailwind CSS',
    content: 'Tailwind CSS has revolutionized how we approach styling in modern web development. This article explores advanced techniques for creating responsive, accessible, and maintainable user interfaces. We\'ll dive into custom configurations, component patterns, and optimization strategies that will help you build beautiful applications faster.',
    slug: 'building-responsive-uis-tailwind-css',
    createdAt: '2024-01-18T14:30:00Z',
    updatedAt: '2024-01-18T14:30:00Z',
    authorId: '1',
    author: mockUsers[0],
    _count: {
      likes: 35,
      comments: 12
    }
  },
  {
    id: '3',
    title: 'State Management in React: A Complete Guide',
    content: 'Managing state effectively is crucial for building robust React applications. This comprehensive guide covers everything from useState and useReducer to advanced patterns with Context API, Zustand, and Redux Toolkit. Learn when to use each approach and how to structure your application state for maximum maintainability.',
    slug: 'state-management-react-complete-guide',
    createdAt: '2024-01-16T11:15:00Z',
    updatedAt: '2024-01-16T11:15:00Z',
    authorId: '2',
    author: mockUsers[1],
    _count: {
      likes: 67,
      comments: 23
    }
  },
  {
    id: '4',
    title: 'Optimizing Web Performance: Core Web Vitals',
    content: 'Web performance directly impacts user experience and SEO rankings. This article focuses on Core Web Vitals - the essential metrics that Google uses to evaluate page experience. We\'ll explore practical techniques for improving Largest Contentful Paint, First Input Delay, and Cumulative Layout Shift.',
    slug: 'optimizing-web-performance-core-web-vitals',
    createdAt: '2024-01-14T16:45:00Z',
    updatedAt: '2024-01-14T16:45:00Z',
    authorId: '3',
    author: mockUsers[2],
    _count: {
      likes: 28,
      comments: 6
    }
  },
  {
    id: '5',
    title: 'Modern Authentication Patterns in Web Apps',
    content: 'Security is paramount in modern web applications. This deep dive explores contemporary authentication patterns including JWT tokens, OAuth 2.0, and passwordless authentication. We\'ll implement secure authentication flows and discuss best practices for protecting user data and maintaining session security.',
    slug: 'modern-authentication-patterns-web-apps',
    createdAt: '2024-01-12T13:20:00Z',
    updatedAt: '2024-01-12T13:20:00Z',
    authorId: '1',
    author: mockUsers[0],
    _count: {
      likes: 54,
      comments: 15
    }
  },
  {
    id: '6',
    title: 'Database Design for Scalable Applications',
    content: 'Designing databases that scale with your application is both an art and a science. This article covers fundamental principles of database design, normalization strategies, indexing best practices, and when to consider NoSQL solutions. Learn how to build data architectures that grow with your business.',
    slug: 'database-design-scalable-applications',
    createdAt: '2024-01-10T10:30:00Z',
    updatedAt: '2024-01-10T10:30:00Z',
    authorId: '2',
    author: mockUsers[1],
    _count: {
      likes: 39,
      comments: 11
    }
  }
]

// Helper functions for pagination
export function getPaginatedPosts(page: number = 1, limit: number = 2) {
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const posts = mockPosts.slice(startIndex, endIndex)
  
  return {
    data: posts,
    hasMore: endIndex < mockPosts.length,
    total: mockPosts.length,
    page,
    limit
  }
}

export function getPostBySlug(slug: string): PostWithAuthor | null {
  return mockPosts.find(post => post.slug === slug) || null
}

// Mock about data
export const mockAboutData: AboutData = {
  personalInfo: {
    name: 'Chhuon Makara Roth',
    title: 'Frontend Developer',
    location: 'Khan Tuol Koak, Phnom Penh, Cambodia',
    phone: '(+855) 81693071',
    email: 'chhuonmakararoth@gmail.com',
    birthDate: 'January 17, 2004',
    hobbies: ['Learning', 'Coding', 'Music', 'Reading'],
    profileImage: '/avatars/roth.jpg',
    story: [
      "Hi! I'm Makara, a passionate frontend developer from Cambodia. At 20 years old, I'm currently pursuing my Computer Science degree at Royal University of Phnom Penh while actively building my skills in web development.",
      "My journey into web development began during my university studies, which led me to complete an intensive web development training program at KiloIT. I've had the privilege of volunteering at major international sporting events, including the 32nd SEA Games and 12th ASEAN Para Games.",
      "I specialize in creating responsive, user-friendly web applications using modern technologies like React, JavaScript, and various CSS frameworks. I'm passionate about clean code, intuitive user interfaces, and continuous learning.",
      "When I'm not coding, you can find me exploring new technologies, listening to music, reading, or enjoying a good cup of coffee while working on personal projects. I believe in the power of technology to create positive change and meaningful user experiences."
    ]
  },
  skills: [
    'React', 'Redux', 'Redux Toolkit', 'Next.js', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'SCSS',
    'Tailwind CSS', 'Bootstrap', 'Node.js', 'Express.js', 'MongoDB', 'MySQL', 'PostgreSQL',
    'Git', 'GitHub', 'GitLab', 'Figma', 'Adobe XD', 'Photoshop', 'REST APIs', 'GraphQL',
    'Responsive Design', 'Cross-browser Compatibility', 'Performance Optimization', 'SEO',
    'Agile/Scrum', 'Team Collaboration', 'Problem Solving', 'Project Management'
  ],
  experiences: [
    {
      role: 'Web Developer / Frontend Developer',
      type: 'Training Program',
      company: 'KiloIT',
      period: 'Nov 2023 - May 2024',
      location: 'Phnom Penh, Cambodia',
      skills: ['React', 'JavaScript', 'HTML', 'CSS', 'SCSS', 'Git', 'Figma', 'REST APIs', 'Responsive Design']
    },
    {
      role: 'Game IT Volunteer',
      type: 'Volunteer',
      company: '32nd SEA Games 2023',
      period: '5 - 17 May, 2023',
      location: 'Phnom Penh, Cambodia',
      skills: ['Technical Support', 'Event Management', 'Team Collaboration', 'Problem Solving']
    },
    {
      role: 'Game IT Volunteer',
      type: 'Volunteer',
      company: '12th ASEAN Para Games 2023',
      period: '3 - 9 Jan, 2023',
      location: 'Phnom Penh, Cambodia',
      skills: ['Technical Support', 'Event Management', 'Team Collaboration', 'Problem Solving']
    }
  ],
  education: [
    {
      degree: 'Web Developer Course',
      school: 'KiloIT',
      period: 'Nov 2023 - May 2024',
      location: 'Phnom Penh, Cambodia',
      description: 'Intensive web development training program focusing on modern frontend technologies'
    },
    {
      degree: 'Bachelor of Computer Science',
      school: 'Royal University of Phnom Penh',
      period: '2021 - 2024',
      location: 'Phnom Penh, Cambodia',
      description: 'Graduated with Computer Science degree, specializing in software development'
    },
    {
      degree: 'Freshman in Computer Science',
      school: 'Royal University of Phnom Penh',
      period: '2021 - 2022',
      location: 'Phnom Penh, Cambodia',
      description: 'Foundation year in Computer Science program'
    },
    {
      degree: 'High School Diploma (Baccii Grade 12)',
      school: 'Sisowath High School',
      period: '2018 - 2022',
      location: 'Phnom Penh, Cambodia',
      description: 'Completed secondary education with focus on science and mathematics'
    }
  ]
}

// Get about data
export function getAboutData(): AboutData {
  return mockAboutData
}

// Mock contact form submission
export function submitContactForm(data: {
  name: string
  email: string
  subject: string
  message: string
}) {
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Contact form submitted:', data)
      resolve({ success: true, message: 'Message sent successfully!' })
    }, 1000)
  })
}