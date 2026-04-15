import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function EventRegistration() {
  const params = useParams();
  const [, navigate] = useLocation();
  const eventId = parseInt(params.eventId || "0");

  const [registrationType, setRegistrationType] = useState<"individual" | "team">("individual");
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: event } = trpc.event.getById.useQuery({ id: eventId });
  const { data: students = [] } = trpc.student.list.useQuery();
  const { data: teams = [] } = trpc.team.list.useQuery();

  const registerMutation = trpc.registration.create.useMutation({
    onSuccess: () => {
      toast.success("Registration successful!");
      setTimeout(() => navigate("/events"), 1500);
    },
    onError: (error) => {
      toast.error(error.message || "Registration failed. Please try again.");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (registrationType === "individual" && !selectedStudentId) {
        toast.error("Please select a student");
        setIsSubmitting(false);
        return;
      }

      if (registrationType === "team" && !selectedTeamId) {
        toast.error("Please select a team");
        setIsSubmitting(false);
        return;
      }

      await registerMutation.mutateAsync({
        eventId,
        studentId: registrationType === "individual" ? selectedStudentId || undefined : undefined,
        teamId: registrationType === "team" ? selectedTeamId || undefined : undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin mb-4">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
          </div>
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-amber-500 py-12 md:py-16">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Event Registration</h1>
          <p className="text-xl text-blue-50">Register for {event.name}</p>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-16 md:py-24">
        <div className="container max-w-2xl">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 animate-fade-in-up">
            {/* Event Details */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{event.name}</h2>
              <div className="grid md:grid-cols-2 gap-4 text-gray-700">
                <div>
                  <p className="text-sm text-gray-600">Event Type</p>
                  <p className="font-semibold">
                    {event.eventType === "individual" ? "👤 Individual" : "👥 Team"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Max Participants</p>
                  <p className="font-semibold">{event.maxParticipants}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Registration Type Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Registration Type *
                </label>
                <div className="space-y-3">
                  {event.eventType === "individual" && (
                    <label className="flex items-center p-4 border-2 border-blue-200 rounded-lg cursor-pointer hover:bg-blue-50 transition">
                      <input
                        type="radio"
                        name="type"
                        value="individual"
                        checked={registrationType === "individual"}
                        onChange={(e) => setRegistrationType(e.target.value as "individual")}
                        className="w-4 h-4"
                      />
                      <span className="ml-3 font-semibold text-gray-800">Individual Registration</span>
                    </label>
                  )}
                  {event.eventType === "team" && (
                    <label className="flex items-center p-4 border-2 border-blue-200 rounded-lg cursor-pointer hover:bg-blue-50 transition">
                      <input
                        type="radio"
                        name="type"
                        value="team"
                        checked={registrationType === "team"}
                        onChange={(e) => setRegistrationType(e.target.value as "team")}
                        className="w-4 h-4"
                      />
                      <span className="ml-3 font-semibold text-gray-800">Team Registration</span>
                    </label>
                  )}
                </div>
              </div>

              {/* Student Selection */}
              {registrationType === "individual" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Student *
                  </label>
                  <select
                    value={selectedStudentId || ""}
                    onChange={(e) => setSelectedStudentId(parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  >
                    <option value="">-- Select a student --</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name} ({student.rollNumber})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Team Selection */}
              {registrationType === "team" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Team *
                  </label>
                  <select
                    value={selectedTeamId || ""}
                    onChange={(e) => setSelectedTeamId(parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  >
                    <option value="">-- Select a team --</option>
                    {teams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Registering..." : "Complete Registration"}
                </Button>
              </div>

              {/* Info Message */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  ℹ️ Make sure you have already registered as a student or created a team before registering for this event.
                </p>
              </div>
            </form>
          </div>

          {/* Quick Links */}
          <div className="grid md:grid-cols-2 gap-4 mt-8">
            <Link href="/register">
              <Button className="w-full btn-secondary">Register as Student</Button>
            </Link>
            <Link href="/teams">
              <Button className="w-full btn-secondary">Create Team</Button>
            </Link>
          </div>
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
