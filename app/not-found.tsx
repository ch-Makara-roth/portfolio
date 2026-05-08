import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg text-text">
      <div className="text-center space-y-6 px-4">
        <h1 className="text-6xl font-bold text-accent">404</h1>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="text-dimmed max-w-md">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-4 bg-accent text-bg rounded-lg hover:bg-accent/90 transition-colors"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
