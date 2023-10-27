# Data Studio Community Connector for Donation Data

This Data Studio community connector allows you to access and visualize donation and earnings data from a web service via an API. The retrieved data can be used to create reports and dashboards in Data Studio.

## Authentication Setup

This connector does not require authentication. Simply provide the service's URL, public API key, and API token when setting up the connector.

## Available Fields

The connector provides the following fields:

- **Donations (Quantity)**: The quantity of donations made.
- **Earnings (EUR)**: Earnings in euros.
- **Day**: The date corresponding to the data.

## Usage

Once you've configured the connector with the URL, API key, and API token, you can select the fields you want to include in your Data Studio report. The connector will handle retrieving donation and earnings data based on the specified date range in the report.

## Installation

1. Clone or download this repository.
2. Import the connector into Data Studio following the instructions in the official Data Studio documentation for community connectors.
3. Configure the connector by providing the service's URL, public API key, and API token.
4. Create your Data Studio report and use the connector to access donation and earnings data.

## Contributions

If you wish to contribute to this project or report issues, feel free to open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

