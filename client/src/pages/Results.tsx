import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Trophy, Medal } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Results() {
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  const { data: events = [] } = trpc.event.list.useQuery();
  const { data: results = [] } = trpc.result.list.useQuery();
  const { data: teams = [] } = trpc.team.list.useQuery();
  const { data: students = [] } = trpc.student.list.useQuery();

  // Get results for selected event
  const eventResults = selectedEventId
    ? results.filter((r) => r.eventId === selectedEventId)
    : results;

  // Get medal colors
  const getMedalColor = (position: number) => {
    switch (position) {
      case 1:
        return "bg-gradient-to-br from-amber-400 to-amber-600";
      case 2:
        return "bg-gradient-to-br from-gray-300 to-gray-500";
      case 3:
        return "bg-gradient-to-br from-orange-400 to-orange-600";
      default:
        return "bg-gradient-to-br from-blue-400 to-blue-600";
    }
  };

  const getMedalIcon = (position: number) => {
    if (position === 1) return "🥇";
    if (position === 2) return "🥈";
    if (position === 3) return "🥉";
    return "🎖️";
  };

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
            <Link href="/events" className="text-gray-700 hover:text-blue-600 transition">
              Events
            </Link>
            <Link href="/results" className="text-gray-700 hover:text-blue-600 transition font-semibold text-blue-600">
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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center gap-3">
            <Trophy className="w-10 h-10" />
            Results & Leaderboard
          </h1>
          <p className="text-xl text-blue-50">View winners and rankings from all events</p>
        </div>
      </section>

      {/* Event Filter */}
      <section className="bg-gray-50 py-8 border-b border-gray-200">
        <div className="container">
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            Select Event to View Results
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedEventId(null)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                selectedEventId === null
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-blue-600"
              }`}
            >
              All Events
            </button>
            {events.map((event) => (
              <button
                key={event.id}
                onClick={() => setSelectedEventId(event.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedEventId === event.id
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:border-blue-600"
                }`}
              >
                {event.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results Display */}
      <section className="py-16 md:py-24">
        <div className="container">
          {eventResults.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-600">No results available yet</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Podium View for Top 3 */}
              {eventResults.slice(0, 3).length > 0 && (
                <div className="md:col-span-2">
                  <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">🏆 Podium</h2>
                  <div className="flex justify-center items-end gap-4 mb-12">
                    {/* 2nd Place */}
                    {eventResults[1] && (
                      <div className="text-center animate-slide-in-left">
                        <div className={`${getMedalColor(2)} rounded-t-xl p-8 w-32 h-40 flex flex-col items-center justify-center text-white shadow-lg`}>
                          <div className="text-4xl mb-2">🥈</div>
                          <div className="text-2xl font-bold">2nd</div>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-b-lg">
                          <p className="font-bold text-gray-800">
                            {eventResults[1].teamId
                              ? teams.find((t) => t.id === eventResults[1].teamId)?.name
                              : students.find((s) => s.id === eventResults[1].studentId)?.name}
                          </p>
                          {eventResults[1].score && (
                            <p className="text-sm text-gray-600">Score: {eventResults[1].score}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* 1st Place */}
                    {eventResults[0] && (
                      <div className="text-center animate-fade-in-up">
                        <div className={`${getMedalColor(1)} rounded-t-xl p-8 w-32 h-48 flex flex-col items-center justify-center text-white shadow-xl`}>
                          <div className="text-5xl mb-2">🥇</div>
                          <div className="text-2xl font-bold">1st</div>
                        </div>
                        <div className="bg-amber-100 p-4 rounded-b-lg border-2 border-amber-500">
                          <p className="font-bold text-gray-800">
                            {eventResults[0].teamId
                              ? teams.find((t) => t.id === eventResults[0].teamId)?.name
                              : students.find((s) => s.id === eventResults[0].studentId)?.name}
                          </p>
                          {eventResults[0].score && (
                            <p className="text-sm text-gray-600">Score: {eventResults[0].score}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* 3rd Place */}
                    {eventResults[2] && (
                      <div className="text-center animate-slide-in-right">
                        <div className={`${getMedalColor(3)} rounded-t-xl p-8 w-32 h-36 flex flex-col items-center justify-center text-white shadow-lg`}>
                          <div className="text-4xl mb-2">🥉</div>
                          <div className="text-2xl font-bold">3rd</div>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-b-lg">
                          <p className="font-bold text-gray-800">
                            {eventResults[2].teamId
                              ? teams.find((t) => t.id === eventResults[2].teamId)?.name
                              : students.find((s) => s.id === eventResults[2].studentId)?.name}
                          </p>
                          {eventResults[2].score && (
                            <p className="text-sm text-gray-600">Score: {eventResults[2].score}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Full Leaderboard */}
              <div className="md:col-span-2">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">📊 Full Leaderboard</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                        <th className="px-6 py-4 text-left font-semibold">Rank</th>
                        <th className="px-6 py-4 text-left font-semibold">Name</th>
                        <th className="px-6 py-4 text-left font-semibold">Type</th>
                        <th className="px-6 py-4 text-left font-semibold">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eventResults.map((result, idx) => (
                        <tr
                          key={result.id}
                          className={`border-b transition-colors ${
                            idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                          } hover:bg-blue-50`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{getMedalIcon(result.position)}</span>
                              <span className="font-bold text-gray-800">#{result.position}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-800">
                            {result.teamId
                              ? teams.find((t) => t.id === result.teamId)?.name
                              : students.find((s) => s.id === result.studentId)?.name}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              result.teamId
                                ? "bg-amber-100 text-amber-800"
                                : "bg-blue-100 text-blue-800"
                            }`}>
                              {result.teamId ? "Team" : "Individual"}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold text-blue-600">
                            {result.score || "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
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
