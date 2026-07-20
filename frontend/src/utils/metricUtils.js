export function getMetricColor(value) {
  if (value < 50)
    return {
      bar: "bg-emerald-500",
      text: "text-emerald-400",
      status: "Normal",
      variant: "success",
    };

  if (value < 80)
    return {
      bar: "bg-amber-500",
      text: "text-amber-400",
      status: "Elevated",
      variant: "warning",
    };

  return {
    bar: "bg-rose-500",
    text: "text-rose-400",
    status: "Critical",
    variant: "error",
  };
}