import { Metadata } from 'next';

// Define default metadata for this route group
export const metadata: Metadata = {
  title: {
    template: '%s - Rupali Travel Agency',
    default: 'Rupali Travel Agency - Premium Car Rental Service',
  },
  description: 'Reliable car rental service in Shillong. Book affordable taxis, cabs, and luxury cars for airport transfers, sightseeing, and outstation trips.',
};

export default function Template({ children }: { children: React.ReactNode }) {
  return children;
}