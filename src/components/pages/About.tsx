import { Leaf, Code, Users, Heart, Github, Linkedin } from 'lucide-react';

export function About() {
  const features = [
    'Multi-trip management with easy switching',
    'Flexible expense splitting (Equal, Units, Exact)',
    'Smart settlement calculations',
    'Visual spending analytics',
    'Responsive design for all devices',
    'Beautiful eco-friendly UI',
  ];

  const team = [
    { name: 'Jiya Sinroja', role: 'Developer' },
    { name: 'Parth Patel', role: 'Developer' },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">About Project</h1>
        <p className="page-subtitle">Learn more about Trip Expense Splitter</p>
      </div>

      {/* Hero Card */}
      <div className="dashboard-card bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shrink-0">
            <Leaf className="w-10 h-10 text-primary-foreground" />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-foreground mb-2">Trip Expense Splitter</h2>
            <p className="text-muted-foreground max-w-xl">
              A modern web application to manage and split expenses among friends, family, or travel groups. 
              Originally a C project, now reimagined as a beautiful web version.
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="dashboard-card">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Code className="w-5 h-5 text-primary" />
          Features
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-foreground">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Stack */}
      <div className="dashboard-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">Technology Stack</h3>
        <div className="flex flex-wrap gap-3">
          {['React', 'TypeScript', 'Tailwind CSS', 'Recharts', 'Lucide Icons'].map((tech) => (
            <span 
              key={tech}
              className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="dashboard-card">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Created By
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {team.map((member) => (
            <div 
              key={member.name}
              className="flex items-center gap-4 p-4 rounded-xl bg-muted/50"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-xl font-bold text-primary-foreground">
                  {member.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-semibold text-foreground">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="dashboard-card text-center">
        <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
          <span>Made with</span>
          <Heart className="w-4 h-4 text-destructive fill-destructive" />
          <span>for travelers</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Trip Expense Splitter – C Project Web Version
        </p>
        <p className="text-sm text-muted-foreground">
          © 2024 Jiya Sinroja & Parth Patel
        </p>
      </div>
    </div>
  );
}
