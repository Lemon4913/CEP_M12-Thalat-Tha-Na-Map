interface Props {
  poiId: string;
  collected: boolean;
}

// Owner: Person B.
function StampBadge({ poiId, collected }: Props) {
  return (
    <div
      title={poiId}
      style={{
        aspectRatio: "1 / 1",
        borderRadius: "50%",
        border: "2px solid #999",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: collected ? 1 : 0.3,
      }}
    >
      {collected ? "✅" : "?"}
    </div>
  );
}

export default StampBadge;
