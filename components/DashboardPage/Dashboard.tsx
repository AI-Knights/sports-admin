"use client"
// app/dashboard/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts'; // Assume installed: npm install recharts
import { motion } from 'framer-motion'; // Assume animation library is framer-motion, installed: npm install framer-motion
import { Bell, FileText, Users, TrendingUp, LogOut, Settings, User, Newspaper, BarChart2 } from 'lucide-react'; // Icons from lucide-react, assume installed
import Header from '../ShardComponents/Header/Header';

// Sample data for chart
const performanceData = [
  { time: '00:00', load: 40 },
  { time: '04:00', load: 30 },
  { time: '08:00', load: 60 },
  { time: '12:00', load: 70 },
  { time: '16:00', load: 50 },
  { time: '20:00', load: 40 },
  { time: '23:59', load: 30 },
];

// Sample recent activities data
const recentActivities = [
  { icon: <BarChart2 className="h-4 w-4 text-blue-500" />, title: 'Match Recap: Liverpool vs Arsenal published', time: '2 hours ago' },
  { icon: <Bell className="h-4 w-4 text-green-500" />, title: 'Goal alert sent to 45,000 users', time: '3 hours ago' },
  { icon: <Users className="h-4 w-4 text-purple-500" />, title: 'New user registration spike: +1,200', time: '5 hours ago' },
  { icon: <Newspaper className="h-4 w-4 text-indigo-500" />, title: 'Transfer News: Mbappé update published', time: '6 hours ago' },
  { icon: <Bell className="h-4 w-4 text-green-500" />, title: 'Match start notification sent', time: '8 hours ago' },
];

export default function Dashboard() {
  return (
    <div className="flex  min-h-screen text-foreground">

      {/* Main Content */}
      <main className="flex-1  space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl sticky top-0 backdrop-blur-xl py-4  font-bold"
        >
          <Header params={{ title: "Admin Dashboard", isIcon: false, subtitle: "Welcome back! Here's an overview of your platform." }} />
        </motion.h1>


        {/* Stats Grid - Responsive: 1 col mobile, 2 md, 4 lg */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div initial={{ scale: 0.1 }} animate={{ scale: 1 }} transition={{ duration: 0.8 }}>
            <Card className='flex flex-row justify-between px-8 items-center' >

              <CardContent className='px-0 space-x-4' >
                <CardTitle className="text-xl text-gray-500 px-0">Total Users</CardTitle>
                <div className="text-2xl text-orange-300">156,847</div>
              </CardContent>
              <Users size={40} className=" text-orange-500 bg-[#FFF8E7] p-2 rounded-xl" />
            </Card>
          </motion.div>
          <motion.div initial={{ scale: 0.1 }} animate={{ scale: 1 }} transition={{ duration: 0.8 }}>
            <Card className='flex flex-row justify-between px-8 items-center' >

              <CardContent className='px-0 space-x-4' >
                <CardTitle className="text-xl text-gray-500 px-0">Total News Articles</CardTitle>
                <div className="text-2xl text-orange-300">2,543</div>
              </CardContent>
              <FileText size={40} className=" text-orange-500 bg-[#FFF8E7] p-2 rounded-xl" />
            </Card>

          </motion.div>
          <motion.div initial={{ scale: 0.02 }} animate={{ scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }}>
            <Card className='flex flex-row justify-between px-8 items-center' >

              <CardContent className='px-0 space-x-4' >
                <CardTitle className="text-xl text-gray-500 px-0">Active Notifications</CardTitle>
                <div className="text-2xl text-orange-300">26</div>
              </CardContent>
              <Bell size={40} className=" text-orange-500 bg-[#FFF8E7] p-2 rounded-xl" />
            </Card>
        
          </motion.div>
          <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }}>
             <Card className='flex flex-row justify-between px-8 items-center' >

              <CardContent className='px-0 space-x-4' >
                <CardTitle className="text-xl text-gray-500 px-0">Performance Score</CardTitle>
                <div className="text-2xl text-orange-300">98.5%</div>
              </CardContent>
              <TrendingUp size={40} className=" text-orange-500 bg-[#FFF8E7] p-2 rounded-xl" />
            </Card>
         
          </motion.div>
        </div>

        {/* Quick Actions Grid - Similar responsive setup */}
        <div className='w-full p-4 border rounded-xl'>
          <p className='font-bold py-4' >Quick Actions</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div initial={{ scale: 0.003 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }}>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-gray-500" />
                  <p>Manage News</p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div initial={{ scale: 0.1 }} animate={{ scale: 1 }} transition={{ duration: 0.8 }}>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Bell className="h-8 w-8 mx-auto mb-2 text-gray-500" />
                  <p>Manage Notifications</p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div initial={{ scale: 0.02 }} animate={{ scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }}>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Users className="h-8 w-8 mx-auto mb-2 text-gray-500" />
                  <p>User Management</p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div initial={{ scale: 0.0005 }} animate={{ scale: 1 }} transition={{ duration: 0.3, delay: 0.3 }}>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-gray-500" />
                  <p>Performance Analytics</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>System Load / Performance Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={performanceData}>
                {/* ✅ Gradient */}
                <defs>
                  <linearGradient id="loadGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#f97316" stopOpacity={0.05} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />

                {/* ✅ Gradient area */}
                <Area
                  type="monotone"
                  dataKey="load"
                  stroke="#f97316"
                  fill="url(#loadGradient)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>

          </CardContent>
        </Card>

        {/* Recent Activities - Table on desktop, Cards on mobile */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Desktop: Table */}
            <div className="hidden md:block">
              <table className="w-full table-auto">
                <thead>
                  <tr className="text-left text-muted-foreground">
                    <th className="pb-2">Activity</th>
                    <th className="pb-2">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivities.map((activity, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="border-t"
                    >
                      <td className="py-2 flex items-center space-x-2">
                        {activity.icon}
                        <span>{activity.title}</span>
                      </td>
                      <td className="py-2 text-muted-foreground">{activity.time}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile: Cards */}
            <div className="md:hidden space-y-4">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="flex items-center space-x-4 p-4">
                      {activity.icon}
                      <div className="flex-1">
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">{activity.time}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}