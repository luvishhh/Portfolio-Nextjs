import type { Project } from '@/types/project';

// In-memory store for projects. This will reset on server restart.
// For a real application, use a database.
export let projectsData: Project[] = [
  {
    id: '1',
    slug: 'modern-dashboard-ui',
    title: 'Modern Dashboard UI',
    description: 'A sleek and intuitive dashboard interface for data visualization.',
    detailedDescription: 'This project involved designing and developing a modern user interface for a complex data analytics platform. The focus was on creating a visually appealing and highly usable experience, allowing users to easily navigate and understand large datasets. Key features include customizable widgets, real-time data updates, and a responsive design that works seamlessly across all devices. The color palette is based on deep blues and vibrant accents to ensure clarity and engagement. Subtle animations enhance user interaction without being distracting.',
    images: [
      'https://placehold.co/1200x800.png',
      'https://placehold.co/800x600.png',
      'https://placehold.co/800x600.png',
    ],
    featured: true,
    tags: ['UI/UX', 'Web Development', 'Dashboard'],
    liveLink: '#',
    repoLink: '#',
    year: 2023,
    client: 'Tech Solutions Inc.',
    role: 'Lead Designer & Developer',
    technologies: ['React', 'TypeScript', 'Chart.js', 'Tailwind CSS'],
    dataAiHint: 'dashboard interface'
  },
  {
    id: '2',
    slug: 'e-commerce-platform',
    title: 'E-commerce Platform Redesign',
    description: 'Complete visual and UX overhaul for a growing online retailer.',
    detailedDescription: 'The goal of this project was to revamp an existing e-commerce website to improve user engagement and conversion rates. We conducted extensive user research to identify pain points and opportunities for improvement. The redesign features a streamlined checkout process, enhanced product discovery through improved navigation and filtering, and visually rich product pages. The design aesthetic is clean, modern, and trustworthy, aligning with the brand\'s values. We used a light and airy color palette with strong calls to action.',
    images: [
      'https://placehold.co/1200x800.png',
      'https://placehold.co/800x600.png',
      'https://placehold.co/800x600.png',
    ],
    featured: true,
    tags: ['E-commerce', 'UX Design', 'Branding'],
    liveLink: '#',
    year: 2022,
    client: 'FashionForward Co.',
    role: 'UX Strategist & UI Designer',
    technologies: ['Shopify Liquid', 'Figma', 'JavaScript'],
    dataAiHint: 'ecommerce website'
  },
  {
    id: '3',
    slug: 'mobile-app-concept',
    title: 'Innovative Mobile App Concept',
    description: 'A conceptual design for a social networking app focused on local events.',
    detailedDescription: 'This was a conceptual project aimed at exploring new interaction patterns for mobile social networking. The app helps users discover and connect with local events and communities. The design prioritizes a map-based discovery interface, intuitive event creation tools, and engaging social features. We focused on a vibrant and energetic visual style, using bold colors and playful illustrations to appeal to a younger demographic. Prototyping and user testing were key stages in refining the concept.',
    images: [
      'https://placehold.co/600x800.png',
      'https://placehold.co/600x400.png',
      'https://placehold.co/600x400.png',
    ],
    featured: false,
    tags: ['Mobile App', 'Concept Design', 'Social Media'],
    year: 2023,
    client: 'Personal Project',
    role: 'Product Designer',
    technologies: ['Figma', 'Principle', 'Adobe Illustrator'],
    dataAiHint: 'mobile app'
  },
  {
    id: '4',
    slug: 'portfolio-website-dev',
    title: 'Developer Portfolio Site',
    description: 'A minimalist and performant portfolio for a software developer.',
    detailedDescription: 'This project involved creating a personal portfolio website for a software developer, focusing on showcasing their skills and projects effectively. The design is minimalist, content-focused, and built for speed and accessibility. It features a clean blog section, filterable project gallery, and clear calls to action. A dark mode was also implemented for user preference. The technology stack was chosen for optimal performance and developer experience.',
    images: [
      'https://placehold.co/1200x800.png',
      'https://placehold.co/800x600.png',
    ],
    featured: true,
    tags: ['Web Development', 'Portfolio', 'Next.js'],
    liveLink: '#',
    repoLink: '#',
    year: 2024,
    client: 'Jane Doe Developer',
    role: 'Full-Stack Developer',
    technologies: ['Next.js', 'Tailwind CSS', 'MDX'],
    dataAiHint: 'developer portfolio'
  },
];

export function getProjects(): Project[] {
  return projectsData;
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projectsData.find(project => project.slug === slug);
}

export function addProject(project: Omit<Project, 'id' | 'slug'>): Project {
  const newProject: Project = {
    ...project,
    id: String(Date.now()), // Simple ID generation
    slug: project.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
  };
  projectsData.unshift(newProject); // Add to the beginning
  return newProject;
}

export function updateProject(id: string, updatedProjectData: Partial<Omit<Project, 'id' | 'slug'>>): Project | undefined {
  const projectIndex = projectsData.findIndex(p => p.id === id);
  if (projectIndex === -1) {
    return undefined;
  }
  const newSlug = updatedProjectData.title 
    ? updatedProjectData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
    : projectsData[projectIndex].slug;

  projectsData[projectIndex] = {
    ...projectsData[projectIndex],
    ...updatedProjectData,
    slug: newSlug,
  };
  return projectsData[projectIndex];
}

export function deleteProject(id: string): boolean {
  const initialLength = projectsData.length;
  projectsData = projectsData.filter(p => p.id !== id);
  return projectsData.length < initialLength;
}

