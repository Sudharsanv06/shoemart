import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center text-center px-6">
      <h1 className="font-display text-[10rem] leading-none text-gold opacity-20 select-none">404</h1>
      <h2 className="font-display text-4xl text-ivory mt-4">Page Not Found</h2>
      <div className="w-16 h-px bg-gold mx-auto my-6" />
      <p className="text-muted font-body text-sm max-w-xs">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn-gold mt-8 inline-block">Back to Home</Link>
    </div>
  );
}
