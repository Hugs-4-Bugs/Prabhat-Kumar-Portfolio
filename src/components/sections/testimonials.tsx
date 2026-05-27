"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { Section } from "@/components/section-wrapper";
import { SectionHeading } from "@/components/section-heading";
import { useTilt } from "@/hooks/use-tilt";

const testimonials = [
  {
    name: "Rahul Mehta",
    role: "CTO, FinTech Startup",
    initials: "RM",
    bgColor: "bg-blue-600",
    gradient: "from-blue-500/20 to-cyan-500/10",
    text: "Prabhat architected our entire trading backend from scratch. His understanding of financial systems, combined with clean Spring Boot microservices design, was exceptional. Delivered on time and beyond expectations.",
    metric: "Within 3 months, the system handled 10,000+ concurrent traders with 99.9% uptime."
  },
  {
    name: "Sarah Chen",
    role: "Product Manager, SaaS Company",
    initials: "SC",
    bgColor: "bg-purple-600",
    gradient: "from-purple-500/20 to-pink-500/10",
    text: "We hired Prabhat to build our AI-powered outreach platform. The system he delivered runs 24/7 autonomously — lead discovery, email validation, AI personalization, and reply classification. Incredible engineering.",
    metric: "Processes 500+ leads daily with 35% better response time and 60% lower operating cost."
  },
  {
    name: "Amit Sharma",
    role: "Founder, Digital Agency",
    initials: "AS",
    bgColor: "bg-emerald-600",
    gradient: "from-emerald-500/20 to-teal-500/10",
    text: "CodeGuard AI saved our team thousands of dollars in unexpected AWS bills. Prabhat built something genuinely useful — real-time Terraform cost detection right in VS Code. Brilliant tool.",
    metric: "AWS bills reduced by 45% in the first month and adopted by 1000+ VS Code users."
  },
  {
    name: "Dhiraj Singh",
    role: "Founder, Maarogyam",
    initials: "DS",
    bgColor: "bg-orange-600",
    gradient: "from-orange-500/20 to-amber-500/10",
    text: "Prabhat delivered exactly what we needed for Maarogyam — a fast, modern, and professional healthcare platform with smooth performance and clean user experience. His attention to backend architecture, scalability, and real-world usability made a huge difference. Highly recommended.",
    metric: "Platform handles 50,000+ patient records with <1.2s page loads and 99.8% uptime."
  },
  {
    name: "AcquisitionOS Beta Client",
    role: "Founder, B2B SaaS",
    initials: "AO",
    bgColor: "bg-cyan-600",
    gradient: "from-cyan-500/20 to-emerald-500/10",
    text: "Prabhat's AcquisitionOS system transformed how we think about lead acquisition. The AI-powered qualification alone improved our conversion rate from 2% to 8% in three months. Game changer.",
    metric: "4x conversion improvement from 2% to 8%."
  }
];

/** Inner card with vanilla-JS 3D tilt — isolated so each card has its own ref */
function TiltTestimonialCard({ testimonial, idx }: { testimonial: typeof testimonials[0]; idx: number }) {
  const { ref, onMouseMove, onMouseLeave } = useTilt<HTMLDivElement>({ maxTilt: 8, scale: 1.02 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: idx * 0.12 }}
      className="flex-shrink-0 w-[85vw] sm:w-[320px] md:w-auto snap-center"
      style={{ willChange: "transform" }}
    >
      <div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className={`relative h-full p-8 rounded-2xl border border-black/10 dark:border-white/10 bg-gradient-to-br ${testimonial.gradient} dark:bg-white/5 backdrop-blur-md shadow-lg flex flex-col cursor-default`}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Glow on hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-white/5 to-transparent" />

        <Quote className="absolute top-6 left-6 w-12 h-12 text-primary/10 dark:text-primary/20 rotate-180 z-0" />

        <div className="relative z-10 flex gap-1 mb-6">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          ))}
        </div>

        <p className="relative z-10 text-muted-foreground text-sm leading-relaxed mb-8 flex-grow italic">
          &ldquo;{testimonial.text}&rdquo;
        </p>

        <div className="relative z-10 mb-6 rounded-xl border border-primary/20 bg-primary/10 p-3 text-xs font-semibold leading-5 text-primary">
          {testimonial.metric}
        </div>

        <div className="relative z-10 flex items-center gap-4 mt-auto">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${testimonial.bgColor} shadow-lg`}>
            {testimonial.initials}
          </div>
          <div>
            <h4 className="font-bold text-foreground">{testimonial.name}</h4>
            <p className="text-xs text-muted-foreground">{testimonial.role}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollRef.current.scrollBy({ left: clientWidth, behavior: "smooth" });
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Section id="testimonials" className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7 }}
      >
        <SectionHeading>What People Say</SectionHeading>
      </motion.div>

      <div className="mt-12">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-2 xl:grid-cols-5 md:overflow-visible md:snap-none"
        >
          {testimonials.map((testimonial, idx) => (
            <TiltTestimonialCard key={idx} testimonial={testimonial} idx={idx} />
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </Section>
  );
}
