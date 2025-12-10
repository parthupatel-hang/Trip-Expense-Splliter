import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Participant {
  id: string;
  name: string;
}

export interface ExpenseShare {
  participantId: string;
  amount: number;
  units?: number;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  splitMethod: 'equal' | 'units' | 'exact';
  shares: ExpenseShare[];
  category: 'food' | 'travel' | 'stay' | 'shopping' | 'other';
  date: string;
}

export interface Trip {
  id: string;
  name: string;
  participants: Participant[];
  expenses: Expense[];
  createdAt: string;
}

interface TripContextType {
  trips: Trip[];
  currentTripId: string | null;
  currentTrip: Trip | null;
  createTrip: (name: string, participantCount: number) => void;
  deleteTrip: (id: string) => void;
  selectTrip: (id: string) => void;
  addParticipant: (name: string) => void;
  updateParticipant: (id: string, name: string) => void;
  deleteParticipant: (id: string) => void;
  addExpense: (expense: Omit<Expense, 'id' | 'date'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  getSettlements: () => { from: string; to: string; amount: number }[];
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export function TripProvider({ children }: { children: ReactNode }) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [currentTripId, setCurrentTripId] = useState<string | null>(null);

  const currentTrip = trips.find(t => t.id === currentTripId) || null;

  const createTrip = (name: string, participantCount: number) => {
    const newTrip: Trip = {
      id: crypto.randomUUID(),
      name,
      participants: Array.from({ length: participantCount }, (_, i) => ({
        id: crypto.randomUUID(),
        name: `Participant ${i + 1}`,
      })),
      expenses: [],
      createdAt: new Date().toISOString(),
    };
    setTrips(prev => [...prev, newTrip]);
    setCurrentTripId(newTrip.id);
  };

  const deleteTrip = (id: string) => {
    setTrips(prev => prev.filter(t => t.id !== id));
    if (currentTripId === id) {
      const remaining = trips.filter(t => t.id !== id);
      setCurrentTripId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const selectTrip = (id: string) => {
    setCurrentTripId(id);
  };

  const addParticipant = (name: string) => {
    if (!currentTripId) return;
    setTrips(prev => prev.map(t => 
      t.id === currentTripId 
        ? { ...t, participants: [...t.participants, { id: crypto.randomUUID(), name }] }
        : t
    ));
  };

  const updateParticipant = (id: string, name: string) => {
    if (!currentTripId) return;
    setTrips(prev => prev.map(t => 
      t.id === currentTripId 
        ? { ...t, participants: t.participants.map(p => p.id === id ? { ...p, name } : p) }
        : t
    ));
  };

  const deleteParticipant = (id: string) => {
    if (!currentTripId) return;
    setTrips(prev => prev.map(t => 
      t.id === currentTripId 
        ? { ...t, participants: t.participants.filter(p => p.id !== id) }
        : t
    ));
  };

  const addExpense = (expense: Omit<Expense, 'id' | 'date'>) => {
    if (!currentTripId) return;
    const newExpense: Expense = {
      ...expense,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };
    setTrips(prev => prev.map(t => 
      t.id === currentTripId 
        ? { ...t, expenses: [...t.expenses, newExpense] }
        : t
    ));
  };

  const updateExpense = (id: string, expense: Partial<Expense>) => {
    if (!currentTripId) return;
    setTrips(prev => prev.map(t => 
      t.id === currentTripId 
        ? { ...t, expenses: t.expenses.map(e => e.id === id ? { ...e, ...expense } : e) }
        : t
    ));
  };

  const deleteExpense = (id: string) => {
    if (!currentTripId) return;
    setTrips(prev => prev.map(t => 
      t.id === currentTripId 
        ? { ...t, expenses: t.expenses.filter(e => e.id !== id) }
        : t
    ));
  };

  const getSettlements = () => {
    if (!currentTrip) return [];

    // Calculate net balance for each participant
    const balances: Record<string, number> = {};
    
    currentTrip.participants.forEach(p => {
      balances[p.id] = 0;
    });

    currentTrip.expenses.forEach(expense => {
      // Add what the payer paid
      balances[expense.paidBy] += expense.amount;
      
      // Subtract what each person owes
      expense.shares.forEach(share => {
        balances[share.participantId] -= share.amount;
      });
    });

    // Separate into creditors and debtors
    const creditors: { id: string; amount: number }[] = [];
    const debtors: { id: string; amount: number }[] = [];

    Object.entries(balances).forEach(([id, balance]) => {
      if (balance > 0.01) {
        creditors.push({ id, amount: balance });
      } else if (balance < -0.01) {
        debtors.push({ id, amount: -balance });
      }
    });

    // Sort for optimal matching
    creditors.sort((a, b) => b.amount - a.amount);
    debtors.sort((a, b) => b.amount - a.amount);

    // Generate settlements
    const settlements: { from: string; to: string; amount: number }[] = [];
    
    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
      const amount = Math.min(debtor.amount, creditor.amount);
      
      if (amount > 0.01) {
        const fromName = currentTrip.participants.find(p => p.id === debtor.id)?.name || 'Unknown';
        const toName = currentTrip.participants.find(p => p.id === creditor.id)?.name || 'Unknown';
        settlements.push({ from: fromName, to: toName, amount: Math.round(amount * 100) / 100 });
      }
      
      debtor.amount -= amount;
      creditor.amount -= amount;
      
      if (debtor.amount < 0.01) i++;
      if (creditor.amount < 0.01) j++;
    }

    return settlements;
  };

  return (
    <TripContext.Provider value={{
      trips,
      currentTripId,
      currentTrip,
      createTrip,
      deleteTrip,
      selectTrip,
      addParticipant,
      updateParticipant,
      deleteParticipant,
      addExpense,
      updateExpense,
      deleteExpense,
      getSettlements,
    }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
}
