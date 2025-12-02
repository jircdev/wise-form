import React from 'react';
import { ExamplesPage } from './pages/ExamplesPage';
import { AfaFormPage } from './pages/AfaFormPage';
import './App.css';

type Page = 'examples' | 'afa';

function App() {
	const [currentPage, setCurrentPage] = React.useState<Page>('examples');

	return (
		<div className='app'>
			<nav className='app-nav'>
				<div className='nav-container'>
					<h1 className='nav-title'>Wise Form Tests</h1>
					<div className='nav-links'>
						<button
							className={`nav-link ${currentPage === 'examples' ? 'active' : ''}`}
							onClick={() => setCurrentPage('examples')}
						>
							Ejemplos
						</button>
						<button
							className={`nav-link ${currentPage === 'afa' ? 'active' : ''}`}
							onClick={() => setCurrentPage('afa')}
						>
							Formulario AFA
						</button>
					</div>
				</div>
			</nav>
			<main className='app-content'>
				{currentPage === 'examples' && <ExamplesPage />}
				{currentPage === 'afa' && <AfaFormPage />}
			</main>
		</div>
	);
}

export default App;
