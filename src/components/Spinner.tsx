function Spinner() {
  return (
    <div className="flex items-center justify-center ">
      <div className="relative w-8 h-8">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className={`absolute left-[45%] bottom-0 w-[3px] h-[28%] rounded-sm bg-gray-400 animate-spinner-fade`}
            style={{
              transformOrigin: "center -8px",
              transform: `rotate(${i * 30}deg)`,
              animationDelay: `${i * 0.083}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default Spinner;
