import { useEffect, useState, useCallback } from "react";
import {
  Users,
  UserPlus,
  Mail,
  Search,
  MoreHorizontal,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Shield,
} from "lucide-react";
import { apiRequest } from "@/lib/api-client";
import type { ApiError } from "@/lib/api-client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/app/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/app/components/ui/tabs";

interface AdminUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  email_verified: boolean;
  current_role?: string;
}

type ModalType = "invite" | "create" | null;

function RoleBadge({ role }: { role: string }) {
  const map: Record<string, { label: string; className: string }> = {
    student: { label: "Student", className: "bg-blue-50 text-blue-700" },
    instructor: {
      label: "Instructor",
      className: "bg-purple-50 text-purple-700",
    },
    admin: { label: "Admin", className: "bg-[#e8f5e9] text-[#1b5e20]" },
  };
  const config = map[role] ?? {
    label: role,
    className: "bg-gray-100 text-gray-600",
  };
  return (
    <span
      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${config.className}`}
    >
      {config.label}
    </span>
  );
}

function UserRow({
  user,
  onRefresh,
}: {
  user: AdminUser;
  onRefresh: () => void;
}) {
  const [isUpdating, setIsUpdating] = useState(false);

  const initials =
    user.first_name || user.last_name
      ? `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase()
      : user.email[0].toUpperCase();

  const fullName =
    user.first_name || user.last_name
      ? `${user.first_name} ${user.last_name}`.trim()
      : "—";

  const handleRoleChange = async (newRole: string) => {
    setIsUpdating(true);
    try {
      await apiRequest(`/auth/admin/users/${user.id}`, {
        method: "PATCH",
        body: { role: newRole },
      });
      onRefresh();
    } catch {
      // silently fail for now
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#e8f5e9] flex items-center justify-center text-[#1b5e20] text-xs font-semibold shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-[#1a2332] truncate">
              {fullName}
            </p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <RoleBadge role={user.role} />
      </td>
      <td className="px-4 py-3">
        {user.email_verified ? (
          <span className="flex items-center gap-1 text-xs text-green-600">
            <CheckCircle className="w-3.5 h-3.5" /> Verified
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <XCircle className="w-3.5 h-3.5" /> Unverified
          </span>
        )}
      </td>
      <td className="px-4 py-3 text-right">
        {isUpdating ? (
          <Loader2 className="w-4 h-4 animate-spin text-gray-400 ml-auto" />
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {user.role !== "instructor" && (
                <DropdownMenuItem
                  onClick={() => handleRoleChange("instructor")}
                >
                  <Shield className="w-4 h-4 mr-2" /> Make instructor
                </DropdownMenuItem>
              )}
              {user.role !== "student" && (
                <DropdownMenuItem onClick={() => handleRoleChange("student")}>
                  <Users className="w-4 h-4 mr-2" /> Make student
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={() => handleRoleChange("suspended")}
              >
                <XCircle className="w-4 h-4 mr-2" /> Suspend
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </td>
    </tr>
  );
}

function InviteModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleClose = () => {
    setEmail("");
    setError(null);
    setSent(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await apiRequest("/auth/invites", {
        method: "POST",
        body: { email: email.trim() },
      });
      setSent(true);
      onSuccess();
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr.message ?? "Failed to send invite. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) handleClose();
      }}
    >
      <DialogContent className="sm:max-w-md font-[Poppins,sans-serif]">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-[#1a2332]">
            Invite instructor
          </DialogTitle>
          <p className="text-xs text-gray-500 mt-1">
            An invitation link will be sent to their email. They will set their
            own password.
          </p>
        </DialogHeader>

        {sent ? (
          <div className="py-6 text-center">
            <div className="w-12 h-12 bg-[#e8f5e9] rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-[#1b5e20]" />
            </div>
            <p className="text-sm font-semibold text-[#1a2332] mb-1">
              Invite sent
            </p>
            <p className="text-xs text-gray-500">
              An invitation has been sent to{" "}
              <span className="font-medium">{email}</span>.
            </p>
            <button
              onClick={handleClose}
              className="mt-5 w-full bg-[#1b5e20] text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-[#145218] transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="mb-4 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2.5 rounded-lg">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <div className="mb-5">
              <label
                htmlFor="invite-email"
                className="block text-xs font-semibold text-gray-700 mb-1.5"
              >
                Instructor email address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-300 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="invite-email"
                  type="email"
                  required
                  autoComplete="off"
                  placeholder="instructor@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm outline-none focus:border-[#1b5e20] transition-colors"
                />
              </div>
            </div>

            <DialogFooter>
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 border border-gray-200 text-gray-700 text-sm font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !email.trim()}
                className="flex-1 bg-[#1b5e20] text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-[#145218] disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                  </>
                ) : (
                  <>Send invite</>
                )}
              </button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

function CreateUserModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    role: "student",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (field: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleClose = () => {
    setForm({
      email: "",
      first_name: "",
      last_name: "",
      password: "",
      role: "student",
    });
    setError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await apiRequest("/auth/admin/users", {
        method: "POST",
        body: form,
      });
      onSuccess();
      handleClose();
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr.message ?? "Failed to create user. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) handleClose();
      }}
    >
      <DialogContent className="sm:max-w-md font-[Poppins,sans-serif]">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-[#1a2332]">
            Create user
          </DialogTitle>
          <p className="text-xs text-gray-500 mt-1">
            Directly create a student or instructor account.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate>
          {error && (
            <div className="mb-4 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2.5 rounded-lg">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <div className="space-y-3 mb-5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  First name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="First name"
                  value={form.first_name}
                  onChange={(e) => update("first_name", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1b5e20] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Last name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Last name"
                  value={form.last_name}
                  onChange={(e) => update("last_name", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1b5e20] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Email address *
              </label>
              <input
                type="email"
                required
                autoComplete="off"
                placeholder="user@example.com"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1b5e20] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Password *
              </label>
              <input
                type="password"
                required
                autoComplete="new-password"
                placeholder="Minimum 8 characters"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1b5e20] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Role *
              </label>
              <select
                value={form.role}
                onChange={(e) => update("role", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1b5e20] transition-colors bg-white text-gray-700"
              >
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 border border-gray-200 text-gray-700 text-sm font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-[#1b5e20] text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-[#145218] disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Creating...
                </>
              ) : (
                "Create user"
              )}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<ModalType>(null);

  const fetchUsers = useCallback(() => {
    setIsLoading(true);
    apiRequest<AdminUser[]>("/auth/admin/users")
      .then(setUsers)
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.email.toLowerCase().includes(q) ||
      u.first_name.toLowerCase().includes(q) ||
      u.last_name.toLowerCase().includes(q)
    );
  });

  const students = filtered.filter((u) => u.role === "student");
  const instructors = filtered.filter((u) => u.role === "instructor");

  const UserTable = ({ list }: { list: AdminUser[] }) =>
    list.length === 0 ? (
      <div className="text-center py-12 text-gray-400">
        <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
        <p className="text-sm">
          {search ? "No users match your search." : "No users yet."}
        </p>
      </div>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                User
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Role
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Email
              </th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {list.map((u) => (
              <UserRow key={u.id} user={u} onRefresh={fetchUsers} />
            ))}
          </tbody>
        </table>
      </div>
    );

  return (
    <div className="p-5 sm:p-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-lg font-bold text-[#1a2332]">Users</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {users.length} total ·{" "}
            {users.filter((u) => u.role === "student").length} students ·{" "}
            {users.filter((u) => u.role === "instructor").length} instructors
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setModal("invite")}
            className="flex items-center gap-2 border border-[#1b5e20] text-[#1b5e20] text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#e8f5e9] transition-colors"
          >
            <Mail className="w-4 h-4" /> Invite instructor
          </button>
          <button
            onClick={() => setModal("create")}
            className="flex items-center gap-2 bg-[#1b5e20] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#145218] transition-colors"
          >
            <UserPlus className="w-4 h-4" /> Create user
          </button>
        </div>
      </div>

      <div className="relative mb-5 max-w-sm">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:border-[#1b5e20] transition-colors bg-white"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          <span className="text-sm">Loading users...</span>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
          <AlertCircle className="w-8 h-8" />
          <p className="text-sm">Failed to load users. Please refresh.</p>
        </div>
      ) : (
        <Tabs defaultValue="students">
          <TabsList className="mb-4 bg-gray-100 p-0.5 h-auto rounded-lg">
            <TabsTrigger
              value="students"
              className="text-xs px-4 py-1.5 rounded-md data-[state=active]:bg-white data-[state=active]:text-[#1b5e20] data-[state=active]:font-semibold"
            >
              Students ({students.length})
            </TabsTrigger>
            <TabsTrigger
              value="instructors"
              className="text-xs px-4 py-1.5 rounded-md data-[state=active]:bg-white data-[state=active]:text-[#1b5e20] data-[state=active]:font-semibold"
            >
              Instructors ({instructors.length})
            </TabsTrigger>
          </TabsList>

          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
            <TabsContent value="students">
              <UserTable list={students} />
            </TabsContent>
            <TabsContent value="instructors">
              <UserTable list={instructors} />
            </TabsContent>
          </div>
        </Tabs>
      )}

      <InviteModal
        open={modal === "invite"}
        onClose={() => setModal(null)}
        onSuccess={fetchUsers}
      />
      <CreateUserModal
        open={modal === "create"}
        onClose={() => setModal(null)}
        onSuccess={fetchUsers}
      />
    </div>
  );
}
