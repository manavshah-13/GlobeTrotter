import React, { useState } from 'react';
import { SidebarNav, TopAppBar } from '../components/Navigation';

const COMMUNITY_POSTS = [
  {
    id: 1,
    author: 'Elena Rostova',
    avatar: 'ER',
    time: '2 hours ago',
    title: 'Hidden Gem Izakayas in Golden Gai, Tokyo',
    description: 'Just wrapped up 5 days in Shinjuku! Here is my curated list of tiny 6-seater izakayas that serve the best highballs and yakitori.',
    likes: 42,
    comments: 12,
    tripTag: 'Tokyo 5-Day Foodie'
  },
  {
    id: 2,
    author: 'Liam Vance',
    avatar: 'LV',
    time: 'Yesterday',
    title: 'Interlaken to Zermatt Glacier Trail Itinerary',
    description: 'Detailed breakdown of train timings, mountain hut reservations, and packing checklist for high-altitude alpine trekking in Switzerland.',
    likes: 88,
    comments: 29,
    tripTag: 'Swiss Alps Trek'
  },
  {
    id: 3,
    author: 'Sofia Rossi',
    avatar: 'SR',
    time: '3 days ago',
    title: 'Amalfi Coast Road Trip: Driving vs Ferry',
    description: 'Sharing my honest experience navigating SS163 coastal road during peak season versus taking high-speed ferry connections between Positano & Capri.',
    likes: 64,
    comments: 18,
    tripTag: 'Amalfi Explorer'
  }
];

export default function CommunityPage() {
  const [posts, setPosts] = useState(COMMUNITY_POSTS);
  const [search, setSearch] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const post = {
      id: Date.now(),
      author: 'Jane Traveler',
      avatar: 'JT',
      time: 'Just now',
      title: newTitle,
      description: newDesc,
      likes: 1,
      comments: 0,
      tripTag: 'Custom Itinerary'
    };

    setPosts([post, ...posts]);
    setNewTitle('');
    setNewDesc('');
    setShowModal(false);
  };

  const handleLike = (id) => {
    setPosts(posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  const filtered = posts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-background text-on-background min-h-screen flex">
      <SidebarNav />

      <div className="flex-grow flex flex-col min-w-0">
        <TopAppBar title="Community Sub Screen (Screen 10)" />

        <main className="flex-grow p-margin-page overflow-y-auto max-w-7xl w-full mx-auto space-y-stack-lg">
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-paper border border-slate p-6 rounded-lg">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-route-teal/10 text-route-teal text-xs font-data-mono font-bold rounded border border-route-teal/30 mb-2">
                <span className="material-symbols-outlined text-sm">groups</span> COMMUNITY HUB
              </div>
              <h1 className="font-headline-lg text-3xl font-bold text-primary">Travel Community & Shared Logs</h1>
              <p className="font-body-md text-slate mt-1">Discover itineraries shared by fellow GlobeTrotter members worldwide.</p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="bg-horizon-amber text-ink-navy font-bold px-6 py-2.5 rounded hover:bg-opacity-90 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined">post_add</span>
              <span>Share Itinerary Post</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="bg-paper border border-slate p-4 rounded-lg">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search community posts, itinerary guides, travel tips..."
                className="w-full bg-paper border border-slate rounded-lg pl-12 pr-4 py-3 font-data-mono text-sm focus:outline-none focus:border-horizon-amber"
              />
              <span className="material-symbols-outlined absolute left-4 top-3 text-slate">search</span>
            </div>
          </div>

          {/* Posts Feed matching Screen 10 */}
          <div className="space-y-4">
            {filtered.map(post => (
              <div key={post.id} className="bg-paper border border-slate rounded-lg p-6 hover:border-horizon-amber transition-all shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-container-highest border border-slate flex items-center justify-center font-bold text-ink-navy text-sm font-headline-sm">
                      {post.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-ink-navy text-base">{post.author}</h4>
                      <span className="font-data-mono-sm text-xs text-slate">{post.time} • <strong className="text-route-teal">{post.tripTag}</strong></span>
                    </div>
                  </div>
                  <button className="text-slate hover:text-ink-navy">
                    <span className="material-symbols-outlined">more_horiz</span>
                  </button>
                </div>

                <h3 className="font-headline-sm text-xl font-bold text-ink-navy mb-2">{post.title}</h3>
                <p className="font-body-md text-sm text-slate mb-4 leading-relaxed">{post.description}</p>

                <div className="pt-4 border-t border-slate/50 flex justify-between items-center text-xs font-data-mono">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLike(post.id)}
                      className="flex items-center gap-1.5 text-slate hover:text-alert-coral transition-colors"
                    >
                      <span className="material-symbols-outlined text-base text-alert-coral">favorite</span>
                      <span>{post.likes} Likes</span>
                    </button>

                    <button className="flex items-center gap-1.5 text-slate hover:text-route-teal transition-colors">
                      <span className="material-symbols-outlined text-base">chat_bubble</span>
                      <span>{post.comments} Comments</span>
                    </button>
                  </div>

                  <button className="text-route-teal hover:underline flex items-center gap-1">
                    <span>View Itinerary Details</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* New Post Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-ink-navy/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-paper border border-slate rounded-lg p-6 max-w-lg w-full shadow-2xl">
                <div className="flex justify-between items-center pb-4 border-b border-slate mb-4">
                  <h3 className="font-headline-sm text-xl font-bold text-ink-navy">Share Itinerary Post</h3>
                  <button onClick={() => setShowModal(false)} className="text-slate hover:text-ink-navy">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <form onSubmit={handleCreatePost} className="space-y-4">
                  <div>
                    <label className="block font-headline-sm font-semibold text-sm mb-1 text-ink-navy">Post Title</label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. 3 Days in Tokyo's Shibuya District"
                      className="w-full bg-paper border border-slate rounded px-3 py-2 font-data-mono text-sm focus:outline-none focus:border-horizon-amber"
                    />
                  </div>

                  <div>
                    <label className="block font-headline-sm font-semibold text-sm mb-1 text-ink-navy">Itinerary Description & Highlights</label>
                    <textarea
                      rows={4}
                      required
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      placeholder="Describe your route recommendations, favorite stops, and travel advice..."
                      className="w-full bg-paper border border-slate rounded p-3 font-data-mono text-sm focus:outline-none focus:border-horizon-amber"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 border border-slate rounded text-sm text-slate hover:bg-surface-container"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-horizon-amber text-ink-navy font-bold rounded text-sm hover:opacity-90"
                    >
                      Publish Post
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
