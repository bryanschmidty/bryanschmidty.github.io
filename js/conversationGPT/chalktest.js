import chalk from 'chalk';

// Output styled text to the console
console.log(chalk.red('Error!'));
console.log(chalk.green('Success!'));
console.log(chalk.yellow('Warning!'));

// Compose multiple styles
console.log(chalk.red.bgWhite.bold('Important message!'));

// Use templates with styles
const name = 'John';
console.log(chalk`Hello, {blue.bold ${name}}!`);

// Nest styles inside each other
console.log(chalk.bold(chalk.underline('Underlined and bold!')));

// Customize the theme
const customTheme = {
    info: '#0077ff',
    warning: '#ff8800',
    error: '#ff0000',
};
