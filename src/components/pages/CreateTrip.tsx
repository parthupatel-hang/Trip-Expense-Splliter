import { useState } from 'react';
import { MapPin, Users, Sparkles } from 'lucide-react';
import { useTrip } from '@/context/TripContext';
import { toast } from 'sonner';

interface CreateTripProps {
  onNavigate: (section: string) => void;
}

export function CreateTrip({ onNavigate }: CreateTripProps) {
  const { createTrip } = useTrip();
  const [tripName, setTripName] = useState('');
  const [participantCount, setParticipantCount] = useState(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tripName.trim()) {
      toast.error('Please enter a trip name');
      return;
    }

    if (participantCount < 2) {
      toast.error('Minimum 2 participants required');
      return;
    }

    createTrip(tripName.trim(), participantCount);
    toast.success(`Trip "${tripName}" created successfully!`);
    setTripName('');
    setParticipantCount(2);
    onNavigate('participants');
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Create New Trip</h1>
        <p className="page-subtitle">Start a new trip and invite your travel buddies</p>
      </div>

      {/* Form Card */}
      <div className="form-card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Trip Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Trip Name
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                placeholder="e.g., Goa Beach Trip 2024"
                className="input-field pl-12"
              />
            </div>
          </div>

          {/* Participant Count */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Number of Participants
            </label>
            <div className="relative">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="number"
                min={2}
                max={50}
                value={participantCount}
                onChange={(e) => setParticipantCount(parseInt(e.target.value) || 2)}
                className="input-field pl-12"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              You can always add more participants later
            </p>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" />
            Create Trip
          </button>
        </form>
      </div>

      {/* Tips Card */}
      <div className="dashboard-card bg-secondary/30">
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Pro Tips
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Give your trip a memorable name for easy identification</li>
          <li>• Add participant names after creating the trip</li>
          <li>• You can manage participants anytime from the sidebar</li>
        </ul>
      </div>
    </div>
  );
}
