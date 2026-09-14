import { Car } from "lucide-react";

const brands = [
  {
    name: "Honda",
    logo: "https://www.honda.com/-/media/Honda-Homepage/Images/Logos/svg/Honda_Power_Of_Dreams_22.svg",
  },
  {
    name: "BMW",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg",
  },
  {
    name: "Mercedes-Benz",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg",
  },
];

export default function CarBrands() {
  return (
    <div className="py-8 mt-4">
      <h2 className="text-xl font-bold text-gray-900 text-center mb-6">Explore Popular Brands</h2>

      <div className="flex flex-wrap justify-center gap-4 md:gap-8">
        {brands.map((brand) => (
          <div
            key={brand.name}
            className="flex flex-col items-center justify-center transition-transform hover:scale-105"
          >
            <img
              src={brand.logo}
              alt={brand.name}
              className="h-12 w-auto object-contain"
            />
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button className="text-orange-500 font-medium hover:text-orange-600 transition-colors">
          View all cars
        </button>
      </div>
    </div>
  );
}
