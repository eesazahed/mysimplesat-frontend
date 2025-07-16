const formatCategory = (text: string) => {
  let formattedCategory;
  if (text === "rw") {
    formattedCategory = "RW";
  } else {
    formattedCategory = text.charAt(0).toUpperCase() + text.slice(1);
  }
  return formattedCategory;
};

export default formatCategory;
