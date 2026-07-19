export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`;
  }
  return `${mins}分钟`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(Date.now() - 86400000);
  
  const isToday = date.toDateString() === today.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();
  
  if (isToday) return '今天';
  if (isYesterday) return '昨天';
  
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}月${day}日`;
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

export function formatFullDate(dateStr: string): string {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  return `${year}-${month}-${day}`;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function getWeekDays(): { date: string; day: string; isToday: boolean }[] {
  const days = [];
  const today = new Date();
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(Date.now() - i * 86400000);
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    days.push({
      date: `${year}-${month}-${day}`,
      day: weekDays[date.getDay()],
      isToday: i === 0
    });
  }

  return days;
}