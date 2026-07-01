import dynamic from 'next/dynamic';
import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ChannelGrid from '../components/ChannelGrid';
import Footer from '../components/Footer';

import sampleChannels from '../data/sampleChannels';

export default function Page() {
  return (
    <main className="flex-1">
      <Navbar />
      <Hero />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-semibold mb-4">Featured Channels</h2>
        <ChannelGrid channels={sampleChannels.slice(0, 8)} />
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-semibold mb-4">Latest Channels</h2>
        <ChannelGrid channels={sampleChannels.slice(8, 16)} />
      </section>

      <Footer />
    </main>
  );
}
