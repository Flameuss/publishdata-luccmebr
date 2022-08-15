export const formatNumberDefault = (n: number): string => {
  return n.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
};

export const createObjectId = () => {
  const timestamp = ((new Date().getTime() / 1000) | 0).toString(16);
  return (
    timestamp +
    'xxxxxxxxxxxxxxxx'
      .replace(/[x]/g, function () {
        return ((Math.random() * 16) | 0).toString(16);
      })
      .toLowerCase()
  );
};
