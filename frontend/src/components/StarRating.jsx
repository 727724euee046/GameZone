// -------------------------------------------------------
// StarRating component
// Props:
//   value    - current rating value (number 1-5)
//   onChange - called with new value when a star is clicked
//   readonly - if true, stars are display-only (no click)
// -------------------------------------------------------
function StarRating({ value, onChange, readonly = false }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="star-rating">
      {stars.map((star) => (
        <span
          key={star}
          className={`star ${star <= value ? 'star-filled' : 'star-empty'}`}
          onClick={() => !readonly && onChange && onChange(star)}
          style={{ cursor: readonly ? 'default' : 'pointer' }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default StarRating;
