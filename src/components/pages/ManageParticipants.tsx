import { useState } from 'react';
import { UserPlus, Edit2, Trash2, Check, X, Users } from 'lucide-react';
import { useTrip } from '@/context/TripContext';
import { toast } from 'sonner';

export function ManageParticipants() {
  const { currentTrip, addParticipant, updateParticipant, deleteParticipant } = useTrip();
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      toast.error('Please enter a name');
      return;
    }
    addParticipant(newName.trim());
    toast.success(`${newName} added to the trip!`);
    setNewName('');
  };

  const handleEdit = (id: string, currentName: string) => {
    setEditingId(id);
    setEditName(currentName);
  };

  const handleSaveEdit = (id: string) => {
    if (!editName.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    updateParticipant(id, editName.trim());
    toast.success('Participant updated!');
    setEditingId(null);
    setEditName('');
  };

  const handleDelete = (id: string, name: string) => {
    deleteParticipant(id);
    toast.success(`${name} removed from the trip`);
  };

  if (!currentTrip) {
    return (
      <div className="space-y-8">
        <div className="page-header">
          <h1 className="page-title">Manage Participants</h1>
          <p className="page-subtitle">Add, edit, or remove trip participants</p>
        </div>
        <div className="dashboard-card">
          <div className="empty-state">
            <div className="empty-state-icon">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No Trip Selected</h3>
            <p className="text-muted-foreground">Please select or create a trip first</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Manage Participants</h1>
        <p className="page-subtitle">{currentTrip.name} • {currentTrip.participants.length} participants</p>
      </div>

      {/* Add Participant Form */}
      <div className="form-card">
        <h2 className="text-lg font-semibold text-foreground mb-4">Add New Participant</h2>
        <form onSubmit={handleAdd} className="flex gap-3">
          <div className="flex-1 relative">
            <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter participant name"
              className="input-field pl-12"
            />
          </div>
          <button type="submit" className="btn-primary">
            Add
          </button>
        </form>
      </div>

      {/* Participants Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentTrip.participants.map((participant, index) => (
              <tr key={participant.id} className="animate-fade-in">
                <td className="text-muted-foreground">{index + 1}</td>
                <td>
                  {editingId === participant.id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="input-field py-1.5 px-3"
                      autoFocus
                    />
                  ) : (
                    <span className="font-medium text-foreground">{participant.name}</span>
                  )}
                </td>
                <td>
                  <div className="flex items-center justify-end gap-2">
                    {editingId === participant.id ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit(participant.id)}
                          className="p-2 rounded-lg bg-success/10 text-success hover:bg-success/20 transition-colors"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(participant.id, participant.name)}
                          className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(participant.id, participant.name)}
                          className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {currentTrip.participants.length === 0 && (
          <div className="empty-state py-8">
            <p className="text-muted-foreground">No participants yet. Add some above!</p>
          </div>
        )}
      </div>
    </div>
  );
}
