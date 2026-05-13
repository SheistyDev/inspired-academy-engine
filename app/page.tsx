import { BookingCalendar } from "@/components/BookingCalendar";
import { Button } from "@/components/ui/button";
import { BookOpen, Target, Zap, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-24 px-4 bg-zinc-50 dark:bg-zinc-950">
        <div className="mb-8">
          <Image
            src="/inspired-logo.jpeg"
            alt="Inspired Academy Logo"
            width={400}
            height={400}
            className="w-full max-w-[300px] md:max-w-[400px] h-auto object-contain rounded-xl mix-blend-multiply dark:mix-blend-normal dark:bg-white p-4"
            priority
          />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-zinc-900 dark:text-zinc-50">
          Master Your Learning Journey
        </h1>
        <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 max-w-2xl mb-10">
          Personalized tutoring tailored to your unique learning style.
          Book a session today and unlock your full potential.
        </p>
        <Button size="lg" asChild className="text-lg px-8 py-6">
          <Link href="#booking">Book Your Session Now</Link>
        </Button>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 md:px-8 bg-white dark:bg-zinc-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-zinc-900 dark:text-zinc-50">
            Why Choose Our Platform?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-4 rounded-full mb-6 text-primary">
                <BookOpen size={40} />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-zinc-900 dark:text-zinc-50">Personalized Learning</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Our curriculum adapts to your pace and learning style, ensuring you grasp every concept thoroughly.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-4 rounded-full mb-6 text-primary">
                <Target size={40} />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-zinc-900 dark:text-zinc-50">Goal-Oriented</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Set specific goals and track your progress with our targeted learning modules and assessments.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-4 rounded-full mb-6 text-primary">
                <Zap size={40} />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-zinc-900 dark:text-zinc-50">Expert Tutors</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Learn from industry professionals and experienced educators dedicated to your success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 md:px-8 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-zinc-900 dark:text-zinc-50">
            What Our Students Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Jenkins",
                role: "High School Student",
                content: "The personalized tutoring completely changed my approach to math. I went from struggling to excelling in just a few months!",
              },
              {
                name: "David Chen",
                role: "College Freshman",
                content: "Booking sessions is so easy, and the tutors are incredibly knowledgeable. Highly recommend for anyone needing extra help.",
              },
              {
                name: "Emily Rodriguez",
                role: "Career Changer",
                content: "I needed to learn coding fast, and this platform provided the exact guidance and support I needed to land my first job.",
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 flex flex-col h-full">
                <div className="flex text-amber-400 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={18} fill="currentColor" />
                  ))}
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 flex-grow mb-6 italic">
                  &quot;{testimonial.content}&quot;
                </p>
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-50">{testimonial.name}</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking" className="py-24 px-4 bg-white dark:bg-zinc-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-zinc-900 dark:text-zinc-50">
              Ready to Start?
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Select a date and time that works best for you to book your first session.
            </p>
          </div>
          <BookingCalendar />
        </div>
      </section>
    </div>
  );
}
