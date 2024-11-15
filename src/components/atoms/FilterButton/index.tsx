/* eslint-disable @typescript-eslint/no-explicit-any */
const FilterButton = ({
  value,
  quantity,
  children,
  curValue,
  setFilter
}: any) => {
  if (value === curValue) {
    return (
      <div className="relative cursor-pointer text-xs sm:text-base">
        <p className="flex flex-col items-center gap-1 md:block">
          <span className="rounded bg-black p-1 text-white">{quantity}</span>{" "}
          {children}
        </p>
        <div className="absolute bottom-[-8px] left-0 h-[2px] w-full rounded bg-black"></div>
      </div>
    );
  }

  return (
    <div
      onClick={() => {
        console.log(value);
        setFilter(value);
      }}
      className=" cursor-pointer text-xs sm:text-base"
    >
      <p className="flex flex-col items-center gap-1 md:block">
        <span className="rounded bg-[#999999] p-1 text-white">{quantity}</span>{" "}
        <span className="text-[#999999]">{children}</span>
      </p>
    </div>
  );
};

export default FilterButton;
