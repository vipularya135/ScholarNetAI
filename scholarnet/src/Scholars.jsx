import { useState, useEffect, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Papa from 'papaparse'
import './Scholars.css'

function Scholars() {
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfessor, setSelectedProfessor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [displayedCount, setDisplayedCount] = useState(30);
  
  // New filter states
  const [institutionFilter, setInstitutionFilter] = useState('all');
  const [sortBy, setSortBy] = useState('none');

  const categories = [
    { id: 'all', name: 'All Scholars' },
    { id: 'Computer Science', name: 'Computer Science' },
    { id: 'Mechanical Engineering', name: 'Mechanical Engineering' },
    { id: 'Electrical Engineering', name: 'Electrical Engineering' },
    { id: 'Civil Engineering', name: 'Civil Engineering' },
    { id: 'Chemical Engineering', name: 'Chemical Engineering' },
    { id: 'Physics', name: 'Physics' },
    { id: 'Mathematics', name: 'Mathematics' },
    { id: 'Arts and Humanities', name: 'Arts and Humanities' },
    { id: 'Business Management', name: 'Business Management' },
    { id: 'Medical Sciences', name: 'Medical Sciences' }
  ];

  const institutionFilters = [
    { id: 'all', name: 'All Institutions' },
    { id: 'iit', name: 'IIT' },
    { id: 'nit', name: 'NIT' },
    { id: 'other', name: 'Other than IIT & NIT' }
  ];

  const sortOptions = [
    { id: 'none', name: 'No Sorting' },
    { id: 'citations', name: 'Citations (Highest First)' },
    { id: 'hIndex', name: 'h-index (Highest First)' },
    { id: 'i10Index', name: 'i10-index (Highest First)' }
  ];

  useEffect(() => {
    const loadProfessors = async () => {
      try {
        const response = await fetch('/src/professors_data.csv');
        const csvText = await response.text();
        
        Papa.parse(csvText, {
          header: true,
          complete: (results) => {
            const processedData = results.data
              .filter(row => row.name && row.name.trim() !== '') // Remove empty rows
              .map((row, index) => {
                // Create unique ID based on name and institution instead of numbers
                const nameSlug = row.name ? row.name.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
                const institutionSlug = row.institution ? row.institution.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 5) : '';
                const uniqueId = `${nameSlug}_${institutionSlug}` || `scholar_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
                
                return {
                  id: uniqueId,
                  name: row.name,
                  institution: row.institution,
                  department: row.department,
                  hIndex: parseInt(row.hIndex) || 0,
                  i10Index: parseInt(row.i10Index) || 0,
                  publications: parseInt(row.publications) || 0,
                  citations: parseInt(row.citations) || 0,
                  bio: row.bio || 'No bio available',
                  researchInterests: row.researchInterests || 'No research interests available',
                  domain: row.domain ? row.domain.trim() : 'Other',
                  imageUrl: row.imageUrl || null,
                  iitornit: row.iitornit ? row.iitornit.trim().toLowerCase() : 'other'
                };
              });
            
            setProfessors(processedData);
            
            // Debug: Log unique domains to help identify matching issues
            const uniqueDomains = [...new Set(processedData.map(p => p.domain))];
            console.log('Available domains in data:', uniqueDomains);
            
            // Log domain counts for verification
            const domainCounts = {};
            processedData.forEach(p => {
              const domain = p.domain || 'Unknown';
              domainCounts[domain] = (domainCounts[domain] || 0) + 1;
            });
            console.log('Domain counts:', domainCounts);
            
            setLoading(false);
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
            setLoading(false);
          }
        });
      } catch (error) {
        console.error('Error loading CSV:', error);
        setLoading(false);
      }
    };

    loadProfessors();
  }, []);

  // Reset displayed count when filters change
  useEffect(() => {
    setDisplayedCount(30);
  }, [selectedCategory, institutionFilter, sortBy]);

  // Helper function to get domain-based avatar color
  const getDomainColor = (domain) => {
    const colors = {
      'Computer Science': '#4a90e2',
      'Mechanical Engineering': '#f39c12',
      'Electrical Engineering': '#e74c3c',
      'Civil Engineering': '#27ae60',
      'Chemical Engineering': '#9b59b6',
      'Physics': '#3498db',
      'Mathematics': '#1abc9c',
      'Arts and Humanities': '#e67e22',
      'Business Management': '#34495e',
      'Medical Sciences': '#e91e63',
      'Other': '#95a5a6'
    };
    return colors[domain] || colors['Other'];
  };

  // Helper function to get professor initials
  const getProfessorInitials = (name) => {
    if (!name) return '??';
    return name.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Helper function to determine institution type
  const getInstitutionType = (professor) => {
    const institution = professor.institution ? professor.institution.toLowerCase() : '';
    const iitornit = professor.iitornit ? professor.iitornit.toLowerCase() : '';
    
    // Check if it's explicitly marked as IIT or NIT
    if (iitornit === 'iit') return 'iit';
    if (iitornit === 'nit') return 'nit';
    
    // Fallback to checking institution name
    if (institution.includes('iit') || institution.includes('indian institute of technology')) return 'iit';
    if (institution.includes('nit') || institution.includes('national institute of technology')) return 'nit';
    
    return 'other';
  };

  // Use useMemo for better performance and proper filtering
  const filteredProfessors = useMemo(() => {
    let filtered = professors;

    // Filter by category (domain)
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(professor => {
        const professorDomain = professor.domain ? professor.domain.trim() : '';
        const selectedDomain = selectedCategory.trim();
        return professorDomain.toLowerCase() === selectedDomain.toLowerCase();
      });
    }

    // Filter by institution type
    if (institutionFilter !== 'all') {
      filtered = filtered.filter(professor => {
        const institutionType = getInstitutionType(professor);
        return institutionType === institutionFilter;
      });
    }

    // Sort the filtered results
    if (sortBy !== 'none') {
      filtered = [...filtered].sort((a, b) => {
        if (sortBy === 'citations') {
          return b.citations - a.citations; // Highest first
        } else if (sortBy === 'hIndex') {
          return b.hIndex - a.hIndex; // Highest first
        } else if (sortBy === 'i10Index') {
          return b.i10Index - a.i10Index; // Highest first
        } else if (sortBy === 'publications') {
          return b.publications - a.publications; // Highest first
        }
        return 0;
      });
    }

    // Debug: Log filtering results
    console.log(`Filtering results: Category=${selectedCategory}, Institution=${institutionFilter}, Sort=${sortBy}, Found=${filtered.length} professors`);
    
    return filtered;
  }, [professors, selectedCategory, institutionFilter, sortBy]);

  const displayedProfessors = useMemo(() => {
    return filteredProfessors.slice(0, displayedCount);
  }, [filteredProfessors, displayedCount]);

  const hasMoreProfessors = displayedCount < filteredProfessors.length;

  const handleViewProfile = (professor) => {
    setSelectedProfessor(professor);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProfessor(null);
  };

  const loadMoreProfessors = () => {
    const previousCount = displayedCount;
    setDisplayedCount(prev => prev + 30);
    
    // Scroll to the newly loaded professors after a short delay to ensure DOM update
    setTimeout(() => {
      const scholarCards = document.querySelectorAll('.scholar-card');
      if (scholarCards.length > previousCount) {
        // Find the first newly loaded card (at index previousCount)
        const firstNewCard = scholarCards[previousCount];
        if (firstNewCard) {
          firstNewCard.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        }
      }
    }, 100);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setDisplayedCount(30); // Reset to show first 30
  };

  const handleInstitutionFilterChange = (filterId) => {
    setInstitutionFilter(filterId);
    setDisplayedCount(30);
  };

  const handleSortChange = (sortId) => {
    setSortBy(sortId);
    setDisplayedCount(30);
  };

  if (loading) {
    return (
      <div className="scholars-app">
        <main className="scholars-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading professors data...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="scholars-app">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-logo">
          <span className="logo-icon">🎓</span>
          <span className="logo-text">ScholarlyAI</span>
        </div>
        <div className="nav-links">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
          <Link to="/scholars" className={location.pathname === '/scholars' ? 'active' : ''}>Scholars</Link>
          <Link to="/ai-chat" className={location.pathname === '/ai-chat' ? 'active' : ''}>AI Chat</Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="scholars-content">
        <div className="scholars-header">
          <h1 className="scholars-title">
            <span className="title-line-1">Discover</span>
            <span className="title-line-2">Top Scholars</span>
          </h1>
          <p className="scholars-subtitle">
            Explore leading researchers and academics across various disciplines
          </p>
        </div>

        {/* Domain/Category Filter */}
        <div className="category-filter">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => handleCategoryChange(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Additional Filters */}
        <div className="additional-filters">
          <div className="filter-section">
            <h3>Institution Type</h3>
            <div className="filter-buttons">
              {institutionFilters.map(filter => (
                <button
                  key={filter.id}
                  className={`filter-btn ${institutionFilter === filter.id ? 'active' : ''}`}
                  onClick={() => handleInstitutionFilterChange(filter.id)}
                >
                  {filter.name}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>Sort By</h3>
            <div className="filter-buttons">
              {sortOptions.map(option => (
                <button
                  key={option.id}
                  className={`filter-btn ${sortBy === option.id ? 'active' : ''}`}
                  onClick={() => handleSortChange(option.id)}
                >
                  {option.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="results-count">
          {filteredProfessors.length > 0 ? (
            <p>
              Exploring academic excellence and innovation across disciplines
              {selectedCategory !== 'all' && (
                <span> • Focusing on {selectedCategory}</span>
              )}
              {institutionFilter !== 'all' && (
                <span> • From {institutionFilters.find(f => f.id === institutionFilter)?.name}</span>
              )}
              {sortBy !== 'none' && (
                <span> • Ranked by {sortOptions.find(s => s.id === sortBy)?.name.toLowerCase()}</span>
              )}
            </p>
          ) : (
            <p className="no-results">No scholars found with the selected filters. Try adjusting your search criteria.</p>
          )}
        </div>

        {/* Scholars Grid */}
        <div className="scholars-grid" key={`${selectedCategory}-${institutionFilter}-${sortBy}-${displayedCount}`}>
          {displayedProfessors.map(professor => (
            <div key={professor.id} className="scholar-card">
              <div 
                className="scholar-avatar"
                style={{ backgroundColor: getDomainColor(professor.domain) }}
              >
                {professor.imageUrl ? (
                  <img src={professor.imageUrl} alt={professor.name} className="avatar-image" />
                ) : (
                  <span className="avatar-text">
                    {getProfessorInitials(professor.name)}
                  </span>
                )}
              </div>
              <div className="scholar-info">
                <h3 className="scholar-name">{professor.name}</h3>
                <p className="scholar-institution">{professor.institution}</p>
                <p className="scholar-field">{professor.domain}</p>
                <div className="scholar-stats">
                  <div className="stat">
                    <span className="stat-label">Citations</span>
                    <span className="stat-value">{professor.citations.toLocaleString()}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">h-index</span>
                    <span className="stat-value">{professor.hIndex}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">i10-index</span>
                    <span className="stat-value">{professor.i10Index}</span>
                  </div>
                </div>
              </div>
              <button 
                className="view-profile-btn"
                onClick={() => handleViewProfile(professor)}
              >
                View Profile
              </button>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {hasMoreProfessors && (
          <div className="load-more-container">
            <button className="load-more-btn" onClick={loadMoreProfessors}>
              Discover More Brilliant Minds
            </button>
          </div>
        )}

        {/* Back to Home Button */}
        <div className="back-home">
          <Link to="/" className="back-home-btn">
            ← Back to Home
          </Link>
        </div>
      </main>

      {/* Modal Popup */}
      {showModal && selectedProfessor && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            
            <div className="modal-header">
              <div 
                className="modal-avatar"
                style={{ backgroundColor: getDomainColor(selectedProfessor.domain) }}
              >
                {selectedProfessor.imageUrl ? (
                  <img src={selectedProfessor.imageUrl} alt={selectedProfessor.name} />
                ) : (
                  <span className="modal-avatar-text">
                    {getProfessorInitials(selectedProfessor.name)}
                  </span>
                )}
              </div>
              <div className="modal-title">
                <h2>{selectedProfessor.name}</h2>
                <p className="modal-institution">{selectedProfessor.institution}</p>
                <p className="modal-domain">{selectedProfessor.domain}</p>
              </div>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <h3>Department</h3>
                <p>{selectedProfessor.department}</p>
              </div>

              <div className="modal-section">
                <h3>Research Metrics</h3>
                <div className="modal-stats">
                  <div className="modal-stat">
                    <span className="modal-stat-label">Citations</span>
                    <span className="modal-stat-value">{selectedProfessor.citations.toLocaleString()}</span>
                  </div>
                  <div className="modal-stat">
                    <span className="modal-stat-label">h-index</span>
                    <span className="modal-stat-value">{selectedProfessor.hIndex}</span>
                  </div>
                  <div className="modal-stat">
                    <span className="modal-stat-label">i10-index</span>
                    <span className="modal-stat-value">{selectedProfessor.i10Index}</span>
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <h3>Biography</h3>
                <p>{selectedProfessor.bio}</p>
              </div>

              <div className="modal-section">
                <h3>Research Interests</h3>
                <p>{selectedProfessor.researchInterests}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Scholars
