export interface Location {
  id: number;
  name: string;
  image: string;
}

const locations: Location[] = [
  { id: 1, name: "Scarborough, Canada", image: "/images/image-01.jpg" },
  { id: 2, name: "Monterrey, Mexico", image: "/images/image-02.jpg" },
  { id: 3, name: "Valls, Spain", image: "/images/image-03.jpg" },
  { id: 4, name: "Herentals, Belgium", image: "/images/image-04.jpg" },
  { id: 5, name: "Bangalore, India", image: "/images/image-05.jpg" },
  { id: 6, name: "Kakegawa, Shizuoka Japan", image: "/images/image-06.jpg" },
  { id: 7, name: "Somercotes, UK", image: "/images/image-07.png" },
  { id: 8, name: "San Jose, Costa Rica", image: "/images/image-08.jpg" },
  { id: 9, name: "Alsip, IL USA", image: "/images/image-09.jpg" },
  { id: 10, name: "Lomianki, Poland", image: "/images/image-10.png" },
];

export default locations;
