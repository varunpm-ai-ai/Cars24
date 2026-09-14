using server.Models;
using MongoDB.Driver;

namespace server.Services
{
    public class CarService
    {
        private readonly IMongoCollection<Car> _cars;
        public CarService(IConfiguration config)
        {
            var client = new MongoClient(config.GetConnectionString("Cars24DB"));

            var database = client.GetDatabase(config["MongoDB:DatabaseName"]);
            _cars = database.GetCollection<Car>("Cars");
        }
        public async Task<List<Car>> GetAllAsync() =>
            await _cars.Find(_ => true).ToListAsync();
        public async Task<Car?> GetByIdAsync(string id)
        {
            return await _cars.Find(u => u.Id == id).FirstOrDefaultAsync();
        }
        public async Task<List<Car>> GetByUserIdAsync(string userId) =>
            await _cars.Find(c => c.UserId == userId).ToListAsync();
        public async Task CreateAsync(Car car) =>
            await _cars.InsertOneAsync(car);
        public async Task DeleteAsync(string id) =>
            await _cars.DeleteOneAsync(c => c.Id == id);
    }
}