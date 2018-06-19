export function getCurrYM() {
  const temp = new Date();
  return {
    year: temp.getFullYear(),
    month: temp.getMonth() + 1
  };
}
export function getTotalDay(date) {
  date.setMonth(date.getMonth() + 1);
  date.setDate(0);
  return date.getDate();
}
