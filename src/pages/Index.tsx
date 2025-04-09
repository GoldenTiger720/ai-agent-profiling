import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Users,
  BookOpen,
  Globe,
  CheckCircle,
  BarChart3,
  Mic,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import SpeakerCard from "@/components/SpeakerCard";
import { Separator } from "@/components/ui/separator";
import CaseStudyCard from "@/components/CaseStudyCard";
import VideoPlayer from "@/components/VideoPlayer";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Index = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [networkName, setNetworkName] = useState("");
  const [networkEmail, setNetworkEmail] = useState("");
  const [isNetworkSubmitting, setIsNetworkSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const stars: { x: number; y: number; size: number; speed: number }[] = [];
    const generateStars = () => {
      stars.length = 0;
      const starCount = Math.floor(
        (window.innerWidth * window.innerHeight) / 1500
      );

      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2,
          speed: 0.1 + Math.random() * 0.3,
        });
      }
    };

    generateStars();

    const animateStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        star.y += star.speed;

        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });

      requestAnimationFrame(animateStars);
    };

    animateStars();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Success!",
        description: "Thank you for signing up. We'll be in touch soon!",
      });
      setName("");
      setEmail("");
    }, 1500);
  };

  const handleNetworkSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsNetworkSubmitting(true);

    setTimeout(() => {
      setIsNetworkSubmitting(false);
      toast({
        title: "Welcome to our network!",
        description:
          "Thank you for signing up. We'll keep you updated on our community events.",
      });
      setNetworkName("");
      setNetworkEmail("");
    }, 1500);
  };

  const speakerData = [
    {
      name: "Meguire Hennes",
      category: "Biotech and Healthcare",
      mediaOutlet: "Elite Daily",
      requirement: "Please answer the question: What is pheromone perfume/oil?",
      avatarSrc: "/images/avatar/Jeff-Getty-2.jpeg",
    },
    {
      name: "Andre O. Newsbreak",
      category: "Business and Finance",
      mediaOutlet: "Newsbreak",
      requirement:
        "I am looking for the best LinkedIn Company Page optimization tips from experts.",
      avatarSrc: "/images/avatar/Kalani-Vale.jpeg",
    },
    {
      name: "Nick Cullen",
      category: "Business and Finance",
      mediaOutlet: "SolutionSuggest.com",
      requirement:
        "We are looking for Founders, CEOs, and Presidents to share their compelling brand stories.",
      avatarSrc: "/images/avatar/Kent-Emmons.jpeg",
    },
  ];

  const caseStudies = [
    {
      imageSrc: "/images/avatar/Jeff-Getty-2.jpeg",
      quote:
        "Working with Authority Fusion was a game-changer for my career. Doug Crowe and his team didn't just help me publish a book; they helped me articulate my vision for integrating neuroscience in athlete development in a way that was both accessible and engaging.",
      name: "Ryan Schatchner",
      title: "Neuroscience-Based Athlete Development",
    },
    {
      imageSrc: "/images/avatar/Kalani-Vale.jpeg",
      quote:
        "Writing 'Cancer's Gifts: A Loving Journey Toward the Final Chapter' was a deeply personal endeavor. Authority Fusion treated my story with the utmost respect and sensitivity, guiding me through the publishing process with empathy and expertise.",
      name: "Les Whitney",
      title: "Vistage International, Group Chair",
    },
    {
      imageSrc: "/images/avatar/Kent-Emmons.jpeg",
      quote:
        "As a CEO and investor, I understand the value of a great partnership. Authority Fusion exceeded my expectations in every way. Their strategic approach to publishing and marketing my insights has not only boosted my professional profile but also allowed me to connect with readers in a meaningful way.",
      name: "Kent Emmons",
      title: "Founding Investor / CEO, Crave News",
    },
    {
      imageSrc: "/images/avatar/Les-Whitney.jpeg",
      quote:
        "Authority Fusion gave me the confidence to share my expertise with the world. The process was streamlined and supportive from start to finish, and the results have been transformative for my business.",
      name: "Sarah Johnson",
      title: "Leadership Consultant",
    },
    {
      imageSrc: "/images/avatar/makin.jpg",
      quote:
        "The team at Authority Fusion understood exactly what I wanted to achieve with my book. Their guidance helped me create a powerful message that resonates with my audience and establishes my authority in my field.",
      name: "Michael Roberts",
      title: "Financial Wellness Expert",
    },
    {
      imageSrc: "/images/avatar/Ryan-Schatchner.jpeg",
      quote:
        "Publishing my book with Authority Fusion opened doors I never thought possible. Within months, I was being invited to speak at conferences and appearing on podcasts. The ROI has been incredible.",
      name: "Jennifer Adams",
      title: "Health & Wellness Coach",
    },
  ];

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 -z-10 pointer-events-none"
      />

      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 animate-fade-in">
                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                  Your Brand <span className="block">deserves to be seen.</span>
                </h1>
                <p className="text-lg text-muted-foreground">
                  FindMyStage helps speakers, authors, podcasters, and experts
                  get booked on stages that match their expertise, grow their
                  audience, and increase their revenue.
                </p>

                <div
                  className="max-w-md bg-card/30 backdrop-blur-sm p-6 rounded-xl border border-border/50 animate-fade-in"
                  style={{ animationDelay: "0.4s" }}
                >
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="sr-only">
                        Your Name
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="bg-background/70 backdrop-blur-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="sr-only">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john.doe@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-background/70 backdrop-blur-sm"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-findmystage-green hover:bg-findmystage-green/90 text-white rounded-md flex items-center justify-center gap-2"
                      disabled={isSubmitting}
                    >
                      SIGN UP
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </div>
              <div
                className="animate-fade-in"
                style={{ animationDelay: "0.3s" }}
              >
                <div className="p-6 bg-findmystage-green/10 rounded-2xl border border-findmystage-green/30">
                  <h2 className="text-3xl font-bold">AUTHORITY FUSION</h2>
                  <p className="text-muted-foreground">
                    The AI-powered platform that helps you discover speaking
                    opportunities and grow your personal brand.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-16">
          <Separator className="max-w-6xl mx-auto h-px bg-border/60" />
        </div>
      </section>

      <section className="py-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              WHAT IS AUTHORITY FUSION?
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              FindMyStage helps you build authority in your niche by connecting
              you with the right speaking opportunities, media outlets, and
              communities to showcase your expertise.
            </p>
          </div>
        </div>
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="relative rounded-xl overflow-hidden aspect-[4/3]">
                <img
                  src="/images/person-holding-speech-official-event.jpg"
                  alt="Speaker addressing an audience"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="w-40 h-1 bg-findmystage-green mb-2"></div>
                  <p className="text-white text-sm font-medium">
                    AUTHORITY FUSION
                  </p>
                </div>
              </div>

              <div className="space-y-6 px-4 md:px-8">
                <h2 className="text-5xl font-bold">Speakers</h2>
                <p className="text-3xl font-medium">
                  We find targeted stages for you.
                </p>

                <div className="space-y-4">
                  <p className="text-lg">
                    We send you upcoming speaker opportunities{" "}
                    <span className="font-bold">before they are announced</span>
                    . Save yourself from countless hours of research, dead end
                    opportunities, and stop spending thousands of dollars
                    "chasing."
                  </p>

                  <p className="text-lg">
                    With over 70,000 targeted speaking opportunities, your stage
                    is just a phone call away.
                  </p>
                </div>

                <Button
                  asChild
                  size="lg"
                  className="rounded-full mt-4 bg-findmystage-green hover:bg-findmystage-green/90"
                >
                  <Link to="/profile">
                    Find Your Stage <ArrowRight className="ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-16">
          <Separator className="max-w-6xl mx-auto h-px bg-border/60" />
        </div>
      </section>

      <section className="py-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h2 className="text-7xl font-bold">Media</h2>
                <h3 className="text-4xl font-medium">Become a Media Maven.</h3>

                <p className="text-lg">
                  Being interviewed by the media not only increases your
                  outreach, but can establish your brand and create high-powered
                  connections.
                </p>

                <p className="text-lg">
                  <span className="font-bold">Author</span>
                  <sup>*</sup>
                  <span className="font-bold">ity Fusion</span> members get FREE
                  access to over 700 journalists, 769 radio producers, and get{" "}
                  <span className="font-bold">
                    DAILY inquiries from reporters
                  </span>{" "}
                  who need your expertise for their News stories.
                </p>

                <p className="text-lg">
                  All members can access professional media training and "hot
                  seat" reviews at no cost.
                </p>

                <Button
                  asChild
                  size="lg"
                  className="rounded-full mt-4 bg-findmystage-green hover:bg-findmystage-green/90"
                >
                  <Link to="/profile">
                    Become a Media Maven <ArrowRight className="ml-2" />
                  </Link>
                </Button>
              </div>

              <div className="relative">
                <div className="absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-background px-4 py-2">
                  <p className="text-lg font-medium text-muted-foreground">
                    1,469 JOURNALISTS SEEKING EXPERTS
                  </p>
                </div>

                <div className="speakers-display">
                  <div className="speakers-row">
                    {speakerData.map((speaker, index) => (
                      <SpeakerCard
                        key={`row1-${index}`}
                        name={speaker.name}
                        category={speaker.category}
                        mediaOutlet={speaker.mediaOutlet}
                        requirement={speaker.requirement}
                        avatarSrc={speaker.avatarSrc}
                      />
                    ))}
                  </div>
                  <div className="speakers-row">
                    {speakerData.map((speaker, index) => (
                      <SpeakerCard
                        key={`row2-${index}`}
                        name={speaker.name}
                        category={speaker.category}
                        mediaOutlet={speaker.mediaOutlet}
                        requirement={speaker.requirement}
                        avatarSrc={speaker.avatarSrc}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-16">
          <Separator className="max-w-6xl mx-auto h-px bg-border/60" />
        </div>
      </section>

      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 items-center">
              <div className="relative image-container-3d">
                <img
                  src="/images/people-taking-part-high-protocol-event.jpg"
                  alt="Conference audience looking at a presenter"
                  className="w-full rounded-lg shadow-xl rotate-3d"
                />
              </div>

              <div className="space-y-6">
                <h2 className="text-7xl font-bold">Community</h2>
                <h3 className="text-3xl font-medium">
                  Network with{" "}
                  <span className="font-bold">industry experts.</span>
                </h3>

                <p className="text-xl">
                  Gain access to our{" "}
                  <span className="font-bold">community of excellence</span>{" "}
                  where you can network and collaborate with over thousands of
                  successful CEO's and Founders who understand and live the core
                  principles of servant leadership.
                </p>

                <div className="pt-6">
                  <h4 className="text-2xl font-bold mb-4">
                    YOUR EVENTS INCLUDE:
                  </h4>
                  <ul className="space-y-4 text-lg">
                    <li className="flex items-start">
                      <span className="text-findmystage-green mr-2">•</span>
                      Monthly <span className="font-bold">CEO roundtable</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-findmystage-green mr-2">•</span>
                      Weekly "Ask anything," open forum
                    </li>
                    <li className="flex items-start">
                      <span className="text-findmystage-green mr-2">•</span>
                      Monthly media "hot seat" session
                    </li>
                    <li className="flex items-start">
                      <span className="text-findmystage-green mr-2">•</span>
                      <span className="font-bold">2 live events</span> each year
                      (by invitation only)
                    </li>
                  </ul>
                </div>

                <div className="pt-4">
                  <Button
                    asChild
                    size="lg"
                    className="rounded-full px-8 bg-findmystage-green hover:bg-findmystage-green/90"
                  >
                    <Link to="/database">
                      Join Our Community <ArrowRight className="ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-16">
          <Separator className="max-w-6xl mx-auto h-px bg-border/60" />
        </div>
      </section>

      <section className="py-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="bg-card/70 backdrop-blur-sm text-sm inline-block py-1 px-3 rounded-md mb-2">
                  Author Resources
                </div>
                <h2 className="text-6xl font-bold">Author Resources</h2>
                <h3 className="text-3xl font-medium">
                  Live trainings from <br />
                  industry experts.
                </h3>

                <p className="text-xl">
                  <span className="font-bold">Become an Author of Impact.</span>{" "}
                  We provide authors with dozens of resources, training, &
                  assets to make your book a platform of influence.
                </p>

                <p className="text-xl font-bold">
                  Ghostwriting. Publishing. Marketing.
                </p>

                <p className="text-xl mt-8">DIY or 100% Done for you.</p>

                <Button
                  asChild
                  size="lg"
                  className="rounded-full mt-6 bg-findmystage-green hover:bg-findmystage-green/90"
                >
                  <Link to="/resources">
                    Access Resources <ArrowRight className="ml-2" />
                  </Link>
                </Button>
              </div>

              <div className="relative">
                <img
                  src="/images/AF-Graphics-Author-Resources-2-768x553.png"
                  alt="Author resources with laptop, books and coffee cup"
                  className="w-full h-auto rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-16">
          <Separator className="max-w-6xl mx-auto h-px bg-border/60" />
        </div>
      </section>

      <section className="py-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center mb-12">
            <h2 className="text-5xl font-bold mb-4">
              DOES AUTHOR
              <span className="relative">
                *<span className="absolute -top-1 text-sm">ITY</span>
              </span>{" "}
              FUSION WORK?
            </h2>
            <p className="text-xl text-muted-foreground">
              Here are a few success stories from our community.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <img
                  src="/images/Les-Whitney_3DBundle-768x570.png"
                  alt="Les Whitney's book - Cancer's Gifts"
                  className="w-full h-auto"
                />
              </div>

              <div className="space-y-8">
                <h3 className="text-6xl font-bold">Keynotes</h3>
                <h4 className="text-3xl font-medium">
                  Two keynotes in the first 40 days
                </h4>

                <div className="space-y-4">
                  <p className="text-lg">
                    Les Whitney was a former Vistage chair who is living with
                    brain and lung cancer. His incredible message of
                    perseverance, acceptance, life & death caught the attention
                    of Vistage international and the{" "}
                    <span className="font-bold">American Cancer Society.</span>
                  </p>

                  <p className="text-lg">
                    Within 2 months of publishing his first book, he landed 2
                    major keynotes at these organizations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-16">
          <Separator className="max-w-6xl mx-auto h-px bg-border/60" />
        </div>
      </section>

      {/* Branded Growth Section */}
      <section className="py-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-7xl font-bold leading-tight">
                  Branded Growth
                </h2>
                <h3 className="text-4xl font-medium">
                  20% Business growth with <br />
                  his published book
                </h3>

                <p className="text-lg">
                  Ariel Halevi runs a 140-person consulting firm. With offices
                  in Israel, the USA & Asia, he had the experience & wisdom but
                  no time to write his book. Our sister company,{" "}
                  <span className="font-bold">Author Your Brand</span>,
                  interviewed, positioned, wrote, edited, formatted, & published
                  his 1st book. 10 years of "wanting" transformed into a
                  published book in less than 9 months.
                </p>

                <Button
                  asChild
                  size="lg"
                  className="rounded-full mt-6 bg-findmystage-green hover:bg-findmystage-green/90"
                >
                  <Link to="/resources">
                    Grow Your Brand <ArrowRight className="ml-2" />
                  </Link>
                </Button>
              </div>

              <div className="relative rounded-lg overflow-hidden border shadow-lg">
                <VideoPlayer
                  videoSrc="/movies/video.mp4"
                  posterSrc="/images/video.png"
                  title="Branded Growth Case Study"
                />
                <div className="absolute top-0 right-0 z-10 bg-black/70 text-white p-3 rounded-bl-lg">
                  <p className="uppercase text-sm font-medium">
                    BOOK OR IF YOU DON'T HAVE A BOOK <br />
                    AND THE WAY I FEEL{" "}
                    <span className="text-findmystage-green">THE MARKET'S</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-16">
          <Separator className="max-w-6xl mx-auto h-px bg-border/60" />
        </div>
      </section>

      {/* Personal Brand Section */}
      <section className="py-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <img
                  src="/images/AF-Graphics-Reveniew-2-768x574.png"
                  alt="Building blocks of personal brand with Authority Fusion"
                  className="w-full h-auto object-cover rounded-lg shadow-xl"
                />
              </div>

              <div className="space-y-6">
                <h2 className="text-7xl font-bold">
                  Per<span className="text-findmystage-green">$</span>onal Brand
                </h2>
                <h3 className="text-4xl font-medium">
                  <span className="font-bold">$200,000</span> increase in <br />
                  revenue
                </h3>

                <div className="mt-8 space-y-4">
                  <p className="text-lg italic">
                    "Doug helped me publish two books. My first book, Super Hero
                    Single Dad, took second place in Christian writers awards.
                    My second book, ROL (Return on Life) with a foreword by Les
                    Brown, became a Amazon{" "}
                    <span className="font-bold">#1 bestseller</span>. Because of
                    these two books, I've placed millions more under management,
                    increased my revenue by $200K, and seen a measurable boost
                    in my credibility."
                  </p>
                </div>

                <Button
                  asChild
                  size="lg"
                  className="rounded-full mt-6 bg-findmystage-green hover:bg-findmystage-green/90"
                >
                  <Link to="/profile">
                    Build Your Brand <ArrowRight className="ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-16">
          <Separator className="max-w-6xl mx-auto h-px bg-border/60" />
        </div>
      </section>

      {/* Your Network = Your Net Worth Section */}
      <section className="py-16 bg-muted/30 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Your Network = Your Net Worth
            </h2>
            <p className="text-xl max-w-3xl mx-auto mb-12">
              Our members are passionate about building relationships & creating
              impact. Join Today. It's free after all...
            </p>

            <form onSubmit={handleNetworkSignUp} className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                <div className="md:col-span-3">
                  <Input
                    type="text"
                    placeholder="Name"
                    value={networkName}
                    onChange={(e) => setNetworkName(e.target.value)}
                    required
                    className="h-14 bg-background border-input"
                  />
                </div>
                <div className="md:col-span-3">
                  <Input
                    type="email"
                    placeholder="Email"
                    value={networkEmail}
                    onChange={(e) => setNetworkEmail(e.target.value)}
                    required
                    className="h-14 bg-background border-input"
                  />
                </div>
                <div className="md:col-span-1">
                  <Button
                    type="submit"
                    className="w-full h-14 bg-findmystage-green hover:bg-findmystage-green/90 text-white"
                    disabled={isNetworkSubmitting}
                  >
                    Sign Up
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-16">
          <Separator className="max-w-6xl mx-auto h-px bg-border/60" />
        </div>
      </section>

      <section className="py-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Case Studies</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              See how speakers, authors, and experts have used Authority Fusion
              to grow their personal brand and business.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <Carousel autoPlay={true} autoPlayInterval={5000} className="mb-8">
              <CarouselContent>
                {Array.from({ length: Math.ceil(caseStudies.length / 3) }).map(
                  (_, slideIndex) => (
                    <CarouselItem key={slideIndex}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-1">
                        {caseStudies
                          .slice(slideIndex * 3, slideIndex * 3 + 3)
                          .map((study, index) => (
                            <CaseStudyCard
                              key={index}
                              imageSrc={study.imageSrc}
                              quote={study.quote}
                              name={study.name}
                              title={study.title}
                            />
                          ))}
                      </div>
                    </CarouselItem>
                  )
                )}
              </CarouselContent>
              <div className="flex justify-center mt-6">
                <CarouselPrevious className="relative static mx-2 left-0 translate-y-0" />
                <CarouselNext className="relative static mx-2 right-0 translate-y-0" />
              </div>
            </Carousel>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-5">
          <Separator className="max-w-6xl mx-auto h-px bg-border/60" />
        </div>
      </section>

      <section className="py-5 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-6xl font-bold leading-tight">
                  Money does <br />
                  not grow on <br />
                  trees
                </h2>
                <h3 className="text-3xl font-medium">
                  ...But it may feel that way.
                </h3>

                <p className="text-xl">
                  We've helped hundreds of CEO's & Founders create hypnotic
                  personal brands. Give it a shot, you won't regret it.
                </p>

                <div className="max-w-md bg-card/30 backdrop-blur-sm p-6 rounded-xl border border-border/50 mt-8">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name-money" className="sr-only">
                        Your Name
                      </Label>
                      <Input
                        id="name-money"
                        type="text"
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="bg-background/70 backdrop-blur-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email-money" className="sr-only">
                        Email Address
                      </Label>
                      <Input
                        id="email-money"
                        type="email"
                        placeholder="john.doe@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-background/70 backdrop-blur-sm"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white rounded-md flex items-center justify-center gap-2"
                      disabled={isSubmitting}
                    >
                      SIGN UP
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </div>

              <div className="relative">
                <img
                  src="/images/image_Pippit_202504091851.png"
                  alt="Money tree with dollar bills growing on it"
                  className="w-full h-auto object-contain rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
