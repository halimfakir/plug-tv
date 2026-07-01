import React from 'react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="bg-gradient-to-r from-[#0f1724] to-[#061024] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold">Watch Free. Discover More.</h1>
            <p className="mt-4 text-lg text-white/80 max-w-2xl">
              Plug TV is a curated directory of official live TV channels and legally embeddable streams — discover channels by country, category, and trending topics.
            </p>

            <div className="mt-6 flex gap-3">
              <a href="#featured" className="px-4 py-2 rounded-md bg-white/6 hover:bg-white/8">Browse Channels</a>
              <a href="/about" className="px-4 py-2 rounded-md border border-white/6">Learn more</a>
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <div className="grid grid-cols-2 gap-3">
              <div className="glass p-3 rounded-lg flex items-center gap-3">
                <img src="/logos/bbc-news.png" alt="BBC" className="w-12 h-12 object-contain rounded-md" />
                <div>
                  <div className="font-semibold">BBC News</div>
                  <div className="text-sm text-white/70">UK • News</div>
                </div>
              </div>
              <div className="glass p-3 rounded-lg flex items-center gap-3">
                <img src="/logos/cnn.png" alt="CNN" className="w-12 h-12 object-contain rounded-md" />
                <div>
                  <div className="font-semibold">CNN</div>
                  <div className="text-sm text-white/70">USA • News</div>
                </div>
              </div>

              <div className="glass p-3 rounded-lg flex items-center gap-3">
                <img src="/logos/espn.png" alt="ESPN" className="w-12 h-12 object-contain rounded-md" />
                <div>
                  <div className="font-semibold">ESPN</div>
                  <div className="text-sm text-white/70">USA • Sports</div>
                </div>
              </div>

              <div className="glass p-3 rounded-lg rounded-lg flex items-center gap-3">
                <img src="/logos/nhk.png" alt="NHK" className="w-12 h-12 object-contain rounded-md" />
                <div>
                  <div className="font-semibold">NHK World</div>
                  <div className="text-sm text-white/70">Japan • News</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
