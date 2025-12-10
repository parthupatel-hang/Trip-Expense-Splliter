import { useState, useEffect } from 'react';
import { Receipt, DollarSign, Users, Tag } from 'lucide-react';
import { useTrip, ExpenseShare } from '@/context/TripContext';
import { toast } from 'sonner';

interface AddExpenseProps {
  onNavigate: (section: string) => void;
}

type SplitMethod = 'equal' | 'units' | 'exact';
type Category = 'food' | 'travel' | 'stay' | 'shopping' | 'other';

const categories: { value: Category; label: string }[] = [
  { value: 'food', label: 'Food & Drinks' },
  { value: 'travel', label: 'Travel' },
  { value: 'stay', label: 'Stay' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'other', label: 'Other' },
];

export function AddExpense({ onNavigate }: AddExpenseProps) {
  const { currentTrip, addExpense } = useTrip();
  
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [splitMethod, setSplitMethod] = useState<SplitMethod>('equal');
  const [category, setCategory] = useState<Category>('other');
  const [customShares, setCustomShares] = useState<Record<string, string>>({});

  // Initialize paidBy when trip changes
  useEffect(() => {
    if (currentTrip?.participants.length && !paidBy) {
      setPaidBy(currentTrip.participants[0].id);
    }
  }, [currentTrip, paidBy]);

  // Reset custom shares when split method changes
  useEffect(() => {
    if (currentTrip) {
      const initial: Record<string, string> = {};
      currentTrip.participants.forEach(p => {
        initial[p.id] = '';
      });
      setCustomShares(initial);
    }
  }, [splitMethod, currentTrip]);

  const calculateShares = (): ExpenseShare[] | null => {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0 || !currentTrip) return null;

    const participants = currentTrip.participants;

    if (splitMethod === 'equal') {
      const shareAmount = amountNum / participants.length;
      return participants.map(p => ({
        participantId: p.id,
        amount: Math.round(shareAmount * 100) / 100,
      }));
    }

    if (splitMethod === 'units') {
      const units: Record<string, number> = {};
      let totalUnits = 0;
      
      for (const p of participants) {
        const unitVal = parseFloat(customShares[p.id] || '0');
        if (isNaN(unitVal) || unitVal < 0) {
          toast.error(`Invalid units for ${p.name}`);
          return null;
        }
        units[p.id] = unitVal;
        totalUnits += unitVal;
      }

      if (totalUnits === 0) {
        toast.error('Total units cannot be zero');
        return null;
      }

      return participants.map(p => ({
        participantId: p.id,
        amount: Math.round((amountNum * units[p.id] / totalUnits) * 100) / 100,
        units: units[p.id],
      }));
    }

    if (splitMethod === 'exact') {
      let totalExact = 0;
      const exactAmounts: Record<string, number> = {};

      for (const p of participants) {
        const exactVal = parseFloat(customShares[p.id] || '0');
        if (isNaN(exactVal) || exactVal < 0) {
          toast.error(`Invalid amount for ${p.name}`);
          return null;
        }
        exactAmounts[p.id] = exactVal;
        totalExact += exactVal;
      }

      // Allow small floating point differences
      if (Math.abs(totalExact - amountNum) > 0.01) {
        toast.error(`Exact amounts (₹${totalExact.toFixed(2)}) must equal total (₹${amountNum.toFixed(2)})`);
        return null;
      }

      return participants.map(p => ({
        participantId: p.id,
        amount: exactAmounts[p.id],
      }));
    }

    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentTrip) {
      toast.error('Please select a trip first');
      return;
    }

    if (!description.trim()) {
      toast.error('Please enter a description');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!paidBy) {
      toast.error('Please select who paid');
      return;
    }

    const shares = calculateShares();
    if (!shares) return;

    addExpense({
      description: description.trim(),
      amount: amountNum,
      paidBy,
      splitMethod,
      shares,
      category,
    });

    toast.success('Expense added successfully!');
    setDescription('');
    setAmount('');
    setSplitMethod('equal');
    setCategory('other');
    setCustomShares({});
    onNavigate('expenses');
  };

  if (!currentTrip) {
    return (
      <div className="space-y-8">
        <div className="page-header">
          <h1 className="page-title">Add Expense</h1>
          <p className="page-subtitle">Track a new expense for your trip</p>
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

  if (currentTrip.participants.length === 0) {
    return (
      <div className="space-y-8">
        <div className="page-header">
          <h1 className="page-title">Add Expense</h1>
          <p className="page-subtitle">Track a new expense for your trip</p>
        </div>
        <div className="dashboard-card">
          <div className="empty-state">
            <div className="empty-state-icon">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No Participants</h3>
            <p className="text-muted-foreground mb-4">Add participants before adding expenses</p>
            <button onClick={() => onNavigate('participants')} className="btn-primary">
              Add Participants
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Add Expense</h1>
        <p className="page-subtitle">{currentTrip.name}</p>
      </div>

      {/* Form Card */}
      <div className="form-card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Description</label>
            <div className="relative">
              <Receipt className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Dinner at Restaurant"
                className="input-field pl-12"
              />
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Amount (₹)</label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="input-field pl-12"
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Category</label>
            <div className="relative">
              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="input-field pl-12 appearance-none cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Paid By */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Paid By</label>
            <div className="relative">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <select
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
                className="input-field pl-12 appearance-none cursor-pointer"
              >
                {currentTrip.participants.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Split Method */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">Split Method</label>
            <div className="grid grid-cols-3 gap-3">
              {(['equal', 'units', 'exact'] as SplitMethod[]).map(method => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setSplitMethod(method)}
                  className={`py-3 px-4 rounded-lg font-medium text-sm transition-all ${
                    splitMethod === method
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {method.charAt(0).toUpperCase() + method.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Fields for Units/Exact */}
          {(splitMethod === 'units' || splitMethod === 'exact') && (
            <div className="space-y-4 p-4 rounded-lg bg-muted/50 animate-fade-in">
              <h4 className="font-medium text-foreground">
                {splitMethod === 'units' 
                  ? 'Enter units for each participant' 
                  : 'Enter exact amount for each participant'}
              </h4>
              <div className="space-y-3">
                {currentTrip.participants.map(p => (
                  <div key={p.id} className="flex items-center gap-4">
                    <span className="flex-1 text-sm text-foreground">{p.name}</span>
                    <input
                      type="number"
                      min="0"
                      step={splitMethod === 'exact' ? '0.01' : '1'}
                      value={customShares[p.id] || ''}
                      onChange={(e) => setCustomShares(prev => ({
                        ...prev,
                        [p.id]: e.target.value
                      }))}
                      placeholder={splitMethod === 'units' ? 'Units' : '₹ Amount'}
                      className="input-field w-32 py-2 text-right"
                    />
                  </div>
                ))}
              </div>
              {splitMethod === 'exact' && amount && (
                <div className="pt-2 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total entered:</span>
                    <span className={`font-medium ${
                      Math.abs(Object.values(customShares).reduce((sum, v) => sum + (parseFloat(v) || 0), 0) - parseFloat(amount)) < 0.01
                        ? 'text-success'
                        : 'text-destructive'
                    }`}>
                      ₹{Object.values(customShares).reduce((sum, v) => sum + (parseFloat(v) || 0), 0).toFixed(2)} / ₹{parseFloat(amount).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Submit */}
          <button type="submit" className="btn-primary w-full">
            Add Expense
          </button>
        </form>
      </div>
    </div>
  );
}
