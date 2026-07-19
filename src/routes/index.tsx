import { createFileRoute } from "@tanstack/react-router";
import { Identity } from "@/sections/Identity";
import { Modules } from "@/sections/Modules";
import { Experience } from "@/sections/Experience";
import { Matrix } from "@/sections/Matrix";
import { Transmission } from "@/sections/Transmission";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Ayushi Raj — AI & Full-Stack Developer" },
      {
        name: "description",
        content:
          "Portfolio of Ayushi Raj — AI & Full-Stack Developer building zero-knowledge tools, orchestration platforms, and computer-vision systems with Python, FastAPI, React, and Gemini.",
      },
      { property: "og:title", content: "Ayushi Raj — AI & Full-Stack Developer" },
      {
        property: "og:description",
        content:
          "Zero-knowledge crypto vaults, low-latency orchestration gateways, and AI-native full-stack products.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Ayushi Raj — AI & Full-Stack Developer" },
      {
        name: "twitter:description",
        content:
          "Portfolio: zero-knowledge crypto vaults, orchestration gateways, AI computer vision.",
      },
    ],
    links: [
      { rel: "canonical", href: "/" },
      {
        rel: "preload",
        as: "image",
        href: "/images/ayushi.webp",
        fetchpriority: "high",
        type: "image/webp",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Ayushi Raj",
          jobTitle: "AI & Full-Stack Developer",
          description:
            "AI & Full-Stack Developer and BCA student at Amity University Noida. Focused on zero-knowledge architectures, low-latency APIs, and Gemini-powered systems.",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Nawada",
            addressRegion: "Bihar",
            addressCountry: "IN",
          },
          email: "mailto:ayushi29507@gmail.com",
          alumniOf: {
            "@type": "CollegeOrUniversity",
            name: "Amity University Noida",
          },
          knowsAbout: [
            "Full-Stack Development",
            "AI Systems",
            "Prompt Engineering",
            "Python",
            "FastAPI",
            "React",
            "TypeScript",
            "Java",
            "Spring Boot",
            "Zero-Knowledge Architecture",
          ],
          sameAs: [
            "https://github.com/Silenttears-cloud",
            "https://www.linkedin.com/in/ayushi-raj-299a99388/",
            "https://www.instagram.com/Silenttears_82",
          ],
        }),
      },
    ],
  }),
});

function Index() {
  return (
    <>
      <Identity />
      <Modules />
      <Experience />
      <Matrix />
      <Transmission />
    </>
  );
}
