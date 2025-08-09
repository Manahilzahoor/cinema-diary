import { useState } from "react";

const containerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
};
const startContainerStyle = {
  display: "flex",
  gap: "4px",
};

export default function StarRating({
  maxRating = 5,
  color = "#fcc419",
  size = 48,
  messages = [],
  className = "",
  defaultRating = 0,
  onSetRating,
}) {
  const [rating, setRating] = useState(defaultRating);
  const [tempRating, setTempRating] = useState(0);
  function handleRating(rating) {
    setRating(rating);
    if (onSetRating) onSetRating(rating); // ✅ Now the parent (MovieDetails) will get the value
  }
  const textStyle = {
    lineHeight: "1",
    margin: "0",
    color,
    fontSize: `${size / 1.5}px`,
  };
  return (
    <div style={containerStyle} className={className}>
      <div style={startContainerStyle}>
        {Array.from({ length: maxRating }, (_, i) => (
          <Star
            key={i}
            full={tempRating ? tempRating >= i + 1 : rating >= i + 1}
            onRate={() => handleRating(i + 1)}
            onMouseIn={() => setTempRating(i + 1)}
            onMouseOut={() => setTempRating(0)}
            color={color}
            size={size}
          />
        ))}
      </div>
      <p style={textStyle}>
        {messages.length === maxRating
          ? messages[tempRating ? tempRating - 1 : rating - 1]
          : tempRating || rating || ""}
      </p>
    </div>
  );
}
function Star({ onRate, full, onMouseIn, onMouseOut, color, size }) {
  const starStyle = {
    width: `${size}px`,
    height: `${size}px`,
    display: "block",
    cursor: "pointer",
  };

  return (
    <span
      role="button"
      style={starStyle}
      onClick={onRate}
      onMouseEnter={onMouseIn}
      onMouseLeave={onMouseOut}
    >
      {full ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={color}
          stroke={color}
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 17.27L18.18 21l-1.64-7.03L22 
              9.24l-7.19-.61L12 2 9.19 8.63 
              2 9.24l5.46 4.73L5.82 21z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 17.27L18.18 21l-1.64-7.03L22 
              9.24l-7.19-.61L12 2 9.19 8.63 
              2 9.24l5.46 4.73L5.82 21z"
          />
        </svg>
      )}
    </span>
  );
}
