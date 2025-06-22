const NoImagePlaceholder = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="400"
    height="200"
    viewBox="0 0 400 200"
    style={{ width: '100%', height: '100%' }}
  >
    <rect width="400" height="200" fill="#f3f4f6" />
    <text
      x="50%"
      y="50%"
      dominantBaseline="middle"
      textAnchor="middle"
      fill="#9ca3af"
      fontFamily="system-ui, -apple-system, sans-serif"
      fontSize="20"
      fontWeight="500"
    >
      No Image
    </text>
  </svg>
);

export default NoImagePlaceholder;
