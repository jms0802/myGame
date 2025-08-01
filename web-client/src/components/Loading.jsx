export default function Loading({ isLoading, zIndex = 70 }) {
  return (
    isLoading && (
    <div className={`absolute inset-0 flex items-center justify-center bg-black/50`}
    style={{ zIndex: zIndex }}>
      <svg
        className="animate-spin h-8 w-8 text-gray-700"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-label="로딩 중"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="white"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="white"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
    </div>
  ));
}