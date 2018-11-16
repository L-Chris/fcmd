# fcmd
a improved version of commander.js

- more readable code structure
- imporve sub command
- most importantly, less bug!

# Usage
```javascript
const program = require('fcmd');

program
  .version('0.0.1') // default to version in package.json
  .description('a demo cli')
  .option('-u --username <username>', 'username') // global option
  .option('-p --password <password>', 'password') // global option
  .action(() => console.log(1));                  // precommand action

program
  .command('test')
  .option('-p --port', 'port option for test subcommand')
  .action((argv, args) => {
    // do sth...
  });

program
  .command('print')
  .option('-t --text', 'text option for test subcommand')
  .action((argv, args) => {
    // do sth...
  });
```