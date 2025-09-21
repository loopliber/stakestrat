import Layout from "./Layout.jsx";

import Home from "./Home";

import DiceCalculator from "./DiceCalculator";

import CrashSimulator from "./CrashSimulator";

import PlinkoSimulator from "./PlinkoSimulator";

import LimboCalculator from "./LimboCalculator";

import Guides from "./Guides";

import GuideDetail from "./GuideDetail";

import Reviews from "./Reviews";

import Promotions from "./Promotions";

import ResponsibleGambling from "./ResponsibleGambling";

import MinesCalculator from "./MinesCalculator";

import ArbitrageCalculator from "./ArbitrageCalculator";

import WheelCalculator from "./WheelCalculator";

import KenoCalculator from "./KenoCalculator";

import RockPaperScissorsCalculator from "./RockPaperScissorsCalculator";

import BlackjackCalculator from "./BlackjackCalculator";

import PokerOddsCalculator from "./PokerOddsCalculator";

import DiceCalculatorAlt from "./dice-calcuator";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
    DiceCalculator: DiceCalculator,
    
    CrashSimulator: CrashSimulator,
    
    PlinkoSimulator: PlinkoSimulator,
    
    LimboCalculator: LimboCalculator,
    
    Guides: Guides,
    
    GuideDetail: GuideDetail,
    
    Reviews: Reviews,
    
    Promotions: Promotions,
    
    ResponsibleGambling: ResponsibleGambling,
    
    MinesCalculator: MinesCalculator,
    
    ArbitrageCalculator: ArbitrageCalculator,
    
    WheelCalculator: WheelCalculator,
    
    KenoCalculator: KenoCalculator,
    
    RockPaperScissorsCalculator: RockPaperScissorsCalculator,
    
    BlackjackCalculator: BlackjackCalculator,
    
    PokerOddsCalculator: PokerOddsCalculator,
    
    "dice-calcuator": DiceCalculatorAlt,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Home />} />
                
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/DiceCalculator" element={<DiceCalculator />} />
                
                <Route path="/CrashSimulator" element={<CrashSimulator />} />
                
                <Route path="/PlinkoSimulator" element={<PlinkoSimulator />} />
                
                <Route path="/LimboCalculator" element={<LimboCalculator />} />
                
                <Route path="/Guides" element={<Guides />} />
                
                <Route path="/GuideDetail" element={<GuideDetail />} />
                
                <Route path="/Reviews" element={<Reviews />} />
                
                <Route path="/Promotions" element={<Promotions />} />
                
                <Route path="/ResponsibleGambling" element={<ResponsibleGambling />} />
                
                <Route path="/MinesCalculator" element={<MinesCalculator />} />
                
                <Route path="/ArbitrageCalculator" element={<ArbitrageCalculator />} />
                
                <Route path="/WheelCalculator" element={<WheelCalculator />} />
                
                <Route path="/KenoCalculator" element={<KenoCalculator />} />
                
                <Route path="/RockPaperScissorsCalculator" element={<RockPaperScissorsCalculator />} />
                
                <Route path="/BlackjackCalculator" element={<BlackjackCalculator />} />
                
                <Route path="/PokerOddsCalculator" element={<PokerOddsCalculator />} />
                
                <Route path="/dice-calcuator" element={<dice-calcuator />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}