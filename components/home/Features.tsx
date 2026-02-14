import { FaShieldAlt, FaDollarSign, FaHeadset, FaCar, FaCheckCircle, FaMapMarkedAlt } from 'react-icons/fa';

const Features = () => {
  const features = [
    {
      icon: <FaCar className="text-4xl" />,
      title: 'Wide Selection',
      description: 'Choose from 500+ premium vehicles including luxury, economy, SUV, and sports cars.',
    },
    {
      icon: <FaDollarSign className="text-4xl" />,
      title: 'Best Prices',
      description: 'Competitive rates with no hidden fees. Get the best value for your money.',
    },
    {
      icon: <FaShieldAlt className="text-4xl" />,
      title: 'Safe & Secure',
      description: 'All vehicles are regularly maintained and fully insured for your peace of mind.',
    },
    {
      icon: <FaHeadset className="text-4xl" />,
      title: '24/7 Support',
      description: 'Our customer support team is available round the clock to assist you.',
    },
    {
      icon: <FaCheckCircle className="text-4xl" />,
      title: 'Easy Booking',
      description: 'Simple online booking process. Reserve your car in just a few clicks.',
    },
    {
      icon: <FaMapMarkedAlt className="text-4xl" />,
      title: 'Multiple Locations',
      description: 'Pick up and drop off at convenient locations across major cities.',
    },
  ];

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-lg mb-4">Why Choose Rupali Travel ?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We provide exceptional car rental services with a focus on customer satisfaction and quality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-lg hover-lift card-hover"
            >
              <div className="text-gold mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-primary mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
