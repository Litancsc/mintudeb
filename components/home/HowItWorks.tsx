import { FaSearch, FaCalendarCheck, FaCar, FaKey } from 'react-icons/fa';

const HowItWorks = () => {
  const steps = [
    {
      icon: <FaSearch className="text-5xl" />,
      title: 'Browse & Select',
      description: 'Search our extensive fleet and choose the perfect car for your needs.',
      step: '01',
    },
    {
      icon: <FaCalendarCheck className="text-5xl" />,
      title: 'Book Online',
      description: 'Complete your booking in minutes with our simple online form.',
      step: '02',
    },
    {
      icon: <FaCar className="text-5xl" />,
      title: 'Confirm Details',
      description: 'Receive instant confirmation and prepare your documents.',
      step: '03',
    },
    {
      icon: <FaKey className="text-5xl" />,
      title: 'Pick Up & Drive',
      description: 'Collect your car and enjoy your journey with confidence.',
      step: '04',
    },
  ];

  return (
    <section className="section-padding bg-gradient-to-br from-primary to-primary-light text-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-lg mb-4">How It Works</h2>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Renting a car has never been easier. Follow these simple steps to get on the road.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-8 text-center hover-lift"
            >
              {/* Step Number */}
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gold rounded-full flex items-center justify-center text-2xl font-bold text-primary">
                {step.step}
              </div>

              {/* Icon */}
              <div className="text-gold mb-4 mt-4">{step.icon}</div>

              {/* Content */}
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-gray-200">{step.description}</p>

              {/* Connector Line (except last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gold" />
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="#featured-cars" className="btn-outline">
            Get Started Now
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
