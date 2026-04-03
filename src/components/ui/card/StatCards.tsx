import React from 'react';
import { ArrowUpRight, ArrowDownRight, MoreHorizontal, TrendingUp, Wallet, ShoppingCart, Users, Package, CreditCard, Activity, User, Circle, LucideIcon } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, BarChart, Bar, Tooltip, XAxis } from 'recharts';

export interface StatCardProps {
  title: string;
  value?: string | number;
  icon?: LucideIcon;
  trend?: number;
  trendLabel?: string;
  color?: 'blue' | 'red' | 'green' | 'yellow' | 'purple' | 'indigo' | 'orange';
  subValue?: string;
  description?: string;
  chartData?: any[];
  items?: { label: string; value: string | number; color?: string }[];
  isLoading?: boolean;
  onClick?: () => void; // Thêm onClick handler
}

const COLORS = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', fill: '#3b82f6', badge: 'bg-blue-100 text-blue-700', gradient: 'from-blue-500 to-blue-600' },
  green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200', fill: '#22c55e', badge: 'bg-green-100 text-green-700', gradient: 'from-green-500 to-green-600' },
  red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', fill: '#ef4444', badge: 'bg-red-100 text-red-700', gradient: 'from-red-500 to-red-600' },
  yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-200', fill: '#eab308', badge: 'bg-yellow-100 text-yellow-800', gradient: 'from-yellow-400 to-yellow-500' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200', fill: '#a855f7', badge: 'bg-purple-100 text-purple-700', gradient: 'from-purple-500 to-purple-600' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200', fill: '#6366f1', badge: 'bg-indigo-100 text-indigo-700', gradient: 'from-indigo-500 to-indigo-600' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200', fill: '#f97316', badge: 'bg-orange-100 text-orange-700', gradient: 'from-orange-500 to-orange-600' },
};

// --- Variant 1: Classic ERP (Enhanced) ---
export const ClassicCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  color = 'blue', 
  trend,
  description,
  items
}) => {
  const styles = COLORS[color];
  
  return (
    <div className={`rounded-lg border ${styles.border} bg-white p-5 shadow-sm hover:shadow-md transition-shadow duration-200 dark:border-gray-700 dark:bg-gray-900`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
          <h3 className={`text-3xl font-bold ${color === 'red' ? 'text-red-600 dark:text-red-400' : color === 'indigo' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-900 dark:text-white'}`}>
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-lg ${styles.bg} ${styles.text}`}>
          {Icon && <Icon size={24} strokeWidth={1.5} />}
        </div>
      </div>

      {/* Trend indicator */}
      {trend !== undefined && (
        <div className="flex items-center mt-3 gap-1 text-xs">
          <span className={`flex items-center font-medium ${trend >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {trend >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {Math.abs(trend)}%
          </span>
          <span className="text-gray-400 dark:text-gray-500">so với tháng trước</span>
        </div>
      )}

      {/* Description */}
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">{description}</p>
      )}

      {/* Items breakdown */}
      {items && items.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="space-y-2">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {item.color && <span className={`w-2 h-2 rounded-full ${item.color}`}></span>}
                  <span className="text-xs text-gray-600 dark:text-gray-400">{item.label}</span>
                </div>
                <span className="text-xs font-semibold text-gray-900 dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Variant 2: Minimalist with Progress (Enhanced) ---
export const ProgressCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  subValue, 
  color = 'blue', 
  trend,
  description,
  items
}) => {
    const styles = COLORS[color];
    const percentage = Math.min(Math.max((trend || 0), 0), 100);

    const getProgressColor = () => {
      switch(color) {
        case 'red': return 'bg-red-500';
        case 'green': return 'bg-green-500';
        case 'orange': return 'bg-orange-500';
        case 'yellow': return 'bg-yellow-500';
        case 'purple': return 'bg-purple-500';
        case 'indigo': return 'bg-indigo-500';
        default: return 'bg-blue-500';
      }
    };

    return (
        <div className={`rounded-lg border ${styles.border} bg-white p-5 shadow-sm hover:shadow-md transition-shadow dark:border-gray-700 dark:bg-gray-900`}>
            {/* Header with badge */}
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">{title}</h4>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${styles.badge}`}>
                    {trend}%
                </span>
            </div>

            {/* Main value */}
            <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">{value}</span>
                {subValue && <span className="text-sm text-gray-500 dark:text-gray-400">/ {subValue}</span>}
            </div>

            {/* Progress bar with gradient */}
            <div className="mb-3">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                  <div 
                      className={`h-full transition-all duration-500 ${getProgressColor()}`} 
                      style={{ width: `${percentage}%` }}
                  ></div>
              </div>
            </div>

            {/* Description text */}
            {description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{description}</p>
            )}

            {/* Items breakdown */}
            {items && items.length > 0 && (
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="space-y-2">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {item.color && <span className={`w-2 h-2 rounded-full ${item.color}`}></span>}
                        <span className="text-xs text-gray-600 dark:text-gray-400">{item.label}</span>
                      </div>
                      <span className="text-xs font-semibold text-gray-900 dark:text-white">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
    );
};

// --- Variant 3: Financial Summary ---
export const FinancialCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color = 'blue', description, isLoading = false, onClick }) => {
    const styles = COLORS[color];
    
    if (isLoading) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full animate-pulse">
                <div className="p-5 flex-1">
                    <div className="flex items-center gap-3 mb-3">
                        <div className={`w-8 h-8 rounded-full ${styles.bg}`}></div>
                        <div className="h-4 bg-gray-200 rounded w-32 dark:bg-gray-800"></div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded w-40 mb-3 dark:bg-gray-800"></div>
                    <div className="h-3 bg-gray-200 rounded w-24 dark:bg-gray-800"></div>
                </div>
                <div className={`px-5 py-3 ${styles.bg} border-t ${styles.border}`}>
                    <div className="h-3 bg-gray-200 rounded w-20 dark:bg-gray-800"></div>
                </div>
            </div>
        );
    }
    
    return (
        <div 
          onClick={onClick}
          className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
        >
            <div className="p-5 flex-1">
                <div className="flex items-center gap-3 mb-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${styles.bg} ${styles.text}`}>
                        {Icon && <Icon size={16} />}
                    </div>
                    <span className="text-gray-600 font-medium text-sm">{title}</span>
                </div>
                <div className="text-2xl font-bold text-gray-800 tracking-tight">
                    {value}
                </div>
                {description && <div className="mt-1 text-xs text-gray-400">{description}</div>}
            </div>
            <div 
              className={`px-5 py-3 ${styles.bg} border-t ${styles.border} flex justify-between items-center ${onClick ? 'cursor-pointer group' : ''}`}
            >
                <span className={`text-xs font-semibold ${styles.text}`}>Xem chi tiết</span>
                <ArrowUpRight size={14} className={`${styles.text} ${onClick ? 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform' : ''}`} />
            </div>
        </div>
    );
};

// --- Variant 4: Trend Chart Card ---
export const ChartCard: React.FC<StatCardProps> = ({ title, value, chartData, color = 'blue', trend }) => {
    const styles = COLORS[color];

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-0 shadow-sm overflow-hidden relative min-h-[160px]">
             <div className="p-5 relative z-10">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
                        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
                    </div>
                    {trend && (
                        <div className={`flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${trend > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                           {trend > 0 ? '+' : ''}{trend}%
                        </div>
                    )}
                </div>
             </div>
             
             <div className="absolute bottom-0 left-0 right-0 h-24 opacity-30">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={styles.fill} stopOpacity={0.8}/>
                                <stop offset="95%" stopColor={styles.fill} stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke={styles.fill} 
                            fill={`url(#gradient-${color})`} 
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
             </div>
        </div>
    );
};

// --- Variant 5: Compact Side-Border Card ---
export const CompactCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color = 'blue' }) => {
    const styles = COLORS[color];
    const borderClass = `border-l-${styles.text.split('-')[1]}-500`;

    // A hack to make Tailwind happy with dynamic classes would require full names or safelist.
    // Assuming standard colors for now or using inline styles for dynamic borders if strict.
    // For this example, let's map it manually to ensure it works.
    const getBorderColor = () => {
        switch(color) {
            case 'red': return 'border-l-red-500';
            case 'green': return 'border-l-green-500';
            case 'yellow': return 'border-l-yellow-500';
            case 'purple': return 'border-l-purple-500';
            default: return 'border-l-blue-500';
        }
    }

    return (
        <div className={`bg-white rounded-r-lg border-y border-r border-gray-200 border-l-4 ${getBorderColor()} p-4 shadow-sm flex items-center justify-between`}>
            <div>
                <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">{title}</p>
                <p className="text-lg font-bold text-gray-800 mt-0.5">{value}</p>
            </div>
            <div className={`p-2 rounded-md ${styles.bg} ${styles.text}`}>
                {Icon && <Icon size={20} />}
            </div>
        </div>
    );
};

// --- Variant 6: Action Card ---
export const ActionCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color = 'yellow' }) => {
     const styles = COLORS[color];
     
     return (
         <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm flex flex-row items-center gap-4">
             <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${styles.bg} ${styles.text}`}>
                 {Icon && <Icon size={24} />}
             </div>
             <div className="flex-1">
                 <h4 className="text-2xl font-bold text-gray-900">{value}</h4>
                 <p className="text-sm text-gray-500">{title}</p>
             </div>
             <button className="text-gray-400 hover:text-gray-600 transition-colors">
                 <MoreHorizontal size={20} />
             </button>
         </div>
     )
}

// --- Variant 7: Gradient Highlight Card ---
// High impact, useful for total aggregations
export const GradientCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color = 'blue', trend }) => {
    const styles = COLORS[color];
    
    return (
        <div className={`rounded-xl p-6 shadow-lg bg-gradient-to-br ${styles.gradient} text-white relative overflow-hidden`}>
            {/* Background Pattern */}
            <div className="absolute -right-6 -top-6 bg-white opacity-10 rounded-full w-32 h-32 blur-2xl"></div>
            <div className="absolute -left-6 -bottom-6 bg-black opacity-10 rounded-full w-32 h-32 blur-2xl"></div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                        {Icon && <Icon size={24} className="text-white" />}
                    </div>
                    {trend !== undefined && (
                        <div className={`px-2 py-1 rounded-full text-xs font-semibold ${trend >= 0 ? 'bg-white/20 text-white' : 'bg-red-500/80 text-white'}`}>
                            {trend > 0 ? '+' : ''}{trend}%
                        </div>
                    )}
                </div>
                <div>
                    <p className="text-blue-100 text-sm font-medium mb-1 opacity-90">{title}</p>
                    <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
                </div>
            </div>
        </div>
    );
};

// --- Variant 8: Comparison Card (Dual Stats) ---
// Useful for Current vs Previous period
export const ComparisonCard: React.FC<StatCardProps> = ({ title, value, subValue, icon: Icon }) => {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
             <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-gray-100 rounded-md text-gray-600">
                    {Icon ? <Icon size={16} /> : <Activity size={16} />}
                </div>
                <h4 className="text-sm font-semibold text-gray-700">{title}</h4>
             </div>
             <div className="flex items-center divide-x divide-gray-200">
                 <div className="pr-4 flex-1">
                     <p className="text-xs text-gray-400 mb-1">Tháng này</p>
                     <p className="text-xl font-bold text-gray-900">{value}</p>
                 </div>
                 <div className="pl-4 flex-1">
                     <p className="text-xs text-gray-400 mb-1">Tháng trước</p>
                     <p className="text-xl font-bold text-gray-500">{subValue}</p>
                 </div>
             </div>
        </div>
    );
};

// --- Variant 9: Mini List Card ---
// Displays top 3 items inside a card
export const MiniListCard: React.FC<StatCardProps> = ({ title, items }) => {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm h-full">
            <h4 className="text-sm font-semibold text-gray-800 mb-4">{title}</h4>
            <div className="space-y-3">
                {items?.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${idx === 0 ? 'bg-yellow-100 text-yellow-700' : idx === 1 ? 'bg-gray-100 text-gray-700' : 'bg-orange-50 text-orange-700'}`}>
                                {idx + 1}
                            </span>
                            <span className="text-sm text-gray-600 font-medium group-hover:text-gray-900 transition-colors">{item.label}</span>
                        </div>
                        <span className="text-sm font-bold text-gray-900">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Variant 10: Team / Avatar Card ---
export const TeamCard: React.FC<StatCardProps> = ({ title, value, subValue, color = 'indigo' }) => {
    const styles = COLORS[color];
    
    // Fake avatars using colors
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
            <div className="flex justify-between items-start mb-3">
                <h4 className="text-sm font-medium text-gray-500">{title}</h4>
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${styles.badge}`}>Active</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-4">{value}</div>
            
            <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                    {[1,2,3,4].map((i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs text-gray-500 font-medium overflow-hidden">
                             <User size={16} className="text-gray-400 mt-1" />
                        </div>
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-50 flex items-center justify-center text-xs text-gray-500 font-medium">
                        +5
                    </div>
                </div>
                <span className="text-xs text-gray-400">{subValue}</span>
            </div>
        </div>
    );
};
