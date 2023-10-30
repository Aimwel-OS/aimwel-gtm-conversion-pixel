## Table of Contents
- [Introduction](#introduction)
- [How It Works](#how-it-works)
- [Integration Guide](#integration-guide)
- [Contributing](#contributing)
- [License](#license)

## Introduction

This repository contains a conversion/tracking pixel that can be integrated into your website using Google Tag Manager (GTM). The pixel allows you to track and measure conversions for specific events, such as Apply Click and Page View, by using GTM's templates and configurations.

## How It Works

The conversion/tracking pixel is designed to work with Google Tag Manager. It is a versatile solution for tracking conversions, and it can be easily customized for your specific needs. Here's how it works:

1. **GTM Implementation**: Ensure that you have set up Google Tag Manager on your website. If you haven't, refer to GTM's official documentation for instructions.

2. **Community Template Gallery**: This pixel utilizes the GTM Community Template Gallery. You can find and select the appropriate tag template from the gallery to track your desired events, such as Apply Click and Page View.

3. **Configuration**: In the selected tag's settings, configure the tag by providing the required input fields, including any query parameters. These query parameters are essential for tracking the conversions correctly.

4. **Variables for Query Parameters**: If you haven't already created variables for query parameters in GTM, follow the instructions in this repository to create the necessary variables that capture query parameters from the URL.

5. **Set Up Triggers**: Create triggers in GTM that specify when the tags should fire. For Apply Click, create a trigger that activates when the user applies a click. For Page View, create a trigger that activates when the container is loaded or when a dedicated dataLayer push event occurs.

6. **Testing**: Before publishing the changes, use GTM's Preview and Debug mode to test that the tags fire correctly. Verify that the tag fires as expected and that the query parameters are captured accurately.

7. **Publish the Container**: Once you've thoroughly tested your configuration, click on "Submit" in GTM to publish the container with the new tags and triggers.

## Integration Guide

Developers can easily integrate the conversion/tracking pixel into your website by following these steps:

1. **Implement GTM Snippet**: Ensure that the GTM snippet is correctly implemented in your website's code. The snippet typically needs to be added to your website's header.

2. **Configure the Tag**: In Google Tag Manager, create a new tag based on the template from the Community Template Gallery. Fill in the necessary query parameters based on your conversion tracking requirements.

3. **Create Variables**: If query parameter variables do not exist, create them in GTM to capture query parameters from the URL.

4. **Set Up Triggers**: Create triggers in GTM that specify when the tags should fire, depending on the events you want to track.

5. **Testing**: Before going live, use GTM's Preview and Debug mode to test that the tags are firing correctly.

6. **Publish the Container**: Once testing is successful, click on "Submit" in GTM to publish the container with the new tags and triggers.

For detailed instructions and code examples, refer to the [Integration Guide](integration-guide.md) in this repository.

## Contributing

We welcome contributions from the community. If you have ideas for improvements or want to report issues, please open a GitHub issue. If you'd like to contribute to the project, feel free to submit a pull request. See our [Contributing Guidelines](CONTRIBUTING.md) for more information.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
