const getPagination = (current: number, total: number) => {
  const pages: (number | string)[] = [];

  if (total <= 5) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
    return pages;
  }

  if (current <= 3) {
    pages.push(1, 2, 3, '...', total);
    return pages;
  }

  if (current === 4) {
    pages.push(1, 2, 3, current, '...', total);
    return pages;
  }

  if (current >= total - 2) {
    pages.push(1, '...', total - 2, total - 1, total);
    return pages;
  }

  pages.push(1, '...', current - 1, current, current + 1, '...', total);

  return pages;
};

export default getPagination;
