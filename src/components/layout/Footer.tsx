export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-900/50 px-6 py-4">
      <div className="flex flex-col items-center justify-between gap-4 text-xs text-slate-400 sm:flex-row">
        <div>
          © {new Date().getFullYear()} CollabType. All rights reserved.
        </div>
        <div className="flex gap-6">
          <button className="transition-colors hover:text-slate-300">
            Help
          </button>
          <button className="transition-colors hover:text-slate-300">
            Privacy
          </button>
          <button className="transition-colors hover:text-slate-300">
            Terms
          </button>
        </div>
      </div>
    </footer>
  );
}
