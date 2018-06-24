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
export function tsToYMD(ts) {
  const date = new Date(ts);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}${month > 9 ? month : '0' + month}${day > 9 ? day : '0' + day}`;
}
export function dateToHms(date) {
  const h = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds();
  return `${h > 9 ? h : '0' + h}:${m > 9 ? m : '0' + m}:${s > 9 ? s : '0' + s}`;
}
