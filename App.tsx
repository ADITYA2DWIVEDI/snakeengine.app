import React, { useState, useCallback, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { AuthPage } from './views/AuthPage';
import { DashboardView } from './views/DashboardView';
import { ChatView } from './views/ChatView';
import { ImageGenView } from './views/ImageGenView';
import { VideoGenView } from './views/VideoGenView';
import { TemplatesView } from './views/TemplatesView';
import { SearchView } from './views/SearchView';
import { DiscoverPage } from './views/DiscoverPage';
import { ExcelAutomationPage } from './views/ExcelAutomationPage';
import { SettingsPage } from './views/SettingsPage';
import { SubscriptionPage } from './views/SubscriptionPage';
import { HelpPage } from './views/HelpPage';
import { AudioToolView } from './views/AudioToolView';
import { CodeAssistantView } from './views/CodeAssistantView';
import { ContentWriterView } from './views/ContentWriterView';
import { CommunityPage } from './views/CommunityPage';
import { CreatorsPage } from './views/CreatorsPage';
import { AdminPage } from './views/AdminPage';
import { TrendingPage } from './views/TrendingPage';
import { ChatHistoryPage } from './views/ChatHistoryPage';
import { PersonaHubView } from './views/PersonaHubView';
import { DocumentAnalyzerView } from './views/DocumentAnalyzerView';
import { MusicComposerView } from './views/MusicComposerView';
import { WebsiteBuilderView } from './views/WebsiteBuilderView';
import { PresentationCreatorView } from './views/PresentationCreatorView';
import { EmailAssistantView } from './views/EmailAssistantView';
import { LiveConversationView } from './views/LiveConversationView';
import { IdeaGeneratorView } from './views/IdeaGeneratorView';
import { TranslatorView } from './views/TranslatorView';
import { PodcastScriptView } from './views/PodcastScriptView';
import { SocialPlannerView } from './views/SocialPlannerView';
import { FitnessPlannerView } from './views/FitnessPlannerView';
import { TravelPlannerView } from './views/TravelPlannerView';
import { GameCreatorView } from './views/GameCreatorView';
import { LeaderboardPage } from './views/LeaderboardPage';
import { ChallengesPage } from './views/ChallengesPage';
import { FinancialAnalystView } from './views/FinancialAnalystView';
import { HealthAdvisorView } from './views/HealthAdvisorView';
import { PersonalStylistView } from './views/PersonalStylistView';
import { Conversation, ChatMessage as Message, User } from './types';
import { clearChatSession } from './services/geminiService';

export type View =
  | 'dashboard' | 'chat' | 'imageGen' | 'videoGen' | 'templates'
  | 'search' | 'discover' | 'excel' | 'settings' | 'subscription'
  | 'help' | 'audio' | 'code' | 'writer' | 'community' | 'creators'
  | 'admin' | 'trending' | 'history' | 'persona' | 'document'
  | 'music' | 'website' | 'presentation' | 'email' | 'live' | 'idea'
  | 'translator' | 'podcast' | 'social' | 'fitness' | 'travel'
  | 'game' | 'leaderboard' | 'challenges' | 'financial' | 'health' | 'stylist';


const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    const [currentView, setCurrentView] = useState<View>('chat');
    const [conversations, setConversations] = useState<Conversation[]>([
        {
            id: '1',
            title: 'SnakeEngine.AI',
            messages: [{ id: '1-1', sender: 'ai', text: 'Hello! I am SnakeEngine.AI. How can I help you today?' }]
        }
    ]);
    const [activeConversationId, setActiveConversationId] = useState<string | null>('1');

    const handleLogin = () => {
        setUser({ name: 'Demo User', email: 'demo@snakeengine.ai' });
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setUser(null);
        setIsLoggedIn(false);
    };

    const handleNewChat = useCallback(() => {
        const newConversation: Conversation = {
            id: Date.now().toString(),
            title: 'SnakeEngine.AI',
            messages: [{ id: `${Date.now().toString()}-1`, sender: 'ai', text: 'Hello! I am SnakeEngine.AI. How can I assist you?' }],
        };
        setConversations(prev => [newConversation, ...prev]);
        setActiveConversationId(newConversation.id);
        setCurrentView('chat');
    }, []);
    
    const handleSelectConversation = (id: string) => {
        setActiveConversationId(id);
        setCurrentView('chat');
    };

    const handleDeleteConversation = (id: string) => {
        setConversations(prev => prev.filter(c => c.id !== id));
        if (activeConversationId === id) {
            setActiveConversationId(conversations.length > 1 ? conversations.find(c => c.id !== id)?.id ?? null : null);
            if (conversations.length <= 1) {
                setCurrentView('chat');
            }
        }
    };

    const updateConversationMessages = useCallback((conversationId: string, updateFn: (messages: Message[]) => Message[]) => {
        setConversations(prev =>
            prev.map(c =>
                c.id === conversationId ? { ...c, messages: updateFn(c.messages) } : c
            )
        );
    }, []);

    const updateConversationTitle = useCallback((conversationId: string, title: string) => {
        // Title is now fixed, but we keep the function in case it's needed elsewhere
        if (title !== "SnakeEngine.AI") {
             setConversations(prev =>
                prev.map(c => (c.id === conversationId ? { ...c, title } : c))
            );
        }
    }, []);
    
    const activeConversation = useMemo(() => {
        return conversations.find(c => c.id === activeConversationId);
    }, [conversations, activeConversationId]);
    
    const handleSetPersona = (persona: string) => {
        if (activeConversationId) {
            setConversations(prev => prev.map(c => c.id === activeConversationId ? { ...c, persona } : c));
            clearChatSession(activeConversationId);
            updateConversationMessages(activeConversationId, (messages) => [
                ...messages,
                { id: Date.now().toString(), sender: 'ai', text: `Persona set! I am now: ${persona}` }
            ]);
            setCurrentView('chat');
        }
    };


    const renderView = () => {
        const chatViewProps = {
            conversations,
            activeConversationId,
            updateConversationMessages,
            updateConversationTitle,
        };

        switch (currentView) {
            case 'dashboard': return <DashboardView />;
            case 'chat': return <ChatView {...chatViewProps} />;
            case 'imageGen': return <ImageGenView />;
            case 'videoGen': return <VideoGenView />;
            case 'templates': return <TemplatesView />;
            case 'search': return <SearchView />;
            case 'discover': return <DiscoverPage />;
            case 'excel': return <ExcelAutomationPage />;
            case 'settings': return <SettingsPage />;
            case 'subscription': return <SubscriptionPage />;
            case 'help': return <HelpPage />;
            case 'audio': return <AudioToolView />;
            case 'code': return <CodeAssistantView />;
            case 'writer': return <ContentWriterView />;
            case 'community': return <CommunityPage />;
            case 'creators': return <CreatorsPage />;
            case 'admin': return <AdminPage />;
            case 'trending': return <TrendingPage />;
            case 'history': return <ChatHistoryPage 
                conversations={conversations} 
                onSelectConversation={handleSelectConversation}
                onDeleteConversation={handleDeleteConversation}
                onNewChat={handleNewChat}
            />;
            case 'persona': return <PersonaHubView onSetPersona={handleSetPersona} />;
            case 'document': return <DocumentAnalyzerView />;
            case 'music': return <MusicComposerView />;
            case 'website': return <WebsiteBuilderView />;
            case 'presentation': return <PresentationCreatorView />;
            case 'email': return <EmailAssistantView />;
            case 'live': return <LiveConversationView />;
            case 'idea': return <IdeaGeneratorView />;
            case 'translator': return <TranslatorView />;
            case 'podcast': return <PodcastScriptView />;
            case 'social': return <SocialPlannerView />;
            case 'fitness': return <FitnessPlannerView />;
            case 'travel': return <TravelPlannerView />;
            case 'game': return <GameCreatorView />;
            case 'leaderboard': return <LeaderboardPage />;
            case 'challenges': return <ChallengesPage />;
            case 'financial': return <FinancialAnalystView />;
            case 'health': return <HealthAdvisorView />;
            case 'stylist': return <PersonalStylistView />;
            default: return <ChatView {...chatViewProps} />;
        }
    };

    if (!isLoggedIn) {
        return <AuthPage onLoginSuccess={handleLogin} />;
    }

    return (
        <div className="flex h-screen w-screen bg-bg-primary text-text-primary font-sans antialiased">
            <Sidebar 
              currentView={currentView} 
              setCurrentView={setCurrentView} 
              onNewChat={handleNewChat}
              user={user}
              onLogout={handleLogout}
            />
            <main className="flex-1 flex flex-col overflow-hidden">
                {renderView()}
            </main>
        </div>
    );
};

export default App;
