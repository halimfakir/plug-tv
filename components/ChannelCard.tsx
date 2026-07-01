import React from 'react';

type Channel = {
  id: string;
  name: string;
  country: string;
  category: string;
  logo: string;
  website: string;
};

export default function ChannelCard({ channel }: { channel: Channel }) {
  return (
    <article className="bg-gradient-to-br from-white/2 to-white/3 glass p-4 rounded-xl hover:scale-[1.01] transition-transform duration-200">
      <div className="flex items-center gap-4">
        <img src={channel.logo} alt={channel.name} className="w-14 h-14 object-contain rounded-md" />
        <div>
          <h3 className="font-semibold">{channel.name}</h3>
          <div className="text-sm text-white/70">{channel.country} • {channel.category}</div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <a href={channel.website} target="_blank" rel="noreferrer" className="text-sm px-3 py-2 bg-white/5 rounded-md">Visit Official Site</a>
        <button className="text-sm px-3 py-2 bg-white/6 rounded-md">Favorite</button>
      </div>
    </article>
  );
}
