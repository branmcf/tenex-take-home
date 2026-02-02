export type DateGroup = "Today" | "Yesterday" | "Previous 7 Days" | "Older";

export interface GroupedItem<T> {
  group: DateGroup;
  items: T[];
}

function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function getDateGroup(date: Date, now: Date): DateGroup {
  const itemDate = startOfDay(date);
  const today = startOfDay(now);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  if (itemDate.getTime() === today.getTime()) {
    return "Today";
  }

  if (itemDate.getTime() === yesterday.getTime()) {
    return "Yesterday";
  }

  if (itemDate >= sevenDaysAgo) {
    return "Previous 7 Days";
  }

  return "Older";
}

export function groupByDate<T>(
  items: T[],
  getDate: (item: T) => Date
): GroupedItem<T>[] {
  const now = new Date();
  const groups = new Map<DateGroup, T[]>();

  const groupOrder: DateGroup[] = [
    "Today",
    "Yesterday",
    "Previous 7 Days",
    "Older",
  ];

  for (const group of groupOrder) {
    groups.set(group, []);
  }

  for (const item of items) {
    const group = getDateGroup(getDate(item), now);
    groups.get(group)!.push(item);
  }

  return groupOrder
    .filter((group) => groups.get(group)!.length > 0)
    .map((group) => ({
      group,
      items: groups.get(group)!,
    }));
}
