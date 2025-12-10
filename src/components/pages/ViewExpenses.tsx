import { useState } from 'react';
import { Edit2, Trash2, Receipt, Check, X } from 'lucide-react';
import { useTrip, Expense } from '@/context/TripContext';
import { toast } from 'sonner';

export function ViewExpenses() {
  const { currentTrip, updateExpense, deleteExpense } = useTrip();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ description: string; amount: string }>({
    description: '',
    amount: '',
  });

  const handleEdit = (expense: Expense) => {
    setEditingId(expense.id);
    setEditData({
      description: expense.description,
      amount: expense.amount.toString(),
    });
  };

  const handleSaveEdit = (expense: Expense) => {
    const newAmount = parseFloat(editData.amount);
    if (isNaN(newAmount) || newAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    // Recalculate shares for equal split
    const participants = currentTrip?.participants || [];
    if (expense.splitMethod === 'equal' && participants.length > 0) {
      const shareAmount = newAmount / participants.length;
      const newShares = participants.map(p => ({
        participantId: p.id,
        amount: Math.round(shareAmount * 100) / 100,
      }));
      
      updateExpense(expense.id, {
        description: editData.description,
        amount: newAmount,
        shares: newShares,
      });
    } else {
      // For units/exact, just update description and amount
      updateExpense(expense.id, {
        description: editData.description,
        amount: newAmount,
      });
    }

    toast.success('Expense updated!');
    setEditingId(null);
  };

  const handleDelete = (id: string, description: string) => {
    deleteExpense(id);
    toast.success(`"${description}" deleted`);
  };

  const getSplitBadgeColor = (method: string) => {
    switch (method) {
      case 'equal': return 'bg-primary/10 text-primary';
      case 'units': return 'bg-accent/10 text-accent';
      case 'exact': return 'bg-warning/10 text-warning';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (!currentTrip) {
    return (
      <div className="space-y-8">
        <div className="page-header">
          <h1 className="page-title">View Expenses</h1>
          <p className="page-subtitle">See all expenses for your trip</p>
        </div>
        <div className="dashboard-card">
          <div className="empty-state">
            <div className="empty-state-icon">
              <Receipt className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No Trip Selected</h3>
            <p className="text-muted-foreground">Please select or create a trip first</p>
          </div>
        </div>
      </div>
    );
  }

  const totalExpenses = currentTrip.expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">View Expenses</h1>
          <p className="page-subtitle">{currentTrip.name} • {currentTrip.expenses.length} expenses</p>
        </div>
        <div className="stat-card py-3 px-5">
          <Receipt className="w-5 h-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-lg font-bold text-foreground">₹{totalExpenses.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="table-container overflow-x-auto">
        <table className="data-table min-w-[600px]">
          <thead>
            <tr>
              <th>Description</th>
              <th>Amount</th>
              <th>Paid By</th>
              <th>Split Type</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentTrip.expenses.map((expense) => {
              const payer = currentTrip.participants.find(p => p.id === expense.paidBy);
              
              return (
                <tr key={expense.id} className="animate-fade-in">
                  <td>
                    {editingId === expense.id ? (
                      <input
                        type="text"
                        value={editData.description}
                        onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                        className="input-field py-1.5 px-3"
                      />
                    ) : (
                      <div>
                        <p className="font-medium text-foreground">{expense.description}</p>
                        <p className="text-xs text-muted-foreground capitalize">{expense.category}</p>
                      </div>
                    )}
                  </td>
                  <td>
                    {editingId === expense.id ? (
                      <input
                        type="number"
                        value={editData.amount}
                        onChange={(e) => setEditData(prev => ({ ...prev, amount: e.target.value }))}
                        className="input-field py-1.5 px-3 w-28"
                      />
                    ) : (
                      <span className="font-semibold text-foreground">₹{expense.amount.toLocaleString()}</span>
                    )}
                  </td>
                  <td>
                    <span className="text-foreground">{payer?.name || 'Unknown'}</span>
                  </td>
                  <td>
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${getSplitBadgeColor(expense.splitMethod)}`}>
                      {expense.splitMethod.charAt(0).toUpperCase() + expense.splitMethod.slice(1)}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-2">
                      {editingId === expense.id ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(expense)}
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
                            onClick={() => handleEdit(expense)}
                            className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(expense.id, expense.description)}
                            className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {currentTrip.expenses.length === 0 && (
          <div className="empty-state py-12">
            <div className="empty-state-icon">
              <Receipt className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No Expenses Yet</h3>
            <p className="text-muted-foreground">Add your first expense to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
