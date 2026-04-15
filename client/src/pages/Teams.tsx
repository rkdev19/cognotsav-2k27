import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Users, Plus, Trash2 } from "lucide-react";

export default function Teams() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [selectedLeaderId, setSelectedLeaderId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: teams = [] } = trpc.team.list.useQuery();
  const { data: students = [] } = trpc.student.list.useQuery();

  const createTeamMutation = trpc.team.create.useMutation({
    onSuccess: () => {
      toast.success("Team created successfully!");
      setTeamName("");
      setSelectedLeaderId(null);
      setShowCreateForm(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create team");
    },
  });

  const deleteTeamMutation = trpc.team.delete.useMutation({
    onSuccess: () => {
      toast.success("Team deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete team");
    },
  });

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!teamName || !selectedLeaderId) {
        toast.error("Please fill in all fields");
        setIsSubmitting(false);
        return;
      }

      await createTeamMutation.mutateAsync({
        name: teamName,
        leaderId: selectedLeaderId,
      });
    } finally {
      setIsSubmitting(false);
    }
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
            <Link href="/teams" className="text-gray-700 hover:text-blue-600 transition font-semibold text-blue-600">
              Teams
            </Link>
            <Link href="/results" className="text-gray-700 hover:text-blue-600 transition">
              Results
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-amber-500 py-12 md:py-16">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center gap-3">
            <Users className="w-10 h-10" />
            Teams
          </h1>
          <p className="text-xl text-blue-50">Create and manage teams for team-based events</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24">
        <div className="container">
          {/* Create Team Button */}
          <div className="mb-12">
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create New Team
            </Button>
          </div>

          {/* Create Team Form */}
          {showCreateForm && (
            <div className="bg-white rounded-xl shadow-lg p-8 mb-12 animate-fade-in-up">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Create a New Team</h2>

              <form onSubmit={handleCreateTeam} className="space-y-6 max-w-2xl">
                {/* Team Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Team Name *
                  </label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="e.g., Code Warriors"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>

                {/* Team Leader */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Team Leader *
                  </label>
                  <select
                    value={selectedLeaderId || ""}
                    onChange={(e) => setSelectedLeaderId(parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    required
                  >
                    <option value="">-- Select a team leader --</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name} ({student.rollNumber})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Creating..." : "Create Team"}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </Button>
                </div>

                {/* Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    ℹ️ After creating a team, you can register it for team-based events. Make sure all team members are registered as students first.
                  </p>
                </div>
              </form>
            </div>
          )}

          {/* Teams List */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">All Teams ({teams.length})</h2>

            {teams.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-xl text-gray-600">No teams created yet</p>
                <p className="text-gray-500 mb-6">Create a team to participate in team-based events</p>
                <Button
                  onClick={() => setShowCreateForm(true)}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create First Team
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {teams.map((team) => {
                  const leader = students.find((s) => s.id === team.leaderId);
                  return (
                    <div
                      key={team.id}
                      className="card-hover bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md hover:shadow-2xl"
                    >
                      {/* Team Header */}
                      <div className="bg-gradient-to-r from-blue-600 to-amber-500 p-6 text-white">
                        <h3 className="text-2xl font-bold mb-2">{team.name}</h3>
                        <p className="text-blue-100">Team ID: {team.id}</p>
                      </div>

                      {/* Team Details */}
                      <div className="p-6">
                        <div className="mb-6">
                          <p className="text-sm text-gray-600 mb-1">Team Leader</p>
                          <p className="font-semibold text-gray-800">
                            {leader?.name || "Unknown"}
                          </p>
                          {leader && (
                            <p className="text-sm text-gray-500">{leader.rollNumber}</p>
                          )}
                        </div>

                        <div className="mb-6">
                          <p className="text-sm text-gray-600 mb-2">Created</p>
                          <p className="text-sm text-gray-700">
                            {new Date(team.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Link href={`/teams/${team.id}`} className="flex-1">
                            <Button className="w-full btn-secondary">View Details</Button>
                          </Link>
                          <button
                            onClick={() => deleteTeamMutation.mutate({ id: team.id })}
                            className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="grid md:grid-cols-2 gap-4 mt-12">
            <Link href="/register">
              <Button className="w-full btn-secondary">Register as Student</Button>
            </Link>
            <Link href="/events">
              <Button className="w-full btn-primary">Browse Events</Button>
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
