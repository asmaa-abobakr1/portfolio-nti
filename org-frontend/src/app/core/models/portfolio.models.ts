export type HomeData = {
  jobTitle: string;
  name: string;
  mainDescription?: string;
  profileImage?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
  };
  services?: HomeService[];
};

export type HomeService = {
  _id?: string;
  title: string;
  description: string;
  isDeleted?: boolean;
};

export type AboutData = {
  bio: string;
  stats?: {
    yearsExperience?: string;
    projectsCompleted?: string;
  };
  experiences?: Experience[];
  skills?: SkillGroup[];
  values?: ValueItem[];
};

export type Experience = {
  _id?: string;
  role: string;
  company: string;
  duration: string;
  location: string;
  isDeleted?: boolean;
};

export type SkillGroup = {
  _id?: string;
  categoryName: string;
  technologies: string[];
  isDeleted?: boolean;
};

export type ValueItem = {
  icon: string;
  title: string;
  description: string;
};

export type ProjectsResponse = {
  pageHeader: {
    title: string;
    subtitle: string;
  };
  projectsList: Project[];
};

export type Project = {
  _id?: string;
  title: string;
  description: string;
  image?: string;
  tools: string[];
  liveDemo?: string;
  githubCode?: string;
  isDeleted?: boolean;
};

export type ServicesResponse = {
  hero: {
    title: string;
    subtitle: string;
  };
  services: ServiceItem[];
  footerAction: {
    title: string;
    description: string;
  };
};

export type ServiceItem = {
  _id?: string;
  icon?: string;
  title: string;
  description: string;
  isDeleted?: boolean;
};

export type ContactMessage = {
  _id?: string;
  name: string;
  email: string;
  message: string;
  sentAt?: string;
  isDeleted?: boolean;
};

export type ContactPayload = {
  name: string;
  email: string;
  message: string;
};
