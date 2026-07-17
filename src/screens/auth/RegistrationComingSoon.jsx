import { FaClock } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const RegistrationComingSoon = () => {
  return (
    <main className="relative flex min-h-full items-center justify-center overflow-hidden bg-slate-50 px-4 py-12">
      <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-amber-200/50 blur-3xl" />

      <section className="relative w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-200/60 sm:p-12">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
          <FaClock className="text-3xl" aria-hidden="true" />
        </div>

        <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-amber-700">
          Coming soon
        </p>
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
          Registration hasn&apos;t started yet
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-slate-600">
          Hostel registration will open soon. Please check back later for updates.
        </p>

        <Link
          to="/"
          className="mt-8 inline-flex rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white transition-colors hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
        >
          Back to login
        </Link>
      </section>
    </main>
  );
};

export default RegistrationComingSoon;
