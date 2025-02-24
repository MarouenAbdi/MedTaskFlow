import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Calendar,
  DollarSign,
  Users,
  Activity,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const areaChartData = [
  { month: 'Jan', patients: 100, appointments: 150 },
  { month: 'Feb', patients: 120, appointments: 180 },
  { month: 'Mar', patients: 140, appointments: 200 },
  { month: 'Apr', patients: 160, appointments: 220 },
  { month: 'May', patients: 180, appointments: 240 },
  { month: 'Jun', patients: 200, appointments: 260 },
];

const barChartData = [
  { name: 'Cardiology', new: 45, returning: 55 },
  { name: 'Pediatrics', new: 35, returning: 45 },
  { name: 'Neurology', new: 25, returning: 35 },
  { name: 'Orthopedics', new: 30, returning: 40 },
];

const pieChartData = [
  { name: 'Insurance', value: 55 },
  { name: 'Cash', value: 25 },
  { name: 'Credit Card', value: 15 },
  { name: 'Other', value: 5 },
];

const COLORS = {
  blue: '#3b82f6',
  indigo: '#6366f1',
  purple: '#8b5cf6',
  pink: '#ec4899',
  orange: '#f97316',
  green: '#22c55e',
  teal: '#14b8a6',
  red: '#ef4444',
};

const chartConfig = {
  xAxis: {
    stroke: 'currentColor',
    strokeOpacity: 0.5,
    fontSize: 12,
    tickLine: false,
    axisLine: false,
  },
  yAxis: {
    stroke: 'currentColor',
    strokeOpacity: 0.5,
    fontSize: 12,
    tickLine: false,
    axisLine: false,
  },
  cartesianGrid: {
    strokeDasharray: '3 3',
    stroke: 'currentColor',
    strokeOpacity: 0.1,
  },
  tooltip: {
    contentStyle: {
      backgroundColor: 'rgba(17, 24, 39, 0.8)',
      border: 'none',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
  },
};

function AreaChartComponent() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={areaChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="patients" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={COLORS.blue} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={COLORS.blue} stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="appointments" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={COLORS.purple} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={COLORS.purple} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid {...chartConfig.cartesianGrid} />
        <XAxis dataKey="month" {...chartConfig.xAxis} />
        <YAxis {...chartConfig.yAxis} />
        <Tooltip {...chartConfig.tooltip} />
        <Area 
          type="monotone" 
          dataKey="patients" 
          stroke={COLORS.blue} 
          fillOpacity={1} 
          fill="url(#patients)" 
          strokeWidth={2}
          name="Patients"
        />
        <Area 
          type="monotone" 
          dataKey="appointments" 
          stroke={COLORS.purple} 
          fillOpacity={1} 
          fill="url(#appointments)" 
          strokeWidth={2}
          name="Appointments"
        />
        <Legend />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function BarChartComponent() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid {...chartConfig.cartesianGrid} />
        <XAxis dataKey="name" {...chartConfig.xAxis} />
        <YAxis {...chartConfig.yAxis} />
        <Tooltip {...chartConfig.tooltip} />
        <Legend />
        <Bar 
          dataKey="new" 
          fill={COLORS.teal} 
          name="New Patients" 
          radius={[4, 4, 0, 0]}
        />
        <Bar 
          dataKey="returning" 
          fill={COLORS.pink} 
          name="Returning Patients" 
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

function PieChartComponent() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
        <Pie
          data={pieChartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {pieChartData.map((_, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={Object.values(COLORS)[index % Object.values(COLORS).length]}
            />
          ))}
        </Pie>
        <Tooltip {...chartConfig.tooltip} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function Dashboard() {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('dashboard.totalAppointments')}
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.fromYesterday')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('dashboard.totalPatients')}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">345</div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.thisWeek')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('dashboard.revenue')}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,450</div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.lastMonth')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('dashboard.patientGrowth')}
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12.5%</div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.growthRate')}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Growth Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <AreaChartComponent />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChartComponent />
          </CardContent>
        </Card>

        <Card className="col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>Department Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChartComponent />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}