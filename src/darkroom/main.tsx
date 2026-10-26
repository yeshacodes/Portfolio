import { createRoot } from 'react-dom/client';
import '../index.css';
import '../styles/editorial.css';
import { Darkroom } from './Darkroom';

// The darkroom portfolio, booted by index.html (the site root). The previous site is in this repository's history (commit e01467a).
createRoot(document.getElementById('root')!).render(<Darkroom />);
