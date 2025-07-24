import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Swords, Trophy, BarChart3, Users, Settings, Search, Bell, Plus,
  ChevronUp, ChevronDown, Star, BrainCircuit, Clock, UsersRound, Sun, Moon, Sparkles, Wand2
} from 'lucide-react';

// --- MOCK DATA --- //
const user = {
  name: 'John Doe',
  avatar: 'https://i.pravatar.cc/150?u=johnDoe',
};

const kpiData = [
  { title: 'Overall Score', value: '2290/3000', trend: 2, icon: <Star className="w-6 h-6" /> },
  { title: 'Win Rate', value: '78/100', trend: 5, icon: <Trophy className="w-6 h-6" /> },
  { title: 'Performance Trend', value: 'Last 30 Days', trend: 0, icon: <BarChart3 className="w-6 h-6" /> },
  { title: 'Avg. Score', value: '82/100', trend: -3, icon: <BrainCircuit className="w-6 h-6" /> },
];

const recentDebates = [
  { topic: 'Climate Change Policy Reform', opponent: 'Sarah Wilson', status: 'Won', score: '85/100', time: '2 hours ago', viewers: 12 },
  { topic: 'Universal Basic Income', opponent: 'Mike Johnson', status: 'Lost', score: '72/100', time: '1 day ago', viewers: 8 },
  { topic: 'AI Ethics in Healthcare', opponent: 'Emma Davis', status: 'Won', score: '91/100', time: '3 days ago', viewers: 15 },
  { topic: 'Mars Colonization Funding', opponent: 'Alex Chen', status: 'Won', score: '78/100', time: '1 week ago', viewers: 6 },
];

const topDebaters = [
  { rank: 1, name: 'Alex Rodriguez', record: '28W - 3L', score: 2450, avatar: 'https://i.pravatar.cc/150?u=alex' },
  { rank: 2, name: 'Sarah Chen', record: '25W - 4L', score: 2380, avatar: 'https://i.pravatar.cc/150?u=sarah' },
  { rank: 3, name: 'John Doe', record: '22W - 8L', score: 2290, avatar: user.avatar },
  { rank: 4, name: 'Emma Wilson', record: '20W - 7L', score: 2180, avatar: 'https://i.pravatar.cc/150?u=emma' },
];

const upcomingDebates = [
    { topic: 'Future of Renewable Energy', opponent: 'Chris Lee', time: 'Tomorrow, 7 PM IST' },
    { topic: 'Data Privacy Laws', opponent: 'Maria Garcia', time: 'July 24, 2025' },
];


// --- THEME TOGGLE COMPONENT --- //
const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
        const theme = localStorage.getItem('theme');
        if (theme) return theme === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  return (
    <button
      onClick={() => setIsDarkMode(!isDarkMode)}
      className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      aria-label="Toggle theme"
    >
      {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};


// --- REUSABLE CARD COMPONENT --- //
const StatCard = ({ item }) => {
  const isPositive = item.trend >= 0;
  const TrendIcon = isPositive ? ChevronUp : ChevronDown;
  const trendColor = isPositive ? 'text-green-500' : 'text-red-500';

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{item.value}</p>
        {item.title !== 'Performance Trend' && (
           <div className={`mt-2 flex items-center text-sm font-semibold ${trendColor}`}>
             <TrendIcon className="w-4 h-4" />
             <span>{Math.abs(item.trend)}% vs last month</span>
           </div>
        )}
      </div>
      <div className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 p-3 rounded-lg">
        {item.icon}
      </div>
    </div>
  );
};

// --- SIDEBAR COMPONENT --- //
const Sidebar = ({ activePage, setActivePage }) => {
  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'My Debates', icon: <Swords size={20} /> },
    { name: 'Leaderboard', icon: <Trophy size={20} /> },
    { name: 'Analytics', icon: <BarChart3 size={20} /> },
    { name: 'Community', icon: <Users size={20} /> },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-800 shadow-lg hidden md:flex flex-col">
      <div className="h-16 flex items-center justify-center text-2xl font-bold text-indigo-600 dark:text-indigo-400 border-b dark:border-gray-700">
        <Swords className="mr-2" />DebateHub
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map(item => (
          <button
            key={item.name}
            onClick={() => setActivePage(item.name)}
            className={`w-full flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
              activePage === item.name
                ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {item.icon}
            <span className="ml-3">{item.name}</span>
          </button>
        ))}
      </nav>
      <div className="px-4 py-4 border-t dark:border-gray-700">
        <button
          onClick={() => setActivePage('Settings')}
          className={`w-full flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
            activePage === 'Settings'
              ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <Settings size={20} />
          <span className="ml-3">Settings</span>
        </button>
      </div>
    </aside>
  );
};

// --- HEADER COMPONENT --- //
const Header = ({ activePage, setActivePage }) => {
  return (
    <header className="sticky top-0 bg-gray-100/80 dark:bg-gray-900/80 backdrop-blur-sm z-10 flex items-center justify-between p-4 border-b dark:border-gray-700">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{activePage}</h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Search debates, users..." className="pl-10 pr-4 py-2 w-64 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <ThemeToggle />
        <button className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Notifications">
          <Bell size={20} />
        </button>
        <button 
          onClick={() => setActivePage('New Debate')}
          className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
        >
          <Plus size={18} className="mr-2" /> New Debate
        </button>
        <img src={user.avatar} alt="User Avatar" className="w-10 h-10 rounded-full" />
      </div>
    </header>
  );
};

// --- PLACEHOLDER PAGE COMPONENT --- //
const PlaceholderPage = ({ title }) => (
  <div className="p-6">
    <div className="bg-white dark:bg-gray-800 p-10 rounded-xl shadow-md text-center">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{title}</h2>
      <p className="text-gray-600 dark:text-gray-400">This is the placeholder page for the {title} section.</p>
      <p className="text-gray-600 dark:text-gray-400">Content for this page would be displayed here.</p>
    </div>
  </div>
);


// --- DASHBOARD CONTENT COMPONENT --- //
const DashboardContent = () => (
  <div className="p-6 space-y-6">
    {/* KPI Row */}
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {kpiData.map(item => <StatCard key={item.title} item={item} />)}
    </div>

    {/* Second Row */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Recent Debates */}
      <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-4">Recent Debates</h3>
        <div className="space-y-4">
          {recentDebates.map((debate, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-4 flex-shrink-0 ${debate.status === 'Won' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">{debate.topic}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">vs {debate.opponent} · {debate.time}</p>
                </div>
              </div>
              <div className="text-right ml-4">
                <p className={`font-bold ${debate.status === 'Won' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{debate.score}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-end"><UsersRound size={14} className="mr-1" /> {debate.viewers}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Debaters */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-4">Top Debaters</h3>
          <div className="space-y-4">
            {topDebaters.map(debater => (
              <div key={debater.rank} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-lg font-bold text-gray-400 dark:text-gray-500 w-6">#{debater.rank}</span>
                  <img src={debater.avatar} alt={debater.name} className="w-10 h-10 rounded-full mx-3" />
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{debater.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{debater.record}</p>
                  </div>
                </div>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{debater.score}</span>
              </div>
            ))}
          </div>
      </div>
    </div>
    
    {/* Third Row */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Performance Breakdown */}
      <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-4">Performance Breakdown</h3>
          <div className="flex items-center justify-center text-center text-gray-500 dark:text-gray-400 py-16">
            <p>
                [A radar chart component like Recharts or Chart.js would be integrated here to show skill breakdown.]
            </p>
          </div>
      </div>
        
      {/* Upcoming Debates */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-4">Upcoming Debates</h3>
          <div className="space-y-4">
              {upcomingDebates.map((debate, index) => (
                  <div key={index} className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg">
                      <p className="font-semibold text-indigo-800 dark:text-indigo-200">{debate.topic}</p>
                      <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-1">vs {debate.opponent}</p>
                      <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <Clock size={14} className="mr-1.5"/>
                          <span>{debate.time}</span>
                      </div>
                  </div>
              ))}
              <button className="w-full mt-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                  View Full Schedule
              </button>
          </div>
      </div>
    </div>
  </div>
);

// --- GEMINI-POWERED NEW DEBATE PAGE --- //
const NewDebatePage = () => {
    const [topic, setTopic] = useState('');
    const [stance, setStance] = useState('For');
    const [generatedContent, setGeneratedContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Function to call the Gemini API
    const callGeminiAPI = async (prompt) => {
        setIsLoading(true);
        setError('');
        setGeneratedContent('');
        const apiKey = ""; // Keep this empty
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });

            if (!response.ok) {
                throw new Error(`API call failed with status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.candidates && result.candidates.length >  0 && result.candidates[0].content.parts[0].text) {
                setGeneratedContent(result.candidates[0].content.parts[0].text);
            } else {
                throw new Error("Invalid response structure from API.");
            }

        } catch (err) {
            setError(err.message || "An unknown error occurred.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateTopics = () => {
        const prompt = "Suggest 5 interesting, current, and controversial debate topics suitable for a competitive debate platform. Present them as a numbered list.";
        callGeminiAPI(prompt);
    };

    const handleGenerateArguments = () => {
        if (!topic) {
            setError("Please enter a debate topic first.");
            return;
        }
        const prompt = `You are an expert debate coach. For the debate topic "${topic}", generate a structured set of strong arguments for the "${stance}" position. Include the following sections: 
        1.  **Opening Statement:** A powerful and concise introduction.
        2.  **Key Arguments:** 3-4 main points with brief explanations.
        3.  **Supporting Evidence:** Suggest types of evidence (e.g., statistics, historical examples, expert opinions) that would strengthen each argument.
        4.  **Anticipated Counter-arguments & Rebuttals:** Foresee what the opposition might argue and provide potential rebuttals.
        
        Format the entire response in Markdown.`;
        callGeminiAPI(prompt);
    };

    return (
        <div className="p-6 space-y-6">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Create a New Debate</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Use our AI-powered tools to help you prepare for your next debate.</p>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="topic" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Debate Topic</label>
                        <input
                            type="text"
                            id="topic"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g., 'Artificial intelligence will do more good than harm'"
                        />
                    </div>
                    <button
                        onClick={handleGenerateTopics}
                        disabled={isLoading}
                        className="flex items-center justify-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 disabled:opacity-50 transition"
                    >
                        <Sparkles size={16} />
                        ✨ Don't have a topic? Generate ideas!
                    </button>
                </div>

                <div className="mt-6">
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Stance</label>
                     <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="stance" value="For" checked={stance === 'For'} onChange={() => setStance('For')} className="form-radio h-4 w-4 text-indigo-600"/>
                            <span className="text-gray-800 dark:text-gray-200">For</span>
                        </label>
                         <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="stance" value="Against" checked={stance === 'Against'} onChange={() => setStance('Against')} className="form-radio h-4 w-4 text-indigo-600"/>
                            <span className="text-gray-800 dark:text-gray-200">Against</span>
                        </label>
                     </div>
                </div>

                 <div className="mt-6">
                    <button
                        onClick={handleGenerateArguments}
                        disabled={isLoading || !topic}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-indigo-400 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed transition"
                    >
                        <Wand2 size={18} />
                        ✨ Generate Arguments & Talking Points
                    </button>
                 </div>
            </div>

            {(isLoading || error || generatedContent) && (
                 <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-4">AI Assistant</h3>
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center space-y-2 text-gray-500 dark:text-gray-400">
                            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                            <p>Generating... Please wait.</p>
                        </div>
                    )}
                    {error && (
                        <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
                            <p><strong>Error:</strong> {error}</p>
                        </div>
                    )}
                    {generatedContent && (
                        <div className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: generatedContent.replace(/\n/g, '<br />') }}></div>
                    )}
                 </div>
            )}
        </div>
    );
};


// --- MAIN APP COMPONENT --- //
export default function App() {
  const [activePage, setActivePage] = useState('Dashboard');

  const renderContent = () => {
    switch (activePage) {
      case 'Dashboard':
        return <DashboardContent />;
      case 'My Debates':
        return <PlaceholderPage title="My Debates" />;
      case 'Leaderboard':
        return <PlaceholderPage title="Leaderboard" />;
      case 'Analytics':
        return <PlaceholderPage title="Analytics" />;
      case 'Community':
        return <PlaceholderPage title="Community" />;
      case 'Settings':
        return <PlaceholderPage title="Settings" />;
      case 'New Debate':
        return <NewDebatePage />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 font-sans">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-1 flex flex-col overflow-y-auto">
        <Header activePage={activePage} setActivePage={setActivePage} />
        {renderContent()}
      </main>
    </div>
  );
}
