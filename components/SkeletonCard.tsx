export default function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/40 p-6">
      <div className="h-56 rounded-3xl bg-white/5" />
      <div className="mt-5 space-y-3">
        <div className="h-5 w-3/4 rounded-full bg-white/5" />
        <div className="h-4 w-1/2 rounded-full bg-white/5" />
        <div className="mt-6 h-10 w-32 rounded-full bg-white/5" />
      </div>
    </div>
  );
}
