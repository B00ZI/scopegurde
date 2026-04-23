import { Search, Filter, Download, MoreVertical, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Client } from '../types';
import { PageHeader } from '../components/PageHeader';

const MOCK_CLIENTS: Client[] = [
  { id: 'CLT-2023-001', name: 'Acme Corp Logistics', email: 'logistics@acmecorp.com', activeProjects: 3, changeOrders: 12, totalRevenue: 45200 },
  { id: 'CLT-2023-042', name: 'Global Partners Inc.', email: 'ops@globalpartners.com', activeProjects: 1, changeOrders: 4, totalRevenue: 12850 },
  { id: 'CLT-2023-089', name: 'Swift Freight Ltd.', email: 'admin@swiftfreight.com', activeProjects: 0, changeOrders: 28, totalRevenue: 104500 },
  { id: 'CLT-2023-112', name: 'Nexus Logistics', email: 'nexus@logistics.com', activeProjects: 5, changeOrders: 7, totalRevenue: 31100 },
];

export function ClientsPage() {
  return (
    <div className="max-w-container-max mx-auto py-8">
      <PageHeader 
        title="Clients Directory" 
        subtitle="Manage client profiles and active logistics projects."
        actions={
          <button className="font-button bg-primary text-on-primary px-5 py-2.5 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity whitespace-nowrap shadow-sm">
            <Plus className="w-4 h-4" />
            Add New Client
          </button>
        }
      />

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
          <input 
            className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-surface-container-highest rounded-lg font-body-base text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all" 
            placeholder="Search clients..." 
            type="text"
          />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-surface-container-lowest border border-surface-container-highest rounded-lg font-button text-on-surface flex items-center gap-2 hover:bg-surface-container-low transition-colors">
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button className="px-4 py-2 bg-surface-container-lowest border border-surface-container-highest rounded-lg font-button text-on-surface flex items-center gap-2 hover:bg-surface-container-low transition-colors">
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
                <th className="py-3 px-6 font-label-caps text-secondary uppercase">Client Name</th>
                <th className="py-3 px-6 font-label-caps text-secondary uppercase">Active Projects</th>
                <th className="py-3 px-6 font-label-caps text-secondary uppercase">Scopes</th>
                <th className="py-3 px-6 font-label-caps text-secondary uppercase">Total Revenue</th>
                <th className="py-3 px-6 font-label-caps text-secondary uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="font-body-sm">
              {MOCK_CLIENTS.map((client) => (
                <tr key={client.id} className="border-b border-surface-container-highest hover:bg-surface transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold">
                        {client.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-on-surface">{client.name}</p>
                        <p className="text-secondary text-xs">ID: {client.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${client.activeProjects > 0 ? 'bg-primary' : 'bg-outline-variant'}`}></span>
                      <span className="text-on-surface font-medium">{client.activeProjects}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-on-surface">{client.changeOrders}</td>
                  <td className="py-4 px-6 text-on-surface font-medium">${client.totalRevenue.toLocaleString()}.00</td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-secondary hover:text-primary transition-colors p-1">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-surface-container-highest bg-surface-container-lowest flex items-center justify-between">
          <span className="font-body-sm text-secondary">Showing 1-4 of 42 clients</span>
          <div className="flex gap-1">
            <button className="p-1 rounded text-secondary hover:bg-surface-container-low transition-colors disabled:opacity-50" disabled>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="p-1 rounded text-on-surface hover:bg-surface-container-low transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
