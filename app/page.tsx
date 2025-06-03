'use client';

import { useEffect, useState } from 'react';

type MoodEntry = {
  id: number;
  mood: string;
  note: string;
  time: string;
};

export default function Home() {
  const [mood, setMood] = useState('');
  const [note, setNote] = useState('');
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const emojiOptions = ['😄', '😊', '😐', '😢', '😡'];

  const submitMood = async () => {
    if (!mood) return alert('Please pick a mood!');
    setLoading(true);
    const res = await fetch('/api/mood', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mood, note }),
    });
    const result = await res.json();
    console.log('submitted:', result);
    setMood('');
    setNote('');
    fetchEntries();
    setLoading(false);
  };

  const fetchEntries = async () => {
    const res = await fetch('/api/mood');
    const data = await res.json();
    setEntries(data.data);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <main className="min-h-screen p-6 bg-gradient-to-br from-yellow-100 to-pink-100">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        <h1 className="text-3xl font-bold mb-4 text-center">🌈 Mood Tracker</h1>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Your Mood:</label>
          <div className="flex gap-2">
            {emojiOptions.map((e) => (
              <button
                key={e}
                onClick={() => setMood(e)}
                className={`text-3xl p-2 rounded hover:bg-gray-200 ${
                  mood === e ? 'bg-yellow-200' : ''
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Note:</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Anything you want to say..."
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          onClick={submitMood}
          disabled={loading}
          className="w-full bg-pink-400 text-white font-bold py-2 rounded hover:bg-pink-500 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Mood'}
        </button>

        <hr className="my-6" />

        <h2 className="text-xl font-bold mb-2">📝 Mood History</h2>
        {entries.length === 0 ? (
          <p className="text-gray-500">No moods yet. Submit one!</p>
        ) : (
          <ul className="space-y-2 max-h-[300px] overflow-y-auto">
            {entries.map((entry) => (
              <li key={entry.id} className="p-3 bg-gray-50 rounded shadow">
                <div className="text-2xl">{entry.mood}</div>
                <div className="text-sm text-gray-700">{entry.note}</div>
                <div className="text-xs text-gray-400">{entry.time}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
