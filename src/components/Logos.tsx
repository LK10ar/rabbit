interface WordmarkProps {
  size?: number;
}

export function GoogleWordmark({ size = 100 }: WordmarkProps) {
  const width = size;
  const height = (size * 30) / 115;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 115 30"
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
      aria-label="Google"
    >
      <text
        x="0"
        y="22"
        fontFamily="Arial, sans-serif"
        fontWeight="700"
        fontSize="24"
        fill="white"
      >
        Google
      </text>
    </svg>
  );
}

export function GithubWordmark({ size = 100 }: WordmarkProps) {
  const width = size;
  const height = (size * 30) / 110;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 110 30"
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
      aria-label="GitHub"
    >
      <text
        x="0"
        y="22"
        fontFamily="Arial, sans-serif"
        fontWeight="700"
        fontSize="24"
        fill="white"
      >
        GitHub
      </text>
    </svg>
  );
}
