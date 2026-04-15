import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Calendar, MapPin, Users, Trophy } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Events() {
  const [filter, setFilter] = useState<"all" | "individual" | "team">("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: events = [], isLoading } = trpc.event.list.useQuery();

  const filteredEvents = events.filter((event) => {
    const matchesFilter = filter === "all" || event.eventType === filter;
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container flex items-center justify-between py-4">
          <Link href="/" className="text-2xl font-bold text-gradient">
            COGNOTSAV 2K27
          </Link>
          <div className="hidden md:flex gap-6">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition">
              Home
            </Link>
            <Link href="/events" className="text-gray-700 hover:text-blue-600 transition font-semibold text-blue-600">
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

      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-amber-500 py-12 md:py-16">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Events</h1>
          <p className="text-xl text-blue-50">Explore all technical and non-technical events</p>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="bg-gray-50 py-8 border-b border-gray-200">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search Events
              </label>
              <input
                type="text"
                placeholder="Search by event name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filter by Type
              </label>
              <div className="flex gap-2">
                {[
                  { value: "all", label: "All Events" },
                  { value: "individual", label: "Individual" },
                  { value: "team", label: "Team" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFilter(option.value as any)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      filter === option.value
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 border border-gray-300 hover:border-blue-600"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16 md:py-24">
        <div className="container">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
              </div>
              <p className="mt-4 text-gray-600">Loading events...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No events found. Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="card-hover bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md hover:shadow-2xl"
                >
                  {/* Event Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-amber-500 p-6 text-white">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold mb-2">{event.name}</h3>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          event.eventType === "individual"
                            ? "bg-blue-200 text-blue-800"
                            : "bg-amber-200 text-amber-800"
                        }`}>
                          {event.eventType === "individual" ? "👤 Individual" : "👥 Team"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="p-6">
                    {event.description && (
                      <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                    )}

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-gray-700">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <span>{event.venue}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700">
                        <Users className="w-5 h-5 text-blue-600" />
                        <span>Max {event.maxParticipants} participants</span>
                      </div>
                      {event.prize && (
                        <div className="flex items-center gap-3 text-gray-700">
                          <Trophy className="w-5 h-5 text-amber-500" />
                          <span className="font-semibold text-amber-600">{event.prize}</span>
                        </div>
                      )}
                    </div>

                    <Link href={`/event-register/${event.id}`}>
                      <Button className="w-full btn-primary">Register for Event</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container text-center text-gray-400">
          <p>&copy; 2027 COGNOTSAV. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
