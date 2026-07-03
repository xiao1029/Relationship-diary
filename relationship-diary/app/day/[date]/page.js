import DayForm from "@/components/DayForm";
import { isValidDateKey } from "@/lib/dates";
import { notFound } from "next/navigation";

export default async function DayPage({ params }) {
  const { date } = await params;

  if (!isValidDateKey(date)) {
    notFound();
  }

  return <DayForm dateKey={date} />;
}
