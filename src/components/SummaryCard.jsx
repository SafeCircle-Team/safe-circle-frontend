const SummaryCard = ({title, value, color}) => {
  return(
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-gray-500">
            {title}
            </p>
        <p className={`mt-2 text-3xl font-bold ${color === "red"
            ? "text-red-600"
            :color === "green"
            ? "text-green-600"
            : "text-gray-800"
        }`}>
            {value}
            </p>
    </div>
  );
};

export default SummaryCard;
