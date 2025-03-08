# Encryption App

A React Native web application for encrypting and decrypting data using various encryption methods.

## Features

- Multiple encryption methods:
  - AES-CBC (Advanced Encryption Standard with CBC mode)
  - AES-ECB (Advanced Encryption Standard with ECB mode)
  - Base64 Encoding/Decoding

- Persistent data storage
- JSON data support
- Secure key management
- Modern Material Design UI

## Technologies Used

- React Native
- Expo
- React Native Paper
- CryptoJS
- Local Storage for data persistence

## Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd encryption-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

## Usage

1. Choose an encryption method:
   - AES-CBC: Secure encryption with random IV
   - AES-ECB: Fixed key encryption
   - Base64: Simple text encoding

2. Enter your data:
   - Support for both text and JSON data
   - Automatic data persistence
   - Secure key input for AES-CBC

3. Encrypt or Decrypt:
   - Click 'Encrypt' to secure your data
   - Click 'Decrypt' to recover original data
   - Results are automatically copied to clipboard

## Security Notes

- AES-CBC is recommended for secure encryption
- Base64 is not encryption, just encoding
- Store encryption keys securely
- ECB mode is less secure but compatible with legacy systems

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
