# ScholarNetAI

ScholarNetAI is an interactive platform designed to help users discover top scholars, researchers, and academics across a wide range of disciplines. The application provides a rich, filterable interface to explore academic excellence, analyze scholarly metrics, and learn more about individual research interests and backgrounds.

## Features

- **Discover Scholars:** Browse and search leading academics and researchers from various domains including Computer Science, Engineering, Physics, Arts & Humanities, Medical Sciences, and more.
- **Advanced Filtering:** Filter scholars by domain/category, institution type (IIT, NIT, or Other), and sort by academic metrics such as citations, h-index, and i10-index.
- **Rich Scholar Profiles:** Each scholar profile includes:
  - Name, institution, department
  - Academic metrics (citations, h-index, i10-index, publications)
  - Biography and research interests
  - Visual avatar (photo or initials)
- **User-Friendly Interface:** Modern UI with navigation, category buttons, institution and sorting filters, and responsive grid display.
- **AI Chat (Coming Soon):** A dedicated page for AI-powered academic assistance.

## Getting Started

### Prerequisites

- Node.js (recommended v16+)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/vipularya135/ScholarNetAI.git
   cd ScholarNetAI
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

### File Structure

- `scholarnet/src/Scholars.jsx`: Main component for scholar listing, filtering, and display logic.
- `scholarnet/src/Scholars.css`: Styles for the scholars interface and grid.
- `src/professors_data.csv`: Data source containing scholar profiles and metrics.

### Main Technologies

- **React** (JavaScript): UI development
- **CSS**: Styling
- **PapaParse**: CSV data parsing
- **React Router**: Navigation

## Usage

- Navigate to `/scholars` to explore the scholar grid.
- Use filter buttons to select a domain, institution type (IIT/NIT/Other), and sorting criteria.
- Click a scholar card to view detailed profile, biography, and research interests in a modal pop-up.

## Contributing

Contributions, suggestions, and new data for scholars are welcome! Please open issues or submit pull requests for features, bug fixes, or improvements.

## License

This project currently does not specify a license. Please contact the repository owner for more information.

## Author

- [vipularya135](https://github.com/vipularya135)

---

_Discover academic excellence. Empower research networking._
