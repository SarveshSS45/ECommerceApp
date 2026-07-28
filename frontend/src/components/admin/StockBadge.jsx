/**
 * Stock level badge.
 * 0 units      -> red "Out of stock"
 * 1-5 units    -> yellow "Low stock: N"
 * 6+ units     -> green "In stock: N"
 */
const StockBadge = ({ stock }) => {
  if (stock === 0) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
        Out of stock
      </span>
    );
  }

  if (stock <= 5) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
        Low stock: {stock}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
      In stock: {stock}
    </span>
  );
};

export default StockBadge;