import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Zap, Users, Trophy, Calendar } from "lucide-react";

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Countdown timer - event date set to 30 days from now
  useEffect(() => {
    const eventDate = new Date();
    eventDate.setDate(eventDate.getDate() + 30);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = eventDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container flex items-center justify-between py-4">
          <div className="text-2xl font-bold text-gradient">COGNOTSAV 2K27</div>
          <div className="hidden md:flex gap-6">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition">
              Home
            </Link>
            <Link href="/events" className="text-gray-700 hover:text-blue-600 transition">
              Events
            </Link>
            <Link href="/results" className="text-gray-700 hover:text-blue-600 transition">
              Results
            </Link>
            <Link href="/admin" className="text-gray-700 hover:text-blue-600 transition">
              Admin
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-amber-500 py-20 md:py-32">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="container relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                COGNOTSAV 2K27
              </h1>
              <p className="text-xl text-blue-50 mb-2">State Level Technical Event</p>
              <p className="text-lg text-blue-100 mb-8">
                Showcase your skills, compete with the best, and win amazing prizes!
              </p>
              <div className="flex gap-4">
                <Link href="/register">
                  <Button className="btn-primary">Register Now</Button>
                </Link>
                <Link href="/events">
                  <Button className="btn-secondary">View Events</Button>
                </Link>
              </div>
            </div>

            <div className="animate-slide-in-right hidden md:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-amber-400 rounded-2xl blur-2xl opacity-50"></div>
                <div className="relative bg-white rounded-2xl p-8 shadow-2xl">
                  <div className="text-center">
                    <Zap className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                    <p className="text-gray-600 text-sm mb-4">Event Starts In</p>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { value: timeLeft.days, label: "Days" },
                        { value: timeLeft.hours, label: "Hours" },
                        { value: timeLeft.minutes, label: "Mins" },
                        { value: timeLeft.seconds, label: "Secs" },
                      ].map((item, idx) => (
                        <div key={idx} className="bg-blue-50 rounded-lg p-3">
                          <div className="text-2xl font-bold text-blue-600">
                            {String(item.value).padStart(2, "0")}
                          </div>
                          <div className="text-xs text-gray-600">{item.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Countdown Mobile */}
      <section className="md:hidden bg-gray-50 py-8">
        <div className="container">
          <p className="text-center text-gray-600 text-sm mb-4">Event Starts In</p>
          <div className="grid grid-cols-4 gap-2">
            {[
              { value: timeLeft.days, label: "Days" },
              { value: timeLeft.hours, label: "Hours" },
              { value: timeLeft.minutes, label: "Mins" },
              { value: timeLeft.seconds, label: "Secs" },
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-lg p-3 text-center shadow-sm">
                <div className="text-xl font-bold text-blue-600">
                  {String(item.value).padStart(2, "0")}
                </div>
                <div className="text-xs text-gray-600">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container">
          <h2 className="section-title">Why Participate?</h2>
          <p className="section-subtitle">Join thousands of students competing for glory and prizes</p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Trophy,
                title: "Amazing Prizes",
                description: "Win exciting prizes and certificates for your achievements",
              },
              {
                icon: Users,
                title: "Network & Collaborate",
                description: "Meet talented students and build lasting connections",
              },
              {
                icon: Zap,
                title: "Showcase Skills",
                description: "Demonstrate your technical expertise on a state-level platform",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="card-hover bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-xl p-8 text-center"
              >
                <feature.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Preview Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container">
          <h2 className="section-title">Featured Events</h2>
          <p className="section-subtitle">Explore our diverse range of technical and non-technical events</p>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {[
              {
                name: "Code Sprint",
                type: "Individual",
                icon: "💻",
                description: "Fast-paced coding competition",
              },
              {
                name: "Tech Quiz",
                type: "Individual",
                icon: "🧠",
                description: "Test your technical knowledge",
              },
              {
                name: "Hackathon",
                type: "Team",
                icon: "🚀",
                description: "Build innovative solutions",
              },
              {
                name: "Robotics Challenge",
                type: "Team",
                icon: "🤖",
                description: "Design and compete with robots",
              },
            ].map((event, idx) => (
              <div
                key={idx}
                className="card-hover bg-white rounded-xl p-6 border border-gray-200 shadow-md hover:shadow-xl"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-4xl mb-2">{event.icon}</div>
                    <h3 className="text-xl font-bold text-gray-800">{event.name}</h3>
                    <p className="text-sm text-blue-600 font-semibold">{event.type}</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{event.description}</p>
                <Link href="/events">
                  <Button className="w-full btn-primary">Learn More</Button>
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/events">
              <Button className="btn-gold">View All Events</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-blue-600 to-amber-500">
        <div className="container text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Compete?
          </h2>
          <p className="text-xl text-blue-50 mb-8 max-w-2xl mx-auto">
            Register now and be part of the biggest technical event of the year!
          </p>
          <Link href="/register">
            <Button className="px-8 py-4 bg-white text-blue-600 font-bold text-lg hover:bg-blue-50 transition-all duration-300 rounded-lg">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">COGNOTSAV 2K27</h3>
              <p className="text-gray-400">State Level Technical Event</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/">Home</Link></li>
                <li><Link href="/events">Events</Link></li>
                <li><Link href="/results">Results</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Participate</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/register">Register Student</Link></li>
                <li><Link href="/teams">Create Team</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-gray-400">Email: info@cognotsav.com</p>
              <p className="text-gray-400">Phone: +91 XXXXXXXXXX</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2027 COGNOTSAV. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
