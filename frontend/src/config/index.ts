export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "NavigAItor",
  description: "An AI tutor to help you navigate college.",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Courses",
      href: "/courses",
    },
  ],
  links: {
    github: "https://github.com/kabilan108/navigaitor",
  },
};

export const getAPIURL = () => {
  console.log(process.env.NODE_ENV);
  if (process.env.NODE_ENV === "development") {
    return import.meta.env.VITE_API_URL;
  } else {
    return window.env.API_URL;
  }
};
