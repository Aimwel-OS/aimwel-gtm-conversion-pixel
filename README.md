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

2. **Community Template Gallery**: This pixel utilizes the GTM Community Template Gallery. You can find and select the appropriate tag template from the gallery to track your desired events, such as an Apply Click and/or Job View.

3. **Configuration**: In the selected tag's settings, configure the tag by providing the required input fields, the API endpoint will be provided by Aimwel, the GA4 measurement/stream Id can be found in the Admin section in Google Analytics 4 by navigating to 'Data collection and modification' -> 'Data streams' and selecting the appropriate stream.

4. **Variables for Platform Parameters**: If you haven't already created variables for the platform parameters originating from your platform in GTM, please do so. The job Id and brand values have to come from your platform and must be included in the conversion events by means of the platform parameters.

5. **Set Up Triggers**: Create triggers in GTM that specify when the tags should fire. For Apply Click, create a trigger that activates when the user does a apply click. For Job View, create a trigger that activates when the container is loaded or when a dedicated dataLayer push event occurs.

6. **Testing**: Before publishing the changes, use GTM's Preview mode to test that the tags fire correctly. Verify that the tag fires as expected and that the GET requeste made to our endpoint has all parameters. Session Id, Event Type, Job Id and Timestamp are required. Session Id and timestamp are filled in by the template automatically.

7. **Publish the Container**: Once you've thoroughly tested your configuration, click on "Submit" in GTM to publish the container with the new tags and triggers. If you're unsure when publishing, feel free to contact Aimwel for support.

## Integration Guide

Developers can easily integrate the conversion/tracking pixel into your website by following these steps:

1. **Implement GTM Snippet**: Ensure that the GTM snippet is correctly implemented in your website's code. The snippet typically needs to be added to your website's header.

2. **Configure the Tag**: In Google Tag Manager, create a new tag based on the template from the Community Template Gallery. Fill in the necessary platform parameters to provide us with the Job Id and Brand for which the conversion has been made.

3. **Create Variables**: If platform parameter variables do not exist, create them in GTM so they can be added to the conversion event utilising the community template.

4. **Set Up Triggers**: Create triggers in GTM that specify when the tags should fire, depending on the events you want to track.

5. **Testing**: Before going live, use GTM's Preview and Debug mode to test that the tags are firing correctly.

6. **Publish the Container**: Once testing is successful, click on "Submit" in GTM to publish the container with the new tags and triggers.

For detailed instructions and code examples, refer to the [Integration Guide](integration-guide.md) in this repository.

## Contributing

We welcome contributions from the community. If you have ideas for improvements or want to report issues, please open a GitHub issue. If you'd like to contribute to the project, feel free to submit a pull request. See our [Contributing Guidelines](CONTRIBUTING.md) for more information.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.