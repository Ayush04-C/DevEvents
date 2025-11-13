export type EventItem= {
    title: string;
    image: string;
    slug: string;
    location: string;
    date: string;
    time: string;
};

export const events: EventItem[] = [
  {
    title: "React Summit 2025",
    image: "/images/event1.png",
    slug: "react-summit-2025",
    location: "Amsterdam, Netherlands",
    date: "June 13-17, 2025",
    time: "9:00 AM - 6:00 PM CEST"
  },
  {
    title: "GitHub Universe",
    image: "/images/event2.png",
    slug: "github-universe-2025",
    location: "San Francisco, CA",
    date: "November 18-19, 2025",
    time: "8:30 AM - 5:00 PM PST"
  },
  {
    title: "AI Engineers Summit",
    image: "/images/event3.png",
    slug: "ai-engineers-summit-2025",
    location: "London, UK",
    date: "September 22-24, 2025",
    time: "10:00 AM - 7:00 PM BST"
  },
  {
    title: "Web3 Developer Conference",
    image: "/images/event4.png",
    slug: "web3-developer-conference",
    location: "Berlin, Germany",
    date: "October 5-7, 2025",
    time: "9:00 AM - 6:00 PM CET"
  },
  {
    title: "DevOps World",
    image: "/images/event5.png",
    slug: "devops-world-2025",
    location: "Austin, TX",
    date: "December 1-3, 2025",
    time: "8:00 AM - 5:00 PM CST"
  },
  {
    title: "Python Conference 2025",
    image: "/images/event6.png",
    slug: "python-conference-2025",
    location: "Portland, OR",
    date: "May 14-22, 2025",
    time: "9:00 AM - 6:00 PM PDT"
  }
];
