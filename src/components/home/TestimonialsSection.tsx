import { Star, Quote } from "lucide-react";
import Image from "next/image";
import user1 from "@/assets/user1.jpeg";
import user2 from "@/assets/user2.jpeg";
import user3 from "@/assets/user3.jpeg";
import user4 from "@/assets/user4.jpeg";

const testimonials = [
  {
    name: "Adaeze Okoro",
    role: "Regular Trader",
    avatar: user1,
    rating: 5,
    comment: "Legitcard is amazing! I've been trading my gift cards here for over a year and never had any issues. The rates are great and payments are instant.",
  },
  {
    name: "Chukwuemeka Nwosu",
    role: "Business Owner",
    avatar: user2,
    rating: 5,
    comment: "As someone who receives a lot of gift cards, this platform has been a lifesaver. Fast, reliable, and the customer support is top-notch!",
  },
  {
    name: "Funke Adeleke",
    role: "Student",
    avatar: user3,
    rating: 5,
    comment: "I was skeptical at first, but Legitcard proved me wrong. Got my payment in less than 5 minutes. Highly recommended!",
  },
  {
    name: "Ibrahim Sani",
    role: "Freelancer",
    avatar: user4,
    rating: 5,
    comment: "The best gift card trading platform I've used. The interface is clean, rates are competitive, and the process is seamless.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24 px-[2vw] gradient-secondary">
      <div className="container mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
            What Our <span className="gradient-text">Users</span> Say
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our satisfied customers have to say about their experience.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 sm:gap-6 gap-9 sm:p-0 p-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative bg-card rounded-2xl p-6 md:p-8 border border-border shadow-card hover:shadow-card-hover transition-all duration-300"
            >
              {/* Quote Icon */}
              <div className=" absolute -top-4 -left-4 w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                <Quote className="sm:w-5 w-4 h-4 sm:h-5 text-primary-foreground" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>

              {/* Comment */}
              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.comment}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold overflow-hidden">
                  <Image src={testimonial.avatar} alt={testimonial.name} width={48} height={48} className="object-cover w-full h-full" />
                </div>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
