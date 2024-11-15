import { StarFilled } from "@ant-design/icons";
import { PlanCardProps } from "./types";

const PlanCard = ({
  description,
  price,
  tier,
  onClick,
  isSelected
}: PlanCardProps) => {
  return (
    <div
      className={`relative flex flex-col items-start gap-4 rounded ${
        isSelected
          ? "scale-105 bg-secondary-amber/80 hover:scale-110"
          : "bg-secondary-amber/50"
      } p-10 text-[#1f1f1f1] shadow-xl transition-all hover:scale-[102%]`}
    >
      <div className="min-w-0 grow-0 rounded bg-primary-amber px-2 py-1 font-bold text-white">
        {tier}
      </div>
      <p className="h-16 text-sm font-light lg:text-base">{description}</p>
      <p>
        <span className="text-2xl font-bold">
          <span className="text-sm font-light">A partir de</span> R$ {price}
        </span>
        /mês
      </p>
      <button
        className="w-full rounded bg-primary-amber py-2 font-bold text-white"
        onClick={onClick}
      >
        {!isSelected ? "Selecionar" : "Selecionado"}
      </button>
      {/* <ul>
        {benefits.map((benefit, index) => {
          return (
            <li
              className="flex items-center gap-2 text-sm lg:text-base"
              key={index}
            >
              <CheckOutlined /> {benefit}
            </li>
          );
        })}
      </ul> */}

      <div>
        {isSelected && (
          <div className="absolute right-2 top-2 flex items-center gap-2 rounded-full bg-primary-amber/10 px-2 py-1 font-semibold text-primary-amber">
            Tier Selecionado <StarFilled className="" />
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanCard;
