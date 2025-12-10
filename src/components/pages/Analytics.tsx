import { BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { useTrip } from '@/context/TripContext';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const CATEGORY_COLORS: Record<string, string> = {
  food: '#10b981',
  travel: '#0ea5e9',
  stay: '#8b5cf6',
  shopping: '#f59e0b',
  other: '#6b7280',
};

const CATEGORY_LABELS: Record<string, string> = {
  food: 'Food & Drinks',
  travel: 'Travel',
  stay: 'Stay',
  shopping: 'Shopping',
  other: 'Other',
};

export function Analytics() {
  const { currentTrip } = useTrip();

  if (!currentTrip) {
    return (
      <div className="space-y-8">
        <div className="page-header">
          <h1 className="page-title">Spending Analytics</h1>
          <p className="page-subtitle">Visualize your trip expenses</p>
        </div>
        <div className="dashboard-card">
          <div className="empty-state">
            <div className="empty-state-icon">
              <BarChart3 className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No Trip Selected</h3>
            <p className="text-muted-foreground">Please select or create a trip first</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate category totals
  const categoryTotals: Record<string, number> = {
    food: 0,
    travel: 0,
    stay: 0,
    shopping: 0,
    other: 0,
  };

  currentTrip.expenses.forEach(expense => {
    categoryTotals[expense.category] += expense.amount;
  });

  const pieData = Object.entries(categoryTotals)
    .filter(([_, value]) => value > 0)
    .map(([key, value]) => ({
      name: CATEGORY_LABELS[key],
      value,
      color: CATEGORY_COLORS[key],
    }));

  const barData = Object.entries(categoryTotals).map(([key, value]) => ({
    name: CATEGORY_LABELS[key],
    amount: value,
    fill: CATEGORY_COLORS[key],
  }));

  // Calculate participant spending
  const participantSpending: Record<string, number> = {};
  currentTrip.participants.forEach(p => {
    participantSpending[p.id] = 0;
  });

  currentTrip.expenses.forEach(expense => {
    expense.shares.forEach(share => {
      if (participantSpending[share.participantId] !== undefined) {
        participantSpending[share.participantId] += share.amount;
      }
    });
  });

  const participantData = currentTrip.participants.map(p => ({
    name: p.name,
    amount: Math.round(participantSpending[p.id] * 100) / 100,
  }));

  const totalExpenses = currentTrip.expenses.reduce((sum, e) => sum + e.amount, 0);

  if (currentTrip.expenses.length === 0) {
    return (
      <div className="space-y-8">
        <div className="page-header">
          <h1 className="page-title">Spending Analytics</h1>
          <p className="page-subtitle">{currentTrip.name}</p>
        </div>
        <div className="dashboard-card">
          <div className="empty-state">
            <div className="empty-state-icon">
              <PieChartIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No Expenses Yet</h3>
            <p className="text-muted-foreground">Add expenses to see analytics</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Spending Analytics</h1>
        <p className="page-subtitle">{currentTrip.name} • Total: ₹{totalExpenses.toLocaleString()}</p>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-primary" />
            Spending by Category
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart - Categories */}
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Category Breakdown
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical">
                <XAxis type="number" tickFormatter={(value) => `₹${value}`} />
                <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                  }}
                />
                <Bar 
                  dataKey="amount" 
                  radius={[0, 4, 4, 0]}
                  animationBegin={0}
                  animationDuration={800}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Participant Spending */}
      <div className="dashboard-card">
        <h3 className="text-lg font-semibold text-foreground mb-6">Individual Spending</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={participantData}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(value) => `₹${value}`} />
              <Tooltip 
                formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Total Owed']}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                }}
              />
              <Bar 
                dataKey="amount" 
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
                animationBegin={0}
                animationDuration={800}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Summary Cards */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Category Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.entries(categoryTotals).map(([key, value]) => (
            <div key={key} className="dashboard-card text-center">
              <div 
                className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center"
                style={{ backgroundColor: `${CATEGORY_COLORS[key]}20` }}
              >
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: CATEGORY_COLORS[key] }}
                />
              </div>
              <p className="text-sm text-muted-foreground">{CATEGORY_LABELS[key]}</p>
              <p className="text-lg font-bold text-foreground">₹{value.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">
                {totalExpenses > 0 ? Math.round((value / totalExpenses) * 100) : 0}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
