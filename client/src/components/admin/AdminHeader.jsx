export default function AdminHeader({ title, subtitle }) {
  return (
    <div className="mb-8 pb-6 border-b border-white/10">
      <h1 className="font-display text-4xl text-ivory">{title}</h1>
      {subtitle && (
        <p className="text-muted text-sm mt-1">{subtitle}</p>
      )}
    </div>
  );
}