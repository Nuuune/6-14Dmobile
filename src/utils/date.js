export function getCurrYM() {
  const temp = new Date();
  return {
    year: temp.getFullYear(),
    month: temp.getMonth() + 1
  };
}
export function getTotalDay(date) {
  const temp = new Date(date);
  temp.setMonth(temp.getMonth() + 1);
  temp.setDate(0);
  return temp.getDate();
}
