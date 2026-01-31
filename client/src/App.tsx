import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Applicant from './pages/Applicant';
// import Approver from './pages/Approver';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/applicant" element={<Applicant />} />
      {/* <Route path="/approver" element={<Approver />} /> */}
    </Routes>
  );
}

export default App;