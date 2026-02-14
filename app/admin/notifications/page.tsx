import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import NotificationsManagement from '@/components/admin/NotificationsManagement';
import dbConnect from '@/lib/mongodb';
import Notification from '@/models/Notification';

type SessionUserWithRole = {
  role?: string;
};

async function getNotifications() {
  try {
    await dbConnect();
    const notifications = await Notification.find()
      .sort({ priority: -1, createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(notifications));
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
}

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as SessionUserWithRole | undefined;

  if (!user || user.role !== 'admin') {
    redirect('/admin/login');
  }

  const notifications = await getNotifications();

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Notifications & Offers
        </h1>
        <p className="text-gray-600">
          Manage promotional offers, announcements, and site-wide notifications.
        </p>
      </div>

      <NotificationsManagement initialNotifications={notifications} />
    </>
  );
}
