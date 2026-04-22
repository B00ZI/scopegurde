import { TrendingUp, Users, FileText, AlertCircle, ArrowUpRight, Search, Filter, Download, MoreVertical } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';

export function DashboardPage() {
  const stats = [
    { label: 'Total Revenue', value: '$242,500', trend: '+12.5%', icon: TrendingUp },
    { label: 'Active Clients', value: '42', trend: '+2', icon: Users },
    { label: 'Pending Approvals', value: '8', trend: '-1', icon: FileText },
    { label: 'Detection Alerts', value: '3', trend: 'High', icon: AlertCircle, color: 'text-error' },
  ];

  const recentActivity = [
    { id: '88211', description: 'Change Order Approved', client: 'Acme Corp', amount: '$1,250.00', status: 'Approved', time: '2h ago' },
    { id: '88212', description: 'New Scope Detected', client: 'Nexus Logistics', amount: '$850.00', status: 'Pending', time: '4h ago' },
    { id: '88213', description: 'Surcharge Paid', client: 'Meridian Shipping', amount: '$14,250.00', status: 'Success', time: 'Yesterday' },
    { id: '88214', description: 'Change Order Sent', client: 'Global Partners', amount: '$2,100.00', status: 'Review', time: 'Yesterday' },
  ];

  return (
    <div className="max-w-container-max mx-auto py-8">
      <PageHeader 
        title="Dashboard" 
        subtitle="Overview of your logistics performance and change orders."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg ${stat.color || 'text-primary'} bg-surface-container`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className={`font-label-caps ${stat.trend.startsWith('+') ? 'text-primary' : stat.trend === 'High' ? 'text-error' : 'text-secondary'}`}>
                {stat.trend}
              </span>
            </div>
            <p className="font-label-caps text-secondary mb-1">{stat.label}</p>
            <p className="font-h2 text-on-surface">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-8">
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-h3 text-on-surface">Recent Activity</h3>
            <button className="text-primary font-button flex items-center gap-1 hover:underline">
              View All <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
              <input 
                className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-surface-container-highest rounded font-body-base text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all" 
                placeholder="Search activity..." 
                type="text"
              />
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-surface-container-lowest border border-surface-container-highest rounded font-button text-on-surface flex items-center gap-2 hover:bg-surface-container-low transition-colors">
                <Filter className="w-4 h-4" />
                Filters
              </button>
              <button className="px-4 py-2 bg-surface-container-lowest border border-surface-container-highest rounded font-button text-on-surface flex items-center gap-2 hover:bg-surface-container-low transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-surface-container-highest rounded-lg overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-surface-container-highest">
                    <th className="py-4 px-6 font-label-caps text-secondary uppercase">Activity</th>
                    <th className="py-4 px-6 font-label-caps text-secondary uppercase">Client</th>
                    <th className="py-4 px-6 font-label-caps text-secondary uppercase">Amount</th>
                    <th className="py-4 px-6 font-label-caps text-secondary uppercase">Status</th>
                    <th className="py-4 px-6 font-label-caps text-secondary uppercase text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="font-body-sm">
                  {recentActivity.map((row) => (
                    <tr key={row.id} className="border-b border-surface-container-highest hover:bg-surface transition-colors group">
                      <td className="py-4 px-6">
                        <p className="font-medium text-on-surface">{row.description}</p>
                        <p className="text-secondary text-xs">#{row.id}</p>
                      </td>
                      <td className="py-4 px-6 text-on-surface">{row.client}</td>
                      <td className="py-4 px-6 text-on-surface font-medium">{row.amount}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          row.status === 'Approved' || row.status === 'Success' ? 'bg-primary/10 text-primary' : 
                          row.status === 'Pending' ? 'bg-error/10 text-error' : 'bg-surface-container text-secondary'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right text-secondary">{row.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
