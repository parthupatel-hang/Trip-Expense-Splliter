import { MapPin, Receipt, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { useTrip } from '@/context/TripContext';

interface DashboardProps {
  onNavigate: (section: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { trips, currentTrip } = useTrip();

  const totalExpenses = currentTrip 
    ? currentTrip.expenses.reduce((sum, e) => sum + e.amount, 0)
    : 0;

  const stats = [
    {
      label: 'Total Trips',
      value: trips.length,
      icon: MapPin,
      color: 'from-primary to-primary/80',
    },
    {
      label: 'Total Expenses',
      value: `₹${totalExpenses.toLocaleString()}`,
      icon: Receipt,
      color: 'from-accent to-accent/80',
    },
    {
      label: 'Active Participants',
      value: currentTrip?.participants.length || 0,
      icon: Users,
      color: 'from-success to-success/80',
    },
  ];

  const quickActions = [
    { label: 'Create New Trip', section: 'create-trip', icon: MapPin },
    { label: 'Add Expense', section: 'add-expense', icon: Receipt },
    { label: 'View Analytics', section: 'analytics', icon: TrendingUp },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">
          {currentTrip 
            ? `Currently viewing: ${currentTrip.name}` 
            : 'Welcome! Create a trip to get started.'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={stat.label} 
              className="stat-card"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`stat-icon bg-gradient-to-br ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.section}
                onClick={() => onNavigate(action.section)}
                className="dashboard-card flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-secondary-foreground">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-foreground">{action.label}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      {currentTrip && currentTrip.expenses.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Expenses</h2>
          <div className="dashboard-card">
            <div className="space-y-4">
              {currentTrip.expenses.slice(-5).reverse().map((expense) => {
                const payer = currentTrip.participants.find(p => p.id === expense.paidBy);
                return (
                  <div key={expense.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="font-medium text-foreground">{expense.description}</p>
                      <p className="text-sm text-muted-foreground">
                        Paid by {payer?.name || 'Unknown'} • {expense.category}
                      </p>
                    </div>
                    <span className="text-lg font-semibold text-foreground">
                      ₹{expense.amount.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!currentTrip && (
        <div className="dashboard-card">
          <div className="empty-state">
            <div className="empty-state-icon">
              <MapPin className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No Trip Selected</h3>
            <p className="text-muted-foreground mb-4">Create your first trip to start tracking expenses</p>
            <button 
              onClick={() => onNavigate('create-trip')}
              className="btn-primary"
            >
              Create Trip
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
