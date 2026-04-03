import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear } from "date-fns";
import { vi } from "date-fns/locale";

export interface DatePreset {
  label: string;
  fromDate: string;
  toDate: string;
}

export function useReportDatePresets() {
  const today = new Date();

  const presets: DatePreset[] = [
    {
      label: "Hôm nay",
      fromDate: format(today, "yyyy-MM-dd"),
      toDate: format(today, "yyyy-MM-dd"),
    },
    {
      label: "Hôm qua",
      fromDate: format(subDays(today, 1), "yyyy-MM-dd"),
      toDate: format(subDays(today, 1), "yyyy-MM-dd"),
    },
    {
      label: "Tuần này",
      fromDate: format(startOfWeek(today, { locale: vi, weekStartsOn: 1 }), "yyyy-MM-dd"),
      toDate: format(today, "yyyy-MM-dd"),
    },
    {
      label: "Tháng này",
      fromDate: format(startOfMonth(today), "yyyy-MM-dd"),
      toDate: format(today, "yyyy-MM-dd"),
    },
    {
      label: "Quý này",
      fromDate: format(startOfQuarter(today), "yyyy-MM-dd"),
      toDate: format(today, "yyyy-MM-dd"),
    },
    {
      label: "Năm nay",
      fromDate: format(startOfYear(today), "yyyy-MM-dd"),
      toDate: format(today, "yyyy-MM-dd"),
    },
    {
      label: "30 ngày gần nhất",
      fromDate: format(subDays(today, 30), "yyyy-MM-dd"),
      toDate: format(today, "yyyy-MM-dd"),
    },
  ];

  return presets;
}
