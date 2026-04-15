import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, LogOut } from "lucide-react";

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<"events" | "students" | "registrations" | "results">("events");

  const { data: events = [] } = trpc.event.list.useQuery();
  const { data: students = [] } = trpc.student.list.useQuery();
  const { data: registrations = [] } = trpc.registration.list.useQuery();
  const { data: results = [] } = trpc.result.list.useQuery();

  const deleteEventMutation = trpc.event.delete.useMutation({
    onSuccess: () => {
      toast.success("Event deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete event");
    },
  });

  const deleteStudentMutation = trpc.student.delete.useMutation({
    onSuccess: () => {
      toast.success("Student deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete student");
    },
  });

  const logoutMutation = trpc.admin.logout.useMutation({
    onSuccess: () => {
      toast.success("Logged out successfully");
      navigate("/admin");
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-amber-500 text-white shadow-lg">
        <div className="container py-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button onClick={handleLogout} className="bg-white text-blue-600 hover:bg-gray-100 flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {[
            { id: "events", label: "📅 Events", count: events.length },
            { id: "students", label: "👥 Students", count: students.length },
            { id: "registrations", label: "📝 Registrations", count: registrations.length },
            { id: "results", label: "🏆 Results", count: results.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Events Tab */}
        {activeTab === "events" && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Events Management</h2>
              <Link href="/admin/create-event">
                <Button className="btn-primary flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create Event
                </Button>
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-6 py-3 text-left font-semibold">Event Name</th>
                    <th className="px-6 py-3 text-left font-semibold">Type</th>
                    <th className="px-6 py-3 text-left font-semibold">Date</th>
                    <th className="px-6 py-3 text-left font-semibold">Max Participants</th>
                    <th className="px-6 py-3 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-3 font-semibold">{event.name}</td>
                      <td className="px-6 py-3">{event.eventType}</td>
                      <td className="px-6 py-3">{new Date(event.date).toLocaleDateString()}</td>
                      <td className="px-6 py-3">{event.maxParticipants}</td>
                      <td className="px-6 py-3 flex gap-2">
                        <button className="text-blue-600 hover:text-blue-800 transition" title="Edit event">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteEventMutation.mutate({ id: event.id })}
                          className="text-red-600 hover:text-red-800 transition"
                          title="Delete event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === "students" && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Students Management</h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-6 py-3 text-left font-semibold">Name</th>
                    <th className="px-6 py-3 text-left font-semibold">Roll Number</th>
                    <th className="px-6 py-3 text-left font-semibold">Department</th>
                    <th className="px-6 py-3 text-left font-semibold">Year</th>
                    <th className="px-6 py-3 text-left font-semibold">Email</th>
                    <th className="px-6 py-3 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-3 font-semibold">{student.name}</td>
                      <td className="px-6 py-3">{student.rollNumber}</td>
                      <td className="px-6 py-3">{student.department}</td>
                      <td className="px-6 py-3">{student.year}</td>
                      <td className="px-6 py-3">{student.email}</td>
                      <td className="px-6 py-3 flex gap-2">
                        <button
                          onClick={() => deleteStudentMutation.mutate({ id: student.id })}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Registrations Tab */}
        {activeTab === "registrations" && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Registrations</h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-6 py-3 text-left font-semibold">Event</th>
                    <th className="px-6 py-3 text-left font-semibold">Type</th>
                    <th className="px-6 py-3 text-left font-semibold">Participant</th>
                    <th className="px-6 py-3 text-left font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((reg) => (
                    <tr key={reg.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-3 font-semibold">
                        {events.find((e) => e.id === reg.eventId)?.name}
                      </td>
                      <td className="px-6 py-3">{reg.studentId ? "Individual" : "Team"}</td>
                      <td className="px-6 py-3">
                        {reg.studentId
                          ? students.find((s) => s.id === reg.studentId)?.name
                          : `Team ${reg.teamId}`}
                      </td>
                      <td className="px-6 py-3">{new Date(reg.registeredAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Results Tab */}
        {activeTab === "results" && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Results Management</h2>
              <Link href="/admin/add-result">
                <Button className="btn-primary flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Result
                </Button>
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-6 py-3 text-left font-semibold">Event</th>
                    <th className="px-6 py-3 text-left font-semibold">Position</th>
                    <th className="px-6 py-3 text-left font-semibold">Winner</th>
                    <th className="px-6 py-3 text-left font-semibold">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => (
                    <tr key={result.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-3 font-semibold">
                        {events.find((e) => e.id === result.eventId)?.name}
                      </td>
                      <td className="px-6 py-3 font-bold text-amber-600">#{result.position}</td>
                      <td className="px-6 py-3">
                        {result.teamId
                          ? `Team ${result.teamId}`
                          : students.find((s) => s.id === result.studentId)?.name}
                      </td>
                      <td className="px-6 py-3">{result.score || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
