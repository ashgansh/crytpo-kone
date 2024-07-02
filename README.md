# Kone - Financial OS for EU Crypto Freelancers

A comprehensive financial management system tailored for crypto freelancers, offering tools for invoice management, payment tracking, and seamless crypto transactions.

## Features

- Create Invoices
- Gnosis Pay integration for crypto-backed card payments
- Monerium integration for IBAN accounts and SEPA transfers
- Yield earning features with sDAI

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Request Network API
- Gnosis Pay API (planned)
- Monerium API (planned)

## Getting Started

1. Clone the repository:
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in the required values
4. Run the development server:
   ```
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser



## Key Components

- `CustomCreateInvoice`: Custom invoice creation form
- `InvoiceList`: Invoice management and display
- `Navbar`: Navigation component
- `MinimalistFinanceDashboard`: Main dashboard layout

## Deployment

GitHub Actions workflows are set up for deploying to staging and production environments:

- Staging: Triggered on push to `main` branch
- Production: Triggered on release publication or manually

## TODO

- [ ] Complete Gnosis Pay integration for card payments
- [ ] Finalize Monerium integration for IBAN account management
- [ ] Implement sDAI yield earning functionality
- [ ] Enhance transaction history with advanced filtering
- [ ] Add comprehensive analytics and reporting tools
- [ ] Implement multi-language support
- [ ] Set up automated testing suite

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a pull request

## License

[MIT License](https://opensource.org/licenses/MIT)

## Acknowledgements

- [Request Network](https://request.network/)
- [Gnosis Pay](https://www.gnosis.io/)
- [Monerium](https://monerium.com/)
- [Web3-Onboard](https://onboard.blocknative.com/)

```

This README provides a comprehensive overview of your project, including features, tech stack, setup instructions, project structure, deployment information, TODOs, contribution guidelines, and acknowledgements. Feel free to adjust any details to better match your specific project needs before adding it to your repository.
6. Open [http://localhost:3000](http://localhost:3000) in your browser



## Key Components

- `CustomCreateInvoice`: Custom invoice creation form
- `InvoiceList`: Invoice management and display
- `Navbar`: Navigation component
- `MinimalistFinanceDashboard`: Main dashboard layout

## TODO

- [ ] Migrate to nextjs app router
- [ ] Complete Gnosis Pay integration for card payments
- [ ] Finalize Monerium integration for IBAN account management
- [ ] Implement sDAI yield earning functionality
- [ ] Enhance transaction history with advanced filtering
- [ ] Set up automated testing suite

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a pull request

## License

[MIT License](https://opensource.org/licenses/MIT)

## Acknowledgements

- [Request Network](https://request.network/)
- [Gnosis Pay](https://www.gnosis.io/)
- [Monerium](https://monerium.com/)
