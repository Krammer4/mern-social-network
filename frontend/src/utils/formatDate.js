const formatDate = (postDate) => {
  const dateOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  return new Date(postDate).toLocaleString("ru-RU", dateOptions);
};

export default formatDate;
