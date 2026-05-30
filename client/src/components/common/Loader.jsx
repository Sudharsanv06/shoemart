export default function Loader({ full = false }) {
  return (
    <div className={`flex items-center justify-center ${full ? "h-screen" : "h-64"}`}>
      <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-gold animate-spin" />
    </div>
  );
}
