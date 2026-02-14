const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
//require('dotenv').config();
require('dotenv').config({ path: '.env.local' });
// Simple schema definitions for seeding
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  role: String,
});

const CarSchema = new mongoose.Schema({
  name: String,
  slug: String,
  brand: String,
  model: String,
  year: Number,
  type: String,
  seats: Number,
  transmission: String,
  fuelType: String,
  pricePerDay: Number,
  features: [String],
  images: [String],
  mainImage: String,
  description: String,
  available: Boolean,
  metaTitle: String,
  metaDescription: String,
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Car = mongoose.models.Car || mongoose.model('Car', CarSchema);

async function seed() {
  try {
   await mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

    // Create admin user
    const adminExists = await User.findOne({ email: 'admin@drivenow.com' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      await User.create({
        email: 'admin@drivenow.com',
        password: hashedPassword,
        name: 'Admin User',
        role: 'admin',
      });
      console.log('✅ Admin user created');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Create sample cars
    const carsExist = await Car.countDocuments();
    if (carsExist === 0) {
      const sampleCars = [
        {
          name: 'Tesla Model 3',
          slug: 'tesla-model-3',
          brand: 'Tesla',
          model: 'Model 3',
          year: 2023,
          type: 'Electric',
          seats: 5,
          transmission: 'Automatic',
          fuelType: 'Electric',
          pricePerDay: 120,
          features: ['Autopilot', 'Premium Sound', 'Glass Roof', 'Supercharging'],
          mainImage: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=800',
          images: [],
          description: 'Experience the future of driving with the Tesla Model 3. Electric performance meets luxury.',
          available: true,
          metaTitle: 'Rent Tesla Model 3 - Electric Car Rental | DriveNow',
          metaDescription: 'Book the Tesla Model 3 for $120/day. Experience electric luxury with autopilot and premium features.',
        },
        {
          name: 'BMW 5 Series',
          slug: 'bmw-5-series',
          brand: 'BMW',
          model: '5 Series',
          year: 2023,
          type: 'Luxury',
          seats: 5,
          transmission: 'Automatic',
          fuelType: 'Petrol',
          pricePerDay: 150,
          features: ['Leather Seats', 'Navigation', 'Sunroof', 'Premium Audio'],
          mainImage: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=800',
          images: [],
          description: 'Luxury and performance combined in the BMW 5 Series. Perfect for business or leisure.',
          available: true,
          metaTitle: 'Rent BMW 5 Series - Luxury Car Rental | DriveNow',
          metaDescription: 'Book the BMW 5 Series for $150/day. Premium luxury sedan with advanced features.',
        },
        {
          name: 'Toyota Camry',
          slug: 'toyota-camry',
          brand: 'Toyota',
          model: 'Camry',
          year: 2023,
          type: 'Economy',
          seats: 5,
          transmission: 'Automatic',
          fuelType: 'Hybrid',
          pricePerDay: 60,
          features: ['Fuel Efficient', 'Bluetooth', 'Backup Camera', 'Cruise Control'],
          mainImage: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=800',
          images: [],
          description: 'Reliable and efficient, the Toyota Camry is perfect for everyday driving.',
          available: true,
          metaTitle: 'Rent Toyota Camry - Affordable Car Rental | DriveNow',
          metaDescription: 'Book the Toyota Camry for just $60/day. Reliable hybrid sedan for comfortable travel.',
        },
        {
          name: 'Range Rover Sport',
          slug: 'range-rover-sport',
          brand: 'Land Rover',
          model: 'Range Rover Sport',
          year: 2023,
          type: 'SUV',
          seats: 7,
          transmission: 'Automatic',
          fuelType: 'Diesel',
          pricePerDay: 200,
          features: ['4WD', 'Leather Interior', 'Panoramic Roof', 'Advanced Safety'],
          mainImage: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?q=80&w=800',
          images: [],
          description: 'Luxury SUV with unmatched capability and comfort for any terrain.',
          available: true,
          metaTitle: 'Rent Range Rover Sport - Luxury SUV Rental | DriveNow',
          metaDescription: 'Book the Range Rover Sport for $200/day. Premium 7-seater SUV with advanced features.',
        },
        {
          name: 'Porsche 911',
          slug: 'porsche-911',
          brand: 'Porsche',
          model: '911',
          year: 2023,
          type: 'Sports',
          seats: 2,
          transmission: 'Automatic',
          fuelType: 'Petrol',
          pricePerDay: 300,
          features: ['Sport Exhaust', 'Carbon Brakes', 'Sport Seats', 'Launch Control'],
          mainImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800',
          images: [],
          description: 'Iconic sports car delivering exhilarating performance and timeless design.',
          available: true,
          metaTitle: 'Rent Porsche 911 - Sports Car Rental | DriveNow',
          metaDescription: 'Book the Porsche 911 for $300/day. Legendary sports car with incredible performance.',
        },
        {
          name: 'Mercedes Sprinter Van',
          slug: 'mercedes-sprinter-van',
          brand: 'Mercedes-Benz',
          model: 'Sprinter',
          year: 2023,
          type: 'Van',
          seats: 12,
          transmission: 'Automatic',
          fuelType: 'Diesel',
          pricePerDay: 180,
          features: ['12 Passenger', 'Climate Control', 'Large Cargo', 'Bluetooth'],
          mainImage: 'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?q=80&w=800',
          images: [],
          description: 'Spacious van perfect for group travel, events, or cargo transportation.',
          available: true,
          metaTitle: 'Rent Mercedes Sprinter Van - 12 Passenger | DriveNow',
          metaDescription: 'Book the Mercedes Sprinter Van for $180/day. Perfect for groups and large cargo.',
        },
      ];

      await Car.insertMany(sampleCars);
      console.log('✅ Sample cars created');
    } else {
      console.log('ℹ️  Cars already exist in database');
    }

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Admin Credentials:');
    console.log('   Email: admin@drivenow.com');
    console.log('   Password: Admin@123');
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
