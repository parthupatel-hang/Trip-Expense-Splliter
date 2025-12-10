import { ArrowRight, CheckCircle, ArrowLeftRight } from 'lucide-react';
import { useTrip } from '@/context/TripContext';

export function Settlement() {
  const { currentTrip, getSettlements } = useTrip();
  const settlements = getSettlements();

  if (!currentTrip) {
    return (
      <div className="space-y-8">
        <div className="page-header">
          <h1 className="page-title">Settlement</h1>
          <p className="page-subtitle">See who owes whom</p>
        </div>
        <div className="dashboard-card">
          <div className="empty-state">
            <div className="empty-state-icon">
              <ArrowLeftRight className="w-8 h-8 text-muted-foreground" />
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
        <h1 className="page-title">Settlement</h1>
        <p className="page-subtitle">{currentTrip.name} • Optimized payments</p>
      </div>

      {/* Settlement Cards */}
      {settlements.length > 0 ? (
        <div className="space-y-4">
          {settlements.map((settlement, index) => (
            <div 
              key={index} 
              className="settlement-card animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-destructive">
                    {settlement.from.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{settlement.from}</p>
                  <p className="text-sm text-muted-foreground">owes money</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <ArrowRight className="w-6 h-6 text-muted-foreground" />
                <div className="px-4 py-2 rounded-lg bg-primary/10">
                  <span className="text-xl font-bold text-primary">₹{settlement.amount}</span>
                </div>
                <ArrowRight className="w-6 h-6 text-muted-foreground" />
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-success">
                    {settlement.to.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{settlement.to}</p>
                  <p className="text-sm text-muted-foreground">receives money</p>
                </div>
              </div>
            </div>
          ))}

          {/* Summary */}
          <div className="dashboard-card bg-success/5 border border-success/20">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-success" />
              <div>
                <p className="font-semibold text-foreground">
                  {settlements.length} payment{settlements.length !== 1 ? 's' : ''} needed
                </p>
                <p className="text-sm text-muted-foreground">
                  This is the minimum number of transactions to settle all debts
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="dashboard-card">
          <div className="empty-state">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">All Settled Up!</h3>
            <p className="text-muted-foreground">
              {currentTrip.expenses.length === 0 
                ? 'Add some expenses to see settlements' 
                : 'Everyone is even - no payments needed'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
