import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-white/6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row justify-between gap-6">
        <div>
          <h3 className="text-xl font-semibold">Plug TV</h3>
          <p className="text-sm text-white/70 max-w-md mt-2">A curated directory of official and publicly embeddable live TV channels. We do not host or link to unauthorized streams.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <h4 className="font-medium">Browse</h4>
            <ul className="mt-2 text-sm text-white/70">
              <li>Countries</li>
              <li>Categories</li>
              <li>Channels</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium">Company</h4>
            <ul className="mt-2 text-sm text-white/70">
              <li>About</li>
              <li>Contact</li>
              <li>Privacy</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium">Support</h4>
            <ul className="mt-2 text-sm text-white/70">
              <li>FAQ</li>
              <li>DMCA</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium">Legal</h4>
            <ul className="mt-2 text-sm text-white/70">
              <li>Terms</li>
              <li>Privacy</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
