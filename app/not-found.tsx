import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto py-24 px-4 text-center">
      <h1 className="text-4xl font-bold mb-6 text-primary">
        404 – Page Not Found
      </h1>

      <p className="mb-8 text-gray-600">
        Sorry, the page you’re looking for doesn’t exist or has been moved.
      </p>

      <Link href="/" className="btn-primary inline-block mb-4">
        Go Back Home
      </Link>

      <div className="mt-8">
        <Link href="/privacy-policy" className="text-gold hover:underline mx-2">
          Privacy Policy
        </Link>
        <span className="text-gray-400"> | </span>
        <Link href="/terms-of-service" className="text-gold hover:underline mx-2">
          Terms of Service
        </Link>
      </div>
    </div>
  );
}
