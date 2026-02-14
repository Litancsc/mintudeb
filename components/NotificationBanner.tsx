import dbConnect from '@/lib/mongodb';
import Notification from '@/models/Notification';
import Link from 'next/link';

async function getActiveNotifications() {
  try {
    await dbConnect();
    const now = new Date();

    const notifications = await Notification.find({
      active: true,
      displayLocation: { $in: ['banner'] }, // ✅ FIX
      startDate: { $lte: now },
      $or: [
        { endDate: { $exists: false } },
        { endDate: null },
        { endDate: { $gte: now } },
      ],
    })
      .sort({ priority: -1, createdAt: -1 })
      .limit(1)
      .lean();

    return JSON.parse(JSON.stringify(notifications));
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
}

const NotificationBanner = async () => {
  const notifications = await getActiveNotifications();

  if (notifications.length === 0) return null;

  const notification = notifications[0];

  return (
    <div
      className="relative py-3 px-4 text-center"
      style={{
        backgroundColor: notification.backgroundColor || '#D4AF37',
        color: notification.textColor || '#FFFFFF',
      }}
    >
      <div className="container-custom flex items-center justify-center">
        <p className="font-medium">
          {notification.title && <strong>{notification.title}: </strong>}
          {notification.message}
          {notification.link && notification.buttonText && (
            <>
              {' '}
              <Link
                href={notification.link}
                className="underline hover:no-underline ml-2"
              >
                {notification.buttonText}
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default NotificationBanner;
