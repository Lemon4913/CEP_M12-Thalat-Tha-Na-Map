import type { POICategory } from "../types";

interface Props {
  name: string;
  category: POICategory;
  index: number;
  collected: boolean;
}

const CATEGORY_ICON: Record<POICategory, string> = {
  shop: "🛍",
  history: "🏛",
  art: "🎨",
  food: "🍜",
};

// Owner: Person B.
function StampBadge({ name, category, index, collected }: Props) {
  return (
    <div className={`stamp-cell ${collected ? "earned" : "locked"}`}>
      <div className="stamp-cell-icon">{CATEGORY_ICON[category]}</div>
      <div className="stamp-cell-num">จุดที่ {index}</div>
      <div className="stamp-cell-name">{name}</div>
    </div>
  );
}

export default StampBadge;
