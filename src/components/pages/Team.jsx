import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { teamService } from "@/services/api/teamService";
import { toast } from "react-toastify";

const Team = () => {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [newMember, setNewMember] = useState({
    email: "",
    role: "user"
  });

  const roleOptions = [
    { value: "admin", label: "Admin" },
    { value: "user", label: "User" },
    { value: "viewer", label: "Viewer" }
  ];

  const loadTeamMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await teamService.getAll();
      setMembers(result);
      setFilteredMembers(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    if (term.trim() === "") {
      setFilteredMembers(members);
    } else {
      const filtered = members.filter(member =>
        member.name.toLowerCase().includes(term.toLowerCase()) ||
        member.email.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredMembers(filtered);
    }
  };

  const handleInvite = async () => {
    try {
      if (!newMember.email || !newMember.role) {
        toast.error("Please fill in all fields");
        return;
      }

      const result = await teamService.create({
        ...newMember,
        status: "pending",
        joinedAt: new Date().toISOString()
      });

      setMembers([...members, result]);
      setFilteredMembers([...filteredMembers, result]);
      setNewMember({ email: "", role: "user" });
      setShowInviteForm(false);
      toast.success("Invitation sent successfully");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleUpdateRole = async (memberId, newRole) => {
    try {
      const updatedMember = await teamService.update(memberId, { role: newRole });
      const updatedMembers = members.map(member => 
        member.Id === memberId ? updatedMember : member
      );
      setMembers(updatedMembers);
      setFilteredMembers(updatedMembers);
      toast.success("Role updated successfully");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleRemove = async (memberId) => {
    try {
      await teamService.delete(memberId);
      const updatedMembers = members.filter(member => member.Id !== memberId);
      setMembers(updatedMembers);
      setFilteredMembers(updatedMembers);
      toast.success("Member removed successfully");
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    loadTeamMembers();
  }, []);

  if (loading) {
    return <Loading variant="table" />;
  }

  if (error) {
    return <Error onRetry={loadTeamMembers} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-surface-50">Team</h1>
          <p className="text-surface-400 mt-1">
            Manage workspace members and their permissions
          </p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => setShowInviteForm(true)}
        >
          <ApperIcon name="UserPlus" size={16} className="mr-2" />
          Invite Member
        </Button>
      </div>

      {/* Invite Form */}
      {showInviteForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-surface-50">Invite Team Member</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowInviteForm(false)}
              >
                <ApperIcon name="X" size={16} />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Email Address"
                type="email"
                value={newMember.email}
                onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                placeholder="member@company.com"
              />
              <Select
                label="Role"
                options={roleOptions}
                value={newMember.role}
                onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
              />
            </div>
            
            <div className="flex space-x-3 mt-6">
              <Button variant="primary" onClick={handleInvite}>
                <ApperIcon name="Send" size={16} className="mr-2" />
                Send Invitation
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowInviteForm(false)}
              >
                Cancel
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Search */}
      <SearchBar
        onSearch={handleSearch}
        placeholder="Search team members..."
        className="max-w-md"
      />

      {/* Team Members */}
      {filteredMembers.length === 0 ? (
        <Empty
          title="No team members found"
          message="Invite your first team member to start collaborating."
          icon="Users"
          actionLabel="Invite Member"
          onAction={() => setShowInviteForm(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member, index) => (
            <motion.div
              key={member.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6" hover>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                    <ApperIcon name="User" size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-surface-50">{member.name}</h3>
                    <p className="text-sm text-surface-400">{member.email}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <Badge 
                    variant={
                      member.role === "admin" ? "primary" :
                      member.role === "user" ? "secondary" : "default"
                    }
                    size="sm"
                  >
                    {member.role}
                  </Badge>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    member.status === "active" 
                      ? "bg-accent-500/20 text-accent-400" 
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}>
                    {member.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-surface-400">Joined</span>
                    <span className="text-surface-200">
                      {new Date(member.joinedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-surface-400">Last Active</span>
                    <span className="text-surface-200">
                      {member.lastActive ? new Date(member.lastActive).toLocaleDateString() : "Never"}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleUpdateRole(member.Id, member.role === "admin" ? "user" : "admin")}
                  >
                    <ApperIcon name="Settings" size={16} className="mr-1" />
                    {member.role === "admin" ? "Demote" : "Promote"}
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => handleRemove(member.Id)}
                  >
                    <ApperIcon name="UserMinus" size={16} />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Team;