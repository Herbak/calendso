import Link from "next/link";

const PoweredByCal = () => (
  <div className="p-1 text-xs text-center sm:text-right">
    <Link href={`https://cal.com?utm_source=embed&utm_medium=powered-by-button`}>
      <a target="_blank" className="text-gray-500 opacity-50 dark:text-white hover:opacity-100">
        Propulsé par{" "}
        <img
          className="dark:hidden w-auto inline h-[10px] relative -mt-px"
          src="https://cal.com/logo.svg"
          alt="Avocal.fr Logo"
        />
        <img
          className="hidden dark:inline w-auto h-[10px] relativ -mt-px"
          src="https://cal.com/logo-white.svg"
          alt="Avocal.fr Logo"
        />
      </a>
    </Link>
  </div>
);

export default PoweredByCal;
