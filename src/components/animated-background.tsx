export function AnimatedBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-28 top-[-10%] h-[34rem] w-[34rem] rounded-full bg-gradient-to-br from-rose-200/70 via-pink-100/50 to-transparent blur-3xl animate-float dark:from-rose-900/30 dark:via-purple-900/20" />
      <div className="absolute right-[-15%] top-[22%] h-[38rem] w-[38rem] rounded-full bg-gradient-to-bl from-amber-100/60 via-rose-100/40 to-transparent blur-3xl animate-drift dark:from-amber-900/20 dark:via-rose-900/10" />
      <div className="absolute bottom-[-20%] left-[28%] h-[32rem] w-[32rem] rounded-full bg-gradient-to-tr from-pink-100/70 via-fuchsia-100/40 to-transparent blur-3xl animate-float dark:from-fuchsia-900/20 dark:via-pink-900/10" />
    </div>
  );
}
