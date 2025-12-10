import { 
  LayoutDashboard, 
  PlusCircle, 
  Users, 
  Receipt, 
  List, 
  ArrowLeftRight, 
  BarChart3, 
  Info,
  Leaf
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'create-trip', label: 'Create Trip', icon: PlusCircle },
  { id: 'participants', label: 'Manage Participants', icon: Users },
  { id: 'add-expense', label: 'Add Expense', icon: Receipt },
  { id: 'expenses', label: 'View Expenses', icon: List },
  { id: 'settlement', label: 'Settlement', icon: ArrowLeftRight },
  { id: 'analytics', label: 'Spending Analytics', icon: BarChart3 },
  { id: 'about', label: 'About Project', icon: Info },
];

export function Sidebar({ activeSection, onNavigate, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-[280px] bg-sidebar border-r border-sidebar-border
          flex flex-col h-screen
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-sidebar-border">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Leaf className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-foreground text-lg leading-tight">Trip Splitter</h1>
            <p className="text-xs text-muted-foreground">Expense Manager</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`nav-item w-full ${isActive ? 'active' : ''}`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="text-xs text-muted-foreground text-center leading-relaxed">
            <p className="font-medium text-foreground">Trip Expense Splitter</p>
            <p>C Project Web Version</p>
            <p className="mt-1">Created by: Jiya Sinroja & Parth Patel</p>
          </div>
        </div>
      </aside>
    </>
  );
}
