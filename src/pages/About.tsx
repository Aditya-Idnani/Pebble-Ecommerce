import { motion } from 'framer-motion';
import { Heart, Shield, Users, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import aboutHero from '@/assets/about-hero.jpg';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }),
};

const About = () => (
  <div>
    {/* Hero — editorial split */}
    <section className="relative h-[70vh] overflow-hidden">
      <img src={aboutHero} alt="Artisan at work" className="w-full h-full object-cover" width={1920} height={1080} />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 container pb-16">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm font-body uppercase tracking-[0.3em] text-card/70 mb-4"
        >
          Our Story
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-display text-5xl md:text-7xl text-card leading-[0.95] max-w-3xl"
        >
          Built on the belief that craft matters.
        </motion.h1>
      </div>
    </section>

    {/* Brand story */}
    <section className="container py-20 max-w-3xl mx-auto">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-6">
        <motion.p variants={fadeUp} custom={0} className="font-display text-2xl md:text-3xl text-foreground leading-relaxed">
          Pebble was born from a simple idea: the things we surround ourselves with should feel
          intentional, made with care, and connected to a real human story.
        </motion.p>
        <motion.p variants={fadeUp} custom={1} className="text-muted-foreground font-body text-lg leading-relaxed">
          In a world of mass production and disposable everything, we created a place where artisans
          can share their craft directly with people who value quality over quantity. Every product
          on Pebble is made by hand, sourced responsibly, and shipped with the care it deserves.
        </motion.p>
        <motion.p variants={fadeUp} custom={2} className="text-muted-foreground font-body text-lg leading-relaxed">
          We're not just a marketplace — we're a community of makers, collectors, and dreamers
          who believe that beautiful objects can make everyday life a little more meaningful.
        </motion.p>
      </motion.div>
    </section>

    {/* Why Pebble — 3 value cards */}
    <section className="bg-card py-20">
      <div className="container">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-display text-3xl md:text-4xl text-foreground text-center mb-14"
        >
          Why Pebble?
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Award,
              title: 'Curated Quality',
              desc: 'Every product is hand-selected by our curation team. We visit workshops, meet the makers, and ensure each piece meets our standards for craftsmanship and sustainability.',
            },
            {
              icon: Shield,
              title: 'Verified Sellers',
              desc: 'Our sellers go through a rigorous verification process. We check credentials, inspect materials, and ensure fair labor practices before anyone joins the platform.',
            },
            {
              icon: Heart,
              title: 'Warm Community',
              desc: 'Pebble is more than transactions. It\'s a place where makers connect with appreciators, share stories behind their craft, and build lasting relationships.',
            },
          ].map((val, i) => (
            <motion.div
              key={val.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="bg-background rounded-3xl p-8 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-6">
                <val.icon className="w-7 h-7 text-stone" />
              </div>
              <h3 className="font-display text-xl text-foreground mb-3">{val.title}</h3>
              <p className="text-muted-foreground font-body leading-relaxed">{val.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Team */}
    <section className="container py-20">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="font-display text-3xl md:text-4xl text-foreground text-center mb-4"
      >
        The People Behind Pebble
      </motion.h2>
      <p className="text-muted-foreground font-body text-center max-w-lg mx-auto mb-14">
        A small team with big ambitions, united by a love for craft and community.
      </p>
      {/* TODO: replace gradient avatars with real photos when available */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-10 max-w-md mx-auto">
        {[
          { name: 'Aditya Idnani', role: 'Co-Founder', initials: 'AI', gradient: 'from-[hsl(var(--accent))] to-[hsl(25,60%,55%)]' },
          { name: 'Sameer Dhakad', role: 'Co-Founder', initials: 'SD', gradient: 'from-[hsl(30,30%,55%)] to-[hsl(var(--accent))]' },
        ].map((member, i) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center"
          >
            <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${member.gradient} mx-auto mb-4 flex items-center justify-center shadow-lg`}>
              <span className="font-display text-2xl text-white/90">{member.initials}</span>
            </div>
            <h4 className="font-display text-lg text-foreground">{member.name}</h4>
            <p className="text-sm text-muted-foreground font-body">{member.role}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Stats strip */}
    <section className="bg-foreground py-16">
      <div className="container grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {[
          { value: '10,000+', label: 'Products' },
          { value: '500+', label: 'Verified Sellers' },
          { value: '50,000+', label: 'Happy Customers' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <p className="font-mono text-4xl md:text-5xl text-card font-medium">{stat.value}</p>
            <p className="text-card/60 font-body mt-2 uppercase tracking-wider text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Join as Seller CTA */}
    <section className="container py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-cream rounded-3xl p-10 md:p-16 text-center"
      >
        <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">Share Your Craft With the World</h2>
        <p className="text-muted-foreground font-body max-w-lg mx-auto mb-8 text-lg">
          Join 500+ artisans selling on Pebble. Low commissions, powerful tools, and a community that values quality.
        </p>
        <Link
          to="/sellers"
          className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-3.5 rounded-full font-body font-semibold hover:opacity-90 transition-opacity"
        >
          Start Selling <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </section>
  </div>
);

export default About;
