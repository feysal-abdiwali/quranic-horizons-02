# Quran App

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌟 Overview

This is a respectful and carefully crafted Quran application that allows users to:
- Read Quranic verses with accurate translations
- Listen to audio recitations from various reciters
- Download verses for offline access
- Bookmark favorite verses
- Search through the Quran
- Track recently visited surahs

## 📜 Respectful Use Policy

This application contains the Holy Quran, and we require all users and contributors to:
- Treat the Quranic content with utmost respect and dignity
- Maintain the accuracy and integrity of the Quranic text and translations
- Use the application and its code in a manner that honors Islamic principles
- Not modify or present the Quranic content in any disrespectful way

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone [your-repo-url]

# Navigate to project directory
cd quran-app

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── audio/          # Audio playback and download components
│   ├── surah/          # Surah and Ayah display components
│   └── ui/             # Reusable UI components
├── pages/              # Route pages
├── services/           # API and data services
├── utils/             # Utility functions
└── hooks/             # Custom React hooks
```

### Key Components

#### 🎵 Audio Components
- `DownloadManager`: Handles verse downloads for offline access
- `StorageInfo`: Manages local storage of audio files

#### 📖 Surah Components
- `AyahCard`: Displays individual verses with translations
- `SurahControls`: Navigation and playback controls
- `SurahHeader`: Displays surah information

#### 🔄 API Service
The `quranApi.ts` service:
- Fetches data from alquran.cloud API
- Implements robust validation
- Handles caching for better performance
- Ensures data integrity

## 🔍 Data Validation

The app implements thorough validation to ensure Quranic content accuracy:
- Validates Arabic text formatting
- Verifies translation alignment
- Ensures proper audio file mapping
- Checks data integrity at multiple levels

## 🧪 Testing Guidelines

Before submitting changes:
1. Verify Arabic text rendering
2. Test audio playback functionality
3. Validate offline capabilities
4. Check responsive design
5. Ensure translation accuracy

## 🤝 Contributing

We welcome contributions that enhance the app while maintaining its respectful nature. Please:

1. Fork the repository
2. Create a feature branch
3. Follow code style guidelines
4. Add appropriate tests
5. Submit a pull request

### Code Style
- Use TypeScript for type safety
- Follow React best practices
- Implement proper error handling
- Add meaningful comments
- Use Prettier for formatting

## 📚 API Documentation

The app uses the [Alquran.cloud API](https://alquran.cloud/api) with additional validation:

```typescript
// Example API response validation
const validateAyahData = (ayah: any): boolean => {
  return (
    typeof ayah.number === 'number' &&
    typeof ayah.text === 'string' &&
    ayah.text.trim().length > 0 &&
    typeof ayah.numberInSurah === 'number' &&
    typeof ayah.translation === 'string'
  );
};
```

## 📱 Features

- 🎯 Accurate Quranic text display
- 🔊 Multiple reciter options
- 💾 Offline audio support
- 🔖 Verse bookmarking
- 🔍 Search functionality
- 📱 Responsive design
- 🌙 Dark mode support

## 📄 License

This project is licensed under the MIT License with the following additional conditions:

1. The Quranic content must be treated with respect and dignity
2. Any modifications must maintain the accuracy of the Quranic text
3. The application must not be used in any way that disrespects Islamic principles

See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Alquran.cloud](https://alquran.cloud) for providing the API
- All the reciters who contributed their voices
- The open-source community for their tools and libraries

## 🤔 Questions?

Feel free to [open an issue](https://github.com/yourusername/quran-app/issues) for:
- Bug reports
- Feature requests
- Documentation improvements
- General questions

Please ensure all communication maintains the respectful nature of this project.