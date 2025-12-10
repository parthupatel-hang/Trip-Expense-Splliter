import { Menu, ChevronDown, Trash2, MapPin } from 'lucide-react';
import { useTrip } from '@/context/TripContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { trips, currentTrip, currentTripId, selectTrip, deleteTrip } = useTrip();

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="hidden sm:flex items-center gap-2 text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">
            {currentTrip ? currentTrip.name : 'No trip selected'}
          </span>
        </div>
      </div>

      {/* Right side - Trip Management */}
      <div className="flex items-center gap-3">
        {/* Trip Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">
              <span className="text-sm font-medium">
                {currentTrip ? currentTrip.name : 'Select Trip'}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-popover">
            {trips.length === 0 ? (
              <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                No trips yet. Create one!
              </div>
            ) : (
              trips.map(trip => (
                <DropdownMenuItem 
                  key={trip.id}
                  onClick={() => selectTrip(trip.id)}
                  className={`cursor-pointer ${trip.id === currentTripId ? 'bg-primary/10 text-primary' : ''}`}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  {trip.name}
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Delete Trip Button */}
        {currentTrip && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Trip?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{currentTrip.name}"? This will remove all participants, expenses, and cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => deleteTrip(currentTrip.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </header>
  );
}
