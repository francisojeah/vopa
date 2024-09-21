# VOPA (Voice-Optimized Payment Assistant)

VOPA is an innovative offline-first, voice-enabled payment assistant designed to transform how people in emerging markets pay, buy, and sell. By leveraging voice recognition, natural language processing (NLP), and Kora's payment APIs, VOPA provides a seamless and secure payment experience via voice commands, even without internet connectivity.

## 🌟 Key Features
- **Voice Commands:** Conduct transactions through simple voice commands, supporting local languages and dialects.
- **Offline-First:** Users can make payments even in areas with poor or no internet connectivity using USSD/SMS gateways.
- **Voice Biometrics:** Secure authentication using voice biometrics for enhanced security.
- **Kora Integration:** Full integration with Kora's payment APIs for fast and secure payments across multiple channels.
- **Multi-Device Support:** Works on both smartphones and feature phones using USSD/SMS.

## 🚀 Technologies Used
### Frontend (Flutter)
- **Flutter SDK**: To build cross-platform mobile applications.
- **speech_to_text**: For converting voice commands to text.
- **hive**: Local storage for offline-first capabilities.
- **flutter_secure_storage**: Securely store user data and credentials.
- **http**: To communicate with the backend API.

### Backend (NestJS)
- **NestJS**: Backend framework to build scalable and efficient server-side applications.
- **Kora API**: Integrated with Kora's payment gateway to handle transactions.
- **Voice Biometrics**: Using third-party libraries to verify user identity based on voice patterns.
- **USSD/SMS Integration**: Support for USSD/SMS transactions via third-party services (e.g., Twilio, Africa's Talking).

## 🛠️ Setup Guide

### Prerequisites
- **Flutter SDK**: [Install Flutter](https://flutter.dev/docs/get-started/install) for the mobile frontend.
- **Node.js & NestJS**: [Install Node.js](https://nodejs.org/en/download/) and [NestJS CLI](https://docs.nestjs.com/cli/overview) for backend development.

### Project Structure
```
vopa/
├── backend/        # NestJS backend for API and integration with Kora and USSD
│   └── src/
│       └── app.controller.ts
│       └── app.module.ts
│       └── payment/      # Payment handling module
│       └── services/     # Services for integrating with Kora APIs
├── vopa_app/       # Flutter mobile application for voice-enabled payments
│   └── lib/
│       └── src/
│           └── services/    # API calls and voice recognition services
│           └── models/      # Data models for Hive and user data
│           └── screens/     # App screens
│           └── widgets/     # Reusable UI components
├── README.md
└── .gitignore
```

### Installation

#### Frontend (Flutter)

1. Clone the repository:
    ```bash
    git clone https://github.com/francisojeah/vopa.git
    cd vopa/vopa_app
    ```

2. Install Flutter dependencies:
    ```bash
    flutter pub get
    ```

3. Run the Flutter app on your emulator or device:
    ```bash
    flutter run
    ```

#### Backend (NestJS)

1. Navigate to the backend directory:
    ```bash
    cd vopa/backend
    ```

2. Install the required Node.js dependencies:
    ```bash
    npm install
    ```

3. Start the NestJS server:
    ```bash
    npm run start:dev
    ```

### API Endpoints

- `POST /payment`: Initiate a payment through voice commands or text.
- `GET /`: Basic health check for the backend service.

### 🧪 Testing

1. Run the backend server locally on `localhost:3000`.
2. Test the APIs using **Postman** or **cURL** for payment transactions.
3. Use Flutter’s testing framework to test mobile app functionality.

## 🔒 Security
- **Voice Biometrics**: Secure authentication using voice patterns.
- **Offline Mode**: Data stored securely on-device using `flutter_secure_storage`.
- **SSL Encryption**: Ensure all communications between the app and backend use SSL/TLS.

## 🏗️ Future Enhancements
- **Multi-Language Support**: Expand voice command support for more languages and dialects.
- **AI/ML for Voice Recognition**: Enhance voice recognition with AI-based NLP models.
- **Advanced Fraud Detection**: Implement algorithms to detect and mitigate fraud in real-time transactions.

## 🤝 Contributions
We welcome contributions from the community. Please follow the guidelines below to submit a PR:
- Fork the repository.
- Create a new branch with your feature or bug fix.
- Commit and push your changes.
- Submit a Pull Request with a detailed description of your changes.

## 📄 License
This project is licensed under the MIT License.
