import { FaCarSide, FaCalendarCheck, FaBlog, FaCheckCircle } from 'react-icons/fa';

interface DashboardStatsProps {
  stats: {
    totalCars: number;
    availableCars: number;
    totalBookings: number;
    pendingBookings: number;
    totalPosts: number;
    publishedPosts: number;
  };
}

const DashboardStats = ({ stats }: DashboardStatsProps) => {
  const statCards = [
    {
      title: 'Total Cars',
      value: stats.totalCars,
      subtitle: `${stats.availableCars} available`,
      icon: FaCarSide,
      color: 'bg-blue-500',
    },
    {
      title: 'Bookings',
      value: stats.totalBookings,
      subtitle: `${stats.pendingBookings} pending`,
      icon: FaCalendarCheck,
      color: 'bg-green-500',
    },
    {
      title: 'Blog Posts',
      value: stats.totalPosts,
      subtitle: `${stats.publishedPosts} published`,
      icon: FaBlog,
      color: 'bg-purple-500',
    },
    {
      title: 'Available Cars',
      value: stats.availableCars,
      subtitle: 'Ready to rent',
      icon: FaCheckCircle,
      color: 'bg-gold',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg transform transition-transform duration-300 hover:scale-110`}>
                <Icon className="text-2xl text-white" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-2">
              {stat.title}
            </h3>
            <p className="text-3xl font-bold text-primary mb-2">
              {stat.value}
            </p>
            <p className="text-sm text-gray-500 bg-gray-50 py-1 px-2 rounded inline-block">
              {stat.subtitle}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
