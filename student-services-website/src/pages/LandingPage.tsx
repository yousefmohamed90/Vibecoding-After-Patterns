import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Home, Utensils, Bus, Users } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 animate-fade-in">
            Welcome to Student Services
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto animate-slide-up">
            Book accommodations, transportation, meals, and join clubs - all in one place!
          </p>
          <div className="flex justify-center space-x-4 animate-slide-up">
            <Link to="/register">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Get Started
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Home, title: 'Accommodations', desc: 'Find your perfect student housing' },
              { icon: Bus, title: 'Transport', desc: 'Book reliable transportation' },
              { icon: Utensils, title: 'Meals', desc: 'Order delicious meals' },
              { icon: Users, title: 'Clubs', desc: 'Join exciting clubs' },
            ].map((feature, idx) => (
              <div key={idx} className="card text-center animate-slide-up" style={{ animationDelay: `${idx * 100}ms` }}>
                <feature.icon className="mx-auto text-blue-600 mb-4" size={48} />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
