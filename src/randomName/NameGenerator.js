export default function NameGenerator() {
  let name;
  let names = ["White Ash", "Bigtooth Aspen", "Basswood", "Black Birch", "Butternut", "Black Cherry", "Eastern Cottonwood", "Cucumber Tree", "Elm", "Balsam Fir", "Hawthorn", "Eastern Hemlock", "Bitternut Hickory", "Shagbark Hickory", "Hornbeam", "American Larch", "Black Locust", "Honey-Locust", "Red Maple", "Silver Maple", "Sugar Maple", "Black Oak", "Chestnut Oak", "Northern Red Oak", "Scarlet Oak", "White Oak", "Eastern White Pine", "Pitch Pine", "Sassafras", "Shadbush", "Red Spruce", "White Spruce", "Sycamore", "Mahogany"]

  const generateRandomName = () => {
    const randIndex = Math.floor(Math.random() * (names.length - 1)) + 1;
    const selectedName = names[randIndex];
    if (!selectedName) {
      generateRandomName();
    }
    localStorage.setItem("myName", selectedName);
    return selectedName;
  }

  name = localStorage.getItem("myName") ? localStorage.getItem("myName") : generateRandomName();

  return name;
}
